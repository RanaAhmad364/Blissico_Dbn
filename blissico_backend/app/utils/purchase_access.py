from app import db
from app.models import Order, OrderItem, Payment


def valid_purchase_card_ids(user_id, card_ids):
    if user_id is None or not card_ids:
        return set()

    rows = (
        db.session.query(OrderItem.card_id)
        .join(Order, OrderItem.order_id == Order.id)
        .join(Payment, Payment.order_id == Order.id)
        .filter(
            Order.user_id == user_id,
            Order.status == "paid",
            Payment.status == "successful",
            Payment.amount == Order.total_amount,
            OrderItem.card_id.in_(card_ids),
        )
        .distinct()
        .all()
    )
    return {row.card_id for row in rows}


def has_valid_purchase(user_id, card_id):
    return card_id in valid_purchase_card_ids(user_id, [card_id])
