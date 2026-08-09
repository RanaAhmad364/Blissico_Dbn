import re


class ValidationError(Exception):
    """Raised when request validation fails."""

    def __init__(self, errors):
        self.errors = errors
        super().__init__("Validation failed")


class AuthValidator:

    @staticmethod
    def validate_required_fields(data, fields):
        errors = {}

        for field in fields:
            if field not in data:
                errors[field] = f"{field} is required."

            elif data[field] is None:
                errors[field] = f"{field} is required."

            elif isinstance(data[field], str) and not data[field].strip():
                errors[field] = f"{field} cannot be empty."

        if errors:
            raise ValidationError(errors)

    @staticmethod
    def validate_email(email):
        pattern = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"

        if not re.match(pattern, email):
            raise ValidationError({
                "email": "Invalid email address."
            })

    @staticmethod
    def validate_password(password):
        errors = {}

        if len(password) < 8:
            errors["password"] = (
                "Password must be at least 8 characters."
            )

        if not re.search(r"[A-Z]", password):
            errors["password"] = (
                "Password must contain at least one uppercase letter."
            )

        if not re.search(r"[a-z]", password):
            errors["password"] = (
                "Password must contain at least one lowercase letter."
            )

        if not re.search(r"\d", password):
            errors["password"] = (
                "Password must contain at least one number."
            )

        if errors:
            raise ValidationError(errors)

    @staticmethod
    def validate_otp(otp):
        if not otp.isdigit() or len(otp) != 6:
            raise ValidationError({
                "otp": "OTP must be a 6-digit number."
            })

    @staticmethod
    def validate_register(data):
        AuthValidator.validate_required_fields(
            data,
            [
                "first_name",
                "last_name",
                "email",
                "password"
            ]
        )

        AuthValidator.validate_email(data["email"])
        AuthValidator.validate_password(data["password"])

        return data

    @staticmethod
    def validate_login(data):
        AuthValidator.validate_required_fields(
            data,
            ["email", "password"]
        )

        AuthValidator.validate_email(data["email"])

        return data

    @staticmethod
    def validate_verify_otp(data):
        AuthValidator.validate_required_fields(
            data,
            ["email", "otp"]
        )

        AuthValidator.validate_email(data["email"])
        AuthValidator.validate_otp(data["otp"])

        return data

    @staticmethod
    def validate_resend_otp(data):
        AuthValidator.validate_required_fields(
            data,
            ["email"]
        )

        AuthValidator.validate_email(data["email"])

        return data

    @staticmethod
    def validate_forgot_password(data):
        AuthValidator.validate_required_fields(
            data,
            ["email"]
        )

        AuthValidator.validate_email(data["email"])

        return data

    @staticmethod
    def validate_reset_password(data):
        AuthValidator.validate_required_fields(
            data,
            ["email", "otp", "new_password"]
        )

        AuthValidator.validate_email(data["email"])
        AuthValidator.validate_otp(data["otp"])
        AuthValidator.validate_password(data["new_password"])

        return data







