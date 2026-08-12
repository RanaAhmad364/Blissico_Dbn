class CatalogValidationError(Exception):
    def __init__(self, errors):
        self.errors = errors
        super().__init__("Validation failed.")


class CatalogValidator:

    # ---------------- CATEGORY / COLLECTION / OCCASION ----------------

    @staticmethod
    def validate_taxonomy(data):
        errors = {}
        if not data.get("name"):
            errors["name"] = "Name is required."
        if errors:
            raise CatalogValidationError(errors)

    # ---------------- CARD ----------------

    @staticmethod
    def validate_card(data, require_all=True):
        errors = {}
        required_fields = ["title", "category_id", "collection_id", "occasion_id"]

        if require_all:
            for field in required_fields:
                if not data.get(field):
                    errors[field] = f"{field} is required."

        if "price" in data and data.get("price") not in (None, ""):
            try:
                float(data["price"])
            except ValueError:
                errors["price"] = "Price must be a number."

        if errors:
            raise CatalogValidationError(errors)

    # ---------------- CARD TEMPLATE ----------------

    @staticmethod
    def validate_card_template(data, require_dimensions=True):
        errors = {}

        if require_dimensions:
            for field in ["width", "height"]:
                value = data.get(field)
                if value is None or value == "":
                    errors[field] = f"{field} is required."
                else:
                    try:
                        int(value)
                    except ValueError:
                        errors[field] = f"{field} must be an integer."

        if errors:
            raise CatalogValidationError(errors)


