from flask_wtf import FlaskForm
from wtforms import StringField,PasswordField,SubmitField,TextAreaField,ValidationError,BooleanField
from wtforms.validators import DataRequired,Length,Email,EqualTo,Regexp
from app.models import User
from flask_login import current_user


class RegistrationForm(FlaskForm):
    Fullname=StringField("Username",validators=[DataRequired(),Length(min=2,max=20)])
    email=StringField("Email",validators=[DataRequired(),Email()])
    PhoneNumber = StringField('Phone Number', validators=[DataRequired(),Regexp(r'^\+?[\d\s\-]{7,15}$', message="Invalid phone number format.")])
    password=PasswordField("Password",validators=[DataRequired()])
    confirm_password=PasswordField("Confirm Password",validators=[DataRequired(),EqualTo('password')])
    submit=SubmitField("Create Account")

    def validate_username(self,username):
        user=User.query.filter_by(username=username.data).first()
        if user:
            raise ValidationError("That username is taken. Please choose a different one.")
        
    def validate_email(self,email):
        user=User.query.filter_by(email=email.data).first()
        if user:
            raise ValidationError("That username is taken. Please choose a different one.")


class LoginForm(FlaskForm):
    email=StringField("Email",validators=[DataRequired(),Email()])
    password=PasswordField("Password",validators=[DataRequired()])
    
    submit=SubmitField("Sign In")









