import re


class CustomizationValidationError(Exception):
    def __init__(self, errors):
        self.errors = errors
        super().__init__("Validation failed.")


class CustomizationValidator:
    ALLOWED_ALIGNMENTS = {"left", "center", "right"}
    HEX_COLOR_RE = re.compile(r"^#(?:[0-9a-fA-F]{3}){1,2}$")

    @staticmethod
    def validate(data):
        errors = {}

        text = data.get("greeting_text")
        if not text or not str(text).strip():
            errors["greeting_text"] = "Greeting text is required."
        elif len(str(text)) > 500:
            errors["greeting_text"] = "Greeting text must be under 500 characters."

        if data.get("alignment") and data["alignment"] not in CustomizationValidator.ALLOWED_ALIGNMENTS:
            errors["alignment"] = "Alignment must be left, center, or right."

        if "font_size" in data and data["font_size"] not in (None, ""):
            try:
                size = int(data["font_size"])
                if not (8 <= size <= 200):
                    errors["font_size"] = "Font size must be between 8 and 200."
            except (TypeError, ValueError):
                errors["font_size"] = "Font size must be a whole number."

        if data.get("font_color") and not CustomizationValidator.HEX_COLOR_RE.match(data["font_color"]):
            errors["font_color"] = "Font color must be a valid hex code, e.g. #ff0000."

        for field in ("letter_spacing", "line_height"):
            if field in data and data[field] not in (None, ""):
                try:
                    float(data[field])
                except (TypeError, ValueError):
                    errors[field] = f"{field.replace('_', ' ').capitalize()} must be a number."

        if errors:
            raise CustomizationValidationError(errors)














