from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

User = get_user_model()


class EmailOrUsernameBackend(ModelBackend):
    """
    Allow authentication with either email or username.
    This ensures users who registered with their email can log in
    using their email address as the username field.
    """

    def authenticate(self, request, username=None, password=None, **kwargs):
        if username is None:
            username = kwargs.get(User.USERNAME_FIELD)
        if username is None or password is None:
            return None

        # Try by email first
        try:
            user = User.objects.get(email__iexact=username)
        except User.DoesNotExist:
            # Fall back to username
            try:
                user = User.objects.get(username__iexact=username)
            except User.DoesNotExist:
                # Run the default password hasher to prevent timing attacks
                User().set_password(password)
                return None

        if user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None
