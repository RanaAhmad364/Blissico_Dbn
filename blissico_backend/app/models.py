from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_login import UserMixin
from itsdangerous import URLSafeTimedSerializer as Serializer
from app import app,db,login_manager


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))



class User(db.Model,UserMixin):
    id=db.Column(db.Integer,primary_key=True)
    Fullname=db.Column(db.String(150),unique=True,nullable=False)
    PhoneNumber=db.Column(db.String(150),unique=True,nullable=False)
    email=db.Column(db.String(150),unique=True,nullable=False)
    password=db.Column(db.String(150),nullable=False)
    
    
    def get_reset_token(self):
        s=Serializer(app.config["SECRET_KEY"])
        return s.dumps({"user_id":self.id})
    
    @staticmethod
    def verify_reset_token(token,expires_sec=1800):
        s=Serializer(app.config["SECRET_KEY"])
        try:
            user_id=s.loads(token,max_age=expires_sec)["user_id"]
        except:
            return None
        return User.query.get(user_id)
    
    def __repr__(self):
        return f"User('{self.id},{self.Fullname},{self.email},{self.password},{self.PhoneNumber}')"








