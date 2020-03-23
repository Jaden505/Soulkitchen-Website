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
    path('admin/', admin.site.urls),
    path('', views.home_view),
    path('about/', views.about_view),
    path('checkout/', views.checkout_view),
    path('menu/', views.menu_view),
    path('menu/<item_id>/<item_price>/', views.add_to_cart, name='addon'),
    path('order/', views.order_view),
    #re_path(r'^(?P<item_id>\w+)/(?P<item_price>(\d+\.\d+))$', views.add_to_cart, name='addon'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
