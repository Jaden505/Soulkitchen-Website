from django.shortcuts import render, redirect
from .models import AddProduct
from django.shortcuts import get_object_or_404

# Create your views here.

shopping_cart = []

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

def add_to_cart(request, **kwargs):
    product = kwargs.get('item_id')
    product_price = kwargs.get('item_price')

    shopping_cart.append(product)
    shopping_cart.append(product_price)

    return redirect(menu_view)

