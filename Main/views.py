from django.shortcuts import render
from .models import AddProduct

# Create your views here.

def home_view(request):
    return render(request, "Home.html")

def about_view(request):
    return render(request, "About.html")

def order_view(request):
    return render(request, "Order.html")

def menu_view(request):
    products = AddProduct.objects.all()
    return render(request, "Menu.html", {'products': products})

def checkout_view(request):
    return render(request, "Checkout.html")
