from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.models import User
from django.db.models import Q


class EmailModelBackend(ModelBackend):

    def authenticate(self, request, username=None, password=None, **kwargs):

        try:
            user = User.objects.get(Q(email__iexact=username)|Q(username__iexact=username))
        except User.DoesNotExist:
            return None
        else:
            if user.check_password(password):
                return user
        
        return None