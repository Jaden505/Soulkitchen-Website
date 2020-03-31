from django.contrib import admin
from .models import AddProduct, Broodje_vdw

# Register your models here.
my_models = [AddProduct, Broodje_vdw]
admin.site.register(my_models)
