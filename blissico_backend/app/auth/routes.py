from flask import Blueprint, request, jsonify
from app.auth.service import AuthService
from app.auth.validators import AuthValidator,ValidationError


auth_bp = Blueprint("auth",__name__,url_prefix="/api/auth")


# ---------------------------------------------------------
# REGISTER
# ---------------------------------------------------------

@auth_bp.post("/register")
def register():
    try:
        data = request.get_json(silent=True) or {}

        AuthValidator.validate_register(data)

        response, status_code = AuthService.register(data)

        return jsonify(response), status_code

    except ValidationError as error:
        return jsonify({
            "success": False,
            "message": "Validation failed.",
            "errors": error.errors
        }), 400

    except Exception:
        return jsonify({
            "success": False,
            "message": "Something went wrong."
        }), 500


# ---------------------------------------------------------
# VERIFY OTP
# ---------------------------------------------------------

@auth_bp.post("/verify-otp")
def verify_otp():
    try:
        data = request.get_json(silent=True) or {}

        AuthValidator.validate_verify_otp(data)

        response, status_code = AuthService.verify_otp(data)

        return jsonify(response), status_code

    except ValidationError as error:
        return jsonify({
            "success": False,
            "message": "Validation failed.",
            "errors": error.errors
        }), 400

    except Exception:
        return jsonify({
            "success": False,
            "message": "Something went wrong."
        }), 500


# ---------------------------------------------------------
# RESEND OTP
# ---------------------------------------------------------

@auth_bp.post("/resend-otp")
def resend_otp():
    try:
        data = request.get_json(silent=True) or {}

        AuthValidator.validate_resend_otp(data)

        response, status_code = AuthService.resend_otp(data)

        return jsonify(response), status_code

    except ValidationError as error:
        return jsonify({
            "success": False,
            "message": "Validation failed.",
            "errors": error.errors
        }), 400

    except Exception:
        return jsonify({
            "success": False,
            "message": "Something went wrong."
        }), 500


# ---------------------------------------------------------
# LOGIN
# ---------------------------------------------------------

@auth_bp.post("/login")
def login():
    try:
        data = request.get_json(silent=True) or {}

        AuthValidator.validate_login(data)

        response, status_code = AuthService.login(data)

        return jsonify(response), status_code

    except ValidationError as error:
        return jsonify({
            "success": False,
            "message": "Validation failed.",
            "errors": error.errors
        }), 400

    except Exception:
        return jsonify({
            "success": False,
            "message": "Something went wrong."
        }), 500


# ---------------------------------------------------------
# FORGOT PASSWORD
# ---------------------------------------------------------

@auth_bp.post("/forgot-password")
def forgot_password():
    try:
        data = request.get_json(silent=True) or {}

        AuthValidator.validate_forgot_password(data)

        response, status_code = AuthService.forgot_password(data)

        return jsonify(response), status_code

    except ValidationError as error:
        return jsonify({
            "success": False,
            "message": "Validation failed.",
            "errors": error.errors
        }), 400

    except Exception:
        return jsonify({
            "success": False,
            "message": "Something went wrong."
        }), 500


# ---------------------------------------------------------
# RESET PASSWORD
# ---------------------------------------------------------

@auth_bp.post("/reset-password")
def reset_password():
    try:
        data = request.get_json(silent=True) or {}

        AuthValidator.validate_reset_password(data)

        response, status_code = AuthService.reset_password(data)

        return jsonify(response), status_code

    except ValidationError as error:
        return jsonify({
            "success": False,
            "message": "Validation failed.",
            "errors": error.errors
        }), 400

    except Exception:
        return jsonify({
            "success": False,
            "message": "Something went wrong."
        }), 500



@auth_bp.post("/logout")
def logout():
    # Stateless JWT: nothing to invalidate server-side yet.
    # (If you later add a token blocklist table, revoke the jti here.)
    return jsonify({
        "success": True,
        "message": "Logged out successfully."
    }), 200