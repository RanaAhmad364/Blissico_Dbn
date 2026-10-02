import random
from datetime import datetime, timedelta, timezone
from werkzeug.security import (
    generate_password_hash,
    check_password_hash
)


class OTPService:
    """
    Service responsible for OTP generation,
    hashing, verification, and expiry.
    """

    OTP_LENGTH = 6
    OTP_EXPIRY_MINUTES = 10

    @staticmethod
    def generate_otp() -> str:
        """
        Generate a secure numeric OTP.
        Example: 483921
        """
        return "".join(
            random.choices(
                "0123456789",
                k=OTPService.OTP_LENGTH
            )
        )

    @staticmethod
    def hash_otp(otp: str) -> str:
        """
        Hash the OTP before storing it.
        """
        return generate_password_hash(otp)

    @staticmethod
    def verify_otp(otp: str, otp_hash: str) -> bool:
        """
        Compare user OTP with stored hash.
        """
        return check_password_hash(
            otp_hash,
            otp
        )

    @staticmethod
    def get_expiry_time() -> datetime:
        """
        Return OTP expiry datetime in UTC.
        """
        return datetime.now(timezone.utc) + timedelta(
            minutes=OTPService.OTP_EXPIRY_MINUTES
        )

    @staticmethod
    def is_expired(expires_at: datetime) -> bool:
        """
        Check whether OTP has expired.
        """
        if expires_at is None:
            return True

        # Handle old/database values that may be timezone-naive.
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)

        return datetime.now(timezone.utc) > expires_at



# import random
# from datetime import datetime, timedelta, timezone
# from werkzeug.security import (
#     generate_password_hash,
#     check_password_hash
# )


# class OTPService:
#     """
#     Service responsible for OTP generation,
#     hashing, verification, and expiry.
#     """

#     OTP_LENGTH = 6
#     OTP_EXPIRY_MINUTES = 10

#     @staticmethod
#     def generate_otp() -> str:
#         """
#         Generate a secure numeric OTP.
#         Example: 483921
#         """
#         return "".join(
#             random.choices(
#                 "0123456789",
#                 k=OTPService.OTP_LENGTH
#             )
#         )

#     @staticmethod
#     def hash_otp(otp: str) -> str:
#         """
#         Hash the OTP before storing it.
#         """
#         return generate_password_hash(otp)

#     @staticmethod
#     def verify_otp(otp: str, otp_hash: str) -> bool:
#         """
#         Compare user OTP with stored hash.
#         """
#         return check_password_hash(
#             otp_hash,
#             otp
#         )

#     @staticmethod
#     def get_expiry_time() -> datetime:
#         """
#         Return OTP expiry datetime.
#         """
#         return datetime.now(timezone.utc) + timedelta(
#             minutes=OTPService.OTP_EXPIRY_MINUTES
#         )

#     @staticmethod
#     def is_expired(expires_at: datetime) -> bool:
#         """
#         Check whether OTP has expired.
#         """
#         return datetime.now(timezone.utc) > expires_at















