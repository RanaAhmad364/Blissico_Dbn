import random
from datetime import datetime, timedelta
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
    OTP_EXPIRY_MINUTES = 1

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
        Return OTP expiry datetime.
        """
        return datetime.utcnow() + timedelta(
            minutes=OTPService.OTP_EXPIRY_MINUTES
        )

    @staticmethod
    def is_expired(expires_at: datetime) -> bool:
        """
        Check whether OTP has expired.
        """
        return datetime.utcnow() > expires_at















