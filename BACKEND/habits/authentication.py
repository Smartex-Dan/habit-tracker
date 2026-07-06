"""
Custom DRF authentication backed by Supabase Auth.

The React frontend authenticates directly against Supabase Auth and gets a
JWT back. That JWT is sent on every request to this API in the
`Authorization: Bearer <token>` header. We verify it here (signature +
expiry) using the Supabase project's JWT secret, then attach a lightweight
`SupabaseUser` to the request along with the raw token — the raw token is
what lets views build a Supabase client that respects Row Level Security,
because Postgres RLS policies check `auth.uid()`, which is derived from
this same JWT.

We deliberately do NOT use Django's built-in User model / auth system.
Supabase Auth is the single source of truth for identity; Django just
verifies and forwards it.
"""

import jwt
from django.conf import settings
from rest_framework import authentication, exceptions


class SupabaseUser:
    """Minimal stand-in for a user, built from a verified Supabase JWT."""

    def __init__(self, user_id: str, email: str | None = None):
        self.id = user_id
        self.email = email
        self.is_authenticated = True

    def __str__(self):
        return self.email or self.id


class SupabaseJWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get("Authorization", "")

        if not auth_header.startswith("Bearer "):
            return None  # No credentials provided; let DRF handle as anonymous.

        token = auth_header.split(" ", 1)[1].strip()

        if not settings.SUPABASE_JWT_SECRET:
            raise exceptions.AuthenticationFailed(
                "Server is missing SUPABASE_JWT_SECRET configuration."
            )

        try:
            payload = jwt.decode(
                token,
                settings.SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                audience="authenticated",
            )
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed("Token has expired.")
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed("Invalid token.")

        user_id = payload.get("sub")
        email = payload.get("email")

        if not user_id:
            raise exceptions.AuthenticationFailed("Token missing user id (sub).")

        user = SupabaseUser(user_id=user_id, email=email)

        # Stash the raw token on the request so views can build a
        # per-request, RLS-aware Supabase client from it.
        request.supabase_access_token = token

        return (user, token)
