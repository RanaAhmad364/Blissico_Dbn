from datetime import datetime
from app import db
from app.models import Order, OrderItem, Card, Download, CardCustomization,User
from flask import current_app
import os,io
from app.notifications.service import create_notification, notify_all_admins
from app.utils.render_services import RenderService

class DownloadService:

    @staticmethod
    def _has_paid_for(user_id, card_id):
        return (
            db.session.query(OrderItem)
            .join(Order, OrderItem.order_id == Order.id)
            .filter(Order.user_id == user_id, Order.status == "paid", OrderItem.card_id == card_id)
            .first()
            is not None
        )

    @staticmethod
    def download_card(user_id, card_id):
        card = Card.query.filter_by(id=card_id, is_active=True).first()
        if not card:
            return {"success": False, "message": "Card not found."}, 404

        if not card.is_free and not DownloadService._has_paid_for(user_id, card_id):
            return {"success": False, "message": "You need to purchase this card before downloading it."}, 403

        customization = CardCustomization.query.filter_by(user_id=user_id, card_id=card_id).first()

        # Stand-in until real customization-to-image rendering exists (see note above).
        file_path = card.thumbnail
        if card.templates:
            file_path = card.templates[0].preview_image

        download = Download(
            user_id=user_id,
            card_id=card_id,
            customization_id=customization.id if customization else None,
            downloaded_at=datetime.utcnow(),
            file_path=file_path,
        )
        db.session.add(download)
        db.session.commit()

        if card.is_free:
            create_notification(
                user_id,
                "Free card downloaded",
                f"You downloaded the free card '{card.title}'.",
                notification_type="free_download",
                related_id=card.id,
                redirect_url=f"/product/{card.id}",
            )
            notify_all_admins(
                "Free card downloaded",
                f"User downloaded the free card '{card.title}'.",
                notification_type="free_download",
                related_id=card.id,
                redirect_url=f"/admin/downloads",
            )

        return {"success": True, "message": "Download ready.", "data": {"file_url": file_path, "downloaded_at": download.downloaded_at.isoformat()}}, 200

    @staticmethod
    def list_user_downloads(user_id):
        downloads = Download.query.filter_by(user_id=user_id).order_by(Download.downloaded_at.desc()).all()
        return [
            {
                "id": d.id,
                "card_id": d.card_id,
                "card_title": d.card.title if d.card else None,
                "file_path": d.file_path,
                "downloaded_at": d.downloaded_at.isoformat(),
            }
            for d in downloads
        ]


    @staticmethod
    def get_downloadable_file(user_id, card_id, fmt="image"):
        card = Card.query.filter_by(id=card_id, is_active=True).first()
        if not card:
            return {"success": False, "message": "Card not found."}, 404

        if not card.is_free and not DownloadService._has_paid_for(user_id, card_id):
            return {"success": False, "message": "You need to purchase this card before downloading it."}, 403

        file_path = card.thumbnail
        if card.templates:
            file_path = card.templates[0].preview_image
        if not file_path:
            return {"success": False, "message": "No downloadable file exists for this card yet."}, 404

        relative = file_path.replace("/static/", "", 1)
        disk_path = os.path.join(current_app.root_path, "static", relative)
        if not os.path.exists(disk_path):
            return {"success": False, "message": "The file for this card is missing on the server."}, 404

        safe_title = "".join(c for c in card.title if c.isalnum() or c in (" ", "-", "_")).strip() or "card"

        customization = CardCustomization.query.filter_by(user_id=user_id, card_id=card_id, is_default=False).first()

        # Composite the user's saved design onto the template — this is the real
        # download now, not just the blank template.
        if customization:
            rendered = RenderService.render(disk_path, customization)
            buf = io.BytesIO()
            rendered.convert("RGB").save(buf, format="JPEG", quality=92)
            raw_bytes = buf.getvalue()
        else:
            with open(disk_path, "rb") as f:
                raw_bytes = f.read()

        if fmt == "pdf":
            import img2pdf
            try:
                out_bytes = img2pdf.convert(raw_bytes)
            except Exception:
                return {"success": False, "message": "Could not generate a PDF for this card."}, 500
            filename = f"{safe_title}.pdf"
            mimetype = "application/pdf"    
        else:
            out_bytes = raw_bytes
            filename = f"{safe_title}.jpg"
            mimetype = "image/jpeg"

        if fmt == "gif":
            if not card.animated_gif:
                return {"success": False, "message": "No animated version exists for this card yet."}, 404
            relative = card.animated_gif.replace("/static/", "", 1)
            disk_path = os.path.join(current_app.root_path, "static", relative)
            if not os.path.exists(disk_path):
                return {"success": False, "message": "The animated file is missing on the server."}, 404
            with open(disk_path, "rb") as f:
                out_bytes = f.read()
            filename = f"{safe_title}.gif"
            mimetype = "image/gif"

        db.session.add(Download(user_id=user_id, card_id=card_id, downloaded_at=datetime.utcnow(), file_path=card.animated_gif))
        db.session.commit()
        return out_bytes, filename, mimetype    


    @staticmethod
    def list_all_downloads():
        rows = (
            db.session.query(Download, Card, User)
            .join(Card, Download.card_id == Card.id)
            .join(User, Download.user_id == User.id)
            .order_by(Download.downloaded_at.desc())
            .all()
        )
        return [
            {
                "card_title": card.title,
                "thumbnail": card.thumbnail,
                "username": f"{user.first_name} {user.last_name}",
                "email": user.email,
                "downloaded_at": d.downloaded_at.isoformat() if d.downloaded_at else None,
            }
            for d, card, user in rows
        ]





