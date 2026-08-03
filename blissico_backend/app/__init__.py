from flask import Flask
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os

load_dotenv()

app=Flask(__name__)
app.config["SECRET_KEY"]="asasjdsk2323"
app.config["SQLALCHEMY_DATABASE_URI"]="sqlite:///site.db"
db=SQLAlchemy(app)
bcrypt=Bcrypt(app)
login_manager=LoginManager(app)
login_manager.login_view='user.login'
login_manager.login_message_category="info"





from app.user.routes import user

app.register_blueprint(user)
