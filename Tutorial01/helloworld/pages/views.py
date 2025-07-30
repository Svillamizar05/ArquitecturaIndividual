from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.views.generic import TemplateView
from django.views import View
from django import forms

# Vista para la página de inicio
class HomePageView(TemplateView):
    template_name = 'home.html'

class AboutPageView(TemplateView):
    template_name = 'pages/about.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update({
            "title": "About us - Online Store",
            "subtitle": "About us",
            "description": "This is an about page ...",
            "author": "Developed by: Santiago Villamizar",
        })
        return context

class ContactPageView(TemplateView):
    template_name = "pages/contact.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update({
            "title": "Contact Us - Online Store",
            "subtitle": "Get in Touch",
            "email": "support@onlinestore.fake",
            "address": "123 Fake Street, Faketown, FK 12345",
            "phone": "+1 (555) 123-4567",
        })
        return context

# Datos estáticos
class Product:
    products = [
        {"id": "1", "name": "TV", "description": "Best TV", "price": 1000},
        {"id": "2", "name": "iPhone", "description": "Best iPhone", "price": 2000},
        {"id": "3", "name": "Chromecast", "description": "Best Chromecast", "price": 100},
        {"id": "4", "name": "Glasses", "description": "Best Glasses", "price": 50}
    ]

    @classmethod
    def get_by_id(cls, id):
        return next((product for product in cls.products if product["id"] == id), None)

# Listado de productos
class ProductIndexView(View):
    template_name = 'products/index.html'

    def get(self, request):
        viewData = {
            "title": "Products - Online Store",
            "subtitle": "List of products",
            "products": Product.products
        }
        return render(request, self.template_name, viewData)

# Detalle del producto
class ProductShowView(View):
    template_name = 'products/show.html'

    def get(self, request, id):
        product = Product.get_by_id(id)
        if not product:
            return HttpResponseRedirect(reverse('home'))
        viewData = {
            "title": product["name"] + " - Online Store",
            "subtitle": product["name"] + " - Product information",
            "product": product
        }
        return render(request, self.template_name, viewData)

# Formulario
class ProductForm(forms.Form):
    name = forms.CharField(required=True)
    price = forms.FloatField(required=True)

# Crear producto
class ProductCreateView(View):
    template_name = 'products/create.html'

    def get(self, request):
        form = ProductForm()
        return render(request, self.template_name, {
            "title": "Create product",
            "form": form
        })

    def post(self, request):
        form = ProductForm(request.POST)
        if form.is_valid():
            return render(request, "products/created.html", {
                "title": "Product created",
                "name": form.cleaned_data["name"],
                "price": form.cleaned_data["price"]
            })
        else:
            return render(request, self.template_name, {
                "title": "Create product",
                "form": form
            })
