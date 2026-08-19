from app import db
from app.models import Favorite, Card


class FavoriteService:

    @staticmethod
    def add(user_id, card_id):
        if not Card.query.filter_by(id=card_id, is_active=True).first():
            return {"success": False, "message": "Card not found."}, 404
        if Favorite.query.filter_by(user_id=user_id, card_id=card_id).first():
            return {"success": False, "message": "Already in favorites."}, 409

        db.session.add(Favorite(user_id=user_id, card_id=card_id))
        db.session.commit()
        return {"success": True, "message": "Added to favorites."}, 201

    @staticmethod
    def remove(user_id, card_id):
        fav = Favorite.query.filter_by(user_id=user_id, card_id=card_id).first()
        if not fav:
            return {"success": False, "message": "Not in favorites."}, 404
        db.session.delete(fav)
        db.session.commit()
        return {"success": True, "message": "Removed from favorites."}, 200

    @staticmethod
    def list_for_user(user_id):
        favorites = Favorite.query.filter_by(user_id=user_id).all()
        return [
            {
                "id": f.id,
                "card_id": f.card_id,
                "title": f.card.title if f.card else None,
                "thumbnail": f.card.thumbnail if f.card else None,
                "price": float(f.card.price) if f.card else None,
                "is_free": f.card.is_free if f.card else None,
            }
            for f in favorites
        ]





