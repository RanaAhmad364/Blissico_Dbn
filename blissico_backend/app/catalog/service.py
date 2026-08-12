from app.models import Category, Collection, Occasion, Card


class CatalogService:

    @staticmethod
    def list_collections():
        return [
            {"id": c.id, "name": c.name, "slug": c.slug, "description": c.description}
            for c in Collection.query.filter_by(is_active=True).order_by(Collection.name).all()
        ]

    @staticmethod
    def list_occasions():
        return [
            {"id": o.id, "name": o.name, "slug": o.slug, "description": o.description}
            for o in Occasion.query.filter_by(is_active=True).order_by(Occasion.name).all()
        ]

    @staticmethod
    def list_occasions():
        return [
            {"id": o.id, "name": o.name, "description": o.description}
            for o in Occasion.query.filter_by(is_active=True).order_by(Occasion.name).all()
        ]

    @staticmethod
    def list_cards(filters, page=1, per_page=12):
        query = Card.query.filter_by(is_active=True)

        if filters.get("category"):
            query = query.join(Category, Card.category_id == Category.id).filter(Category.slug == filters["category"])
        if filters.get("collection"):
            query = query.join(Collection, Card.collection_id == Collection.id).filter(Collection.slug == filters["collection"])
        if filters.get("occasion"):
            query = query.join(Occasion, Card.occasion_id == Occasion.id).filter(Occasion.slug == filters["occasion"])
        if filters.get("is_free") is not None:
            query = query.filter(Card.is_free == filters["is_free"])
        if filters.get("search"):
            query = query.filter(Card.title.ilike(f"%{filters['search']}%"))

        sort = filters.get("sort")
        if sort == "price_low_high":
            query = query.order_by(Card.price.asc())
        elif sort == "price_high_low":
            query = query.order_by(Card.price.desc())
        elif sort == "name_az":
            query = query.order_by(Card.title.asc())
        else:
            query = query.order_by(Card.id.desc())

        pagination = query.paginate(page=page, per_page=per_page, error_out=False)

        return {
            "items": [CatalogService._serialize_card_summary(c) for c in pagination.items],
            "total": pagination.total,
            "page": pagination.page,
            "pages": pagination.pages,
        }

    @staticmethod
    def get_card(card_id):
        card = Card.query.filter_by(id=card_id, is_active=True).first()
        return CatalogService._serialize_card_detail(card) if card else None

    @staticmethod
    def _serialize_card_summary(card):
        return {
            "id": card.id,
            "title": card.title,
            "thumbnail": card.thumbnail,
            "price": float(card.price),
            "is_free": card.is_free,
            "category": card.category.name if card.category else None,
            "collection": card.collection.name if card.collection else None,
            "occasion": card.occasion.name if card.occasion else None,
        }

    @staticmethod
    def _serialize_card_detail(card):
        data = CatalogService._serialize_card_summary(card)
        data["description"] = card.description
        # Only preview images + dimensions are public. The raw editable
        # template_file is intentionally withheld until purchase.
        data["templates"] = [
            {"id": t.id, "preview_image": t.preview_image, "width": t.width, "height": t.height}
            for t in card.templates
        ]
        return data








