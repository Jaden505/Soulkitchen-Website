from django.shortcuts import render, redirect
from .models import AddProduct, Broodje_vdw
from .forms import *
import stripe
from Web import settings
import logging
import json
from django.http import JsonResponse
from django.core import serializers

# Create your views here.

# Logs error
logging.getLogger('error logger')

def home_view(request):
    products = AddProduct.objects.all()[:8]

    return render(request, "Home.html", {'products': products})

def about_view(request):
    return render(request, "About.html")

def order_view(request):
    json_serializer = serializers.get_serializer("json")()
    products = json_serializer.serialize(AddProduct.objects.all().order_by('id')[:5], ensure_ascii=False)
    bvdw = json_serializer.serialize(Broodje_vdw.objects.all().order_by('id')[:5], ensure_ascii=False)

    return render(request, "Order.html", {'products': products, 'bvdw': bvdw})

def menu_view(request):
    products = AddProduct.objects.all()
    bvdw = Broodje_vdw.objects.all()

    return render(request, "Menu.html", {'products': products, 'bvdw': bvdw})

def checkout_view(request):
    stripe.api_key = settings.STRIPE_SECRET_KEY
    public_key = settings.STRIPE_PUBLIC_KEY
    amount = request.session['amount']
    form = UserInfo

    payment = stripe.PaymentIntent.create(
        amount=amount,
        currency='eur',
        payment_method_types=['ideal'],
    )

    return render(request, "Checkout.html", {'payment': payment.client_secret, 'public_key': public_key, 'form': form})

def amount_view(request, amount):
    amount = round((float(amount) * 100), 0)
    amount = int(amount)

    request.session['amount'] = amount

    return redirect(checkout_view)

def confirmation_view(request):
    return render(request, 'Confirmation.html')

def basketAmount(request, basket, many):
    request.session['basket'] = basket
    request.session['many'] = many

    return redirect(order_view)

def jsonQuery():
    data = list(AddProduct.objects.values())  # wrap in list(), because QuerySet is not JSON serializable
    return JsonResponse(data, safe=False)  # or JsonResponse({'data': data})

