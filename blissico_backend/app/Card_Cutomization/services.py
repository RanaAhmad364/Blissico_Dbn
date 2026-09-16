from app import db
from app.models import Card, CardCustomization, CustomizationTextBox


class CustomizationService:

    DEFAULT_BOX = {
        "content": "", "font_family": "Poppins", "font_size": 24, "font_color": "#000000",
        "bold": False, "italic": False, "underline": False, "alignment": "center",
        "letter_spacing": 0, "line_height": 1.2, "position_x": 50, "position_y": 50,
    }

    @staticmethod
    def _effective_boxes(customization):
        """Real boxes if any exist; otherwise synthesize one from the legacy
        flat fields, so callers only ever deal with 'a list of boxes'."""
        if customization.text_boxes:
            return customization.text_boxes

        class _LegacyBox:
            pass
        box = _LegacyBox()
        box.content = customization.greeting_text
        box.font_family = customization.font_family
        box.font_size = customization.font_size
        box.font_color = customization.font_color
        box.bold = customization.bold
        box.italic = customization.italic
        box.underline = customization.underline
        box.alignment = customization.alignment
        box.letter_spacing = customization.letter_spacing
        box.line_height = customization.line_height
        box.position_x = customization.position_x
        box.position_y = customization.position_y
        return [box]

    @staticmethod
    def _write_boxes(customization, boxes_data):
        CustomizationTextBox.query.filter_by(customization_id=customization.id).delete()
        for i, b in enumerate(boxes_data):
            db.session.add(CustomizationTextBox(
                customization_id=customization.id,
                content=b.get("content", ""),
                font_family=b.get("font_family", "Poppins"),
                font_size=int(b.get("font_size", 24)),
                font_color=b.get("font_color", "#000000"),
                bold=bool(b.get("bold", False)),
                italic=bool(b.get("italic", False)),
                underline=bool(b.get("underline", False)),
                alignment=b.get("alignment", "center"),
                letter_spacing=float(b.get("letter_spacing", 0)),
                line_height=float(b.get("line_height", 1.2)),
                position_x=float(b.get("position_x", 50)),
                position_y=float(b.get("position_y", 50)),
                z_index=i,
            ))
        # Keep legacy flat fields in sync via the first box, for anything
        # not yet migrated to read text_boxes.
        first = boxes_data[0]
        customization.greeting_text = first.get("content", "")
        customization.font_family = first.get("font_family", "Poppins")
        customization.font_size = int(first.get("font_size", 24))
        customization.font_color = first.get("font_color", "#000000")
        customization.bold = bool(first.get("bold", False))
        customization.italic = bool(first.get("italic", False))
        customization.underline = bool(first.get("underline", False))
        customization.alignment = first.get("alignment", "center")
        customization.letter_spacing = float(first.get("letter_spacing", 0))
        customization.line_height = float(first.get("line_height", 1.2))
        customization.position_x = float(first.get("position_x", 50))
        customization.position_y = float(first.get("position_y", 50))

    @staticmethod
    def get_customization(user_id, card_id):
        card = Card.query.filter_by(id=card_id, is_active=True).first()
        if not card:
            return None, {"success": False, "message": "Card not found."}, 404

        existing = CardCustomization.query.filter_by(user_id=user_id, card_id=card_id, is_default=False).first()

        if existing:
            data = CustomizationService._serialize(existing)
        else:
            default = CardCustomization.query.filter_by(card_id=card_id, is_default=True).first()
            if default:
                data = CustomizationService._serialize(default)
            else:
                data = {"id": None, "card_id": card_id, "text_boxes": [{**CustomizationService.DEFAULT_BOX, "content": card.title}]}

        return data, None, 200

    @staticmethod
    def save_customization(user_id, card_id, data):
        card = Card.query.filter_by(id=card_id, is_active=True).first()
        if not card:
            return {"success": False, "message": "Card not found."}, 404

        boxes_data = data.get("text_boxes")
        if not boxes_data:
            return {"success": False, "message": "At least one text box is required."}, 400

        customization = CardCustomization.query.filter_by(user_id=user_id, card_id=card_id, is_default=False).first()
        is_new = customization is None
        if is_new:
            customization = CardCustomization(user_id=user_id, card_id=card_id)
            db.session.add(customization)
            db.session.flush()

        CustomizationService._write_boxes(customization, boxes_data)
        db.session.commit()

        message = "Customization saved." if is_new else "Customization updated."
        return {"success": True, "message": message, "data": CustomizationService._serialize(customization)}, 201 if is_new else 200

    @staticmethod
    def delete_customization(user_id, card_id):
        customization = CardCustomization.query.filter_by(user_id=user_id, card_id=card_id, is_default=False).first()
        if not customization:
            return {"success": False, "message": "No saved customization to reset."}, 404
        db.session.delete(customization)
        db.session.commit()
        return {"success": True, "message": "Customization reset to defaults."}, 200

    @staticmethod
    def get_default_customization(card_id):
        card = Card.query.filter_by(id=card_id, is_active=True).first()
        if not card:
            return None, {"success": False, "message": "Card not found."}, 404
        customization = CardCustomization.query.filter_by(card_id=card_id, is_default=True).first()
        return (CustomizationService._serialize(customization), None, 200) if customization else (None, None, 200)

    @staticmethod
    def get_public_default_customization(card_id):
        customization = CardCustomization.query.filter_by(card_id=card_id, is_default=True).first()
        return CustomizationService._serialize(customization) if customization else None

    @staticmethod
    def save_default_customization(card_id, data):
        card = Card.query.filter_by(id=card_id, is_active=True).first()
        if not card:
            return {"success": False, "message": "Card not found."}, 404

        boxes_data = data.get("text_boxes")
        if not boxes_data:
            return {"success": False, "message": "At least one text box is required."}, 400

        customization = CardCustomization.query.filter_by(card_id=card_id, is_default=True).first()
        is_new = customization is None
        if is_new:
            customization = CardCustomization(user_id=None, card_id=card_id, is_default=True)
            db.session.add(customization)
            db.session.flush()

        CustomizationService._write_boxes(customization, boxes_data)
        db.session.commit()
        return {"success": True, "message": "Default design saved.", "data": CustomizationService._serialize(customization)}, 201 if is_new else 200

    @staticmethod
    def list_my_customizations(user_id):
        from app.downloads.service import DownloadService
        customizations = CardCustomization.query.filter_by(user_id=user_id, is_default=False).all()
        result = []
        for c in customizations:
            if not c.card:
                continue
            boxes = CustomizationService._effective_boxes(c)
            result.append({
                "card_id": c.card_id,
                "title": c.card.title,
                "thumbnail": c.card.thumbnail,
                "greeting_text": boxes[0].content if boxes else "",
                "can_download": c.card.is_free or DownloadService._has_paid_for(user_id, c.card_id),
            })
        return result

    @staticmethod
    def _serialize(c):
        boxes = CustomizationService._effective_boxes(c)
        return {
            "id": c.id,
            "card_id": c.card_id,
            "text_boxes": [
                {
                    "content": b.content, "font_family": b.font_family, "font_size": b.font_size,
                    "font_color": b.font_color, "bold": b.bold, "italic": b.italic, "underline": b.underline,
                    "alignment": b.alignment, "letter_spacing": b.letter_spacing, "line_height": b.line_height,
                    "position_x": b.position_x, "position_y": b.position_y,
                }
                for b in boxes
            ],
        }