from flask_login import login_user,current_user,logout_user,login_required
from app.user.Form import RegistrationForm,LoginForm
from flask import render_template,url_for,flash,redirect,request,Blueprint,jsonify
from app import db,bcrypt
from app.models import User

user=Blueprint('user',__name__)


@user.route('/api/auth/register', methods=['POST'])
def api_register():
    data = request.get_json(silent=True) or {}

    fullname = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    phone_number = data.get('contact', '').strip()
    password = data.get('password', '')
    confirm_password = data.get('confirmPassword', '')

    if not fullname or not email or not phone_number or not password or not confirm_password:
        return jsonify({'error': 'All fields are required.'}), 400

    if password != confirm_password:
        return jsonify({'error': 'Passwords do not match.'}), 400

    existing_email = User.query.filter_by(email=email).first()
    if existing_email:
        return jsonify({'error': 'Email is already registered.'}), 409

    existing_phone = User.query.filter_by(PhoneNumber=phone_number).first()
    if existing_phone:
        return jsonify({'error': 'Phone number is already registered.'}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(
        Fullname=fullname,
        PhoneNumber=phone_number,
        email=email,
        password=hashed_password,
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'Registration successful.'}), 201


@user.route('/api/auth/login', methods=['POST'])
def api_login():
    data = request.get_json(silent=True) or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'error': 'Email and password are required.'}), 400

    found_user = User.query.filter_by(email=email).first()
    if not found_user or not bcrypt.check_password_hash(found_user.password, password):
        return jsonify({'error': 'Invalid email or password.'}), 401

    login_user(found_user)

    return jsonify({
        'message': 'Login successful.',
        'access_token': f'session-{found_user.id}',
        'user': {
            'id': found_user.id,
            'name': found_user.Fullname,
            'email': found_user.email,
            'contact': found_user.PhoneNumber,
        },
    }), 200


@user.route('/api/auth/logout', methods=['POST'])
@login_required
def api_logout():
    logout_user()
    return jsonify({'message': 'Logout successful.'}), 200


@user.route("/register",methods=['GET','POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('main.home'))
    form=RegistrationForm()
    if form.validate_on_submit():
        hashed_password=bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        new_user=User(
            Fullname=form.Fullname.data,
            PhoneNumber=form.PhoneNumber.data,
            email=form.email.data,
            password=hashed_password,
        )
        db.session.add(new_user)
        db.session.commit()
        flash(f'Account created for {form.Fullname.data}! You can now log in.','success')
        return redirect(url_for('user.login'))
    return render_template('register.html',title='Register',form=form)


@user.route("/login",methods=['GET','POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('main.home'))
    form=LoginForm()
    if form.validate_on_submit():
        found_user=User.query.filter_by(email=form.email.data).first()
        if found_user and bcrypt.check_password_hash(found_user.password,form.password.data):
            login_user(found_user)
            next_page=request.args.get('next')
            return redirect(next_page) if next_page else redirect(url_for('main.home'))
        else:
            flash('login Unsuccessful.Please check email and password','danger')
    return render_template('login.html',title='login',form=form)       

@user.route("/logout")
def logout():
    logout_user()
    return redirect(url_for('user.login')) 



















