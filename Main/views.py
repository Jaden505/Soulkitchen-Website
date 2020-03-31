from django.shortcuts import render, redirect
from .models import AddProduct, Broodje_vdw
import stripe
from django.core.mail import send_mail

# Create your views here.

def home_view(request):
    return render(request, "Home.html")

def about_view(request):
    return render(request, "About.html")

def order_view(request):
    return render(request, "Order.html")

def menu_view(request):
    products = AddProduct.objects.all()
    bvdw = Broodje_vdw.objects.all()
    return render(request, "Menu.html", {'products': products, 'bvdw': bvdw})

def checkout_view(request):
    stripe.api_key = 'sk_test_r6FwtlBtj8JiMSxLcz4DlaRH00yErwoh8S'
    amount = request.session['amount']

    payment = stripe.PaymentIntent.create(
        amount=amount,
        currency='eur',
        payment_method_types=['ideal']
    )

    return render(request, "Checkout.html", {'payment': payment.client_secret})

def amount_view(request, amount):
    request.session['amount'] = amount

    return redirect(checkout_view)

def confirmation_view(request):
    # total = request.session['total']
    # basket = request.session['basket']
    #
    # send_mail(
    #     'Subject here',
    #     'Here is the message. \n{}. \n{}'.format(total, basket),
    #     'from@example.com',
    #     ['to@example.com'],
    #     fail_silently=False,
    # )

    return render(request, 'Confirmation.html')
