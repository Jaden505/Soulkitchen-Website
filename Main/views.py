from django.shortcuts import render, redirect
from .models import AddProduct, Broodje_vdw, CouponCodes
from .forms import *
import stripe
import logging
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt
import base64
from Web import settings

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

    request.session['data'] = None

    return render(request, "Menu.html", {'products': products, 'bvdw': bvdw})

def order_view(request):
    json_serializer = serializers.get_serializer("json")()
    products = json_serializer.serialize(AddProduct.objects.all().order_by('id')[:5], ensure_ascii=False)
    bvdw = json_serializer.serialize(Broodje_vdw.objects.all().order_by('id')[:5], ensure_ascii=False)
    coupons = json_serializer.serialize(CouponCodes.objects.all().order_by('id')[:5], ensure_ascii=False)

    if request.method == 'POST':
        form = UserInfo(request.POST)
        if form.is_valid():
            request.session['data'] = [form.cleaned_data.get("email"), form.cleaned_data.get("address"),
                                       form.cleaned_data.get("city"), form.cleaned_data.get("zip_code")]

            if request.session['amount'] > 1000:
                return redirect(payment_view)

            else:
                # GIVE NOTIFICATION
                return redirect(order_view)
    else:
        form = UserInfo

    return render(request, "Order.html", {'products': products, 'bvdw': bvdw, 'coupons': coupons, 'form': form})

@csrf_exempt
def amount_view(request, amount, code):
    # Decode string
    amount = (base64.b64decode(amount)).decode('utf-8')
    code = (base64.b64decode(code)).decode('utf-8')

    amount = round((float(amount) * 100), 0)
    amount = int(amount)

    request.session['amount'] = amount
    request.session['coupon_code'] = code

    return redirect(order_view)

def payment_view(request):
    if request.session['data'] == None:
        return redirect(order_view)

    data = request.session['data']

    json_serializer = serializers.get_serializer("json")()
    products = json_serializer.serialize(AddProduct.objects.all().order_by('id')[:5], ensure_ascii=False)
    bvdw = json_serializer.serialize(Broodje_vdw.objects.all().order_by('id')[:5], ensure_ascii=False)
    coupons = json_serializer.serialize(CouponCodes.objects.all().order_by('id')[:5], ensure_ascii=False)

    stripe.api_key = settings.STRIPE_SECRET_KEY
    public_key = settings.STRIPE_PUBLIC_KEY

    try:
        amount = request.session['amount']
    except:
        amount = 1

    payment = stripe.PaymentIntent.create(
        amount=amount,
        currency='eur',
        payment_method_types=['ideal'],
    )

    return render(request, "Payment.html", {'products': products, 'bvdw': bvdw, 'coupons': coupons,
                                            'payment': payment.client_secret, 'public_key': public_key,
                                            'data': data})

def confirmation_view(request):
    code = request.session['coupon_code']

    # Remove coupon when used
    if code != 'null':
        CouponCodes.objects.filter(code=code).delete()

    return render(request, 'Confirmation.html')
