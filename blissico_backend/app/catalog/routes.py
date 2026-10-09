import io
import os
from flask import Blueprint, request, jsonify, send_file, current_app
from flask_jwt_extended import get_jwt_identity, jwt_required
from app.catalog.service import CatalogService
from app.downloads.service import DownloadService
from app.models import Card
from app.utils.preview_service import PreviewService

catalog_bp = Blueprint("catalog", __name__, url_prefix="/api")


@catalog_bp.get("/categories")
def get_categories():
    return jsonify({"success": True, "data": CatalogService.list_categories()}), 200


@catalog_bp.get("/collections")
def get_collections():
    return jsonify({"success": True, "data": CatalogService.list_collections()}), 200


@catalog_bp.get("/occasions")
def get_occasions():
    return jsonify({"success": True, "data": CatalogService.list_occasions()}), 200


@catalog_bp.get("/cards")
@jwt_required(optional=True)
def get_cards():
    filters = {
        "category": request.args.get("category"),
        "collection": request.args.get("collection"),
        "occasion": request.args.get("occasion"),
        "search": request.args.get("search"),
        "sort": request.args.get("sort"),
    }
    if request.args.get("is_free") is not None:
        filters["is_free"] = request.args.get("is_free") == "true"

    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 12, type=int)

    identity = get_jwt_identity()
    user_id = int(identity) if identity is not None else None
    result = CatalogService.list_cards(filters, page, per_page, user_id=user_id)
    return jsonify({"success": True, **result}), 200


@catalog_bp.get("/cards/<int:card_id>")
@jwt_required(optional=True)
def get_card(card_id):
    identity = get_jwt_identity()
    user_id = int(identity) if identity is not None else None
    card = CatalogService.get_card(card_id, user_id=user_id)
    if not card:
        return jsonify({"success": False, "message": "Card not found."}), 404
    return jsonify({"success": True, "data": card}), 200


@catalog_bp.get("/cards/<int:card_id>/preview")
@jwt_required(optional=True)
def get_card_preview(card_id):
    card = Card.query.filter_by(id=card_id, is_active=True).first()
    if not card:
        return jsonify({"success": False, "message": "Card not found."}), 404

    variant = request.args.get("variant", "thumbnail")
    template_id = request.args.get("template_id", type=int)
    media_path = PreviewService.resolve_preview(card, variant, template_id)
    disk_path = PreviewService.resolve_disk_path(media_path)
    if not media_path or not disk_path:
        current_app.logger.warning(
            "Card preview path is missing or invalid (card_id=%s, variant=%s).",
            card.id,
            variant,
        )
        return jsonify({"success": False, "message": "Card preview not found."}), 404
    if not os.path.isfile(disk_path):
        current_app.logger.error(
            "Card preview file is missing (card_id=%s, path=%s).",
            card.id,
            media_path,
        )
        return jsonify({"success": False, "message": "Card preview not found."}), 404

    user_id = get_jwt_identity()
    user_id = int(user_id) if user_id is not None else None
    watermarked = not card.is_free and not DownloadService._has_paid_for(user_id, card.id)
    if watermarked:
        image_bytes = PreviewService.watermarked_preview(disk_path)
        response = send_file(
            io.BytesIO(image_bytes),
            mimetype=PreviewService.mimetype(media_path),
            max_age=0,
        )
    else:
        response = send_file(disk_path, mimetype=PreviewService.mimetype(media_path), max_age=0)

    response.headers["X-Preview-Watermarked"] = "true" if watermarked else "false"
    response.headers["Cache-Control"] = "private, no-store"
    return response

