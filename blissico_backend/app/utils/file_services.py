import os
import uuid
from flask import current_app
from werkzeug.utils import secure_filename


class FileService:

    @staticmethod
    def _allowed(filename, allowed_extensions):
        return (
            "." in filename
            and filename.rsplit(".", 1)[1].lower() in allowed_extensions
        )

    @staticmethod
    def save_file(file_storage, subfolder, allowed_extensions):
        """
        Saves an uploaded file under app/static/uploads/<subfolder>/
        and returns a public URL path, e.g. /static/uploads/cards/xyz.jpg
        Returns None if no file was provided.
        """
        if not file_storage or file_storage.filename == "":
            return None

        filename = secure_filename(file_storage.filename)

        if not FileService._allowed(filename, allowed_extensions):
            raise ValueError(
                f"File type not allowed. Allowed: {', '.join(sorted(allowed_extensions))}"
            )

        ext = filename.rsplit(".", 1)[1].lower()
        unique_name = f"{uuid.uuid4().hex}.{ext}"

        folder_path = os.path.join(current_app.config["UPLOAD_FOLDER"], subfolder)
        os.makedirs(folder_path, exist_ok=True)

        file_storage.save(os.path.join(folder_path, unique_name))

        return f"/static/uploads/{subfolder}/{unique_name}"

    @staticmethod
    def delete_file(url_path):
        """Deletes a file previously saved via save_file, given its public URL path."""
        if not url_path or not url_path.startswith("/static/"):
            return

        relative_path = url_path.replace("/static/", "", 1)
        full_path = os.path.join(current_app.root_path, "static", relative_path)

        if os.path.exists(full_path):
            try:
                os.remove(full_path)
            except OSError:
                pass








