from flask import Blueprint, request, jsonify

from app.admin.decorators import admin_required
from app.admin.service import AdminService
from app.admin.validators import AdminValidator,AdminValidationError
from app.admin.catalog_service import AdminCatalogService
from app.admin.catalog_validator import CatalogValidator, CatalogValidationError


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

def _handle_validation(fn, *args):
    try:
        fn(*args)
        return None
    except CatalogValidationError as error:
        return jsonify({"success": False, "message": "Validation failed.", "errors": error.errors}), 400


# =========================================================
# CATEGORIES
# =========================================================

@admin_bp.get("/categories")
@admin_required
def list_categories():
    return jsonify({"success": True, "data": AdminCatalogService.list_categories()}), 200


@admin_bp.post("/categories")
@admin_required
def create_category():
    data = request.get_json(silent=True) or {}
    error_response = _handle_validation(CatalogValidator.validate_taxonomy, data)
    if error_response:
        return error_response
    response, status_code = AdminCatalogService.create_category(data)
    return jsonify(response), status_code


@admin_bp.put("/categories/<int:category_id>")
@admin_required
def update_category(category_id):
    data = request.get_json(silent=True) or {}
    response, status_code = AdminCatalogService.update_category(category_id, data)
    return jsonify(response), status_code


@admin_bp.delete("/categories/<int:category_id>")
@admin_required
def delete_category(category_id):
    response, status_code = AdminCatalogService.delete_category(category_id)
    return jsonify(response), status_code


# =========================================================
# COLLECTIONS
# =========================================================

@admin_bp.get("/collections")
@admin_required
def list_collections():
    return jsonify({"success": True, "data": AdminCatalogService.list_collections()}), 200


@admin_bp.post("/collections")
@admin_required
def create_collection():
    data = request.get_json(silent=True) or {}
    error_response = _handle_validation(CatalogValidator.validate_taxonomy, data)
    if error_response:
        return error_response
    response, status_code = AdminCatalogService.create_collection(data)
    return jsonify(response), status_code


@admin_bp.put("/collections/<int:collection_id>")
@admin_required
def update_collection(collection_id):
    data = request.get_json(silent=True) or {}
    response, status_code = AdminCatalogService.update_collection(collection_id, data)
    return jsonify(response), status_code


@admin_bp.delete("/collections/<int:collection_id>")
@admin_required
def delete_collection(collection_id):
    response, status_code = AdminCatalogService.delete_collection(collection_id)
    return jsonify(response), status_code


# =========================================================
# OCCASIONS
# =========================================================

@admin_bp.get("/occasions")
@admin_required
def list_occasions():
    return jsonify({"success": True, "data": AdminCatalogService.list_occasions()}), 200


@admin_bp.post("/occasions")
@admin_required
def create_occasion():
    data = request.get_json(silent=True) or {}
    error_response = _handle_validation(CatalogValidator.validate_taxonomy, data)
    if error_response:
        return error_response
    response, status_code = AdminCatalogService.create_occasion(data)
    return jsonify(response), status_code


@admin_bp.put("/occasions/<int:occasion_id>")
@admin_required
def update_occasion(occasion_id):
    data = request.get_json(silent=True) or {}
    response, status_code = AdminCatalogService.update_occasion(occasion_id, data)
    return jsonify(response), status_code


@admin_bp.delete("/occasions/<int:occasion_id>")
@admin_required
def delete_occasion(occasion_id):
    response, status_code = AdminCatalogService.delete_occasion(occasion_id)
    return jsonify(response), status_code


# =========================================================
# CARDS  (multipart/form-data — thumbnail upload)
# =========================================================

@admin_bp.get("/cards")
@admin_required
def list_cards():
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 20, type=int)
    return jsonify({"success": True, **AdminCatalogService.list_cards(page, per_page)}), 200


@admin_bp.get("/cards/<int:card_id>")
@admin_required
def get_card(card_id):
    card = AdminCatalogService.get_card(card_id)
    if not card:
        return jsonify({"success": False, "message": "Card not found."}), 404
    return jsonify({"success": True, "data": card}), 200


@admin_bp.post("/cards")
@admin_required
def create_card():
    data = request.form.to_dict()
    error_response = _handle_validation(CatalogValidator.validate_card, data)
    if error_response:
        return error_response

    thumbnail_file = request.files.get("thumbnail")
    response, status_code = AdminCatalogService.create_card(data, thumbnail_file)
    return jsonify(response), status_code


@admin_bp.put("/cards/<int:card_id>")
@admin_required
def update_card(card_id):
    data = request.form.to_dict()
    error_response = _handle_validation(CatalogValidator.validate_card, data, False)
    if error_response:
        return error_response

    thumbnail_file = request.files.get("thumbnail")
    response, status_code = AdminCatalogService.update_card(card_id, data, thumbnail_file)
    return jsonify(response), status_code


@admin_bp.delete("/cards/<int:card_id>")
@admin_required
def delete_card(card_id):
    response, status_code = AdminCatalogService.delete_card(card_id)
    return jsonify(response), status_code


# =========================================================
# CARD TEMPLATES  (multipart/form-data — template + preview upload)
# =========================================================

@admin_bp.post("/cards/<int:card_id>/templates")
@admin_required
def add_template(card_id):
    data = request.form.to_dict()
    error_response = _handle_validation(CatalogValidator.validate_card_template, data)
    if error_response:
        return error_response

    template_file = request.files.get("template_file")
    preview_image_file = request.files.get("preview_image")
    response, status_code = AdminCatalogService.add_template(card_id, data, template_file, preview_image_file)
    return jsonify(response), status_code


@admin_bp.delete("/card-templates/<int:template_id>")
@admin_required
def delete_template(template_id):
    response, status_code = AdminCatalogService.delete_template(template_id)
    return jsonify(response), status_code







