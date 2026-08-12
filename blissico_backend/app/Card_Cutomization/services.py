from app import db
from app.models import Card, CardCustomization


class CustomizationService:

    DEFAULTS = {
        "font_family": "Poppins",
        "font_size": 24,
        "font_color": "#000000",
        "bold": False,
        "italic": False,
        "underline": False,
        "alignment": "center",
        "letter_spacing": 0,
        "line_height": 1.2,
    }

    @staticmethod
    def get_customization(user_id, card_id):
        card = Card.query.filter_by(id=card_id, is_active=True).first()
        if not card:
            return None, {"success": False, "message": "Card not found."}, 404

        existing = CardCustomization.query.filter_by(user_id=user_id, card_id=card_id).first()

        if existing:
            data = CustomizationService._serialize(existing)
        else:
            data = {**CustomizationService.DEFAULTS, "id": None, "card_id": card_id, "greeting_text": card.title}

        return data, None, 200

    @staticmethod
    def save_customization(user_id, card_id, data):
        card = Card.query.filter_by(id=card_id, is_active=True).first()
        if not card:
            return {"success": False, "message": "Card not found."}, 404

        customization = CardCustomization.query.filter_by(user_id=user_id, card_id=card_id).first()
        is_new = customization is None

        if is_new:
            customization = CardCustomization(user_id=user_id, card_id=card_id, greeting_text=data["greeting_text"])
            db.session.add(customization)

        customization.greeting_text = data["greeting_text"]
        customization.font_family = data.get("font_family", customization.font_family) or CustomizationService.DEFAULTS["font_family"]
        customization.font_size = int(data.get("font_size") or customization.font_size or CustomizationService.DEFAULTS["font_size"])
        customization.font_color = data.get("font_color", customization.font_color) or CustomizationService.DEFAULTS["font_color"]
        customization.bold = bool(data.get("bold", customization.bold))
        customization.italic = bool(data.get("italic", customization.italic))
        customization.underline = bool(data.get("underline", customization.underline))
        customization.alignment = data.get("alignment", customization.alignment) or CustomizationService.DEFAULTS["alignment"]
        customization.letter_spacing = float(data.get("letter_spacing") if data.get("letter_spacing") not in (None, "") else (customization.letter_spacing or 0))
        customization.line_height = float(data.get("line_height") if data.get("line_height") not in (None, "") else (customization.line_height or 1.2))

        db.session.commit()

        message = "Customization saved." if is_new else "Customization updated."
        return {"success": True, "message": message, "data": CustomizationService._serialize(customization)}, 201 if is_new else 200

    @staticmethod
    def delete_customization(user_id, card_id):
        customization = CardCustomization.query.filter_by(user_id=user_id, card_id=card_id).first()
        if not customization:
            return {"success": False, "message": "No saved customization to reset."}, 404

        db.session.delete(customization)
        db.session.commit()
        return {"success": True, "message": "Customization reset to defaults."}, 200

    @staticmethod
    def _serialize(c):
        return {
            "id": c.id,
            "card_id": c.card_id,
            "greeting_text": c.greeting_text,
            "font_family": c.font_family,
            "font_size": c.font_size,
            "font_color": c.font_color,
            "bold": c.bold,
            "italic": c.italic,
            "underline": c.underline,
            "alignment": c.alignment,
            "letter_spacing": c.letter_spacing,
            "line_height": c.line_height,
        }










