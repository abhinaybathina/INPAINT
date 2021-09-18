from django.db import models
from django.conf import settings
import os

# Create your models here.

def upload_image(instance, filename):
    filebase, extension = filename.split('.')
    imgname = 'image.%s' % (extension)
    fullname = os.path.join(settings.MEDIA_ROOT, imgname)
    if os.path.exists(fullname):
        os.remove(fullname)
    return imgname

def upload_mask(instance, filename):
    filebase, extension = filename.split('.')
    imgname = 'mask.%s' % (extension)
    fullname = os.path.join(settings.MEDIA_ROOT, imgname)
    if os.path.exists(fullname):
        os.remove(fullname)
    return imgname

class Inpaint(models.Model):
    image = models.ImageField(upload_to=upload_image)
    mask = models.ImageField(upload_to=upload_mask)

    def __str__(self) -> str:
        return str(self.pk)
