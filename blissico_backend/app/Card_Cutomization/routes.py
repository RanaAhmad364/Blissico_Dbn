from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.Card_Cutomization.services import CustomizationService
from app.Card_Cutomization.validators import CustomizationValidator, CustomizationValidationError

customization_bp = Blueprint("customization", __name__, url_prefix="/api/admin")


@customization_bp.get("/cards/<int:card_id>/customization")
@jwt_required()
def get_customization(card_id):
    user_id = int(get_jwt_identity())
    data, error, status = CustomizationService.get_customization(user_id, card_id)
    if error:
        return jsonify(error), status
    return jsonify({"success": True, "data": data}), status


@customization_bp.post("/cards/<int:card_id>/customization")
@jwt_required()
def save_customization(card_id):
    user_id = int(get_jwt_identity())
    data = request.get_json(silent=True) or {}

    try:
        CustomizationValidator.validate(data)
    except CustomizationValidationError as error:
        return jsonify({"success": False, "message": "Validation failed.", "errors": error.errors}), 400

    response, status_code = CustomizationService.save_customization(user_id, card_id, data)
    return jsonify(response), status_code


@customization_bp.delete("/cards/<int:card_id>/customization")
@jwt_required()
def delete_customization(card_id):
    user_id = int(get_jwt_identity())
    response, status_code = CustomizationService.delete_customization(user_id, card_id)
    return jsonify(response), status_code