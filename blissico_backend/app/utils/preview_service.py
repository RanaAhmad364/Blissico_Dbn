import mimetypes
import os
from functools import lru_cache

from flask import current_app

from app.models import Card, CardTemplate


class PreviewService:
    @staticmethod
    def preview_url(card_id, variant="thumbnail", template_id=None):
        if variant == "template":
            return f"/api/cards/{card_id}/preview?variant=template&template_id={template_id}"
        return f"/api/cards/{card_id}/preview?variant=thumbnail"

    @staticmethod
    def resolve_preview(card, variant, template_id=None):
        if variant == "thumbnail":
            return card.thumbnail
        if variant == "template" and template_id is not None:
            template = CardTemplate.query.filter_by(id=template_id, card_id=card.id).first()
            return template.preview_image if template else None
        return None

    @staticmethod
    def resolve_disk_path(media_path):
        if not media_path or not media_path.startswith("/static/"):
            return None

        static_root = os.path.realpath(os.path.join(current_app.root_path, "static"))
        disk_path = os.path.realpath(os.path.join(static_root, media_path[len("/static/"):]))
        if os.path.commonpath((static_root, disk_path)) != static_root:
            return None
        return disk_path

    @staticmethod
    def find_registered_media(media_path):
        cards = Card.query.filter(
            (Card.thumbnail == media_path) | (Card.animated_gif == media_path)
        ).all()

        templates = CardTemplate.query.filter(
            (CardTemplate.preview_image == media_path)
            | (CardTemplate.template_file == media_path)
            | (CardTemplate.animated_file == media_path)
        ).all()
        by_id = {card.id: card for card in cards}
        by_id.update({template.card.id: template.card for template in templates if template.card})
        return list(by_id.values())

    @staticmethod
    def mimetype(media_path):
        return mimetypes.guess_type(media_path)[0] or "application/octet-stream"

    @staticmethod
    def watermarked_preview(disk_path):
        stat = os.stat(disk_path)
        return _render_watermarked_preview(disk_path, stat.st_mtime_ns, stat.st_size)


@lru_cache(maxsize=2)
def _render_watermarked_preview(disk_path, modified_ns, file_size):
    from app.utils.render_services import RenderService

    with open(disk_path, "rb") as media_file:
        return RenderService.watermark_preview(media_file.read())
