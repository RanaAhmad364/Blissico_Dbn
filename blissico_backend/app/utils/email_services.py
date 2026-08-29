from flask_mail import Message
from app import mail


class EmailService:  
    """
    Service responsible for sending application emails.
    """

    @staticmethod   # Registration -> send_otp()
    def send_otp(email: str, otp: str) -> None:
        message = Message(
            subject="Email Verification OTP",
            recipients=[email]
        )

        message.body = (
            f"Your verification OTP is: {otp}\n\n"
            "This OTP will expire in 1 minutes.\n"
            "If you did not request this code, please ignore this email."
        )

        mail.send(message)

    # Forgot Password -> send_password_reset_otp()

    @staticmethod 
    def send_password_reset_otp(
        email: str,
        otp: str
    ) -> None:
        message = Message(
            subject="Password Reset OTP",
            recipients=[email]
        )

        message.body = (
            f"Your password reset OTP is: {otp}\n\n"
            "This OTP will expire in 1 minutes.\n"
            "If you did not request a password reset, please ignore this email."
        )

        mail.send(message)

    @staticmethod
    def send_contact_reply(email: str, subject: str, original_message: str, admin_reply: str) -> None:
        """Send a contact-form reply using the existing Flask-Mail setup."""
        message = Message(
            subject=f"Reply to your query — {subject or 'Contact Us'}",
            recipients=[email],
        )

        message.body = (
            "Hello,\n\n"
            "This is a reply to your recent message to Blissico.\n\n"
            "Original message:\n"
            f"{original_message}\n\n"
            "Our reply:\n"
            f"{admin_reply}\n\n"
            "Thank you,\n"
            "Blissico Team"
        )

        mail.send(message)









