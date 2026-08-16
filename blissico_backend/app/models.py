from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from app import db, login_manager


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


class BaseModel(db.Model):
    __abstract__ = True

    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime,default=datetime.utcnow,nullable=False)
    updated_at = db.Column(db.DateTime,default=datetime.utcnow,onupdate=datetime.utcnow,nullable=False)


class Role(BaseModel):

    __tablename__ = "roles"

    name = db.Column(db.String(50),unique=True,nullable=False)
    description = db.Column(db.String(255))
    users = db.relationship("User",back_populates="role",lazy=True)
    def __repr__(self):
        return f"<Role {self.name}>"


class User(BaseModel):

    __tablename__ = "users"

    role_id = db.Column(db.Integer,db.ForeignKey("roles.id"),nullable=False)
    first_name = db.Column(db.String(100),nullable=False)
    last_name = db.Column(db.String(100),nullable=False)
    email = db.Column(db.String(150),unique=True,nullable=False,index=True)
    password_hash = db.Column(db.String(255),nullable=False)
    profile_picture = db.Column(db.String(255))
    is_verified = db.Column(db.Boolean,default=False)
    is_active = db.Column(db.Boolean,default=True)
    role = db.relationship("Role",back_populates="users")
    otps = db.relationship("EmailOTP",back_populates="user",cascade="all, delete-orphan")
    orders = db.relationship("Order",back_populates="user")
    favorites = db.relationship("Favorite",back_populates="user")
    downloads = db.relationship("Download",back_populates="user")
    customizations = db.relationship("CardCustomization",back_populates="user")
    notifications = db.relationship("Notification",back_populates="user")
    subscriptions = db.relationship("Subscription",back_populates="user")
    activity_logs = db.relationship("ActivityLog",back_populates="user")
    def __repr__(self):
        return f"<User {self.email}>"



class EmailOTP(BaseModel):

    __tablename__ = "email_otps"

    user_id = db.Column(db.Integer,db.ForeignKey("users.id"),nullable=False)
    otp_hash = db.Column(db.String(255),nullable=False)
    expires_at = db.Column(db.DateTime,nullable=False)
    verified = db.Column(db.Boolean,default=False)
    user = db.relationship("User",back_populates="otps")
    @property
    def is_expired(self):
        return datetime.utcnow() > self.expires_at


# Catalogue Module

class Category(BaseModel):
    __tablename__ = "categories"

    name = db.Column(db.String(100),nullable=False,unique=True) 
    slug = db.Column(db.String(120),nullable=False,unique=True,index=True) 
    icon = db.Column(db.String(255)) 
    description = db.Column(db.Text) 
    is_active = db.Column(db.Boolean,default=True,nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey("categories.id"), nullable=True)
    subcategories = db.relationship(                                                    
        "Category", backref=db.backref("parent", remote_side="Category.id"), lazy=True
    ) 
    cards = db.relationship("Card",back_populates="category",lazy=True) 
    def __repr__(self):
        return f"<Category {self.name}>"


class Collection(BaseModel):
    __tablename__ = "collections"

    name = db.Column(db.String(100),nullable=False,unique=True)
    slug = db.Column(db.String(120),nullable=False,unique=True,index=True)
    description = db.Column(db.Text)
    is_active = db.Column(db.Boolean,default=True,nullable=False)
    cards = db.relationship("Card",back_populates="collection",lazy=True)
    def __repr__(self):
        return f"<Collection {self.name}>"

class Occasion(BaseModel):
    __tablename__ = "occasions"

    name = db.Column(db.String(100),nullable=False,unique=True)
    slug = db.Column(db.String(120),nullable=False,unique=True,index=True)
    description = db.Column(db.Text)
    is_active = db.Column(db.Boolean,default=True,nullable=False)
    cards = db.relationship("Card",back_populates="occasion",lazy=True)
    def __repr__(self):
        return f"<Occasion {self.name}>"


class Card(BaseModel):
    __tablename__ = "cards"

    category_id = db.Column(db.Integer,db.ForeignKey("categories.id"),nullable=False)
    collection_id = db.Column(db.Integer,db.ForeignKey("collections.id"),nullable=False)
    occasion_id = db.Column(db.Integer,db.ForeignKey("occasions.id"),nullable=False)
    title = db.Column(db.String(200),nullable=False)
    description = db.Column(db.Text)

    thumbnail = db.Column(db.String(255),nullable=False)
    price = db.Column(db.Numeric(10, 2),default=0.00,nullable=False)
    is_free = db.Column(db.Boolean,default=False,nullable=False)
    is_active = db.Column(db.Boolean,default=True,nullable=False)
    # Relationships
    category = db.relationship("Category",back_populates="cards")
    collection = db.relationship("Collection",back_populates="cards")
    occasion = db.relationship("Occasion",back_populates="cards")
    order_items = db.relationship("OrderItem",back_populates="card")
    templates = db.relationship("CardTemplate",back_populates="card",cascade="all, delete-orphan")
    

    customizations = db.relationship("CardCustomization",back_populates="card")
    favorites = db.relationship("Favorite",back_populates="card")
    downloads = db.relationship("Download",back_populates="card")
    order_items = db.relationship("OrderItem",back_populates="card")
    def __repr__(self):
        return f"<Card {self.title}>"


class CardTemplate(BaseModel):
    __tablename__ = "card_templates"
    card_id = db.Column(db.Integer,db.ForeignKey("cards.id"),nullable=False)
    template_file = db.Column(db.String(255),nullable=False)
    preview_image = db.Column(db.String(255),nullable=False)
    width = db.Column(db.Integer,nullable=False)
    height = db.Column(db.Integer,nullable=False)
    card = db.relationship("Card",back_populates="templates")

    def __repr__(self):
        return f"<CardTemplate {self.id}>"

# Card Customization Module
class CardCustomization(BaseModel):
    __tablename__ = "card_customizations"

    user_id = db.Column(db.Integer,db.ForeignKey("users.id"),nullable=False)
    card_id = db.Column(db.Integer,db.ForeignKey("cards.id"),nullable=False)
    greeting_text = db.Column(db.Text,nullable=False)
    font_family = db.Column(db.String(100),default="Poppins",nullable=False)
    font_size = db.Column(db.Integer,default=24,nullable=False)
    font_color = db.Column(db.String(20),default="#000000",nullable=False)
    bold = db.Column(db.Boolean,default=False)
    italic = db.Column(db.Boolean,default=False)
    underline = db.Column(db.Boolean,default=False)
    alignment = db.Column(db.String(20),default="center")
    letter_spacing = db.Column(db.Float,default=0)
    line_height = db.Column(db.Float,default=1.2)
    user = db.relationship("User",back_populates="customizations")
    card = db.relationship("Card",back_populates="customizations")
    def __repr__(self):
        return f"<Customization {self.id}>"

# Commerce Module (Order → Payment → Invoice)

class Order(BaseModel):
    __tablename__ = "orders"

    user_id = db.Column(db.Integer,db.ForeignKey("users.id"),nullable=False)
    order_number = db.Column(db.String(50),unique=True,nullable=False)
    total_amount = db.Column(db.Numeric(10, 2),nullable=False)
    status = db.Column(
        db.Enum(
            "pending",
            "paid",
            "cancelled",
            "failed",
            name="order_status_enum"),default="pending",nullable=False)

    user = db.relationship("User",back_populates="orders")
    order_items = db.relationship("OrderItem",back_populates="order",cascade="all, delete-orphan")
    payment = db.relationship("Payment",back_populates="order",uselist=False,cascade="all, delete-orphan")
    def __repr__(self):
        return f"<Order {self.order_number}>"


class OrderItem(BaseModel):
    __tablename__ = "order_items"

    order_id = db.Column(db.Integer,db.ForeignKey("orders.id"),nullable=False)
    card_id = db.Column(db.Integer,db.ForeignKey("cards.id"),nullable=False)
    price = db.Column(db.Numeric(10, 2),nullable=False)
    order = db.relationship("Order",back_populates="order_items")
    card = db.relationship("Card",back_populates="order_items")
    def __repr__(self):
        return f"<OrderItem {self.id}>"


class Payment(BaseModel):
    __tablename__ = "payments"
    order_id = db.Column(db.Integer,db.ForeignKey("orders.id"),unique=True,nullable=False)
    transaction_id = db.Column(
        db.String(150),
        unique=True)
    payment_gateway = db.Column(db.String(50),nullable=False)
    amount = db.Column(db.Numeric(10, 2),nullable=False)
    status = db.Column(
        db.Enum(
            "pending",
            "successful",
            "failed",
            "refunded",
            name="payment_status_enum"
        ),default="pending",nullable=False)
    paid_at = db.Column(db.DateTime)
    order = db.relationship("Order",back_populates="payment")
    invoice = db.relationship("Invoice",back_populates="payment",uselist=False,cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Payment {self.transaction_id}>"


class Invoice(BaseModel):
    __tablename__ = "invoices"

    payment_id = db.Column(db.Integer,db.ForeignKey("payments.id"),unique=True,nullable=False)
    invoice_number = db.Column(db.String(100),unique=True,nullable=False)
    pdf_path = db.Column(db.String(255))
    payment = db.relationship("Payment",back_populates="invoice")
    def __repr__(self):
        return f"<Invoice {self.invoice_number}>"


class Favorite(BaseModel):
    __tablename__ = "favorites"

    user_id = db.Column(db.Integer,db.ForeignKey("users.id"),nullable=False)
    card_id = db.Column(db.Integer,db.ForeignKey("cards.id"),nullable=False)
    user = db.relationship("User",back_populates="favorites")
    card = db.relationship("Card",back_populates="favorites")
    __table_args__ = (
        db.UniqueConstraint(
            "user_id",
            "card_id",
            name="uq_user_favorite"
        ),
    )

    def __repr__(self):
        return f"<Favorite User:{self.user_id} Card:{self.card_id}>"

class Download(BaseModel):
    __tablename__ = "downloads"

    user_id = db.Column(db.Integer,db.ForeignKey("users.id"),nullable=False)
    card_id = db.Column(db.Integer,db.ForeignKey("cards.id"),nullable=False)
    customization_id = db.Column(db.Integer,db.ForeignKey("card_customizations.id"),nullable=True)
    downloaded_at = db.Column(db.DateTime,nullable=False)
    file_path = db.Column(db.String(255),nullable=False)
    user = db.relationship("User",back_populates="downloads")
    card = db.relationship("Card",back_populates="downloads")
    customization = db.relationship("CardCustomization")


class Notification(BaseModel):
    __tablename__ = "notifications"

    user_id = db.Column(db.Integer,db.ForeignKey("users.id"),nullable=False)
    title = db.Column(db.String(200),nullable=False)
    message = db.Column(db.Text,nullable=False)
    is_read = db.Column(db.Boolean,default=False,nullable=False)
    user = db.relationship("User",back_populates="notifications")

class Coupon(BaseModel):
    __tablename__ = "coupons"

    code = db.Column(db.String(50),unique=True,nullable=False)
    discount = db.Column(db.Numeric(10,2),nullable=False)
    expiry_date = db.Column(db.DateTime,nullable=False)
    is_active = db.Column(db.Boolean,default=True)

class Subscription(BaseModel):
    __tablename__ = "subscriptions"

    user_id = db.Column(db.Integer,db.ForeignKey("users.id"),nullable=False)
    plan = db.Column(db.String(50),nullable=False)
    start_date = db.Column(db.Date,nullable=False)
    end_date = db.Column(db.Date,nullable=False)
    is_active = db.Column(db.Boolean,default=True)
    user = db.relationship("User",back_populates="subscriptions")


class ActivityLog(BaseModel):
    __tablename__ = "activity_logs"

    user_id = db.Column(db.Integer,db.ForeignKey("users.id"),nullable=False)
    action = db.Column(db.String(255),nullable=False)
    ip_address = db.Column(db.String(45))
    user = db.relationship("User",back_populates="activity_logs")


class Setting(BaseModel):
    __tablename__ = "settings"

    site_name = db.Column(db.String(100),nullable=False)
    support_email = db.Column(db.String(150),nullable=False)
    currency = db.Column(db.String(20),default="USD")
    logo = db.Column(db.String(255))

