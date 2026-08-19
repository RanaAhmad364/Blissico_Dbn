from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.downloads.service import DownloadService

downloads_bp = Blueprint("downloads", __name__, url_prefix="/api")


@downloads_bp.post("/cards/<int:card_id>/download")
@jwt_required()
def download_card(card_id):
    user_id = int(get_jwt_identity())
    response, status = DownloadService.download_card(user_id, card_id)
    return jsonify(response), status


@downloads_bp.get("/downloads")
@jwt_required()
def list_downloads():
    user_id = int(get_jwt_identity())
    return jsonify({"success": True, "data": DownloadService.list_user_downloads(user_id)}), 200

