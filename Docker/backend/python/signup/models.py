from django.db import models
from django.contrib.auth.hashers import check_password, make_password

# Create your models here.
class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)

    class Meta:
        db_table = "users"

    def __str__(self):
        return self.name

    def set_password(self, raw_password):
        self.password = raw_password
        self.save()

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

