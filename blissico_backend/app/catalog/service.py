from app.models import Category, Collection, Occasion, Card,CardCustomization
from app.Card_Cutomization.services import CustomizationService
from app.utils.preview_service import PreviewService
from app.utils.purchase_access import valid_purchase_card_ids


class CatalogService:
    _NO_BATCH_DEFAULT=object()


    @staticmethod
    def list_categories():
        all_categories = Category.query.filter_by(is_active=True).order_by(Category.created_at, Category.id).all()
        top_level = [c for c in all_categories if c.parent_id is None]

        def serialize(cat, all_cats):
            return {
                "id": cat.id,
                "name": cat.name,
                "slug": cat.slug,
                "icon": cat.icon,
                "mega_menu_image": cat.mega_menu_image,
                "subcategories": [
                    serialize(c, all_cats) for c in all_cats if c.parent_id == cat.id
                ],
            }

        return [serialize(c, all_categories) for c in top_level]

    @staticmethod
    def list_collections():
        all_collections = Collection.query.filter_by(is_active=True).order_by(Collection.created_at, Collection.id).all()
        top_level = [c for c in all_collections if c.parent_id is None]

        def serialize(col, all_cols):
            return {
                "id": col.id, "name": col.name, "slug": col.slug,
                "mega_menu_image": col.mega_menu_image,
                "subcategories": [serialize(c, all_cols) for c in all_cols if c.parent_id == col.id],
            }
        return [serialize(c, all_collections) for c in top_level]

    @staticmethod
    def list_occasions():
        all_occasions = Occasion.query.filter_by(is_active=True).order_by(Occasion.created_at, Occasion.id).all()
        top_level = [o for o in all_occasions if o.parent_id is None]

        def serialize(occ, all_occs):
            return {
                "id": occ.id, "name": occ.name, "slug": occ.slug,
                "mega_menu_image": occ.mega_menu_image,
                "subcategories": [serialize(o, all_occs) for o in all_occs if o.parent_id == occ.id],
            }
        return [serialize(o, all_occasions) for o in top_level]

    @staticmethod
    def list_cards(filters, page=1, per_page=12, user_id=None):
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
        card_ids = [card.id for card in pagination.items]
        purchased_ids = valid_purchase_card_ids(user_id, card_ids)
        defaults = {
            customization.card_id: CustomizationService._serialize(customization)
            for customization in CardCustomization.query.filter(
                CardCustomization.card_id.in_(card_ids),
                CardCustomization.is_default.is_(True),
            ).all()
        }
        



        

        return {
            "items": [
                CatalogService._serialize_card_summary(
                    c,
                    defaults.get(c.id, None),
                    is_purchased=c.id in purchased_ids,
                )
                for c in pagination.items
            ],
            "total": pagination.total,
            "page": pagination.page,
            "pages": pagination.pages,
        }

    @staticmethod
    def get_card(card_id, user_id=None):
        card = Card.query.filter_by(
            id=card_id,
            is_active=True
        ).first()

        return (
            CatalogService._serialize_card_detail(
                card,
                is_purchased=card.id in valid_purchase_card_ids(user_id, [card.id]) if card else False,
            )
            if card
            else None
        )

    @staticmethod
    def _serialize_card_summary(card, default_design=_NO_BATCH_DEFAULT, is_purchased=False):
        if default_design is CatalogService._NO_BATCH_DEFAULT:
            customization = CardCustomization.query.filter_by(card_id=card.id, is_default=True).first()
            default_design = CustomizationService._serialize(customization) if customization else None
        return {
            "id": card.id,
            "title": card.title,
            "thumbnail": PreviewService.preview_url(card.id),
            "price": float(card.price),
            "is_free": card.is_free,
            "is_purchased": is_purchased,
            "category": card.category.name if card.category else None,
            "collection": card.collection.name if card.collection else None,
            "occasion": card.occasion.name if card.occasion else None,
            "default_design":default_design
        }

    @staticmethod
    def _serialize_card_detail(card, is_purchased=False):
        data = CatalogService._serialize_card_summary(card, is_purchased=is_purchased)

        data["description"] = card.description

        data["templates"] = [
            {
                "id": t.id,
                "preview_image": PreviewService.preview_url(card.id, "template", t.id),
                "width": t.width,
                "height": t.height, "has_animated": bool(t.animated_file)
            }
            for t in card.templates
        ]
        data["has_animated"] = bool(card.animated_gif)

        return data