from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'stock', views.StockViewSet)
router.register(r'movements', views.StockMovementViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
