# Generated by Django 3.0.4 on 2020-03-23 11:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Main', '0002_auto_20200323_0955'),
    ]

    operations = [
        migrations.AlterField(
            model_name='addproduct',
            name='image',
            field=models.ImageField(default=None, upload_to=''),
        ),
    ]