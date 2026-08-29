from app import create_app, db
from app.models import Role, User, Notification
from app.notifications.service import create_notification
from flask_jwt_extended import create_access_token

class TestConfig:
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    WTF_CSRF_ENABLED = False
    JWT_SECRET_KEY = '12345678901234567890123456789012'

app = create_app(TestConfig)
with app.app_context():
    db.create_all()
    role = Role.query.filter_by(name='User').first()
    if role is None:
        role = Role(name='User', description='User')
        db.session.add(role)
        db.session.commit()
    user = User(first_name='Api', last_name='User', email='api_notify@example.com', password_hash='hash', role_id=role.id, is_verified=True)
    db.session.add(user)
    db.session.commit()
    create_notification(user.id, 'API check', 'Notification returned through API', notification_type='api_test', redirect_url='/dashboard')
    print('count', Notification.query.count())
    token = create_access_token(identity=user.id)
    print('token', token)
    client = app.test_client()
    resp = client.get('/api/notifications', headers={'Authorization': 'Bearer ' + token})
    print('status', resp.status_code)
    print('json', resp.get_json())
    print('text', resp.get_data(as_text=True))
