"""Web URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from Main import views
from django.conf import settings
from django.conf.urls.static import static
from django.urls import re_path

urlpatterns = [
    path('admin/', admin.site.urls, name='admin_view'),
    path('', views.home_view, name='home_view'),
    path('about/', views.about_view, name='about_view'),
    # path('checkout/', views.checkout_view, name='checkout_view'),
    path('menu/', views.menu_view, name='menu_view'),
    path('order/', views.order_view, name='order_view'),
    path('order/<amount>/', views.amount_view, name='amount_view'),
    path('confirmation/', views.confirmation_view, name='confirmation_view'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

