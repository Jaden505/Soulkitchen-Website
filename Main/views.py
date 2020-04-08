from django.shortcuts import render, redirect
from .models import AddProduct, Broodje_vdw
from .forms import *
from django import forms
import stripe
from django.core.mail import send_mail
from decimal import Decimal

# Create your views here.

def home_view(request):
    return render(request, "Home.html")

def about_view(request):
    return render(request, "About.html")

def order_view(request):
    form = UserInfo
    return render(request, "Order.html", {'form': form})

def menu_view(request):
    products = AddProduct.objects.all()
    bvdw = Broodje_vdw.objects.all()
    return render(request, "Menu.html", {'products': products, 'bvdw': bvdw})

def checkout_view(request):
    stripe.api_key = 'sk_test_r6FwtlBtj8JiMSxLcz4DlaRH00yErwoh8S' # Secret
    public_key = 'pk_live_n0KEXVBkq1aVwMbZ1JMrO6ID00dRVeza24' # Public
    amount = request.session['amount']

    payment = stripe.PaymentIntent.create(
        amount=amount,
        currency='eur',
        payment_method_types=['ideal'],
    )

    return render(request, "Checkout.html", {'payment': payment.client_secret, 'public_key': public_key})

def amount_view(request, amount):
    amount = round((float(amount) * 100), 0)
    amount = int(amount)

    request.session['amount'] = amount

    return redirect(checkout_view)

def confirmation_view(request):
    # total = request.session['total']
    # basket = request.session['basket']
    # user_details = request.session['user_details']
    #
    # send_mail(
    #     'Thank you for ordering at our restaurant.',
    #     'Here is the message. \n{}. \n{}'.format(total, basket),
    #     'info@sassies-soulkitchen.nl',
    #     [user_details['email']],
    #     fail_silently=False,
    # )

    return render(request, 'Confirmation.html')
