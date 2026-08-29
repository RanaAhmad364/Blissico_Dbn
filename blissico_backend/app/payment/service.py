import uuid
from datetime import datetime
from app import db
from app.models import Order, Payment, Invoice
from app.notifications.service import create_notification, notify_all_admins


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

        create_notification(
            user_id,
            "Payment successful",
            f"Your payment for order #{order.order_number} was successful.",
            notification_type="payment_success",
            related_id=order.id,
            redirect_url=f"/orders/{order.id}",
        )
        notify_all_admins(
            "User payment received",
            f"User order #{order.order_number} was successfully paid.",
            notification_type="payment_success",
            related_id=order.id,
            redirect_url=f"/admin/purchases",
        )

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

        create_notification(
            user_id,
            "Payment failed",
            f"Your payment for order #{order.order_number} did not complete. Please try again.",
            notification_type="payment_failed",
            related_id=order.id,
            redirect_url=f"/checkout/{order.id}",
        )
        notify_all_admins(
            "Payment issue",
            f"Payment failed for order #{order.order_number}.",
            notification_type="payment_failed",
            related_id=order.id,
            redirect_url=f"/admin/purchases",
        )
        return {"success": True, "message": "Payment marked as failed.", "data": {"order_id": order.id, "status": order.status}}, 200