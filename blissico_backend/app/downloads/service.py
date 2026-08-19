from datetime import datetime
from app import db
from app.models import Order, OrderItem, Card, Download, CardCustomization


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






