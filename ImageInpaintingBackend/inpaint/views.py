from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from inpaint.serializers import InpaintSerializer
from PIL import Image
import os

# Create your views here.


class InpaintView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = InpaintSerializer

    def post(self, request):
        serializer = InpaintSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        image = Image.open('media/image.png', 'r')
        image.save('image_inpaint/image.png')
        mask = Image.open('media/mask.png', 'r')
        mask.save('image_inpaint/mask.png')
        os.system(
            'cd image_inpaint && python test_image.py config/test_places2_sagan.yml')
        return Response({
            'output': 'media/output.png'
        }, status=status.HTTP_200_OK)
