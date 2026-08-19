from datetime import datetime, timedelta
from sqlalchemy import func
from app import db
from app.models import Order, OrderItem, Payment, Download, Card, User


class AnalyticsService:

    @staticmethod
    def _revenue_since(since):
        query = db.session.query(func.coalesce(func.sum(Payment.amount), 0)).filter(Payment.status == "successful")
        if since:
            query = query.filter(Payment.paid_at >= since)
        return float(query.scalar() or 0)

    @staticmethod
    def _downloads_since(since):
        query = db.session.query(func.count(Download.id))
        if since:
            query = query.filter(Download.downloaded_at >= since)
        return query.scalar() or 0

    @staticmethod
    def get_overview():
        now = datetime.utcnow()
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        week_start = now - timedelta(days=7)
        month_start = now - timedelta(days=30)
        year_start = now - timedelta(days=365)

        revenue = {
            "today": AnalyticsService._revenue_since(today_start),
            "weekly": AnalyticsService._revenue_since(week_start),
            "monthly": AnalyticsService._revenue_since(month_start),
            "yearly": AnalyticsService._revenue_since(year_start),
            "total": AnalyticsService._revenue_since(None),
        }
        downloads = {
            "today": AnalyticsService._downloads_since(today_start),
            "weekly": AnalyticsService._downloads_since(week_start),
            "monthly": AnalyticsService._downloads_since(month_start),
            "total": AnalyticsService._downloads_since(None),
        }
        orders = {
            "total": Order.query.count(),
            "pending": Order.query.filter_by(status="pending").count(),
            "completed": Order.query.filter_by(status="paid").count(),
            "failed": Order.query.filter_by(status="failed").count(),
        }
        return {"revenue": revenue, "downloads": downloads, "orders": orders}

    @staticmethod
    def most_downloaded_cards(limit=5):
        rows = (
            db.session.query(Card.id, Card.title, Card.thumbnail, func.count(Download.id).label("download_count"))
            .join(Download, Download.card_id == Card.id)
            .group_by(Card.id)
            .order_by(func.count(Download.id).desc())
            .limit(limit)
            .all()
        )
        return [{"id": r.id, "title": r.title, "thumbnail": r.thumbnail, "downloads": r.download_count} for r in rows]

    @staticmethod
    def top_selling_cards(limit=5):
        rows = (
            db.session.query(Card.id, Card.title, Card.thumbnail, func.count(OrderItem.id).label("sales_count"))
            .join(OrderItem, OrderItem.card_id == Card.id)
            .join(Order, Order.id == OrderItem.order_id)
            .filter(Order.status == "paid")
            .group_by(Card.id)
            .order_by(func.count(OrderItem.id).desc())
            .limit(limit)
            .all()
        )
        return [{"id": r.id, "title": r.title, "thumbnail": r.thumbnail, "sales": r.sales_count} for r in rows]

    @staticmethod
    def recent_payments(limit=10):
        payments = Payment.query.order_by(Payment.id.desc()).limit(limit).all()
        return [
            {
                "id": p.id,
                "transaction_id": p.transaction_id,
                "amount": float(p.amount),
                "status": p.status,
                "user": f"{p.order.user.first_name} {p.order.user.last_name}" if p.order and p.order.user else None,
                "paid_at": p.paid_at.isoformat() if p.paid_at else None,
            }
            for p in payments
        ]

    @staticmethod
    def recent_users(limit=10):
        users = User.query.order_by(User.id.desc()).limit(limit).all()
        return [{"id": u.id, "name": f"{u.first_name} {u.last_name}", "email": u.email} for u in users]

    @staticmethod
    def revenue_chart(days=14):
        now = datetime.utcnow()
        start = (now - timedelta(days=days - 1)).replace(hour=0, minute=0, second=0, microsecond=0)
        rows = (
            db.session.query(func.date(Payment.paid_at).label("day"), func.coalesce(func.sum(Payment.amount), 0).label("total"))
            .filter(Payment.status == "successful", Payment.paid_at >= start)
            .group_by(func.date(Payment.paid_at))
            .all()
        )
        by_day = {str(r.day): float(r.total) for r in rows}
        return [
            {"date": (start + timedelta(days=i)).date().isoformat(), "revenue": by_day.get(str((start + timedelta(days=i)).date()), 0)}
            for i in range(days)
        ]

    @staticmethod
    def download_chart(days=14):
        now = datetime.utcnow()
        start = (now - timedelta(days=days - 1)).replace(hour=0, minute=0, second=0, microsecond=0)
        rows = (
            db.session.query(func.date(Download.downloaded_at).label("day"), func.count(Download.id).label("count"))
            .filter(Download.downloaded_at >= start)
            .group_by(func.date(Download.downloaded_at))
            .all()
        )
        by_day = {str(r.day): r.count for r in rows}
        return [
            {"date": (start + timedelta(days=i)).date().isoformat(), "downloads": by_day.get(str((start + timedelta(days=i)).date()), 0)}
            for i in range(days)
        ]









