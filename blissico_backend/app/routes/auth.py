from flask import Blueprint

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/")
def auth_home():
    return {
        "module": "Authentication API"
    }