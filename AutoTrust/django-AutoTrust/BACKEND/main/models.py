from django.db import models

# Create your models here.
class Car(models.Model):
    model = models.CharField(max_length=100)
    year = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    comments = models.TextField()
    image = models.ImageField(upload_to="cars/", null=True, blank=True)  # <<--- NUEVO
    created = models.DateTimeField(auto_now_add=True) #actualizar fecha y hora de creados
    updated = models.DateTimeField(auto_now=True) #actualizar fecha y hora de modificacion

    def __str__(self):
        return f"{self.year} {self.comments} {self.model} - ${self.price} "
    