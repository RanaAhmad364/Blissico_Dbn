from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.profile.service import ProfileService
from app.profile.validators import ProfileValidator, ProfileValidationError

profile_bp = Blueprint("profile", __name__, url_prefix="/api")


@profile_bp.get("/profile")
@jwt_required()
def get_profile():
    user_id = int(get_jwt_identity())
    profile = ProfileService.get_profile(user_id)
    if not profile:
        return jsonify({"success": False, "message": "User not found."}), 404
    return jsonify({"success": True, "data": profile}), 200


@profile_bp.put("/profile")
@jwt_required()
def update_profile():
    user_id = int(get_jwt_identity())
    data = request.get_json(silent=True) or {}
    try:
        ProfileValidator.validate_update(data)
    except ProfileValidationError as e:
        return jsonify({"success": False, "message": "Validation failed.", "errors": e.errors}), 400

    response, status = ProfileService.update_profile(user_id, data)
    return jsonify(response), status


@profile_bp.post("/profile/picture")
@jwt_required()
def upload_picture():
    user_id = int(get_jwt_identity())
    response, status = ProfileService.upload_picture(user_id, request.files.get("profile_picture"))
    return jsonify(response), status


@profile_bp.delete("/profile/picture")
@jwt_required()
def remove_picture():
    user_id = int(get_jwt_identity())
    response, status = ProfileService.remove_picture(user_id)
    return jsonify(response), status



