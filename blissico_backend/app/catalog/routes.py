from flask import Blueprint, request, jsonify
from app.catalog.service import CatalogService

catalog_bp = Blueprint("catalog", __name__, url_prefix="/api/catalog")


@catalog_bp.get("/categories")
def get_categories():
    return jsonify({"success": True, "data": CatalogService.list_categories()}), 200


@catalog_bp.get("/collections")
def get_collections():
    return jsonify({"success": True, "data": CatalogService.list_collections()}), 200


@catalog_bp.get("/occasions")
def get_occasions():
    return jsonify({"success": True, "data": CatalogService.list_occasions()}), 200


@catalog_bp.get("/cards")
def get_cards():
    filters = {
        "category": request.args.get("category"),
        "collection": request.args.get("collection"),
        "occasion": request.args.get("occasion"),
        "search": request.args.get("search"),
        "sort": request.args.get("sort"),
    }
    if request.args.get("is_free") is not None:
        filters["is_free"] = request.args.get("is_free") == "true"

    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 12, type=int)

    result = CatalogService.list_cards(filters, page, per_page)
    return jsonify({"success": True, **result}), 200


@catalog_bp.get("/cards/<int:card_id>")
def get_card(card_id):
    card = CatalogService.get_card(card_id)
    if not card:
        return jsonify({"success": False, "message": "Card not found."}), 404
    return jsonify({"success": True, "data": card}), 200








