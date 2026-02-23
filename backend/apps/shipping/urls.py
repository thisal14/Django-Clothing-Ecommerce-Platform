from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'zones', views.ShippingZoneViewSet)
router.register(r'methods', views.ShippingMethodViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
