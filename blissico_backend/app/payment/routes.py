from decimal import Decimal, InvalidOperation
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
        paypal_order = PayPalService.create_order(
            float(order.total_amount),
            reference_id=order.order_number,
        )
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

    if not isinstance(result, dict) or result.get("status") != "COMPLETED":
        PaymentService.mark_failed(order_id, user_id)
        return jsonify({"success": False, "message": "PayPal payment was not completed.", "paypal_response": result}), 400

    purchase_units = result.get("purchase_units") or []
    purchase_unit = purchase_units[0] if purchase_units else {}
    if not isinstance(purchase_unit, dict):
        PaymentService.mark_failed(order_id, user_id)
        return jsonify({"success": False, "message": "PayPal returned an invalid capture response."}), 400
    payments = purchase_unit.get("payments")
    captures = payments.get("captures") if isinstance(payments, dict) else None
    if not isinstance(captures, list) or not captures:
        PaymentService.mark_failed(order_id, user_id)
        return jsonify({"success": False, "message": "PayPal returned no completed capture."}), 400
    capture = captures[0] if captures else {}
    if not isinstance(capture, dict):
        PaymentService.mark_failed(order_id, user_id)
        return jsonify({"success": False, "message": "PayPal returned an invalid capture response."}), 400
    if purchase_unit.get("reference_id") != order.order_number:
        PaymentService.mark_failed(order_id, user_id)
        return jsonify({"success": False, "message": "PayPal payment did not match this order."}), 400

    captured_amount = capture.get("amount", {})
    try:
        if not isinstance(captured_amount, dict):
            raise InvalidOperation
        amount_matches = Decimal(str(captured_amount.get("value"))) == Decimal(order.total_amount)
    except (InvalidOperation, TypeError):
        amount_matches = False

    if not amount_matches or captured_amount.get("currency_code") != "USD":
        PaymentService.mark_failed(order_id, user_id)
        return jsonify({"success": False, "message": "PayPal payment amount did not match this order."}), 400

    capture_id = capture.get("id")
    if not capture_id:
        PaymentService.mark_failed(order_id, user_id)
        return jsonify({"success": False, "message": "PayPal did not return a verified capture reference."}), 400

    response, status = PaymentService.pay_order(order_id, user_id, payment_gateway="paypal", transaction_id=capture_id)
    return jsonify(response), status