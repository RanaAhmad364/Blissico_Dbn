import re


class ProfileValidationError(Exception):
    def __init__(self, errors):
        self.errors = errors
        super().__init__("Validation failed.")


class ProfileValidator:
    EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

    @staticmethod
    def validate_update(data):
        errors = {}
        if not data.get("first_name") or not data["first_name"].strip():
            errors["first_name"] = "First name is required."
        if not data.get("last_name") or not data["last_name"].strip():
            errors["last_name"] = "Last name is required."
        if not data.get("email") or not ProfileValidator.EMAIL_RE.match(data["email"]):
            errors["email"] = "A valid email is required."
        if errors:
            raise ProfileValidationError(errors)










