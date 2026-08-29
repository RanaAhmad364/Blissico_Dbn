from app import db
from app.models import Notification, User, Role


def create_notification(user_id, title, message, notification_type=None, related_id=None, redirect_url=None):
    """Create a notification for a single user."""
    if user_id is None:
        return None

    notification = Notification(
        user_id=user_id,
        title=title,
        message=message,
        is_read=False,
        notification_type=notification_type,
        related_id=related_id,
        redirect_url=redirect_url,
    )
    db.session.add(notification)
    db.session.commit()
    return notification


def notify_all_admins(title, message, notification_type=None, related_id=None, redirect_url=None):
    """Create a notification for every admin user."""
    admin_role = Role.query.filter(db.func.lower(Role.name) == 'admin').first()
    if not admin_role:
        return []

    admins = User.query.filter_by(role_id=admin_role.id).all()
    if not admins:
        return []

    created = []
    for admin in admins:
        created.append(
            create_notification(
                admin.id,
                title,
                message,
                notification_type=notification_type,
                related_id=related_id,
                redirect_url=redirect_url,
            )
        )
    return created


def get_user_notifications(user_id, limit=None, unread_only=False):
    query = Notification.query.filter_by(user_id=user_id).order_by(Notification.created_at.desc())
    if unread_only:
        query = query.filter_by(is_read=False)
    if limit:
        query = query.limit(limit)
    notifications = query.all()
    return [
        {
            "id": n.id,
            "title": n.title,
            "message": n.message,
            "is_read": n.is_read,
            "notification_type": n.notification_type,
            "related_id": n.related_id,
            "redirect_url": n.redirect_url,
            "created_at": n.created_at.isoformat() if n.created_at else None,
        }
        for n in notifications
    ]


def get_unread_notification_count(user_id):
    return Notification.query.filter_by(user_id=user_id, is_read=False).count()


def mark_notification_read(notification_id, user_id):
    notification = Notification.query.filter_by(id=notification_id, user_id=user_id).first()
    if not notification:
        return None
    notification.is_read = True
    db.session.commit()
    return notification


def mark_all_notifications_read(user_id):
    updated = Notification.query.filter_by(user_id=user_id, is_read=False).all()
    for item in updated:
        item.is_read = True
    db.session.commit()
    return len(updated)


def delete_notification(notification_id, user_id):
    notification = Notification.query.filter_by(id=notification_id, user_id=user_id).first()
    if not notification:
        return False
    db.session.delete(notification)
    db.session.commit()
    return True
