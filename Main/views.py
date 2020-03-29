from django.shortcuts import render, redirect
from .models import AddProduct
from django.shortcuts import get_object_or_404
import stripe


# Create your views here.

def home_view(request):
    return render(request, "Home.html")

def about_view(request):
    return render(request, "About.html")

def order_view(request):
    return render(request, "Order.html")

def menu_view(request):
    products = AddProduct.objects.all()
    return render(request, "Menu.html",  {'products': products})

def checkout_view(request):
    stripe.api_key = 'sk_test_r6FwtlBtj8JiMSxLcz4DlaRH00yErwoh8S'
    amt = request.session['amount']

    payment = stripe.PaymentIntent.create(
        amount=amt,
        currency='eur',
        payment_method_types=['ideal']
    )

    return render(request, "Checkout.html", {'payment': payment.client_secret})

def amount_view(request, amount):
    request.session['amount'] = amount

    return redirect(checkout_view)

def confirmation_view(request):
    return render(request, 'Confirmation.html')
