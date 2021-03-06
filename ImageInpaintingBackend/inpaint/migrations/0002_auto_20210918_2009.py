# Generated by Django 3.0.5 on 2021-09-18 14:39

from django.db import migrations, models
import inpaint.models


class Migration(migrations.Migration):

    dependencies = [
        ('inpaint', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='inpaint',
            name='image',
            field=models.ImageField(upload_to=inpaint.models.upload_image),
        ),
        migrations.AlterField(
            model_name='inpaint',
            name='mask',
            field=models.ImageField(upload_to=inpaint.models.upload_mask),
        ),
    ]
