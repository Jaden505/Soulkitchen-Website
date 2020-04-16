from django.shortcuts import render, redirect
from .models import AddProduct, Broodje_vdw
from .forms import *
import stripe
from Web import settings

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
    stripe.api_key = settings.STRIPE_SECRET_KEY
    public_key = settings.STRIPE_PUBLIC_KEY
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
    return render(request, 'Confirmation.html')
