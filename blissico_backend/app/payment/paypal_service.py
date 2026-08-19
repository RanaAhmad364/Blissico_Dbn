import requests
from flask import current_app


class PayPalService:

    @staticmethod
    def _base_url():
        return current_app.config["PAYPAL_BASE"]

    @staticmethod
    def get_access_token():
        response = requests.post(
            f"{PayPalService._base_url()}/v1/oauth2/token",
            auth=(current_app.config["PAYPAL_CLIENT"], current_app.config["PAYPAL_SECRET"]),
            headers={"Accept": "application/json", "Accept-Language": "en_US"},
            data={"grant_type": "client_credentials"},
            timeout=10,
        )
        response.raise_for_status()
        return response.json()["access_token"]

    @staticmethod
    def create_order(amount, currency="USD"):
        """
        `amount` must come from our own Order.total_amount in the database —
        never from anything the frontend sends.
        """
        access_token = PayPalService.get_access_token()
        response = requests.post(
            f"{PayPalService._base_url()}/v2/checkout/orders",
            headers={"Content-Type": "application/json", "Authorization": f"Bearer {access_token}"},
            json={
                "intent": "CAPTURE",
                "purchase_units": [{"amount": {"currency_code": currency, "value": f"{amount:.2f}"}}],
            },
            timeout=10,
        )
        response.raise_for_status()
        return response.json()

    @staticmethod
    def capture_order(paypal_order_id):
        access_token = PayPalService.get_access_token()
        response = requests.post(
            f"{PayPalService._base_url()}/v2/checkout/orders/{paypal_order_id}/capture",
            headers={"Content-Type": "application/json", "Authorization": f"Bearer {access_token}"},
            timeout=10,
        )
        return response.json(), response.status_code








