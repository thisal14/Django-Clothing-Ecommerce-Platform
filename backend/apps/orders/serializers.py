import traceback
from django.db import transaction
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import Order, OrderItem, Cart, CartItem

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = '__all__'

class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='variant.product.name')
    line_total = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    
    class Meta:
        model = CartItem
        fields = ['id', 'variant', 'product_name', 'quantity', 'line_total']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Cart
        fields = ['id', 'items', 'total', 'item_count']

class CheckoutSerializer(serializers.Serializer):
    shipping_address = serializers.JSONField(required=True)
    shipping_method_id = serializers.CharField(required=False, default='standard')
    notes = serializers.CharField(required=False, allow_blank=True)

    def validate(self, data):
        user = self.context['request'].user
        cart = Cart.objects.filter(user=user).first()
        
        if not cart or cart.items.count() == 0:
            raise ValidationError({"detail": "Cart is empty"})
        
        data['cart'] = cart
        return data

    @transaction.atomic
    def save(self, **kwargs):
        user = self.context['request'].user
        cart = self.validated_data['cart']
        shipping_address = self.validated_data['shipping_address']
        shipping_method = self.validated_data['shipping_method_id']
        notes = self.validated_data.get('notes', '')

        # In a real app, calculate shipping based on method
        shipping_cost = 450 

        # Create Order
        order = Order.objects.create(
            user=user,
            status=Order.Status.PENDING,
            shipping_address=shipping_address,
            shipping_method=shipping_method,
            shipping_cost=shipping_cost,
            subtotal=cart.total,
            grand_total=cart.total + shipping_cost,
            notes=notes
        )

        order_items = []
        for item in cart.items.all():
            order_items.append(
                OrderItem(
                    order=order,
                    variant=item.variant,
                    product_snapshot={
                        "name": item.variant.product.name,
                        "sku": item.variant.sku,
                    },
                    quantity=item.quantity,
                    unit_price=item.variant.effective_price,
                    total_price=item.line_total
                )
            )
            
        # Bulk create order items
        OrderItem.objects.bulk_create(order_items)

        # Clear cart
        cart.items.all().delete()

        return order
