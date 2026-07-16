from flask import Flask

from app.config import Config
from app.extensions import (
    db,
    bcrypt,
    mail,
    jwt,
    migrate,
    login_manager,
    cors,
)


def create_app():
    """
    Application Factory
    """

    app = Flask(__name__)

    # Load Configuration
    app.config.from_object(Config)

    # Initialize Extensions
    db.init_app(app)
    bcrypt.init_app(app)
    mail.init_app(app)
    jwt.init_app(app)
    login_manager.init_app(app)
    migrate.init_app(app, db)

    # Import all database models
    import app.models

    # Enable CORS
    cors.init_app(
        app,
        resources={r"/api/*": {"origins": "*"}}
    )

    # Import Blueprints
    from app.routes.auth import auth_bp
    from app.routes.admin import admin_bp
    from app.routes.user import user_bp

    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(user_bp, url_prefix="/api/user")

    @app.route("/")
    def home():
        return {
            "message": "Blissico Backend Running Successfully",
            "status": "success"
        }

    return app