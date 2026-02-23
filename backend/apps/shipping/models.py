"""Shipping app models."""
import uuid
from django.db import models


class ShippingZone(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    districts = models.JSONField(default=list)  # ["Colombo", "Gampaha"]
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'shipping_zone'

    def __str__(self):
        return self.name


class ShippingMethod(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    zone = models.ForeignKey(ShippingZone, on_delete=models.CASCADE, related_name='methods')
    name = models.CharField(max_length=200)
    carrier = models.CharField(max_length=200)  # e.g. Lanka Express, DHL
    base_rate = models.DecimalField(max_digits=10, decimal_places=2)
    per_kg_rate = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    estimated_days_min = models.PositiveIntegerField(default=1)
    estimated_days_max = models.PositiveIntegerField(default=3)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'shipping_method'
        ordering = ['base_rate']

    def __str__(self):
        return f'{self.name} ({self.zone.name}) — LKR {self.base_rate}'

    def calculate_rate(self, weight_kg=0):
        return self.base_rate + (self.per_kg_rate * weight_kg)
