from rest_framework import serializers
from inpaint.models import Inpaint


class InpaintSerializer(serializers.ModelSerializer):

    class Meta:
        model = Inpaint
        fields = ['image', 'mask']

    def validate(self, attrs):
        return attrs

    def create(self, validated_data):
        return Inpaint.objects.create(**validated_data)
