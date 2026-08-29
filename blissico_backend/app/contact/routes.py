from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from app import db
from app.models import ContactMessage, User

contact_bp = Blueprint("contact", __name__, url_prefix="/api")


@contact_bp.post("/contact")
def submit_contact():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    message = (data.get("message") or "").strip()
    subject = (data.get("subject") or "General inquiry").strip()

    if not name or not email or not message:
        return jsonify({"success": False, "message": "Name, email, and message are required."}), 400

    user = None
    if request.headers.get("Authorization"):
        try:
            user_id = int(get_jwt_identity())
            user = User.query.get(user_id)
        except Exception:
            user = None

    contact_message = ContactMessage(
        user_id=user.id if user else None,
        name=name,
        email=email,
        subject=subject or "General inquiry",
        message=message,
        status="new",
    )
    db.session.add(contact_message)
    db.session.commit()

    return jsonify({"success": True, "message": "Your message has been sent successfully."}), 201


@contact_bp.get("/contact/messages")
@jwt_required()
def list_contact_messages():
    from app.admin.decorators import admin_required
    return admin_required(lambda: jsonify({"success": True, "data": [
        {
            "id": item.id,
            "name": item.name,
            "email": item.email,
            "subject": item.subject,
            "message": item.message,
            "status": item.status,
            "created_at": item.created_at.isoformat() if item.created_at else None,
        }
        for item in ContactMessage.query.order_by(ContactMessage.created_at.desc()).all()
    ]}))()
