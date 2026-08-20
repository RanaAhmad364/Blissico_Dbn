from app.models import Category, Collection, Occasion, Card


class CatalogService:

    @staticmethod
    def list_categories():
        all_categories = Category.query.filter_by(is_active=True).order_by(Category.name).all()
        top_level = [c for c in all_categories if c.parent_id is None]

        def serialize(cat, all_cats):
            return {
                "id": cat.id,
                "name": cat.name,
                "slug": cat.slug,
                "icon": cat.icon,
                "subcategories": [
                    serialize(c, all_cats) for c in all_cats if c.parent_id == cat.id
                ],
            }

        return [serialize(c, all_categories) for c in top_level]

    @staticmethod
    def list_collections():
        all_collections = Collection.query.filter_by(is_active=True).order_by(Collection.name).all()
        top_level = [c for c in all_collections if c.parent_id is None]

        def serialize(col, all_cols):
            return {
                "id": col.id, "name": col.name, "slug": col.slug,
                "subcategories": [serialize(c, all_cols) for c in all_cols if c.parent_id == col.id],
            }
        return [serialize(c, all_collections) for c in top_level]

    @staticmethod
    def list_occasions():
        all_occasions = Occasion.query.filter_by(is_active=True).order_by(Occasion.name).all()
        top_level = [o for o in all_occasions if o.parent_id is None]

        def serialize(occ, all_occs):
            return {
                "id": occ.id, "name": occ.name, "slug": occ.slug,
                "subcategories": [serialize(o, all_occs) for o in all_occs if o.parent_id == occ.id],
            }
        return [serialize(o, all_occasions) for o in top_level]

    @staticmethod
    def list_cards(filters, page=1, per_page=12):
        query = Card.query.filter_by(is_active=True)

        if filters.get("category"):
            category = Category.query.filter_by(slug=filters["category"]).first()
            if category:
                category_ids = [category.id] + [c.id for c in category.subcategories]
                query = query.filter(Card.category_id.in_(category_ids))
            else:
                query = query.filter(False) 

        if filters.get("collection"):
            collection = Collection.query.filter_by(slug=filters["collection"]).first()
            if collection:
                collection_ids = [collection.id] + [c.id for c in collection.subcategories]
                query = query.filter(Card.collection_id.in_(collection_ids))
            else:
                query = query.filter(False)

        if filters.get("occasion"):
            occasion = Occasion.query.filter_by(slug=filters["occasion"]).first()
            if occasion:
                occasion_ids = [occasion.id] + [o.id for o in occasion.subcategories]
                query = query.filter(Card.occasion_id.in_(occasion_ids))
            else:
                query = query.filter(False)
        if filters.get("is_free") is not None:
            query = query.filter(
                Card.is_free == filters["is_free"]
            )

        if filters.get("search"):
            query = query.filter(
                Card.title.ilike(f"%{filters['search']}%")
            )

        sort = filters.get("sort")

        if sort == "price_low_high":
            query = query.order_by(Card.price.asc())
        elif sort == "price_high_low":
            query = query.order_by(Card.price.desc())
        elif sort == "name_az":
            query = query.order_by(Card.title.asc())
        else:
            query = query.order_by(Card.id.desc())

        pagination = query.paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )

        return {
            "items": [
                CatalogService._serialize_card_summary(c)
                for c in pagination.items
            ],
            "total": pagination.total,
            "page": pagination.page,
            "pages": pagination.pages,
        }

    @staticmethod
    def get_card(card_id):
        card = Card.query.filter_by(
            id=card_id,
            is_active=True
        ).first()

        return (
            CatalogService._serialize_card_detail(card)
            if card
            else None
        )

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

        data["templates"] = [
            {
                "id": t.id,
                "preview_image": t.preview_image,
                "width": t.width,
                "height": t.height
            }
            for t in card.templates
        ]

        return data