from django.shortcuts import render, redirect
from .models import AddProduct, Broodje_vdw
from .forms import *
import os
import stripe
import psycopg2

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

    for product in products:
        if getFile('images', product.title) != False:
            product.image = getFile('images', product.title)
        else:
            #print('Doesnt exist')
            pass

    return render(request, "Menu.html", {'products': products, 'bvdw': bvdw})

def checkout_view(request):
    stripe.api_key = os.environ.get('STRIPE_PUBLIC_KEY') # Secret
    public_key = os.environ.get('STRIPE_SECRET_KEY') # Public
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

    stripe.api_key = "sk_live_Z37IuBar2N3xzo6jLDpyF5dY00XyY0Gu9J"

    stripe.PaymentIntent.confirm(
        payment_method="ideal",
    )

    return render(request, 'Confirmation.html')


def getFile(table, name):

    def retrieve():
        cursor.execute(f"""SELECT * FROM {table}
            WHERE name = {name};
        """)

        rett = cursor.fetchall()
        print(rett)

        return rett

    try:
        connection = psycopg2.connect(port="5432", database="WebshopDB")
        cursor = connection.cursor()
        #print('Connection is open')

        try:
            retrieve()
        except:
            return False

    except (Exception, psycopg2.Error) as error:
        print("Error while connecting to PostgreSQL", error)
        return False

    finally:
        #closing database connection.
        if connection:
            cursor.close()
            connection.close()
            #print("PostgreSQL connection is closed")

