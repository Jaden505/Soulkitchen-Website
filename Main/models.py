from django.db import models
from django.core.exceptions import ValidationError

# Create your models here.

CATEGORIES = (
    ('1', "Broodjes"),
    ('2', "Drinken"),
    ('3', "Extra's"),
)

def validate_only_one_instance(obj):
    model = obj.__class__
    if (model.objects.count() > 0 and obj.id != model.objects.get().id):
        raise ValidationError("Can only create 1 %s instance" % model.__name__)

class AddProduct(models.Model):
    title = models.CharField(max_length=20, blank=False, default='')
    description = models.TextField(blank=True, default='')
    image = models.ImageField(upload_to='', blank=False, height_field=None, width_field=None, default=None)
    price = models.DecimalField(max_digits=6, decimal_places=2, blank=False, default=0)
    category = models.CharField(max_length=50, choices=CATEGORIES, default='2')

    def __str__(self):
        return self.title

class Broodje_vdw(models.Model):
    title = models.CharField(max_length=20, blank=False, default='')
    description = models.TextField(blank=True, default='')
    image = models.ImageField(upload_to='', blank=False, height_field=None, width_field=None, default=None)
    price = models.DecimalField(max_digits=6, decimal_places=2, blank=False, default=0)

    def clean(self):
        validate_only_one_instance(self)

    def __str__(self):
        return self.title
