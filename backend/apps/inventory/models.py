"""Inventory app models — Stock management with reservations."""
from django.db import models
from django.conf import settings


class Stock(models.Model):
    variant = models.OneToOneField(
        'catalog.ProductVariant', on_delete=models.CASCADE, related_name='stock'
    )
    quantity = models.PositiveIntegerField(default=0)
    reserved_quantity = models.PositiveIntegerField(default=0)  # In-cart or unpaid orders
    low_stock_threshold = models.PositiveIntegerField(default=5)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'inventory_stock'

    def __str__(self):
        return f'Stock: {self.variant.sku} | Available: {self.available}'

    @property
    def available(self):
        return max(0, self.quantity - self.reserved_quantity)

    @property
    def is_low_stock(self):
        return self.available <= self.low_stock_threshold

    @property
    def is_in_stock(self):
        return self.available > 0


class StockMovement(models.Model):
    class Reason(models.TextChoices):
        PURCHASE = 'PURCHASE', 'Purchase / Restock'
        SALE = 'SALE', 'Sale'
        RETURN = 'RETURN', 'Return'
        RESERVATION = 'RESERVATION', 'Cart Reservation'
        RELEASE = 'RELEASE', 'Reservation Released'
        ADJUSTMENT = 'ADJUSTMENT', 'Manual Adjustment'
        DAMAGE = 'DAMAGE', 'Damage / Loss'

    variant = models.ForeignKey(
        'catalog.ProductVariant', on_delete=models.CASCADE, related_name='stock_movements'
    )
    quantity_change = models.IntegerField()  # Positive = in, Negative = out
    reason = models.CharField(max_length=20, choices=Reason.choices)
    reference_id = models.CharField(max_length=100, blank=True)  # Order or PO number
    note = models.TextField(blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'inventory_movement'
        ordering = ['-created_at']

    def __str__(self):
        direction = '+' if self.quantity_change > 0 else ''
        return f'{self.variant.sku} {direction}{self.quantity_change} ({self.reason})'
