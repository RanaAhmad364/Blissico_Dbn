from flask import jsonify, request
from app.admin.routes import admin_bp
from app.admin.decorators import admin_required
from app.admin.analytics_service import AnalyticsService


@admin_bp.get("/analytics/overview")
@admin_required
def analytics_overview():
    return jsonify({"success": True, "data": AnalyticsService.get_overview()}), 200


@admin_bp.get("/analytics/most-downloaded")
@admin_required
def analytics_most_downloaded():
    return jsonify({"success": True, "data": AnalyticsService.most_downloaded_cards()}), 200


@admin_bp.get("/analytics/top-selling")
@admin_required
def analytics_top_selling():
    return jsonify({"success": True, "data": AnalyticsService.top_selling_cards()}), 200


@admin_bp.get("/analytics/recent-payments")
@admin_required
def analytics_recent_payments():
    return jsonify({"success": True, "data": AnalyticsService.recent_payments()}), 200


@admin_bp.get("/analytics/recent-users")
@admin_required
def analytics_recent_users():
    return jsonify({"success": True, "data": AnalyticsService.recent_users()}), 200


@admin_bp.get("/analytics/revenue-chart")
@admin_required
def analytics_revenue_chart():
    return jsonify({"success": True, "data": AnalyticsService.revenue_chart(request.args.get("days", 14, type=int))}), 200


@admin_bp.get("/analytics/download-chart")
@admin_required
def analytics_download_chart():
    return jsonify({"success": True, "data": AnalyticsService.download_chart(request.args.get("days", 14, type=int))}), 200


