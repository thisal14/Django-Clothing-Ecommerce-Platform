"""Catalog serializers."""
from rest_framework import serializers
from .models import Category, Brand, Product, ProductVariant, ProductImage, AttributeValue, ProductAttribute
from apps.inventory.models import Stock


class CategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'image', 'description', 'children', 'sort_order']

    def get_children(self, obj):
        if obj.children.exists():
            return CategorySerializer(obj.children.filter(is_active=True), many=True).data
        return []


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug', 'logo']


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'sort_order', 'is_primary']


class AttributeValueSerializer(serializers.ModelSerializer):
    attribute_name = serializers.CharField(source='attribute.name', read_only=True)

    class Meta:
        model = AttributeValue
        fields = ['id', 'attribute_name', 'value', 'color_hex']


class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = ['quantity', 'available', 'is_in_stock', 'is_low_stock']


class ProductVariantSerializer(serializers.ModelSerializer):
    attributes = AttributeValueSerializer(many=True, read_only=True)
    stock = StockSerializer(read_only=True)
    effective_price = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = ProductVariant
        fields = ['id', 'sku', 'attributes', 'effective_price', 'price_override', 'stock', 'is_active']


class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for product grid listings."""
    primary_image = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.name', read_only=True)
    effective_price = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    is_on_sale = serializers.BooleanField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'category_name', 'primary_image',
            'base_price', 'sale_price', 'effective_price', 'is_on_sale',
            'is_new_arrival', 'is_featured'
        ]

    def get_primary_image(self, obj):
        img = obj.images.filter(is_primary=True).first()
        if img:
            request = self.context.get('request')
            return request.build_absolute_uri(img.image.url) if request else img.image.url
        return None


class ProductDetailSerializer(serializers.ModelSerializer):
    """Full serializer for product detail page."""
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    brand = BrandSerializer(read_only=True)
    effective_price = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    is_on_sale = serializers.BooleanField(read_only=True)
    avg_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'category', 'brand', 'description', 'short_description',
            'base_price', 'sale_price', 'effective_price', 'is_on_sale',
            'images', 'variants', 'is_new_arrival', 'is_featured',
            'meta_title', 'meta_description', 'avg_rating', 'review_count'
        ]

    def get_avg_rating(self, obj):
        reviews = obj.reviews.filter(is_approved=True)
        if reviews.exists():
            return round(reviews.aggregate(__import__('django.db.models', fromlist=['Avg']).Avg('rating'))['rating__avg'], 1)
        return None

    def get_review_count(self, obj):
        return obj.reviews.filter(is_approved=True).count()


class ProductWriteSerializer(serializers.ModelSerializer):
    """For admin create/update."""
    class Meta:
        model = Product
        fields = [
            'name', 'slug', 'category', 'brand', 'description', 'short_description',
            'base_price', 'sale_price', 'is_active', 'is_featured', 'is_new_arrival',
            'meta_title', 'meta_description'
        ]
