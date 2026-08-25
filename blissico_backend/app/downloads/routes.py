from flask import Blueprint, jsonify,request,send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.downloads.service import DownloadService
import io

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


@downloads_bp.get("/cards/<int:card_id>/download/file")
@jwt_required()
def download_file(card_id):
    user_id = int(get_jwt_identity())
    fmt = request.args.get("format", "image")
    result = DownloadService.get_downloadable_file(user_id, card_id, fmt)

    if isinstance(result[0], dict):  # error case
        return jsonify(result[0]), result[1]

    file_bytes, filename, mimetype = result
    return send_file(io.BytesIO(file_bytes), as_attachment=True, download_name=filename, mimetype=mimetype)

