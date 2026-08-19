from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.Orders.service import OrderService
from app.Orders.validators import OrderValidator, OrderValidationError

orders_bp = Blueprint("Orders", __name__, url_prefix="/api")


@orders_bp.post("/orders")
@jwt_required()
def create_order():
    user_id = int(get_jwt_identity())
    data = request.get_json(silent=True) or {}
    try:
        OrderValidator.validate_create(data)
    except OrderValidationError as e:
        return jsonify({"success": False, "message": "Validation failed.", "errors": e.errors}), 400

    response, status = OrderService.create_order(user_id, data["card_ids"])
    return jsonify(response), status


@orders_bp.get("/orders")
@jwt_required()
def list_orders():
    user_id = int(get_jwt_identity())
    return jsonify({"success": True, "data": OrderService.list_user_orders(user_id)}), 200


@orders_bp.get("/orders/<int:order_id>")
@jwt_required()
def get_order(order_id):
    user_id = int(get_jwt_identity())
    order = OrderService.get_order(order_id, user_id)
    if not order:
        return jsonify({"success": False, "message": "Order not found."}), 404
    return jsonify({"success": True, "data": order}), 200