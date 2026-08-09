from werkzeug.security import generate_password_hash, check_password_hash


class PasswordService:
    """
    Service responsible for password hashing and verification.
    """

    @staticmethod
    def hash_password(password: str) -> str:
        """
        Hash a plain-text password.
        """
        return generate_password_hash(password)

    @staticmethod
    def verify_password(password: str, password_hash: str) -> bool:
        """
        Compare a plain-text password with its hash.
        """
        return check_password_hash(password_hash, password)








