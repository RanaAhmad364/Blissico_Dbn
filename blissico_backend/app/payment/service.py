import uuid
from datetime import datetime
from app import db
from app.models import Order, Payment, Invoice


class PaymentService:

    @staticmethod
    def pay_order(order_id, user_id, payment_gateway="mock", transaction_id=None):
        order = Order.query.filter_by(id=order_id, user_id=user_id).first()
        if not order:
            return {"success": False, "message": "Order not found."}, 404
        if order.status == "paid":
            return {"success": False, "message": "Order has already been paid."}, 409
        if order.status == "cancelled":
            return {"success": False, "message": "This order was cancelled."}, 409

        payment = Payment(
            order_id=order.id,
            transaction_id=transaction_id or f"TXN-{uuid.uuid4().hex[:12].upper()}",
            payment_gateway=payment_gateway,
            amount=order.total_amount,
            status="successful",
            paid_at=datetime.utcnow(),
        )
        db.session.add(payment)
        order.status = "paid"
        db.session.flush()

        invoice = Invoice(
            payment_id=payment.id,
            invoice_number=f"INV-{datetime.utcnow().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}",
        )
        db.session.add(invoice)
        db.session.commit()

        return {
            "success": True,
            "message": "Payment successful.",
            "data": {
                "order_id": order.id,
                "status": order.status,
                "transaction_id": payment.transaction_id,
                "invoice_number": invoice.invoice_number,
                "paid_at": payment.paid_at.isoformat(),
            },
        }, 200

    @staticmethod
    def mark_failed(order_id, user_id):
        order = Order.query.filter_by(id=order_id, user_id=user_id).first()
        if not order:
            return {"success": False, "message": "Order not found."}, 404

        db.session.add(Payment(
            order_id=order.id,
            transaction_id=f"TXN-{uuid.uuid4().hex[:12].upper()}",
            payment_gateway="mock",
            amount=order.total_amount,
            status="failed",
        ))
        order.status = "failed"
        db.session.commit()
        return {"success": True, "message": "Payment marked as failed.", "data": {"order_id": order.id, "status": order.status}}, 200