from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    decode_token,
    get_jwt_identity
)


class JWTService:
    """
    Service responsible for JWT operations.
    """

    @staticmethod
    def create_access_token(user=None, identity=None, additional_claims=None):
        """
        Generate an access token.
        """
        if user is not None:
            identity = str(user.id)
            claims = {
                "role": user.role.name,
                "email": user.email
            }
            if additional_claims:
                claims.update(additional_claims)
        else:
            if identity is None:
                raise TypeError(
                    "create_access_token() requires a user or identity"
                )

            claims = additional_claims or {}

        return create_access_token(
            identity=str(identity),
            additional_claims=claims
        )

    @staticmethod
    def create_refresh_token(user=None, identity=None):
        """
        Generate a refresh token.
        """
        if user is not None:
            identity = str(user.id)
        elif identity is None:
            raise TypeError(
                "create_refresh_token() requires a user or identity"
            )

        return create_refresh_token(
            identity=str(identity)
        )

    @staticmethod
    def decode(token):
        """
        Decode a JWT.
        """
        return decode_token(token)

    @staticmethod
    def get_current_user_id():
        """
        Return authenticated user's ID.
        """
        return get_jwt_identity()