from app import db

from app.models import User,Role
from app.utils.password_services import PasswordService


class AdminService:

    # =========================================================
    # USER MANAGEMENT
    # =========================================================

    @staticmethod
    def get_users():

        users = (
            User.query
            .order_by(User.id.desc())
            .all()
        )

        return [
            AdminService._serialize_user(user)
            for user in users
        ]

    # ---------------------------------------------------------
    # GET SINGLE USER
    # ---------------------------------------------------------

    @staticmethod
    def get_user(user_id):

        user = User.query.get(user_id)

        if not user:
            return None

        return AdminService._serialize_user(user)

    # ---------------------------------------------------------
    # CREATE USER
    # ---------------------------------------------------------

    @staticmethod
    def create_user(data):

        email = data["email"].strip().lower()

        # Check duplicate email
        existing_user = User.query.filter_by(
            email=email
        ).first()

        if existing_user:
            return {
                "success": False,
                "message": "Email is already registered."
            }, 409

        # Find requested role
        role_name = data.get(
            "role",
            "User"
        )

        role = Role.query.filter_by(
            name=role_name
        ).first()

        if not role:
            return {
                "success": False,
                "message": "Requested role does not exist."
            }, 400

        # Hash password
        password_hash = PasswordService.hash_password(
            data["password"]
        )

        user = User(
            role_id=role.id,
            first_name=data["first_name"].strip(),
            last_name=data["last_name"].strip(),
            email=email,
            password_hash=password_hash,
            profile_picture=data.get("profile_picture"),
            is_verified=data.get(
                "is_verified",
                True
            ),
            is_active=data.get(
                "is_active",
                True
            )
        )

        db.session.add(user)
        db.session.commit()

        return {
            "success": True,
            "message": "User created successfully.",
            "data": AdminService._serialize_user(user)
        }, 201

    # ---------------------------------------------------------
    # UPDATE USER
    # ---------------------------------------------------------

    @staticmethod
    def update_user(user_id, data):

        user = User.query.get(user_id)

        if not user:
            return {
                "success": False,
                "message": "User not found."
            }, 404

        # Update first name
        if "first_name" in data:
            user.first_name = data[
                "first_name"
            ].strip()

        # Update last name
        if "last_name" in data:
            user.last_name = data[
                "last_name"
            ].strip()

        # Update email
        if "email" in data:

            email = data[
                "email"
            ].strip().lower()

            existing_user = (
                User.query
                .filter(
                    User.email == email,
                    User.id != user.id
                )
                .first()
            )

            if existing_user:
                return {
                    "success": False,
                    "message": (
                        "Email is already registered."
                    )
                }, 409

            user.email = email

        # Update profile picture
        if "profile_picture" in data:
            user.profile_picture = data[
                "profile_picture"
            ]

        # Update role
        if "role" in data:

            role = Role.query.filter_by(
                name=data["role"]
            ).first()

            if not role:
                return {
                    "success": False,
                    "message": "Role does not exist."
                }, 400

            user.role_id = role.id

        db.session.commit()

        return {
            "success": True,
            "message": "User updated successfully.",
            "data": AdminService._serialize_user(user)
        }, 200

    # ---------------------------------------------------------
    # UPDATE USER STATUS
    # ---------------------------------------------------------

    @staticmethod
    def update_user_status(
        user_id,
        is_active
    ):

        user = User.query.get(user_id)

        if not user:
            return {
                "success": False,
                "message": "User not found."
            }, 404

        user.is_active = is_active

        db.session.commit()

        return {
            "success": True,
            "message": "User status updated successfully.",
            "data": {
                "id": user.id,
                "is_active": user.is_active
            }
        }, 200

    # ---------------------------------------------------------
    # VERIFY USER
    # ---------------------------------------------------------

    @staticmethod
    def verify_user(
        user_id,
        is_verified
    ):

        user = User.query.get(user_id)

        if not user:
            return {
                "success": False,
                "message": "User not found."
            }, 404

        user.is_verified = is_verified

        db.session.commit()

        return {
            "success": True,
            "message": "User verification status updated.",
            "data": {
                "id": user.id,
                "is_verified": user.is_verified
            }
        }, 200

    # ---------------------------------------------------------
    # DELETE USER
    # ---------------------------------------------------------

    @staticmethod
    def delete_user(user_id):

        user = User.query.get(user_id)

        if not user:
            return {
                "success": False,
                "message": "User not found."
            }, 404

        db.session.delete(user)
        db.session.commit()

        return {
            "success": True,
            "message": "User deleted successfully."
        }, 200

    # =========================================================
    # SERIALIZER
    # =========================================================

    @staticmethod
    def _serialize_user(user):

        return {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "profile_picture": user.profile_picture,
            "is_verified": user.is_verified,
            "is_active": user.is_active,
            "role": (
                user.role.name
                if user.role
                else None
            ),
            "created_at": (
                user.created_at.isoformat()
                if user.created_at
                else None
            )
        }




