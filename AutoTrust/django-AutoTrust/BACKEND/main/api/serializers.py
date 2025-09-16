from rest_framework import serializers
from main.models import Car

class CarSerializer(serializers.ModelSerializer):
    # fuerza a que DRF devuelva URL (relativa o absoluta si le pasas request)
    image = serializers.ImageField(use_url=True, required=False, allow_null=True)

    class Meta:
        model = Car
        fields = "__all__"
