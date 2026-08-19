from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from Favourite.service import FavoriteService

favorites_bp = Blueprint("Favourite", __name__, url_prefix="/api")


@favorites_bp.post("/cards/<int:card_id>/favorite")
@jwt_required()
def add_favorite(card_id):
    user_id = int(get_jwt_identity())
    response, status = FavoriteService.add(user_id, card_id)
    return jsonify(response), status


@favorites_bp.delete("/cards/<int:card_id>/favorite")
@jwt_required()
def remove_favorite(card_id):
    user_id = int(get_jwt_identity())
    response, status = FavoriteService.remove(user_id, card_id)
    return jsonify(response), status


@favorites_bp.get("/favorites")
@jwt_required()
def list_favorites():
    user_id = int(get_jwt_identity())
    return jsonify({"success": True, "data": FavoriteService.list_for_user(user_id)}), 200



