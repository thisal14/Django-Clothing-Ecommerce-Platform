"""Analytics views — admin dashboard metrics."""
from django.db.models import Sum, Count, Avg
from django.db.models.functions import TruncDate
from django.utils import timezone
from datetime import timedelta
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from apps.orders.models import Order
from apps.catalog.models import Product
from apps.accounts.models import CustomUser
from utils.permissions import IsStaffOrAdmin


@api_view(['GET'])
@permission_classes([IsStaffOrAdmin])
def dashboard_metrics(request):
    """Admin dashboard summary."""
    now = timezone.now()
    thirty_days_ago = now - timedelta(days=30)
    seven_days_ago = now - timedelta(days=7)

    total_revenue = Order.objects.filter(
        status__in=['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED']
    ).aggregate(total=Sum('grand_total'))['total'] or 0

    monthly_revenue = Order.objects.filter(
        status__in=['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'],
        created_at__gte=thirty_days_ago
    ).aggregate(total=Sum('grand_total'))['total'] or 0

    pending_orders = Order.objects.filter(status='PENDING').count()
    processing_orders = Order.objects.filter(status='PROCESSING').count()

    new_customers = CustomUser.objects.filter(
        date_joined__gte=thirty_days_ago, role='CUSTOMER'
    ).count()

    # Sales over last 7 days
    daily_sales = (
        Order.objects.filter(
            status__in=['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'],
            created_at__gte=seven_days_ago
        )
        .annotate(date=TruncDate('created_at'))
        .values('date')
        .annotate(revenue=Sum('grand_total'), orders=Count('id'))
        .order_by('date')
    )

    # Top products by order count
    top_products = (
        Product.objects.filter(is_active=True)
        .annotate(order_count=Count('variants__order_items'))
        .order_by('-order_count')[:5]
        .values('name', 'slug', 'order_count')
    )

    return Response({
        'total_revenue': float(total_revenue),
        'monthly_revenue': float(monthly_revenue),
        'pending_orders': pending_orders,
        'processing_orders': processing_orders,
        'total_products': Product.objects.filter(is_active=True).count(),
        'total_customers': CustomUser.objects.filter(role='CUSTOMER').count(),
        'new_customers_30d': new_customers,
        'daily_sales': [
            {
                'date': str(day['date']),
                'revenue': float(day['revenue']),
                'orders': day['orders']
            } for day in daily_sales
        ],
        'top_products': list(top_products),
    })
