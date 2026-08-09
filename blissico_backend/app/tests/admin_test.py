import pytest
from app import create_app,db
from app.models import Role
from app.models import User
from app.utils.password_services import PasswordService
from app.utils.jwt_services import JWTService
from config import Config


# ============================================================
# TEST CONFIGURATION
# ============================================================

class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    WTF_CSRF_ENABLED = False

@pytest.fixture
def app():

    app = create_app(TestConfig)

   

    with app.app_context():

        db.create_all()

        # ----------------------------------------------------
        # Create roles
        # ----------------------------------------------------

        admin_role = Role(
            name="Admin",
            description="Platform administrator"
        )

        user_role = Role(
            name="User",
            description="Normal platform user"
        )

        db.session.add_all([
            admin_role,
            user_role
        ])

        db.session.commit()

        yield app

        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):

    return app.test_client()


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def create_test_user(
    app,
    email,
    role_name="User",
    is_verified=True,
    is_active=True
):

    with app.app_context():

        role = Role.query.filter_by(
            name=role_name
        ).first()

        password_hash = (
            PasswordService.hash_password(
                "Password@123"
            )
        )

        user = User(
            role_id=role.id,
            first_name="Test",
            last_name="User",
            email=email,
            password_hash=password_hash,
            is_verified=is_verified,
            is_active=is_active
        )

        db.session.add(user)
        db.session.commit()

        user_id = user.id

        return user_id


def create_access_token(user_id):

    """
    Create JWT for the test user.

    Adjust this function if your JWTService
    uses a different method name/signature.
    """

    return JWTService.create_access_token(
        identity=user_id
    )


def auth_headers(token):

    return {
        "Authorization": f"Bearer {token}"
    }


# ============================================================
# 1. APPLICATION STARTS
# ============================================================

def test_admin_application_starts(app):

    assert app is not None

    with app.app_context():

        admin_role = Role.query.filter_by(
            name="Admin"
        ).first()

        user_role = Role.query.filter_by(
            name="User"
        ).first()

        assert admin_role is not None
        assert user_role is not None


# ============================================================
# 2. ADMIN CAN ACCESS USER LIST
# ============================================================

def test_admin_can_get_users(
    client,
    app
):

    user_id = create_test_user(
        app,
        "user1@example.com",
        role_name="User"
    )

    admin_id = create_test_user(
        app,
        "admin@example.com",
        role_name="Admin"
    )

    token = create_access_token(admin_id)

    response = client.get(
        "/api/admin/users",
        headers=auth_headers(token)
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["success"] is True
    assert "data" in data

    assert len(data["data"]) >= 2


# ============================================================
# 3. NORMAL USER CANNOT ACCESS ADMIN API
# ============================================================

def test_normal_user_cannot_get_users(
    client,
    app
):

    user_id = create_test_user(
        app,
        "normal@example.com",
        role_name="User"
    )

    token = create_access_token(user_id)

    response = client.get(
        "/api/admin/users",
        headers=auth_headers(token)
    )

    assert response.status_code == 403

    data = response.get_json()

    assert data["success"] is False
    assert data["message"] == "Admin access required."


# ============================================================
# 4. NO TOKEN CANNOT ACCESS ADMIN API
# ============================================================

def test_no_token_cannot_get_users(client):

    response = client.get(
        "/api/admin/users"
    )

    assert response.status_code == 401


# ============================================================
# 5. ADMIN CAN GET SINGLE USER
# ============================================================

def test_admin_can_get_single_user(
    client,
    app
):

    user_id = create_test_user(
        app,
        "single@example.com",
        role_name="User"
    )

    admin_id = create_test_user(
        app,
        "admin2@example.com",
        role_name="Admin"
    )

    token = create_access_token(admin_id)

    response = client.get(
        f"/api/admin/users/{user_id}",
        headers=auth_headers(token)
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["success"] is True

    assert data["data"]["id"] == user_id
    assert data["data"]["email"] == "single@example.com"


# ============================================================
# 6. GET NON-EXISTING USER
# ============================================================

def test_get_non_existing_user(
    client,
    app
):

    admin_id = create_test_user(
        app,
        "admin3@example.com",
        role_name="Admin"
    )

    token = create_access_token(admin_id)

    response = client.get(
        "/api/admin/users/99999",
        headers=auth_headers(token)
    )

    assert response.status_code == 404

    data = response.get_json()

    assert data["success"] is False
    assert data["message"] == "User not found."


# ============================================================
# 7. ADMIN CAN CREATE USER
# ============================================================

def test_admin_can_create_user(
    client,
    app
):

    admin_id = create_test_user(
        app,
        "admin4@example.com",
        role_name="Admin"
    )

    token = create_access_token(admin_id)

    response = client.post(
        "/api/admin/users",
        headers=auth_headers(token),
        json={
            "first_name": "Created",
            "last_name": "User",
            "email": "created@example.com",
            "password": "Password@123",
            "role": "User"
        }
    )

    assert response.status_code == 201

    data = response.get_json()

    assert data["success"] is True
    assert data["message"] == (
        "User created successfully."
    )

    assert data["data"]["email"] == (
        "created@example.com"
    )

    # Verify database
    with app.app_context():

        user = User.query.filter_by(
            email="created@example.com"
        ).first()

        assert user is not None
        assert user.first_name == "Created"
        assert user.role.name == "User"

        # Password must be hashed
        assert user.password_hash != "Password@123"


# ============================================================
# 8. CREATE USER WITH DUPLICATE EMAIL
# ============================================================

def test_admin_cannot_create_duplicate_email(
    client,
    app
):

    create_test_user(
        app,
        "duplicate@example.com",
        role_name="User"
    )

    admin_id = create_test_user(
        app,
        "admin5@example.com",
        role_name="Admin"
    )

    token = create_access_token(admin_id)

    response = client.post(
        "/api/admin/users",
        headers=auth_headers(token),
        json={
            "first_name": "Duplicate",
            "last_name": "User",
            "email": "duplicate@example.com",
            "password": "Password@123",
            "role": "User"
        }
    )

    assert response.status_code == 409

    data = response.get_json()

    assert data["success"] is False
    assert data["message"] == (
        "Email is already registered."
    )


# ============================================================
# 9. CREATE USER VALIDATION
# ============================================================

def test_create_user_validation(
    client,
    app
):

    admin_id = create_test_user(
        app,
        "admin6@example.com",
        role_name="Admin"
    )

    token = create_access_token(admin_id)

    response = client.post(
        "/api/admin/users",
        headers=auth_headers(token),
        json={
            "first_name": "Test"
        }
    )

    assert response.status_code == 400

    data = response.get_json()

    assert data["success"] is False
    assert data["message"] == "Validation failed."

    assert "last_name" in data["errors"]
    assert "email" in data["errors"]
    assert "password" in data["errors"]


# ============================================================
# 10. ADMIN CAN UPDATE USER
# ============================================================

def test_admin_can_update_user(
    client,
    app
):

    user_id = create_test_user(
        app,
        "update@example.com",
        role_name="User"
    )

    admin_id = create_test_user(
        app,
        "admin7@example.com",
        role_name="Admin"
    )

    token = create_access_token(admin_id)

    response = client.put(
        f"/api/admin/users/{user_id}",
        headers=auth_headers(token),
        json={
            "first_name": "Updated",
            "last_name": "Name"
        }
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["success"] is True

    assert data["data"]["first_name"] == "Updated"
    assert data["data"]["last_name"] == "Name"

    # Verify database
    with app.app_context():

        user = User.query.get(user_id)

        assert user.first_name == "Updated"
        assert user.last_name == "Name"


# ============================================================
# 11. ADMIN CAN UPDATE EMAIL
# ============================================================

def test_admin_can_update_email(
    client,
    app
):

    user_id = create_test_user(
        app,
        "oldemail@example.com",
        role_name="User"
    )

    admin_id = create_test_user(
        app,
        "admin8@example.com",
        role_name="Admin"
    )

    token = create_access_token(admin_id)

    response = client.put(
        f"/api/admin/users/{user_id}",
        headers=auth_headers(token),
        json={
            "email": "newemail@example.com"
        }
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["success"] is True
    assert data["data"]["email"] == (
        "newemail@example.com"
    )


# ============================================================
# 12. ADMIN CANNOT UPDATE TO EXISTING EMAIL
# ============================================================

def test_admin_cannot_use_existing_email(
    client,
    app
):

    user1_id = create_test_user(
        app,
        "first@example.com",
        role_name="User"
    )

    user2_id = create_test_user(
        app,
        "second@example.com",
        role_name="User"
    )

    admin_id = create_test_user(
        app,
        "admin9@example.com",
        role_name="Admin"
    )

    token = create_access_token(admin_id)

    response = client.put(
        f"/api/admin/users/{user2_id}",
        headers=auth_headers(token),
        json={
            "email": "first@example.com"
        }
    )

    assert response.status_code == 409

    data = response.get_json()

    assert data["success"] is False


# ============================================================
# 13. ADMIN CAN UPDATE ROLE
# ============================================================

def test_admin_can_update_role(
    client,
    app
):

    user_id = create_test_user(
        app,
        "rolechange@example.com",
        role_name="User"
    )

    admin_id = create_test_user(
        app,
        "admin10@example.com",
        role_name="Admin"
    )

    token = create_access_token(admin_id)

    response = client.put(
        f"/api/admin/users/{user_id}",
        headers=auth_headers(token),
        json={
            "role": "Admin"
        }
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["success"] is True
    assert data["data"]["role"] == "Admin"


# ============================================================
# 14. INVALID ROLE
# ============================================================

def test_admin_cannot_assign_invalid_role(
    client,
    app
):

    user_id = create_test_user(
        app,
        "invalidrole@example.com",
        role_name="User"
    )

    admin_id = create_test_user(
        app,
        "admin11@example.com",
        role_name="Admin"
    )

    token = create_access_token(admin_id)

    response = client.put(
        f"/api/admin/users/{user_id}",
        headers=auth_headers(token),
        json={
            "role": "SuperAdmin"
        }
    )

    assert response.status_code == 400

    data = response.get_json()

    assert data["success"] is False
    assert data["message"] == "Role does not exist."


# ============================================================
# 15. ADMIN CAN DISABLE USER
# ============================================================

def test_admin_can_disable_user(
    client,
    app
):

    user_id = create_test_user(
        app,
        "disable@example.com",
        role_name="User",
        is_active=True
    )

    admin_id = create_test_user(
        app,
        "admin12@example.com",
        role_name="Admin"
    )

    token = create_access_token(admin_id)

    response = client.patch(
        f"/api/admin/users/{user_id}/status",
        headers=auth_headers(token),
        json={
            "is_active": False
        }
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["success"] is True
    assert data["data"]["is_active"] is False

    # Verify database
    with app.app_context():

        user = User.query.get(user_id)

        assert user.is_active is False


# ============================================================
# 16. ADMIN CAN ACTIVATE USER
# ============================================================

def test_admin_can_activate_user(
    client,
    app
):

    user_id = create_test_user(
        app,
        "activate@example.com",
        role_name="User",
        is_active=False
    )

    admin_id = create_test_user(
        app,
        "admin13@example.com",
        role_name="Admin"
    )

    token = create_access_token(admin_id)

    response = client.patch(
        f"/api/admin/users/{user_id}/status",
        headers=auth_headers(token),
        json={
            "is_active": True
        }
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["success"] is True
    assert data["data"]["is_active"] is True


# ============================================================
# 17. INVALID STATUS VALUE
# ============================================================

def test_invalid_user_status(
    client,
    app
):

    user_id = create_test_user(
        app,
        "invalidstatus@example.com",
        role_name="User"
    )

    admin_id = create_test_user(
        app,
        "admin14@example.com",
        role_name="Admin"
    )

    token = create_access_token(admin_id)

    response = client.patch(
        f"/api/admin/users/{user_id}/status",
        headers=auth_headers(token),
        json={
            "is_active": "false"
        }
    )

    assert response.status_code == 400

    data = response.get_json()

    assert data["success"] is False
    assert "is_active" in data["errors"]


# ============================================================
# 18. ADMIN CAN VERIFY USER
# ============================================================

def test_admin_can_verify_user(
    client,
    app
):

    user_id = create_test_user(
        app,
        "verifyadmin@example.com",
        role_name="User",
        is_verified=False
    )

    admin_id = create_test_user(
        app,
        "admin15@example.com",
        role_name="Admin"
    )

    token = create_access_token(admin_id)

    response = client.patch(
        f"/api/admin/users/{user_id}/verify",
        headers=auth_headers(token),
        json={
            "is_verified": True
        }
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["success"] is True
    assert data["data"]["is_verified"] is True

    with app.app_context():

        user = User.query.get(user_id)

        assert user.is_verified is True


# ============================================================
# 19. ADMIN CAN UNVERIFY USER
# ============================================================

def test_admin_can_unverify_user(
    client,
    app
):

    user_id = create_test_user(
        app,
        "unverify@example.com",
        role_name="User",
        is_verified=True
    )

    admin_id = create_test_user(
        app,
        "admin16@example.com",
        role_name="Admin"
    )

    token = create_access_token(admin_id)

    response = client.patch(
        f"/api/admin/users/{user_id}/verify",
        headers=auth_headers(token),
        json={
            "is_verified": False
        }
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["success"] is True
    assert data["data"]["is_verified"] is False


# ============================================================
# 20. INVALID VERIFICATION VALUE
# ============================================================

def test_invalid_verification_value(
    client,
    app
):

    user_id = create_test_user(
        app,
        "invalidverify@example.com",
        role_name="User"
    )

    admin_id = create_test_user(
        app,
        "admin17@example.com",
        role_name="Admin"
    )

    token = create_access_token(admin_id)

    response = client.patch(
        f"/api/admin/users/{user_id}/verify",
        headers=auth_headers(token),
        json={
            "is_verified": "true"
        }
    )

    assert response.status_code == 400

    data = response.get_json()

    assert data["success"] is False
    assert "is_verified" in data["errors"]


# ============================================================
# 21. ADMIN CAN DELETE USER
# ============================================================

def test_admin_can_delete_user(
    client,
    app
):

    user_id = create_test_user(
        app,
        "delete@example.com",
        role_name="User"
    )

    admin_id = create_test_user(
        app,
        "admin18@example.com",
        role_name="Admin"
    )

    token = create_access_token(admin_id)

    response = client.delete(
        f"/api/admin/users/{user_id}",
        headers=auth_headers(token)
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["success"] is True
    assert data["message"] == (
        "User deleted successfully."
    )

    # Verify database
    with app.app_context():

        user = User.query.get(user_id)

        assert user is None


# ============================================================
# 22. ADMIN CANNOT DELETE NON-EXISTING USER
# ============================================================

def test_delete_non_existing_user(
    client,
    app
):

    admin_id = create_test_user(
        app,
        "admin19@example.com",
        role_name="Admin"
    )

    token = create_access_token(admin_id)

    response = client.delete(
        "/api/admin/users/99999",
        headers=auth_headers(token)
    )

    assert response.status_code == 404

    data = response.get_json()

    assert data["success"] is False
    assert data["message"] == "User not found."


# ============================================================
# 23. INACTIVE ADMIN CANNOT ACCESS ADMIN API
# ============================================================

def test_inactive_admin_cannot_access_admin_api(
    client,
    app
):

    admin_id = create_test_user(
        app,
        "inactiveadmin@example.com",
        role_name="Admin",
        is_active=False
    )

    token = create_access_token(admin_id)

    response = client.get(
        "/api/admin/users",
        headers=auth_headers(token)
    )

    assert response.status_code == 403

    data = response.get_json()

    assert data["success"] is False
    assert data["message"] == (
        "Your account is inactive."
    )

