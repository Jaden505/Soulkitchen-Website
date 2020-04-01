from django.test import TestCase
from django.urls import reverse, resolve
import requests
from .models import *
from .views import *

# Create your tests here.

BASE_URL = 'http://127.0.0.1:8000/'
URLS = ['home_view', 'about_view', 'menu_view', 'confirmation_view', 'order_view', 'checkout_view']
URLS_ARGS = ['amount_view']

class TestURLs(TestCase):

    def urlCallback(self, name_url):
        response = self.client.get(reverse(name_url))
        self.assertEqual(response.status_code, 200)
        print(f'Url {name_url} works')

    def urlCallbackArgs(self, name_url, amount):
        response = self.client.get(reverse(name_url, args=[amount]))
        self.assertEqual(response.status_code, 302)
        print(f'Url {name_url} works')

    def test_url(self):
        for url in URLS_ARGS:
            self.urlCallbackArgs(url, 50)

        for url in URLS:
            self.urlCallback(url)

class TestModels(TestCase):

    def setUp(self):
        self.product = AddProduct.objects.create(
            title='product1',
            price=50,
        )

    def test_validate_amount(self):
        with self.assertRaises(Exception):
            self.broodje = Broodje_vdw.objects.create(
                title='product2',
                price=55,
            )
            self.broodje2 = Broodje_vdw.objects.create(
                title='product3',
                price=105,
            )

            self.clean = Broodje_vdw.clean(self.broodje2)

if __name__ == '__main__':
    TestCase
