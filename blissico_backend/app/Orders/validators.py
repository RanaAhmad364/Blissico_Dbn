class OrderValidationError(Exception):
    def __init__(self, errors):
        self.errors = errors
        super().__init__("Validation failed.")


class OrderValidator:
    @staticmethod
    def validate_create(data):
        errors = {}
        card_ids = data.get("card_ids")
        if not card_ids or not isinstance(card_ids, list):
            errors["card_ids"] = "card_ids must be a non-empty list."
        elif not all(isinstance(cid, int) for cid in card_ids):
            errors["card_ids"] = "card_ids must all be integers."
        if errors:
            raise OrderValidationError(errors)







