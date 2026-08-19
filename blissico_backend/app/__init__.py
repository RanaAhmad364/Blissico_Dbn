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
    import app.admin.analytics_routes
    import app.admin.analytics_service 
    from app.catalog.routes import catalog_bp
    from app.Card_Cutomization.routes import customization_bp
    from app.cli import seed_roles, create_admin

    from app.Orders.routes import orders_bp
    from app.Favourite.routes import favorites_bp
    from app.payment.routes import payments_bp
    from app.downloads.routes import downloads_bp


    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(catalog_bp)
    app.register_blueprint(customization_bp)
    app.register_blueprint(orders_bp)
    app.register_blueprint(favorites_bp)
    app.register_blueprint(payments_bp)
    app.register_blueprint(downloads_bp)
    app.cli.add_command(seed_roles)
    app.cli.add_command(create_admin)



    return app
    