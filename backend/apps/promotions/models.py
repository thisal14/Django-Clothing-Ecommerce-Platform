"""Promotions app models — Coupons and Flash Sales."""
import uuid
from django.db import models
from django.conf import settings
from django.utils import timezone


class Coupon(models.Model):
    class Type(models.TextChoices):
        PERCENTAGE = 'PERCENTAGE', 'Percentage Discount'
        FIXED_AMOUNT = 'FIXED_AMOUNT', 'Fixed Amount Off'
        FREE_SHIPPING = 'FREE_SHIPPING', 'Free Shipping'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=50, unique=True, db_index=True)
    description = models.CharField(max_length=300, blank=True)
    type = models.CharField(max_length=20, choices=Type.choices)
    value = models.DecimalField(max_digits=10, decimal_places=2)
    minimum_order_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    max_uses = models.PositiveIntegerField(null=True, blank=True)
    used_count = models.PositiveIntegerField(default=0)
    valid_from = models.DateTimeField()
    valid_until = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'promotions_coupon'

    def __str__(self):
        return f'Coupon: {self.code} ({self.get_type_display()})'

    def is_valid(self):
        now = timezone.now()
        if not self.is_active:
            return False, 'Coupon is not active'
        if now < self.valid_from:
            return False, 'Coupon is not yet valid'
        if self.valid_until and now > self.valid_until:
            return False, 'Coupon has expired'
        if self.max_uses and self.used_count >= self.max_uses:
            return False, 'Coupon has reached its maximum usage limit'
        return True, 'Valid'


class CouponUsage(models.Model):
    coupon = models.ForeignKey(Coupon, on_delete=models.CASCADE, related_name='usages')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    order = models.ForeignKey('orders.Order', on_delete=models.CASCADE)
    used_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'promotions_coupon_usage'
        unique_together = ('coupon', 'user')


class FlashSale(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey('catalog.Product', on_delete=models.CASCADE, related_name='flash_sales')
    discount_percentage = models.PositiveIntegerField()  # 10 = 10% off
    starts_at = models.DateTimeField()
    ends_at = models.DateTimeField()
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'promotions_flash_sale'

    def __str__(self):
        return f'Flash Sale: {self.product.name} ({self.discount_percentage}% off)'

    @property
    def is_live(self):
        now = timezone.now()
        return self.is_active and self.starts_at <= now <= self.ends_at
