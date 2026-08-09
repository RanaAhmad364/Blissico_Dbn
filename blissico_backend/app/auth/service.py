from app.models import User,EmailOTP,Role
from app.utils.password_services import PasswordService
from app.utils.otp_services import OTPService
from app.utils.email_services import EmailService
from app.utils.jwt_services import JWTService
from app import db


class AuthService:
    """
    Business logic for user authentication.
    """

    # ---------------------------------------------------------
    # REGISTER
    # ---------------------------------------------------------

    @staticmethod
    def register(data):
        """
        Register a new user and send email verification OTP.
        """

        email = data["email"].strip().lower()

        # Check whether email already exists
        existing_user = User.query.filter_by(
            email=email
        ).first()

        if existing_user:

            # Email already registered and verified
            if existing_user.is_verified:
                return {
                    "success": False,
                    "message": "Email is already registered."
                }, 409

            # User exists but email is not verified.
            # Send a new OTP instead of creating another user.
            return AuthService._create_and_send_verification_otp(
                existing_user
            )

        # Hash password
        password_hash = PasswordService.hash_password(
            data["password"]
        )

        role = Role.query.filter_by(name="User").first()

        if not role:
            return {
                "success": False,
                "message": "Default user role is not configured."
            }, 500
        
        # Create user
        user = User(
            role_id=role.id,
            first_name=data["first_name"].strip(),
            last_name=data["last_name"].strip(),
            email=email,
            password_hash=password_hash,
            is_verified=False
        )

        db.session.add(user)

        # Flush so user.id becomes available
        db.session.flush()

        # Generate and store OTP
        otp = OTPService.generate_otp()

        otp_hash = OTPService.hash_otp(otp)

        expires_at = OTPService.get_expiry_time()

        email_otp = EmailOTP(
            user_id=user.id,
            otp_hash=otp_hash,
            expires_at=expires_at,
            verified=False
        )

        db.session.add(email_otp)
        db.session.commit()

        # Send OTP email
        try:
            EmailService.send_otp(
                email=user.email,
                otp=otp
            )

        except Exception:
            db.session.rollback()

            return {
                "success": False,
                "message": "Unable to send verification email."
            }, 500

        return {
            "success": True,
            "message": "Registration successful. Verification OTP sent."
        }, 201

    # ---------------------------------------------------------
    # VERIFY OTP
    # ---------------------------------------------------------

    @staticmethod
    def verify_otp(data):
        """
        Verify the latest unverified email OTP.
        """

        email = data["email"].strip().lower()
        otp = data["otp"].strip()

        # Find user
        user = User.query.filter_by(
            email=email
        ).first()

        if not user:
            return {
                "success": False,
                "message": "Invalid email or OTP."
            }, 400

        # Already verified
        if user.is_verified:
            return {
                "success": False,
                "message": "Email is already verified."
            }, 400

        # Get latest unverified OTP
        email_otp = (
            EmailOTP.query
            .filter_by(
                user_id=user.id,
                verified=False
            )
            .order_by(
                EmailOTP.created_at.desc()
            )
            .first()
        )

        if not email_otp:
            return {
                "success": False,
                "message": "No valid verification OTP found."
            }, 400

        # Check expiry using model property
        if email_otp.is_expired:
            return {
                "success": False,
                "message": "OTP has expired."
            }, 400

        # Verify OTP hash
        if not OTPService.verify_otp(
            otp,
            email_otp.otp_hash
        ):
            return {
                "success": False,
                "message": "Invalid OTP."
            }, 400

        # Mark OTP as verified
        email_otp.verified = True

        # Verify user's email
        user.is_verified = True

        db.session.commit()

        return {
            "success": True,
            "message": "Email verified successfully."
        }, 200

    # ---------------------------------------------------------
    # RESEND OTP
    # ---------------------------------------------------------

    @staticmethod
    def resend_otp(data):
        """
        Generate and send a new email verification OTP.
        """

        email = data["email"].strip().lower()

        user = User.query.filter_by(
            email=email
        ).first()

        # Don't reveal whether an email exists
        if not user:
            return {
                "success": True,
                "message": (
                    "If the email is registered, "
                    "a verification OTP has been sent."
                )
            }, 200

        if user.is_verified:
            return {
                "success": False,
                "message": "Email is already verified."
            }, 400

        return AuthService._create_and_send_verification_otp(
            user
        )

    # ---------------------------------------------------------
    # LOGIN
    # ---------------------------------------------------------

    @staticmethod
    def login(data):
        """
        Authenticate the user and generate JWT tokens.
        """

        email = data["email"].strip().lower()
        password = data["password"]

        # Find user
        user = User.query.filter_by(
            email=email
        ).first()

        if not user:
            return {
                "success": False,
                "message": "Invalid email or password."
            }, 401

        # Verify password
        if not PasswordService.verify_password(
            password,
            user.password_hash
        ):
            return {
                "success": False,
                "message": "Invalid email or password."
            }, 401

        # Check email verification
        if not user.is_verified:
            return {
                "success": False,
                "message": (
                    "Please verify your email "
                    "before logging in."
                )
            }, 403

        # Generate JWT tokens
        access_token = JWTService.create_access_token(
            user
        )

        refresh_token = JWTService.create_refresh_token(
            user
        )

        return {
            "success": True,
            "message": "Login successful.",
            "data": {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "user": {
                    "id": user.id,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "email": user.email
                }
            }
        }, 200

    # ---------------------------------------------------------
    # FORGOT PASSWORD
    # ---------------------------------------------------------

    @staticmethod
    def forgot_password(data):
        """
        Generate and send password-reset OTP.
        """

        email = data["email"].strip().lower()

        user = User.query.filter_by(
            email=email
        ).first()

        # Do not reveal whether email exists
        if not user:
            return {
                "success": True,
                "message": (
                    "If the email is registered, "
                    "a password reset OTP has been sent."
                )
            }, 200

        if not user.is_verified:
            return {
                "success": True,
                "message": (
                    "If the email is registered, "
                    "a password reset OTP has been sent."
                )
            }, 200

        # Generate password reset OTP
        otp = OTPService.generate_otp()

        otp_hash = OTPService.hash_otp(otp)

        expires_at = OTPService.get_expiry_time()

        # Invalidate previous unverified OTPs
        EmailOTP.query.filter_by(
            user_id=user.id,
            verified=False
        ).update(
            {
                "verified": True
            }
        )

        # Store new OTP
        email_otp = EmailOTP(
            user_id=user.id,
            otp_hash=otp_hash,
            expires_at=expires_at,
            verified=False
        )

        db.session.add(email_otp)
        db.session.commit()

        # Send reset OTP
        try:
            EmailService.send_password_reset_otp(
                email=user.email,
                otp=otp
            )

        except Exception:
            db.session.rollback()

            return {
                "success": False,
                "message": (
                    "Unable to send password reset email."
                )
            }, 500

        return {
            "success": True,
            "message": (
                "If the email is registered, "
                "a password reset OTP has been sent."
            )
        }, 200

    # ---------------------------------------------------------
    # RESET PASSWORD
    # ---------------------------------------------------------

    @staticmethod
    def reset_password(data):
        """
        Verify password-reset OTP and update password.
        """

        email = data["email"].strip().lower()
        otp = data["otp"].strip()
        new_password = data["new_password"]

        # Find user
        user = User.query.filter_by(
            email=email
        ).first()

        if not user:
            return {
                "success": False,
                "message": "Invalid email or OTP."
            }, 400

        # Find latest unverified OTP
        email_otp = (
            EmailOTP.query
            .filter_by(
                user_id=user.id,
                verified=False
            )
            .order_by(
                EmailOTP.created_at.desc()
            )
            .first()
        )

        if not email_otp:
            return {
                "success": False,
                "message": "Invalid email or OTP."
            }, 400

        # Check expiry
        if email_otp.is_expired:
            return {
                "success": False,
                "message": "OTP has expired."
            }, 400

        # Verify OTP
        if not OTPService.verify_otp(
            otp,
            email_otp.otp_hash
        ):
            return {
                "success": False,
                "message": "Invalid email or OTP."
            }, 400

        # Hash new password
        user.password_hash = (
            PasswordService.hash_password(
                new_password
            )
        )

        # Mark OTP as verified
        email_otp.verified = True

        db.session.commit()

        return {
            "success": True,
            "message": "Password reset successfully."
        }, 200

    # ---------------------------------------------------------
    # PRIVATE OTP HELPER
    # ---------------------------------------------------------

    @staticmethod
    def _create_and_send_verification_otp(user):
        """
        Invalidate previous verification OTPs,
        create a new OTP and send it by email.
        """

        # Invalidate previous unverified OTPs
        EmailOTP.query.filter_by(
            user_id=user.id,
            verified=False
        ).update(
            {
                "verified": True
            }
        )

        # Generate new OTP
        otp = OTPService.generate_otp()

        otp_hash = OTPService.hash_otp(otp)

        expires_at = OTPService.get_expiry_time()

        # Create new OTP record
        email_otp = EmailOTP(
            user_id=user.id,
            otp_hash=otp_hash,
            expires_at=expires_at,
            verified=False
        )

        db.session.add(email_otp)
        db.session.commit()

        # Send email
        try:
            EmailService.send_otp(
                email=user.email,
                otp=otp
            )

        except Exception:
            db.session.rollback()

            return {
                "success": False,
                "message": (
                    "Unable to send verification email."
                )
            }, 500

        return {
            "success": True,
            "message": (
                "Verification OTP sent successfully."
            )
        }, 200

