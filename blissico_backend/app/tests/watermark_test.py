from decimal import Decimal
from io import BytesIO

import pytest
from flask_jwt_extended import create_access_token
from PIL import Image

from app import create_app, db
from app.models import Category, Card, CardTemplate, Collection, Occasion, Order, OrderItem, Payment, Role, User
from app.utils.purchase_access import has_valid_purchase
from config import Config


class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    JWT_SECRET_KEY = "watermark-test-key-with-enough-length"
    WTF_CSRF_ENABLED = False


@pytest.fixture
def preview_app(tmp_path):
    app = create_app(TestConfig)
    root = tmp_path / "app-root"
    media_file = root / "static" / "uploads" / "cards" / "preview.png"
    media_file.parent.mkdir(parents=True)
    Image.new("RGB", (450, 600), (190, 70, 120)).save(media_file)
    original_bytes = media_file.read_bytes()

    app.root_path = str(root)
    with app.app_context():
        db.create_all()
        role = Role(name="User")
        db.session.add(role)
        db.session.flush()
        users = [
            User(
                role_id=role.id,
                first_name=f"Test{index}",
                last_name="User",
                email=f"watermark{index}@example.test",
                password_hash="test",
                is_verified=True,
            )
            for index in (1, 2)
        ]
        db.session.add_all(users)
        db.session.flush()
        cards = [
            Card(
                title="Free card",
                thumbnail="/static/uploads/cards/preview.png",
                price=Decimal("0.00"),
                is_free=True,
            ),
            Card(
                title="Paid card",
                thumbnail="/static/uploads/cards/preview.png",
                price=Decimal("5.00"),
                is_free=False,
            ),
        ]
        db.session.add_all(cards)
        db.session.flush()
        template = CardTemplate(
            card_id=cards[1].id,
            template_file="/static/uploads/cards/preview.png",
            preview_image="/static/uploads/cards/preview.png",
            width=450,
            height=600,
        )
        db.session.add(template)
        db.session.commit()
        app.config["TEST_USER_IDS"] = [user.id for user in users]
        app.config["TEST_CARD_IDS"] = [card.id for card in cards]
        app.config["TEST_TEMPLATE_ID"] = template.id

        yield app, original_bytes

        db.session.remove()
        db.drop_all()


def auth_headers(app, user_id):
    with app.app_context():
        token = create_access_token(identity=str(user_id))
    return {"Authorization": f"Bearer {token}"}


def add_purchase(user_id, card_id, order_status="paid", payment_status="successful"):
    order = Order(
        user_id=user_id,
        order_number=f"TEST-{user_id}-{order_status}-{payment_status}",
        total_amount=Decimal("5.00"),
        status=order_status,
    )
    db.session.add(order)
    db.session.flush()
    db.session.add(OrderItem(order_id=order.id, card_id=card_id, price=Decimal("5.00")))
    db.session.add(
        Payment(
            order_id=order.id,
            transaction_id=f"TEST-TXN-{user_id}-{order_status}-{payment_status}",
            payment_gateway="test",
            amount=Decimal("5.00"),
            status=payment_status,
        )
    )
    db.session.commit()


def test_free_and_unpurchased_paid_previews(preview_app):
    app, original_bytes = preview_app
    client = app.test_client()
    free_id, paid_id = app.config["TEST_CARD_IDS"]
    template_id = app.config["TEST_TEMPLATE_ID"]

    free_response = client.get(f"/api/cards/{free_id}/preview")
    unpaid_response = client.get(f"/api/cards/{paid_id}/preview")
    card_data = client.get(f"/api/cards/{paid_id}").json["data"]
    template_preview = client.get(
        f"/api/cards/{paid_id}/preview?variant=template&template_id={template_id}"
    )

    assert free_response.status_code == 200
    assert free_response.headers["X-Preview-Watermarked"] == "false"
    assert free_response.data == original_bytes
    assert unpaid_response.status_code == 200
    assert unpaid_response.headers["X-Preview-Watermarked"] == "true"
    assert unpaid_response.data != original_bytes
    assert Image.open(BytesIO(unpaid_response.data)).size == (360, 480)
    assert "/static/uploads/" not in card_data["thumbnail"]
    assert "/static/uploads/" not in card_data["templates"][0]["preview_image"]
    assert template_preview.headers["X-Preview-Watermarked"] == "true"


def test_registered_media_options_and_missing_previews(preview_app):
    app, _ = preview_app
    client = app.test_client()
    _, paid_id = app.config["TEST_CARD_IDS"]

    preflight = client.options(
        "/static/uploads/cards/preview.png",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "authorization",
        },
    )
    assert preflight.status_code < 500
    assert preflight.headers["Access-Control-Allow-Origin"] == "http://localhost:5173"

    with app.app_context():
        missing_card = Card(
            title="Missing preview",
            thumbnail="/static/uploads/cards/missing.png",
            price=Decimal("5.00"),
            is_free=False,
        )
        db.session.add(missing_card)
        db.session.commit()
        missing_card_id = missing_card.id

    missing_preview = client.get(f"/api/cards/{missing_card_id}/preview?variant=thumbnail")
    missing_media = client.get("/static/uploads/cards/missing.png")
    assert missing_preview.status_code == 404
    assert missing_media.status_code == 404
    assert client.get(f"/api/cards/{paid_id}/preview?variant=unknown").status_code == 404


def test_static_gif_preflight_and_watermark_preserve_animation(preview_app):
    app, _ = preview_app
    client = app.test_client()
    _, paid_id = app.config["TEST_CARD_IDS"]
    gif_path = "/static/uploads/cards/preview.gif"
    disk_path = app.static_folder + "\\uploads\\cards\\preview.gif"
    first = Image.new("RGB", (240, 320), (180, 80, 120))
    second = Image.new("RGB", (240, 320), (60, 150, 120))
    first.save(disk_path, format="GIF", save_all=True, append_images=[second], duration=[100, 200], loop=0)

    with app.app_context():
        Card.query.filter_by(id=paid_id).update({Card.animated_gif: gif_path})
        db.session.commit()

    preflight = client.options(
        gif_path,
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "authorization",
        },
    )
    response = client.get(gif_path)

    assert preflight.status_code < 500
    assert response.status_code == 200
    assert response.headers["X-Preview-Watermarked"] == "true"
    with Image.open(BytesIO(response.data)) as result:
        assert result.format == "GIF"
        assert result.n_frames == 2


def test_catalog_responses_return_purchase_state_without_per_card_calls(preview_app):
    app, _ = preview_app
    client = app.test_client()
    buyer_id, _ = app.config["TEST_USER_IDS"]
    free_id, paid_id = app.config["TEST_CARD_IDS"]

    with app.app_context():
        add_purchase(buyer_id, paid_id)

    headers = auth_headers(app, buyer_id)
    listing = client.get("/api/cards?per_page=12", headers=headers)
    listing_by_id = {item["id"]: item for item in listing.json["items"]}
    detail = client.get(f"/api/cards/{paid_id}", headers=headers)

    assert listing_by_id[free_id]["is_purchased"] is False
    assert listing_by_id[paid_id]["is_purchased"] is True
    assert detail.json["data"]["is_purchased"] is True


def test_confirmed_purchase_is_user_specific_and_payment_verified(preview_app):
    app, original_bytes = preview_app
    client = app.test_client()
    buyer_id, other_user_id = app.config["TEST_USER_IDS"]
    _, paid_id = app.config["TEST_CARD_IDS"]

    with app.app_context():
        add_purchase(buyer_id, paid_id)
        assert has_valid_purchase(buyer_id, paid_id)
        assert not has_valid_purchase(other_user_id, paid_id)

        order = Order(
            user_id=other_user_id,
            order_number="TEST-PENDING-ORDER",
            total_amount=Decimal("5.00"),
            status="pending",
        )
        db.session.add(order)
        db.session.flush()
        db.session.add(OrderItem(order_id=order.id, card_id=paid_id, price=Decimal("5.00")))
        db.session.add(
            Payment(
                order_id=order.id,
                transaction_id="TEST-PENDING-PAYMENT",
                payment_gateway="test",
                amount=Decimal("5.00"),
                status="successful",
            )
        )
        db.session.commit()
        assert not has_valid_purchase(other_user_id, paid_id)

        add_purchase(other_user_id, paid_id, order_status="paid", payment_status="failed")
        assert not has_valid_purchase(other_user_id, paid_id)

    purchased_response = client.get(
        f"/api/cards/{paid_id}/preview",
        headers=auth_headers(app, buyer_id),
    )
    other_user_response = client.get(
        f"/api/cards/{paid_id}/preview",
        headers=auth_headers(app, other_user_id),
    )

    assert purchased_response.headers["X-Preview-Watermarked"] == "false"
    assert purchased_response.data == original_bytes
    assert other_user_response.headers["X-Preview-Watermarked"] == "true"


def test_direct_media_and_downloads_cannot_bypass_purchase(preview_app):
    app, original_bytes = preview_app
    client = app.test_client()
    buyer_id, other_user_id = app.config["TEST_USER_IDS"]
    _, paid_id = app.config["TEST_CARD_IDS"]

    direct_media = client.get("/static/uploads/cards/preview.png")
    assert direct_media.status_code == 200
    assert direct_media.headers["X-Preview-Watermarked"] == "true"
    assert direct_media.data != original_bytes

    denied = client.get(
        f"/api/cards/{paid_id}/download/file",
        headers=auth_headers(app, other_user_id),
    )
    assert denied.status_code == 403

    with app.app_context():
        add_purchase(buyer_id, paid_id)
    allowed = client.get(
        f"/api/cards/{paid_id}/download/file",
        headers=auth_headers(app, buyer_id),
    )
    assert allowed.status_code == 200
    assert allowed.data == original_bytes


def test_mock_payment_cannot_complete_paid_order(preview_app):
    app, _ = preview_app
    buyer_id = app.config["TEST_USER_IDS"][0]
    _, paid_id = app.config["TEST_CARD_IDS"]
    client = app.test_client()

    with app.app_context():
        order = Order(
            user_id=buyer_id,
            order_number="TEST-MOCK-PAYMENT",
            total_amount=Decimal("5.00"),
            status="pending",
        )
        db.session.add(order)
        db.session.flush()
        db.session.add(OrderItem(order_id=order.id, card_id=paid_id, price=Decimal("5.00")))
        db.session.commit()
        order_id = order.id

    response = client.post(
        f"/api/orders/{order_id}/pay",
        headers=auth_headers(app, buyer_id),
    )
    assert response.status_code == 403

    with app.app_context():
        assert not has_valid_purchase(buyer_id, paid_id)


def test_paypal_capture_must_match_order_and_amount(preview_app, monkeypatch):
    from app.payment.paypal_service import PayPalService

    app, _ = preview_app
    buyer_id = app.config["TEST_USER_IDS"][0]
    _, paid_id = app.config["TEST_CARD_IDS"]
    client = app.test_client()

    with app.app_context():
        order = Order(
            user_id=buyer_id,
            order_number="TEST-PAYPAL-CAPTURE",
            total_amount=Decimal("5.00"),
            status="pending",
        )
        db.session.add(order)
        db.session.flush()
        db.session.add(OrderItem(order_id=order.id, card_id=paid_id, price=Decimal("5.00")))
        db.session.commit()
        order_id = order.id
        order_number = order.order_number

    monkeypatch.setattr(
        PayPalService,
        "capture_order",
        staticmethod(
            lambda _paypal_id: (
                {
                    "status": "COMPLETED",
                    "purchase_units": [
                        {
                            "reference_id": order_number,
                            "payments": {
                                "captures": [
                                    {
                                        "id": "verified-capture",
                                        "amount": {"value": "5.00", "currency_code": "USD"},
                                    }
                                ]
                            },
                        }
                    ],
                },
                201,
            )
        ),
    )
    response = client.post(
        f"/api/orders/{order_id}/paypal/capture-order",
        headers=auth_headers(app, buyer_id),
        json={"paypal_order_id": "verified-paypal-order"},
    )

    assert response.status_code == 200
    with app.app_context():
        assert has_valid_purchase(buyer_id, paid_id)

    with app.app_context():
        second_order = Order(
            user_id=app.config["TEST_USER_IDS"][1],
            order_number="TEST-PAYPAL-WRONG-AMOUNT",
            total_amount=Decimal("7.00"),
            status="pending",
        )
        db.session.add(second_order)
        db.session.flush()
        db.session.add(OrderItem(order_id=second_order.id, card_id=paid_id, price=Decimal("7.00")))
        db.session.commit()
        second_order_id = second_order.id
        second_order_number = second_order.order_number

    monkeypatch.setattr(
        PayPalService,
        "capture_order",
        staticmethod(
            lambda _paypal_id: (
                {
                    "status": "COMPLETED",
                    "purchase_units": [
                        {
                            "reference_id": second_order_number,
                            "payments": {
                                "captures": [
                                    {
                                        "id": "wrong-amount-capture",
                                        "amount": {"value": "5.00", "currency_code": "USD"},
                                    }
                                ]
                            },
                        }
                    ],
                },
                201,
            )
        ),
    )
    mismatch_response = client.post(
        f"/api/orders/{second_order_id}/paypal/capture-order",
        headers=auth_headers(app, app.config["TEST_USER_IDS"][1]),
        json={"paypal_order_id": "wrong-amount-order"},
    )
    assert mismatch_response.status_code == 400
    with app.app_context():
        assert not has_valid_purchase(app.config["TEST_USER_IDS"][1], paid_id)


def test_gif_watermark_keeps_animation(preview_app):
    from io import BytesIO

    from app.utils.render_services import RenderService

    first = Image.new("RGB", (240, 320), (180, 80, 120))
    second = Image.new("RGB", (240, 320), (60, 150, 120))
    source = BytesIO()
    first.save(source, format="GIF", save_all=True, append_images=[second], duration=[100, 200], loop=0)

    watermarked = RenderService.watermark_preview(source.getvalue())
    with Image.open(BytesIO(watermarked)) as result:
        assert result.format == "GIF"
        assert result.n_frames == 2


def test_jpeg_watermark_preview_supports_single_frame_images(preview_app):
    from app.utils.render_services import RenderService

    source = BytesIO()
    Image.new("RGB", (450, 600), (180, 80, 120)).save(source, format="JPEG")

    watermarked = RenderService.watermark_preview(source.getvalue())

    with Image.open(BytesIO(watermarked)) as result:
        assert result.format == "JPEG"
        assert result.size == (360, 480)


def test_taxonomy_endpoints_preserve_creation_order(preview_app):
    app, _ = preview_app
    with app.app_context():
        for model, names in (
            (Category, ("B Birthday", "A Anniversary")),
            (Collection, ("B Collection", "A Collection")),
            (Occasion, ("B Occasion", "A Occasion")),
        ):
            for name in names:
                slug = name.lower().replace(" ", "-")
                db.session.add(model(name=name, slug=slug, is_active=True))
                db.session.commit()

    client = app.test_client()
    for endpoint, expected in (
        ("/api/categories", ["B Birthday", "A Anniversary"]),
        ("/api/collections", ["B Collection", "A Collection"]),
        ("/api/occasions", ["B Occasion", "A Occasion"]),
    ):
        for _ in range(2):
            response = client.get(endpoint)
            assert response.status_code == 200
            assert [item["name"] for item in response.json["data"]] == expected
