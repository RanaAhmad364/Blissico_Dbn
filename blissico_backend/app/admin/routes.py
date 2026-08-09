from flask import Blueprint, request, jsonify

from app.admin.decorators import admin_required
from app.admin.service import AdminService
from app.admin.validators import (
    AdminValidator,
    AdminValidationError
)


admin_bp = Blueprint("admin",__name__,url_prefix="/api/admin")


# =========================================================
# USER MANAGEMENT
# =========================================================

# ---------------------------------------------------------
# GET ALL USERS
# ---------------------------------------------------------

@admin_bp.get("/users")
@admin_required
def get_users():

    users = AdminService.get_users()

    return jsonify({
        "success": True,
        "data": users
    }), 200


# ---------------------------------------------------------
# GET SINGLE USER
# ---------------------------------------------------------

@admin_bp.get("/users/<int:user_id>")
@admin_required
def get_user(user_id):

    user = AdminService.get_user(user_id)

    if not user:
        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    return jsonify({
        "success": True,
        "data": user
    }), 200


# ---------------------------------------------------------
# CREATE USER
# ---------------------------------------------------------

@admin_bp.post("/users")
@admin_required
def create_user():

    try:

        data = request.get_json(
            silent=True
        ) or {}

        AdminValidator.validate_create_user(
            data
        )

        response, status_code = (
            AdminService.create_user(data)
        )

        return jsonify(response), status_code

    except AdminValidationError as error:

        return jsonify({
            "success": False,
            "message": "Validation failed.",
            "errors": error.errors
        }), 400


# ---------------------------------------------------------
# UPDATE USER
# ---------------------------------------------------------

@admin_bp.put("/users/<int:user_id>")
@admin_required
def update_user(user_id):

    try:

        data = request.get_json(
            silent=True
        ) or {}

        AdminValidator.validate_update_user(
            data
        )

        response, status_code = (
            AdminService.update_user(
                user_id,
                data
            )
        )

        return jsonify(response), status_code

    except AdminValidationError as error:

        return jsonify({
            "success": False,
            "message": "Validation failed.",
            "errors": error.errors
        }), 400


# ---------------------------------------------------------
# UPDATE USER STATUS
# ---------------------------------------------------------

@admin_bp.patch(
    "/users/<int:user_id>/status"
)
@admin_required
def update_user_status(user_id):

    try:

        data = request.get_json(
            silent=True
        ) or {}

        AdminValidator.validate_status(
            data
        )

        response, status_code = (
            AdminService.update_user_status(
                user_id,
                data["is_active"]
            )
        )

        return jsonify(response), status_code

    except AdminValidationError as error:

        return jsonify({
            "success": False,
            "message": "Validation failed.",
            "errors": error.errors
        }), 400


# ---------------------------------------------------------
# VERIFY USER
# ---------------------------------------------------------

@admin_bp.patch(
    "/users/<int:user_id>/verify"
)
@admin_required
def verify_user(user_id):

    try:

        data = request.get_json(
            silent=True
        ) or {}

        AdminValidator.validate_verify_user(
            data
        )

        response, status_code = (
            AdminService.verify_user(
                user_id,
                data["is_verified"]
            )
        )

        return jsonify(response), status_code

    except AdminValidationError as error:

        return jsonify({
            "success": False,
            "message": "Validation failed.",
            "errors": error.errors
        }), 400


# ---------------------------------------------------------
# DELETE USER
# ---------------------------------------------------------

@admin_bp.delete(
    "/users/<int:user_id>"
)
@admin_required
def delete_user(user_id):

    response, status_code = (
        AdminService.delete_user(
            user_id
        )
    )

    return jsonify(response), status_code

