from django.contrib.auth.models import User
from django.db import models

class EndUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=15, blank=True)
    face_data = models.JSONField(null=True, blank=True)
    # You can add more fields specific to EndUser here if needed

    def __str__(self):
        return self.user.username
    