from datetime import timedelta
import os

class Config:

    # =========================
    # SECURITY
    # =========================

    JWT_SECRET_KEY = os.getenv(
        "JWT_SECRET_KEY",
        "change-this-secret-key"
    )

    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)

    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=7)

    SECRET_KEY = os.getenv("SECRET_KEY")


    # =========================
    # DATABASE
    # =========================

    SQLALCHEMY_DATABASE_URI = (
        os.getenv("SQLALCHEMY_DATABASE_URI")
        or "sqlite:///site.db"
    )


    # =========================
    # FILE UPLOADS
    # =========================

    BASE_DIR = os.path.abspath(os.path.dirname(__file__))

    UPLOAD_FOLDER = os.path.join(
        BASE_DIR,
        "app",
        "static",
        "uploads"
    )

    MAX_CONTENT_LENGTH = 10 * 1024 * 1024

    ALLOWED_IMAGE_EXTENSIONS = {
        "png",
        "jpg",
        "jpeg",
        "webp",
        "gif"
    }

    ALLOWED_TEMPLATE_EXTENSIONS = {
        "png",
        "jpg",
        "jpeg",
        "svg",
        "json",
        "pdf"
    }


    # =========================
    # EMAIL / SMTP
    # =========================

    MAIL_SERVER = os.getenv("MAIL_SERVER","smtp.gmail.com")
    MAIL_PORT = int(os.getenv("MAIL_PORT", "587"))
    MAIL_USE_TLS = (os.getenv("MAIL_USE_TLS", "true").lower() == "true")
    MAIL_USE_SSL = (os.getenv("MAIL_USE_SSL", "false").lower() == "true")
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    MAIL_DEFAULT_SENDER = os.getenv("MAIL_DEFAULT_SENDER")






    ##### Pay Pal Credentials

    PAYPAL_CLIENT = os.getenv("PAYPAL_CLIENT_ID")
    PAYPAL_SECRET = os.getenv("PAYPAL_CLIENT_SECRET")
    PAYPAL_BASE = os.getenv("PAYPAL_BASE", "https://api-m.sandbox.paypal.com")



