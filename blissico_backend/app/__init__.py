from flask import Flask

from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv
import os
from config import Config
from flask_mail import Mail
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

load_dotenv()
cor=CORS()
db=SQLAlchemy()
mail= Mail()
jwt = JWTManager()
migrate=Migrate()
login_manager=LoginManager()
login_manager.login_view='user.login'
login_manager.login_message_category="info"


def create_app(config_class=Config):
    app=Flask(__name__)
    app.config.from_object(config_class)
    db.init_app(app)
    login_manager.init_app(app)
    mail.init_app(app)
    jwt.init_app(app)
    cor.init_app(app, resources={r"/api/*": {"origins": "*"}})
    migrate.init_app(app,db)


    from app.auth.routes import auth_bp
    from app.admin.routes import admin_bp
    from app.catalog.routes import catalog_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(catalog_bp)

    return app
    