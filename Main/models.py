from django.db import models
from django.core.exceptions import ValidationError

# Create your models here.

FOOD_CATEGORIES = (
    ('1', "Broodjes"),
    ('2', "Drinken"),
    ('3', "Extra's"),
)

SPICINESS_CATEGORIES = (
    ('1', "Geen (mild)"),
    ('2', "Pittig"),
    ('3', "Extra pittig"),
)

def validate_only_one_instance(obj):
    model = obj.__class__
    if (model.objects.count() > 0 and obj.id != model.objects.get().id):
        raise ValidationError("Can only create 1 %s instance" % model.__name__)

class AddProduct(models.Model):
    title = models.CharField(max_length=20, blank=False, default='', unique=True)
    description = models.TextField(blank=True, default='')
    image = models.ImageField(upload_to='', blank=False, height_field=None, width_field=None, default=None)
    price = models.DecimalField(max_digits=6, decimal_places=2, blank=False, default=0)
    category = models.CharField(max_length=50, choices=FOOD_CATEGORIES, default='2')
    spiciness_category = models.CharField(max_length=50, choices=SPICINESS_CATEGORIES, default='1')
    vegan = models.BooleanField(default=False)

    def __str__(self):
        return self.title

class Broodje_vdw(models.Model):
    title = models.CharField(max_length=20, blank=False, default='', unique=True)
    description = models.TextField(blank=True, default='')
    image = models.ImageField(upload_to='', blank=False, height_field=None, width_field=None, default=None)
    price = models.DecimalField(max_digits=6, decimal_places=2, blank=False, default=0)
    spiciness_category = models.CharField(max_length=50, choices=SPICINESS_CATEGORIES, default='1')
    vegan = models.BooleanField(default=False)

    def clean(self):
        validate_only_one_instance(self)

    def __str__(self):
        return self.title

class CouponCodes(models.Model):
    code = models.CharField(max_length=20, blank=False, default='', unique=True)
    discount = models.DecimalField(max_digits=6, decimal_places=2, blank=False, default=0)

    def __str__(self):
        return self.code
