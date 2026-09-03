from flask import Flask
# from flask import Flask, jsonify  URL was not found on the server / section fixed k lye 

from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv
import os
from config import Config
from flask_mail import Mail
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from sqlalchemy import text

load_dotenv()
cor=CORS()
db=SQLAlchemy()
mail= Mail()
jwt = JWTManager()
migrate=Migrate()
login_manager=LoginManager()
login_manager.login_view='user.login'
login_manager.login_message_category="info"


def ensure_notification_schema(app):
    """Backfill missing notification columns for older SQLite databases."""
    with app.app_context():
        inspector = db.inspect(db.engine)
        if "notifications" not in inspector.get_table_names():
            return

        columns = {column["name"] for column in inspector.get_columns("notifications")}
        missing_columns = {
            "notification_type": "VARCHAR(50)",
            "related_id": "INTEGER",
            "redirect_url": "VARCHAR(255)"
        }

        for column_name, column_type in missing_columns.items():
            if column_name not in columns:
                db.session.execute(text(f"ALTER TABLE notifications ADD COLUMN {column_name} {column_type}"))

        db.session.commit()


def ensure_contact_schema(app):
    """Backfill missing contact-message columns for older SQLite databases."""
    with app.app_context():
        inspector = db.inspect(db.engine)
        if "contact_messages" not in inspector.get_table_names():
            return

        columns = {column["name"] for column in inspector.get_columns("contact_messages")}
        missing_columns = {
            "admin_reply": "TEXT",
            "is_replied": "BOOLEAN",
            "replied_at": "DATETIME",
        }

        for column_name, column_type in missing_columns.items():
            if column_name not in columns:
                db.session.execute(text(f"ALTER TABLE contact_messages ADD COLUMN {column_name} {column_type}"))

        db.session.commit()


def create_app(config_class=Config):
    app=Flask(__name__)
    app.config.from_object(config_class)
    db.init_app(app)
    login_manager.init_app(app)
    mail.init_app(app)
    jwt.init_app(app)
    cor.init_app(app, resources={r"/api/*": {"origins": "*"}}, expose_headers=["Content-Disposition"])
    migrate.init_app(app,db)
    ensure_notification_schema(app)
    ensure_contact_schema(app)

    from app.auth.routes import auth_bp
    from app.admin.routes import admin_bp
    from app.admin import analytics_routes, analytics_service
    from app.admin import purchases_routes
    from app.catalog.routes import catalog_bp
    from app.Card_Cutomization.routes import customization_bp
    from app.cli import seed_roles, create_admin
    from app.profile.routes import profile_bp

    from app.Orders.routes import orders_bp
    from app.Favourite.routes import favorites_bp
    from app.payment.routes import payments_bp
    from app.downloads.routes import downloads_bp
    from app.notifications.routes import notifications_bp
    from app.contact.routes import contact_bp


    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(catalog_bp)
    app.register_blueprint(customization_bp)
    app.register_blueprint(orders_bp)
    app.register_blueprint(favorites_bp)
    app.register_blueprint(payments_bp)
    app.register_blueprint(downloads_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(notifications_bp)
    app.register_blueprint(contact_bp)
    app.cli.add_command(seed_roles)
    app.cli.add_command(create_admin)



    return app
    