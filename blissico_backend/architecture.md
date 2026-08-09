
## Complete ERD

                                      +----------------+
                                      |     Roles      |
                                      +----------------+
                                      | PK id          |
                                      | name           |
                                      | description    |
                                      +----------------+
                                              |
                                              | 1
                                              |
                                              | N
+----------------+                    +---------------------+
|  Email OTPs    |                    |       Users         |
+----------------+                    +---------------------+
| PK id          |                    | PK id              |
| FK user_id     |------------------->| FK role_id         |
| otp_hash       |                    | first_name         |
| expires_at     |                    | last_name          |
| verified       |                    | email             |
| created_at     |                    | password_hash      |
+----------------+                    | profile_picture    |
                                      | is_verified        |
                                      | is_active          |
                                      | created_at         |
                                      | updated_at         |
                                      +---------------------+
                                              |
             -------------------------------------------------------------------------
             |              |              |             |            |               |
             |              |              |             |            |               |
             |              |              |             |            |               |
             V              V              V             V            V               V

      +-------------+ +---------------+ +-----------+ +--------------+ +--------------+ +----------------+
      | Favorites   | | Downloads     | | Orders    | | Notifications| | ActivityLogs | |Subscriptions  |
      +-------------+ +---------------+ +-----------+ +--------------+ +--------------+ +----------------+
      | PK id       | | PK id         | | PK id     | | PK id        | | PK id        | | PK id         |
      | FK user_id  | | FK user_id    | | FK user_id| | FK user_id   | | FK user_id   | | FK user_id    |
      | FK card_id  | | FK card_id    | | total     | | title        | | action       | | plan          |
      +-------------+ +---------------+ | status    | | message      | | ip_address   | | start_date    |
                                        | created   | | is_read      | | created_at   | | end_date      |
                                        +-----------+ +--------------+ +--------------+ +----------------+
                                              |
                                              |1
                                              |
                                              |N
                                        +--------------+
                                        | Order Items  |
                                        +--------------+
                                        | PK id        |
                                        | FK order_id  |
                                        | FK card_id   |
                                        | price        |
                                        +--------------+
                                              |
                                              |1
                                              |
                                              |1
                                        +--------------+
                                        | Payments     |
                                        +--------------+
                                        | PK id        |
                                        | FK order_id  |
                                        | transaction  |
                                        | amount       |
                                        | status       |
                                        +--------------+
                                              |
                                              |1
                                              |
                                              |1
                                        +--------------+
                                        | Invoices     |
                                        +--------------+
                                        | PK id        |
                                        | FK payment_id|
                                        | invoice_no   |
                                        | pdf_path     |
                                        +--------------+


                   +----------------+
                   |  Categories    |
                   +----------------+
                   | PK id          |
                   | name           |
                   +----------------+
                           |
                           |1
                           |
                           |N
                     +----------------------+
                     |                      |
                     |                      |
                     V                      V

               +-------------------------------+
               |             Cards             |
               +-------------------------------+
               | PK id                         |
               | FK category_id                |
               | FK collection_id              |
               | FK occasion_id                |
               | title                         |
               | description                   |
               | thumbnail                     |
               | price                         |
               | is_free                       |
               | status                        |
               +-------------------------------+
                     |          |           |           |
                     |          |           |           |
                     |          |           |           |
                     |          |           |           |
                     V          V           V           V

          +----------------+ +---------------------+
          | CardTemplates  | | CardCustomization   |
          +----------------+ +---------------------+
          | PK id          | | PK id              |
          | FK card_id     | | FK card_id         |
          | template_file  | | FK user_id         |
          | preview_image  | | greeting_text      |
          | width          | | font_family        |
          | height         | | font_size          |
          +----------------+ | font_color         |
                              | bold              |
                              | italic            |
                              | underline         |
                              | alignment         |
                              | letter_spacing    |
                              | line_height       |
                              +-------------------+

                           ^
                           |
                           |
                  +----------------+
                  | Collections    |
                  +----------------+
                  | PK id          |
                  | name           |
                  +----------------+

                           ^
                           |
                           |
                    +---------------+
                    | Occasions     |
                    +---------------+
                    | PK id         |
                    | name          |
                    +---------------+


              +------------------+
              | Coupons          |
              +------------------+
              | PK id            |
              | code             |
              | discount         |
              | expiry_date      |
              +------------------+

              +------------------+
              | Settings         |
              +------------------+
              | PK id            |
              | site_name        |
              | support_email    |
              | currency         |
              +------------------+

# Folder structure

app/

├── auth/
│   ├── __init__.py
│   ├── routes.py
│   ├── service.py
│   ├── validators.py
│   └── schemas.py
│
├── admin/
│   ├── __init__.py
│   ├── routes.py
│   ├── decorators.py
│   ├── service.py
│   └── validators.py
├── utils/
│   ├── jwt_service.py
│   ├── otp_service.py
│   ├── email_service.py
│   └── password_service.py
│
├── cards/
│   ├── __init__.py
│   ├── routes.py
│   ├── service.py
│   └── validators.py
├── models/
│
├── config.py
│
└── extensions.py





# Endpoints

POST /api/auth/register
POST /api/auth/verify-otp
POST /api/auth/resend-otp
POST /api/auth/login
POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/auth/refresh



| Method | Endpoint                    | Purpose                   |
| ------ | --------------------------- | ------------------------- |
| `POST` | `/api/auth/register`        | Create account + send OTP |
| `POST` | `/api/auth/verify-otp`      | Verify email              |
| `POST` | `/api/auth/resend-otp`      | Send new verification OTP |
| `POST` | `/api/auth/login`           | Login + JWT               |
| `POST` | `/api/auth/forgot-password` | Send password-reset OTP   |
| `POST` | `/api/auth/reset-password`  | Reset password            |




## Authentication Flow

                    Register
                        │
                        ▼
              Create User (is_verified=False)
                        │
                        ▼
                Generate OTP (6 digits)
                        │
                        ▼
                  Hash OTP & Store
                        │
                        ▼
                 Send OTP via Email
                        │
                        ▼
                User enters OTP
                        │
                        ▼
             Verify OTP + Check Expiry
                        │
                        ▼
            User.is_verified = True
                        │
                        ▼
                     Login
                        │
                        ▼
             Verify Password & Email
                        │
                        ▼
                 Generate JWT Token
                        │
                        ▼
          Frontend stores JWT token
                        │
                        ▼
         Protected API requests use JWT






React Frontend

        │

        ▼

Routes

        │

        ▼

Validators

        │

        ▼

AuthService

        │

        ├──────── OTPService

        ├──────── EmailService

        ├──────── JWTService

        │

        ▼

Models

        │

        ▼

Database









Configuration

↓

Extensions

↓

Utilities

↓

Validators

↓

Services

↓

Routes



# Test list

[ ] Application starts
[ ] Database connection works
[ ] User role exists
[ ] Register succeeds
[ ] User saved with correct role_id
[ ] Password is hashed
[ ] User initially is_verified=False
[ ] OTP is hashed
[ ] OTP is saved
[ ] OTP email is received
[ ] Correct OTP verifies account
[ ] User becomes is_verified=True
[ ] OTP becomes verified=True
[ ] Same OTP cannot be reused
[ ] Wrong OTP rejected
[ ] Expired OTP rejected
[ ] Resend OTP works
[ ] Unverified user cannot login
[ ] Correct login returns JWT
[ ] Wrong password rejected
[ ] Forgot password works
[ ] Reset password works
[ ] Old password no longer works
[ ] New password works



# Admin endpoints

POST   /api/admin/categories
PUT    /api/admin/categories/<id>
DELETE /api/admin/categories/<id>

POST   /api/admin/collections
PUT    /api/admin/collections/<id>
DELETE /api/admin/collections/<id>

POST   /api/admin/occasions
PUT    /api/admin/occasions/<id>
DELETE /api/admin/occasions/<id>