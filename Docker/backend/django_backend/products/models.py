from django.db import models

class Product(models.Model):
    CATEGORY_CHOICES = [
        ('mobile', 'Mobile Phone'),
        ('watch', 'Smart Watch'),
        # Future categories
        ('laptop', 'Laptop'),
        ('pc', 'PC'),
        ('ipad', 'iPad'),
    ]

    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='product_images/')
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES)

    def __str__(self):
        return self.name
    
    class Meta:
        db_table = 'product'
