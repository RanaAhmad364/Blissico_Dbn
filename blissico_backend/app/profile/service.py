from flask import current_app
from app import db
from app.models import User
from app.utils.file_services import FileService


class ProfileService:

    @staticmethod
    def get_profile(user_id):
        user = User.query.get(user_id)
        if not user:
            return None
        return ProfileService._serialize(user)

    @staticmethod
    def update_profile(user_id, data):
        user = User.query.get(user_id)
        if not user:
            return {"success": False, "message": "User not found."}, 404

        # email = data["email"].strip().lower()
        # existing = User.query.filter(User.email == email, User.id != user_id).first()
        # if existing:
        #     return {"success": False, "message": "That email is already in use by another account."}, 409

        user.first_name = data["first_name"].strip()
        user.last_name = data["last_name"].strip()
        # user.email = email
        db.session.commit()

        return {"success": True, "message": "Profile updated.", "data": ProfileService._serialize(user)}, 200

    @staticmethod
    def upload_picture(user_id, file):
        user = User.query.get(user_id)
        if not user:
            return {"success": False, "message": "User not found."}, 404

        try:
            new_url = FileService.save_file(file, "profiles", current_app.config["ALLOWED_IMAGE_EXTENSIONS"])
        except ValueError as e:
            return {"success": False, "message": str(e)}, 400

        if not new_url:
            return {"success": False, "message": "No image file provided."}, 400

        old_url = user.profile_picture
        user.profile_picture = new_url
        db.session.commit()

        # Only delete the old file after the new one is safely saved and committed —
        # so a failed upload never leaves the user with no picture at all.
        if old_url:
            FileService.delete_file(old_url)

        return {"success": True, "message": "Profile picture updated.", "data": ProfileService._serialize(user)}, 200

    @staticmethod
    def remove_picture(user_id):
        user = User.query.get(user_id)
        if not user:
            return {"success": False, "message": "User not found."}, 404

        old_url = user.profile_picture
        user.profile_picture = None
        db.session.commit()

        if old_url:
            FileService.delete_file(old_url)

        return {"success": True, "message": "Profile picture removed.", "data": ProfileService._serialize(user)}, 200

    @staticmethod
    def _serialize(user):
        return {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "profile_picture": user.profile_picture,
            "role": user.role.name if user.role else None,
        }



