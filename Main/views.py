from django.shortcuts import render

# Create your views here.

def home_view(request):
    return render(request, "Home.html")

def about_view(request):
    return render(request, "About.html")

def order_view(request):
    return render(request, "Order.html")

def menu_view(request):
    return render(request, "Menu.html")

def checkout_view(request):
    return render(request, "Checkout.html")
