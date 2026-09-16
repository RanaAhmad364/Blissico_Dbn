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
        boxes = data.get("text_boxes")

        if not boxes or not isinstance(boxes, list):
            errors["text_boxes"] = "At least one text box is required."
            raise CustomizationValidationError(errors)

        for i, box in enumerate(boxes):
            prefix = f"text_boxes[{i}]"

            if not box.get("content") or not str(box["content"]).strip():
                errors[f"{prefix}.content"] = "Text content is required."
            elif len(str(box["content"])) > 500:
                errors[f"{prefix}.content"] = "Text must be under 500 characters."

            if box.get("alignment") and box["alignment"] not in CustomizationValidator.ALLOWED_ALIGNMENTS:
                errors[f"{prefix}.alignment"] = "Alignment must be left, center, or right."

            if "font_size" in box and box["font_size"] not in (None, ""):
                try:
                    size = int(box["font_size"])
                    if not (8 <= size <= 200):
                        errors[f"{prefix}.font_size"] = "Font size must be between 8 and 200."
                except (TypeError, ValueError):
                    errors[f"{prefix}.font_size"] = "Font size must be a whole number."

            if box.get("font_color") and not CustomizationValidator.HEX_COLOR_RE.match(box["font_color"]):
                errors[f"{prefix}.font_color"] = "Font color must be a valid hex code, e.g. #ff0000."

            for field in ("letter_spacing", "line_height", "position_x", "position_y"):
                if field in box and box[field] not in (None, ""):
                    try:
                        value = float(box[field])
                        if field in ("position_x", "position_y") and not 0 <= value <= 100:
                            errors[f"{prefix}.{field}"] = f"{field} must be between 0 and 100."
                    except (TypeError, ValueError):
                        errors[f"{prefix}.{field}"] = f"{field} must be a number."

        if errors:
            raise CustomizationValidationError(errors)














