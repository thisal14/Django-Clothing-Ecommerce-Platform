"""Analytics URL configuration."""
from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.dashboard_metrics, name='admin-dashboard'),
]
