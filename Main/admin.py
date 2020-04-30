from django.contrib import admin
from .models import AddProduct, Broodje_vdw, CouponCodes

# Register your models here.
my_models = [AddProduct, Broodje_vdw, CouponCodes]
admin.site.register(my_models)
