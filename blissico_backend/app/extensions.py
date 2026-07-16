from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_mail import Mail
from flask_jwt_extended import JWTManager
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_cors import CORS

# Database
db = SQLAlchemy()

# Password Hashing
bcrypt = Bcrypt()

# Email
mail = Mail()

# JWT Authentication
jwt = JWTManager()

# Login Manager
login_manager = LoginManager()

# Database Migration
migrate = Migrate()

# Cross-Origin Resource Sharing
cors = CORS()