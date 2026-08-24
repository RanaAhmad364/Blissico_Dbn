from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.Card_Cutomization.services import CustomizationService
from app.Card_Cutomization.validators import CustomizationValidator, CustomizationValidationError
from app.admin.decorators import admin_required
from app.models import Card

customization_bp = Blueprint("Card_Customization", __name__, url_prefix="/api")


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



@customization_bp.get("/admin/cards/<int:card_id>/default-customization")
@admin_required
def get_admin_default_customization(card_id):
    data, error, status = CustomizationService.get_default_customization(card_id)
    if error:
        return jsonify(error), status
    return jsonify({"success": True, "data": data}), status


@customization_bp.post("/admin/cards/<int:card_id>/default-customization")
@admin_required
def save_admin_default_customization(card_id):
    data = request.get_json(silent=True) or {}
    try:
        CustomizationValidator.validate(data)
    except CustomizationValidationError as error:
        return jsonify({"success": False, "message": "Validation failed.", "errors": error.errors}), 400

    response, status_code = CustomizationService.save_default_customization(card_id, data)
    return jsonify(response), status_code


@customization_bp.get("/cards/<int:card_id>/default-customization")
def get_public_default_customization(card_id):
    card = Card.query.filter_by(id=card_id, is_active=True).first()
    if not card:
        return jsonify({"success": False, "message": "Card not found."}), 404
    return jsonify({"success": True, "data": CustomizationService.get_public_default_customization(card_id)}), 200















