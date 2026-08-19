from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Order
from app.payment.service import PaymentService
from app.payment.paypal_service import PayPalService

payments_bp = Blueprint("payment", __name__, url_prefix="/api")


# ---- Mock / internal (used automatically for free-card orders) ----

@payments_bp.post("/orders/<int:order_id>/pay")
@jwt_required()
def pay_order(order_id):
    user_id = int(get_jwt_identity())
    response, status = PaymentService.pay_order(order_id, user_id)
    return jsonify(response), status


@payments_bp.post("/orders/<int:order_id>/pay/fail")
@jwt_required()
def fail_order(order_id):
    user_id = int(get_jwt_identity())
    response, status = PaymentService.mark_failed(order_id, user_id)
    return jsonify(response), status


# ---- PayPal ----

@payments_bp.post("/orders/<int:order_id>/paypal/create-order")
@jwt_required()
def paypal_create_order(order_id):
    user_id = int(get_jwt_identity())
    order = Order.query.filter_by(id=order_id, user_id=user_id).first()
    if not order:
        return jsonify({"success": False, "message": "Order not found."}), 404
    if order.status != "pending":
        return jsonify({"success": False, "message": f"Order is already '{order.status}'."}), 409

    try:
        paypal_order = PayPalService.create_order(float(order.total_amount))
    except Exception as e:
        return jsonify({"success": False, "message": f"Could not create PayPal order: {e}"}), 502

    return jsonify({"success": True, "data": {"paypal_order_id": paypal_order["id"]}}), 200


@payments_bp.post("/orders/<int:order_id>/paypal/capture-order")
@jwt_required()
def paypal_capture_order(order_id):
    user_id = int(get_jwt_identity())
    data = request.get_json(silent=True) or {}
    paypal_order_id = data.get("paypal_order_id")
    if not paypal_order_id:
        return jsonify({"success": False, "message": "paypal_order_id is required."}), 400

    order = Order.query.filter_by(id=order_id, user_id=user_id).first()
    if not order:
        return jsonify({"success": False, "message": "Order not found."}), 404
    if order.status != "pending":
        return jsonify({"success": False, "message": f"Order is already '{order.status}'."}), 409

    try:
        result, _ = PayPalService.capture_order(paypal_order_id)
    except Exception as e:
        return jsonify({"success": False, "message": f"Could not reach PayPal: {e}"}), 502

    if result.get("status") != "COMPLETED":
        PaymentService.mark_failed(order_id, user_id)
        return jsonify({"success": False, "message": "PayPal payment was not completed.", "paypal_response": result}), 400

    capture_id = (
        result.get("purchase_units", [{}])[0]
        .get("payments", {}).get("captures", [{}])[0].get("id")
    )
    response, status = PaymentService.pay_order(order_id, user_id, payment_gateway="paypal", transaction_id=capture_id)
    return jsonify(response), status