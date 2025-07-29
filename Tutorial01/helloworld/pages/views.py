from django.shortcuts import render # here by default
from django.views.generic import TemplateView

# Create your views here.
class HomePageView(TemplateView):
     template_name = 'home.html'