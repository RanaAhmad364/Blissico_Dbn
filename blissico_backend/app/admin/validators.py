class AdminValidationError(Exception):
    """
    Raised when admin request validation fails.
    """

    def __init__(self, errors):
        self.errors = errors
        super().__init__("Validation failed.")


class AdminValidator:

    # ---------------------------------------------------------
    # CREATE USER
    # ---------------------------------------------------------

    @staticmethod
    def validate_create_user(data):

        errors = {}

        if not data.get("first_name"):
            errors["first_name"] = "First name is required."

        if not data.get("last_name"):
            errors["last_name"] = "Last name is required."

        if not data.get("email"):
            errors["email"] = "Email is required."

        if not data.get("password"):
            errors["password"] = "Password is required."

        if errors:
            raise AdminValidationError(errors)

    # ---------------------------------------------------------
    # UPDATE USER
    # ---------------------------------------------------------

    @staticmethod
    def validate_update_user(data):

        errors = {}

        if not data:
            errors["body"] = "Request body cannot be empty."

        if errors:
            raise AdminValidationError(errors)

    # ---------------------------------------------------------
    # UPDATE STATUS
    # ---------------------------------------------------------

    @staticmethod
    def validate_status(data):

        errors = {}

        if "is_active" not in data:
            errors["is_active"] = (
                "is_active field is required."
            )

        elif not isinstance(data["is_active"], bool):
            errors["is_active"] = (
                "is_active must be true or false."
            )

        if errors:
            raise AdminValidationError(errors)

    # ---------------------------------------------------------
    # VERIFY USER
    # ---------------------------------------------------------

    @staticmethod
    def validate_verify_user(data):

        errors = {}

        if "is_verified" not in data:
            errors["is_verified"] = (
                "is_verified field is required."
            )

        elif not isinstance(data["is_verified"], bool):
            errors["is_verified"] = (
                "is_verified must be true or false."
            )

        if errors:
            raise AdminValidationError(errors)
















