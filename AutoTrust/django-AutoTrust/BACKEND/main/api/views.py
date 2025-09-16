from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from main.models import Car
from .serializers import CarSerializer

class CarViewSet(viewsets.ModelViewSet):
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx["request"] = self.request  # permite URL absoluta si quieres
        return ctx
