from flask import jsonify
from app.admin.routes import admin_bp
from app.admin.decorators import admin_required
from app.Orders.service import OrderService
from app.downloads.service import DownloadService


@admin_bp.get("/purchases")
@admin_required
def list_all_purchases():
    return jsonify({"success": True, "data": OrderService.list_all_purchases()}), 200


@admin_bp.get("/downloads")
@admin_required
def list_all_downloads():
    return jsonify({"success": True, "data": DownloadService.list_all_downloads()}), 200




