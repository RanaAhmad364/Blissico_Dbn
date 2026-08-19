import uuid
from datetime import datetime
from app import db
from app.models import Order, OrderItem, Card
from app.payments.service import PaymentService


class OrderService:

    @staticmethod
    def _generate_order_number():
        return f"ORD-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}-{uuid.uuid4().hex[:6].upper()}"

    @staticmethod
    def create_order(user_id, card_ids):
        cards = Card.query.filter(Card.id.in_(card_ids), Card.is_active == True).all()
        found_ids = {c.id for c in cards}
        missing = set(card_ids) - found_ids
        if missing:
            return {"success": False, "message": f"Card(s) not found: {', '.join(map(str, missing))}"}, 404

        total = sum(0.0 if c.is_free else float(c.price) for c in cards)

        order = Order(
            user_id=user_id,
            order_number=OrderService._generate_order_number(),
            total_amount=total,
            status="pending",
        )
        db.session.add(order)
        db.session.flush()  # get order.id before committing

        for card in cards:
            db.session.add(OrderItem(
                order_id=order.id,
                card_id=card.id,
                price=0 if card.is_free else card.price,
            ))

        db.session.commit()

        # Free orders skip the payment step entirely — auto-complete right away.
        if total == 0:
            PaymentService.pay_order(order.id, user_id, payment_gateway="free")
            db.session.refresh(order)

        return {"success": True, "message": "Order created.", "data": OrderService._serialize_order(order)}, 201

    @staticmethod
    def list_user_orders(user_id):
        orders = Order.query.filter_by(user_id=user_id).order_by(Order.id.desc()).all()
        return [OrderService._serialize_order(o) for o in orders]

    @staticmethod
    def get_order(order_id, user_id):
        order = Order.query.filter_by(id=order_id, user_id=user_id).first()
        return OrderService._serialize_order(order) if order else None

    @staticmethod
    def _serialize_order(order):
        return {
            "id": order.id,
            "order_number": order.order_number,
            "status": order.status,
            "total_amount": float(order.total_amount),
            "items": [
                {"card_id": item.card_id, "title": item.card.title if item.card else None, "price": float(item.price)}
                for item in order.order_items
            ],
            "payment": {
                "status": order.payment.status,
                "transaction_id": order.payment.transaction_id,
                "paid_at": order.payment.paid_at.isoformat() if order.payment.paid_at else None,
            } if order.payment else None,
        }