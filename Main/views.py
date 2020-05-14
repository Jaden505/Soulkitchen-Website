from django.shortcuts import render, redirect
from .models import AddProduct, Broodje_vdw, CouponCodes
from .forms import *
import stripe
from Web import settings
import logging
from django.core import serializers

# Create your views here.

# Logs error
logging.getLogger('error logger')

def home_view(request):
    products = AddProduct.objects.all()[:8]

    return render(request, "Home.html", {'products': products})

def about_view(request):
    return render(request, "About.html")


def menu_view(request):
    products = AddProduct.objects.all()
    bvdw = Broodje_vdw.objects.all()

    return render(request, "Menu.html", {'products': products, 'bvdw': bvdw})

def order_view(request):
    json_serializer = serializers.get_serializer("json")()
    products = json_serializer.serialize(AddProduct.objects.all().order_by('id')[:5], ensure_ascii=False)
    bvdw = json_serializer.serialize(Broodje_vdw.objects.all().order_by('id')[:5], ensure_ascii=False)
    coupons = json_serializer.serialize(CouponCodes.objects.all().order_by('id')[:5], ensure_ascii=False)

    form = UserInfo

    stripe.api_key = settings.STRIPE_SECRET_KEY
    public_key = settings.STRIPE_PUBLIC_KEY
    amount = request.session['amount']

    payment = stripe.PaymentIntent.create(
        amount=amount,
        currency='eur',
        payment_method_types=['ideal'],
    )

    return render(request, "Order.html", {'products': products, 'bvdw': bvdw, 'coupons': coupons, 'form': form, 'payment': payment.client_secret, 'public_key': public_key})

def amount_view(request, amount, code):
    amount = round((float(amount) * 100), 0)
    amount = int(amount)

    request.session['amount'] = amount
    request.session['coupon_code'] = code

    return redirect(order_view)

def confirmation_view(request):
    code = request.session['coupon_code']

    # Remove coupon when used
    if code != 'null':
        CouponCodes.objects.filter(code=code).delete()

    return render(request, 'Confirmation.html')
