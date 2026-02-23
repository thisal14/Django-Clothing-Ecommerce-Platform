from django.urls import path
from . import views

urlpatterns = [
    path('', views.CartViewSet.as_view({'get': 'list'}), name='cart-detail'),
    path('add/', views.CartViewSet.as_view({'post': 'add_item'}), name='cart-add'),
    path('update/', views.CartViewSet.as_view({'post': 'update_item'}), name='cart-update'),
    path('remove/', views.CartViewSet.as_view({'post': 'remove_item'}), name='cart-remove'),
]
