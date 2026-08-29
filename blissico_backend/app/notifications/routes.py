from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from app.notifications.service import (
    delete_notification,
    get_unread_notification_count,
    get_user_notifications,
    mark_all_notifications_read,
    mark_notification_read,
)

notifications_bp = Blueprint("notifications", __name__, url_prefix="/api")


@notifications_bp.get("/notifications")
@jwt_required()
def list_notifications():
    user_id = int(get_jwt_identity())
    unread_only = request.args.get("unread_only", "false").lower() == "true"
    limit = request.args.get("limit", type=int)
    return jsonify({"success": True, "data": get_user_notifications(user_id, limit=limit, unread_only=unread_only)}), 200


@notifications_bp.get("/notifications/unread")
@jwt_required()
def list_unread_notifications():
    user_id = int(get_jwt_identity())
    return jsonify({"success": True, "data": get_user_notifications(user_id, unread_only=True)}), 200


@notifications_bp.get("/notifications/unread-count")
@jwt_required()
def unread_count():
    user_id = int(get_jwt_identity())
    return jsonify({"success": True, "data": {"count": get_unread_notification_count(user_id)}}), 200


@notifications_bp.put("/notifications/<int:notification_id>/read")
@jwt_required()
def read_notification(notification_id):
    user_id = int(get_jwt_identity())
    notification = mark_notification_read(notification_id, user_id)
    if not notification:
        return jsonify({"success": False, "message": "Notification not found."}), 404
    return jsonify({"success": True, "data": {"id": notification.id, "is_read": notification.is_read}}), 200


@notifications_bp.put("/notifications/mark-all-read")
@jwt_required()
def mark_all_read():
    user_id = int(get_jwt_identity())
    count = mark_all_notifications_read(user_id)
    return jsonify({"success": True, "data": {"updated": count}}), 200


@notifications_bp.delete("/notifications/<int:notification_id>")
@jwt_required()
def delete_single_notification(notification_id):
    user_id = int(get_jwt_identity())
    deleted = delete_notification(notification_id, user_id)
    if not deleted:
        return jsonify({"success": False, "message": "Notification not found."}), 404
    return jsonify({"success": True, "message": "Notification deleted."}), 200
