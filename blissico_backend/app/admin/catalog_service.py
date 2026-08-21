from app import db
from app.models import Category, Collection, Occasion, Card, CardTemplate
from app.utils.file_services import FileService
from flask import current_app


class AdminCatalogService:

    # =====================================================
    # CATEGORIES
    # =====================================================

    @staticmethod
    def list_categories():
        categories = Category.query.order_by(Category.name).all()
        return [AdminCatalogService._serialize_taxonomy(c) for c in categories]

    @staticmethod
    def create_category(data):
        name = data["name"].strip()
        slug = AdminCatalogService._slugify(name)

        if Category.query.filter_by(slug=slug).first():
            return {"success": False, "message": "A category with this name already exists."}, 409

        parent_id = data.get("parent_id") or None
        if parent_id:
            parent = Category.query.get(parent_id)
            if not parent:
                return {"success": False, "message": "Parent category not found."}, 400
            if parent.parent_id is not None:
                return {"success": False, "message": "A subcategory cannot itself have a parent — only one level of nesting is allowed."}, 400

        category = Category(
            name=name,
            slug=slug,
            description=data.get("description"),
            icon=data.get("icon"),
            is_active=data.get("is_active", True),
            parent_id=parent_id,
        )
        db.session.add(category)
        db.session.commit()

        return {"success": True, "message": "Category created.", "data": AdminCatalogService._serialize_taxonomy(category)}, 201

    @staticmethod
    def update_category(category_id, data):
        category = Category.query.get(category_id)
        if not category:
            return {"success": False, "message": "Category not found."}, 404

        if "name" in data:
            category.name = data["name"].strip()
            category.slug = AdminCatalogService._slugify(category.name)
        if "description" in data:
            category.description = data["description"]
        if "icon" in data:
            category.icon = data["icon"]
        if "is_active" in data:
            category.is_active = data["is_active"]
        if "parent_id" in data:
            parent_id = data["parent_id"] or None
            if parent_id:
                if int(parent_id) == category.id:
                    return {"success": False, "message": "A category cannot be its own parent."}, 400
                parent = Category.query.get(parent_id)
                if not parent:
                    return {"success": False, "message": "Parent category not found."}, 400
                if parent.parent_id is not None:
                    return {"success": False, "message": "A subcategory cannot itself have a parent — only one level of nesting is allowed."}, 400
                if category.subcategories:
                    return {"success": False, "message": "This category already has subcategories of its own — it can't also become a subcategory."}, 400
            category.parent_id = parent_id

        db.session.commit()
        return {"success": True, "message": "Category updated.", "data": AdminCatalogService._serialize_taxonomy(category)}, 200


    @staticmethod
    def delete_category(category_id):
        category = Category.query.get(category_id)
        if not category:
            return {"success": False, "message": "Category not found."}, 404
        if category.cards:
            return {"success": False, "message": "Cannot delete a category that still has cards assigned to it."}, 409
        if category.subcategories:
            return {"success": False, "message": "Cannot delete a category that still has subcategories."}, 409

        db.session.delete(category)
        db.session.commit()
        return {"success": True, "message": "Category deleted."}, 200

    # =====================================================
    # COLLECTIONS  (same shape as categories, no slug)
    # =====================================================

    @staticmethod
    def list_collections():
        return [AdminCatalogService._serialize_taxonomy(c) for c in Collection.query.order_by(Collection.name).all()]

    @staticmethod
    def create_collection(data):
        name = data["name"].strip()
        slug = AdminCatalogService._slugify(name)
        if Collection.query.filter_by(slug=slug).first():
            return {"success": False, "message": "A collection with this name already exists."}, 409

        parent_id = data.get("parent_id") or None
        if parent_id:
            parent = Collection.query.get(parent_id)
            if not parent:
                return {"success": False, "message": "Parent collection not found."}, 400
            if parent.parent_id is not None:
                return {"success": False, "message": "A subcategory cannot itself have a parent — only one level of nesting is allowed."}, 400

        collection = Collection(name=name, slug=slug, description=data.get("description"), is_active=data.get("is_active", True), parent_id=parent_id)
        db.session.add(collection)
        db.session.commit()
        return {"success": True, "message": "Collection created.", "data": AdminCatalogService._serialize_taxonomy(collection)}, 201

    @staticmethod
    def update_collection(collection_id, data):
        collection = Collection.query.get(collection_id)
        if not collection:
            return {"success": False, "message": "Collection not found."}, 404

        if "name" in data:
            collection.name = data["name"].strip()
            collection.slug = AdminCatalogService._slugify(collection.name)
        if "description" in data:
            collection.description = data["description"]
        if "is_active" in data:
            collection.is_active = data["is_active"]
        if "parent_id" in data:
            parent_id = data["parent_id"] or None
            if parent_id:
                if int(parent_id) == collection.id:
                    return {"success": False, "message": "A collection cannot be its own parent."}, 400
                parent = Collection.query.get(parent_id)
                if not parent:
                    return {"success": False, "message": "Parent collection not found."}, 400
                if parent.parent_id is not None:
                    return {"success": False, "message": "A subcategory cannot itself have a parent — only one level of nesting is allowed."}, 400
                if collection.subcategories:
                    return {"success": False, "message": "This collection already has subcategories of its own — it can't also become a subcategory."}, 400
            collection.parent_id = parent_id

        db.session.commit()
        return {"success": True, "message": "Collection updated.", "data": AdminCatalogService._serialize_taxonomy(collection)}, 200

    @staticmethod
    def delete_collection(collection_id):
        collection = Collection.query.get(collection_id)
        if not collection:
            return {"success": False, "message": "Collection not found."}, 404
        if collection.cards:
            return {"success": False, "message": "Cannot delete a collection that still has cards assigned to it."}, 409

        if collection.subcategories:   
            return {"success": False, "message": "Cannot delete a collection that still has subcategories."}, 409

        db.session.delete(collection)
        db.session.commit()
        return {"success": True, "message": "Collection deleted."}, 200

    # =====================================================
    # OCCASIONS  (same shape again)
    # =====================================================

    @staticmethod
    def list_occasions():
        return [AdminCatalogService._serialize_taxonomy(o) for o in Occasion.query.order_by(Occasion.name).all()]

    @staticmethod
    def create_occasion(data):
        name = data["name"].strip()
        slug = AdminCatalogService._slugify(name)
        if Occasion.query.filter_by(slug=slug).first():
            return {"success": False, "message": "An occasion with this name already exists."}, 409

        parent_id = data.get("parent_id") or None
        if parent_id:
            parent = Occasion.query.get(parent_id)
            if not parent:
                return {"success": False, "message": "Parent occasion not found."}, 400
            if parent.parent_id is not None:
                return {"success": False, "message": "A subcategory cannot itself have a parent — only one level of nesting is allowed."}, 400

        occasion = Occasion(name=name, slug=slug, description=data.get("description"), is_active=data.get("is_active", True), parent_id=parent_id)
        db.session.add(occasion)
        db.session.commit()
        return {"success": True, "message": "Occasion created.", "data": AdminCatalogService._serialize_taxonomy(occasion)}, 201

    @staticmethod
    def update_occasion(occasion_id, data):
        occasion = Occasion.query.get(occasion_id)
        if not occasion:
            return {"success": False, "message": "Occasion not found."}, 404

        if "name" in data:
            occasion.name = data["name"].strip()
            occasion.slug = AdminCatalogService._slugify(occasion.name)
        if "description" in data:
            occasion.description = data["description"]
        if "is_active" in data:
            occasion.is_active = data["is_active"]
        if "parent_id" in data:
            parent_id = data["parent_id"] or None
            if parent_id:
                if int(parent_id) == occasion.id:
                    return {"success": False, "message": "An occasion cannot be its own parent."}, 400
                parent = Occasion.query.get(parent_id)
                if not parent:
                    return {"success": False, "message": "Parent occasion not found."}, 400
                if parent.parent_id is not None:
                    return {"success": False, "message": "A subcategory cannot itself have a parent — only one level of nesting is allowed."}, 400
                if occasion.subcategories:
                    return {"success": False, "message": "This occasion already has subcategories of its own — it can't also become a subcategory."}, 400
            occasion.parent_id = parent_id

        db.session.commit()
        return {"success": True, "message": "Occasion updated.", "data": AdminCatalogService._serialize_taxonomy(occasion)}, 200

    @staticmethod
    def delete_occasion(occasion_id):
        occasion = Occasion.query.get(occasion_id)
        if not occasion:
            return {"success": False, "message": "Occasion not found."}, 404
        if occasion.cards:
            return {"success": False, "message": "Cannot delete an occasion that still has cards assigned to it."}, 409
        if occasion.subcategories:   
            return {"success": False, "message": "Cannot delete a occasion that still has subcategories."}, 409

        db.session.delete(occasion)
        db.session.commit()
        return {"success": True, "message": "Occasion deleted."}, 200

    # =====================================================
    # CARDS
    # =====================================================

    @staticmethod
    def list_cards(page=1, per_page=20):
        pagination = Card.query.order_by(Card.id.desc()).paginate(page=page, per_page=per_page, error_out=False)
        return {
            "items": [AdminCatalogService._serialize_card(c) for c in pagination.items],
            "total": pagination.total,
            "page": pagination.page,
            "pages": pagination.pages,
        }

    @staticmethod
    def get_card(card_id):
        card = Card.query.get(card_id)
        return AdminCatalogService._serialize_card(card) if card else None

    @staticmethod
    def create_card(data, thumbnail_file):

        category_id = data.get("category_id") or None
        if category_id and not Category.query.get(category_id):
            return {"success": False, "message": "Category not found."}, 400

        collection_id = data.get("collection_id") or None
        if collection_id and not Collection.query.get(collection_id):
            return {"success": False, "message": "Collection not found."}, 400

        occasion_id = data.get("occasion_id") or None
        if occasion_id and not Occasion.query.get(occasion_id):
            return {"success": False, "message": "Occasion not found."}, 400

        try:
            thumbnail_url = FileService.save_file(
                thumbnail_file, "cards", current_app.config["ALLOWED_IMAGE_EXTENSIONS"]
            )
        except ValueError as e:
            return {"success": False, "message": str(e)}, 400

        if not thumbnail_url:
            return {"success": False, "message": "A thumbnail image is required."}, 400

        is_free = str(data.get("is_free", "false")).lower() == "true"

        card = Card(
            category_id=category_id,
            collection_id=collection_id,
            occasion_id=occasion_id,
            title=data["title"].strip(),
            description=data.get("description"),
            thumbnail=thumbnail_url,
            price=0.00 if is_free else float(data.get("price") or 0),
            is_free=is_free,
            is_active=str(data.get("is_active", "true")).lower() == "true",
        )
        db.session.add(card)
        db.session.commit()

        return {"success": True, "message": "Card created.", "data": AdminCatalogService._serialize_card(card)}, 201

    @staticmethod
    def update_card(card_id, data, thumbnail_file=None):
        card = Card.query.get(card_id)
        if not card:
            return {"success": False, "message": "Card not found."}, 404


        for fk, model, label in [
            ("category_id", Category, "Category"),
            ("collection_id", Collection, "Collection"),
            ("occasion_id", Occasion, "Occasion"),
        ]:
            if fk in data:
                value = data[fk] or None
                if value and not model.query.get(value):
                    return {"success": False, "message": f"{label} not found."}, 400
                setattr(card, fk, value)

        if "title" in data:
            card.title = data["title"].strip()
        if "description" in data:
            card.description = data["description"]
        if "is_free" in data:
            card.is_free = str(data["is_free"]).lower() == "true"
        if "price" in data and data["price"] not in (None, ""):
            card.price = 0.00 if card.is_free else float(data["price"])
        if "is_active" in data:
            card.is_active = str(data["is_active"]).lower() == "true"

        if thumbnail_file and thumbnail_file.filename:
            try:
                new_url = FileService.save_file(
                    thumbnail_file, "cards", current_app.config["ALLOWED_IMAGE_EXTENSIONS"]
                )
            except ValueError as e:
                return {"success": False, "message": str(e)}, 400

            old_thumbnail = card.thumbnail
            card.thumbnail = new_url
            FileService.delete_file(old_thumbnail)

        db.session.commit()
        return {"success": True, "message": "Card updated.", "data": AdminCatalogService._serialize_card(card)}, 200

    @staticmethod
    def delete_card(card_id):
        card = Card.query.get(card_id)
        if not card:
            return {"success": False, "message": "Card not found."}, 404

        thumbnail = card.thumbnail
        template_files = [(t.template_file, t.preview_image) for t in card.templates]

        db.session.delete(card)
        db.session.commit()

        FileService.delete_file(thumbnail)
        for template_file, preview_image in template_files:
            FileService.delete_file(template_file)
            FileService.delete_file(preview_image)

        return {"success": True, "message": "Card deleted."}, 200

    # =====================================================
    # CARD TEMPLATES  (the editable file behind a card)
    # =====================================================

    @staticmethod
    def add_template(card_id, data, template_file, preview_image_file):
        card = Card.query.get(card_id)
        if not card:
            return {"success": False, "message": "Card not found."}, 404

        try:
            template_url = FileService.save_file(
                template_file, "templates", current_app.config["ALLOWED_TEMPLATE_EXTENSIONS"]
            )
            preview_url = FileService.save_file(
                preview_image_file, "template-previews", current_app.config["ALLOWED_IMAGE_EXTENSIONS"]
            )
        except ValueError as e:
            return {"success": False, "message": str(e)}, 400

        if not template_url or not preview_url:
            return {"success": False, "message": "Both a template file and a preview image are required."}, 400

        template = CardTemplate(
            card_id=card_id,
            template_file=template_url,
            preview_image=preview_url,
            width=int(data["width"]),
            height=int(data["height"]),
        )
        db.session.add(template)
        db.session.commit()

        return {"success": True, "message": "Template added.", "data": AdminCatalogService._serialize_template(template)}, 201

    @staticmethod
    def delete_template(template_id):
        template = CardTemplate.query.get(template_id)
        if not template:
            return {"success": False, "message": "Template not found."}, 404

        template_file, preview_image = template.template_file, template.preview_image
        db.session.delete(template)
        db.session.commit()

        FileService.delete_file(template_file)
        FileService.delete_file(preview_image)

        return {"success": True, "message": "Template deleted."}, 200

    # =====================================================
    # SERIALIZERS / HELPERS
    # =====================================================

    @staticmethod
    def _slugify(name):
        return name.strip().lower().replace(" ", "-")

    @staticmethod
    def _serialize_taxonomy(obj):
        data = {"id": obj.id, "name": obj.name, "description": obj.description, "is_active": obj.is_active}
        if hasattr(obj, "slug"):
            data["slug"] = obj.slug
        if hasattr(obj, "icon"):
            data["icon"] = obj.icon
        if hasattr(obj, "parent_id"):
            data["parent_id"] = obj.parent_id
        return data

    @staticmethod
    def _serialize_card(card):
        return {
            "id": card.id,
            "title": card.title,
            "description": card.description,
            "thumbnail": card.thumbnail,
            "price": float(card.price),
            "is_free": card.is_free,
            "is_active": card.is_active,
            "category": {"id": card.category.id, "name": card.category.name} if card.category else None,
            "collection": {"id": card.collection.id, "name": card.collection.name} if card.collection else None,
            "occasion": {"id": card.occasion.id, "name": card.occasion.name} if card.occasion else None,
            "templates": [AdminCatalogService._serialize_template(t) for t in card.templates],
            "created_at": card.created_at.isoformat() if card.created_at else None,
        }

    @staticmethod
    def _serialize_template(template):
        return {
            "id": template.id,
            "template_file": template.template_file,
            "preview_image": template.preview_image,
            "width": template.width,
            "height": template.height,
        }



