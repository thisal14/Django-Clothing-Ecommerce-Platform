from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'coupons', views.CouponViewSet)
router.register(r'flash-sales', views.FlashSaleViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('validate/', views.validate_coupon, name='validate-coupon'),
]
