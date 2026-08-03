from flask_login import login_user,current_user,logout_user,login_required
from app.user.Form import RegistrationForm,LoginForm
from flask import render_template,url_for,flash,redirect,request,Blueprint
from app import db,bcrypt
from app.models import User

user=Blueprint('user',__name__)


@user.route("/register",methods=['GET','POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('main.home'))
    form=RegistrationForm()
    if form.validate_on_submit():
        hashed_password=bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        user=User(Fullname=form.Fullname.data,email=form.email.data,password=hashed_password)
        db.session.add(user)
        db.session.commit()
        flash(f'Account created for {form.username.data}! You can now log in.','success')
        return redirect(url_for('user.login'))
    return render_template('register.html',title='Register',form=form)


@user.route("/login",methods=['GET','POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('main.home'))
    form=LoginForm()
    if form.validate_on_submit():
        user=User.query.filter_by(email=form.email.data).first()
        if user and bcrypt.check_password_hash(user.password,form.password.data):
            login_user(user,remember=form.remember.data)
            next_page=request.args.get('next')
            return redirect(next_page) if next_page else redirect(url_for('main.home'))
        else:
            flash('login Unsuccessful.Please check email and password','danger')
    return render_template('login.html',title='login',form=form)       

@user.route("/logout")
def logout():
    logout_user()
    return redirect(url_for('user.login')) 



















