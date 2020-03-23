from django.db import models

# Create your models here.
class AddProduct(models.Model):
    title = models.CharField(max_length=50, blank=False, default='')
    description = models.TextField(blank=False, default='')
    image = models.ImageField(upload_to='', blank=False, height_field=None, width_field=None, max_length=10, default=None)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=False, default=0)

    def __str__(self):
        return self.title
