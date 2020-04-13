from django.db import models
from django.core.exceptions import ValidationError
import psycopg2
from PIL import Image
from io import BytesIO
import base64
import os

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

def uploadFile(title, image):

    print(image)

    def Encoding():
        buffered = BytesIO()

        img_str = base64.b64encode(buffered.getvalue())

        print(img_str)

        return img_str

    def insert():
        inn = f"INSERT INTO images VALUES ('{str(title)}', '{str(Encoding())}');"
        cursor.execute(inn)
        connection.commit()
        print('inserted')

    try:
        connection = psycopg2.connect(port="5432", database="WebshopDB")
        cursor = connection.cursor()
        print('Connection is open')

        insert()

    except (Exception, psycopg2.Error) as error:
        print("Error while connecting to PostgreSQL", error)

    finally:
        # closing database connection.
        if connection:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")


class AddProduct(models.Model):
    file = None

    title = models.CharField(max_length=20, blank=False, default='')
    description = models.TextField(blank=True, default='')
    image = models.ImageField(blank=False, default=None)
    price = models.DecimalField(max_digits=6, decimal_places=2, blank=False, default=0)
    category = models.CharField(max_length=50, choices=CATEGORIES, default='2')

    def clean(self):
        uploadFile(self.title, self.image)

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
