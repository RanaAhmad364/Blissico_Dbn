from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from app.models import User


def admin_required(fn):
    """
    Allow access only to authenticated users
    having the Admin role.
    """

    @wraps(fn)
    def wrapper(*args, **kwargs):

        # Make sure a valid JWT exists
        verify_jwt_in_request()

        # Get user ID from JWT
        user_id = get_jwt_identity()

        # Find user
        user = User.query.get(user_id)

        if not user:
            return jsonify({
                "success": False,
                "message": "User not found."
            }), 404

        # Check account status
        if not user.is_active:
            return jsonify({
                "success": False,
                "message": "Your account is inactive."
            }), 403

        # Check role
        if not user.role or user.role.name.lower() != "admin":
            return jsonify({
                "success": False,
                "message": "Admin access required."
            }), 403

        return fn(*args, **kwargs)

    return wrapper


