from sqlalchemy import text

from app import create_app
from app.extensions import db

app = create_app()

with app.app_context():

    print("Database URI:")
    print(app.config["SQLALCHEMY_DATABASE_URI"])

    result = db.session.execute(text("SELECT DATABASE();"))
    print("Connected Database:", result.scalar())

    print("Models Found:")
    print(db.metadata.tables.keys())

    db.create_all()

    print("Tables Created Successfully")