"""
seed_products.py — Populates the DB with sample Sri Lankan fashion products.
Usage: python manage.py seed_products
Safe to re-run (idempotent via get_or_create).
"""
import io
import os
import urllib.request
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from django.conf import settings
from apps.catalog.models import (
    Category, Brand, Product, ProductAttribute,
    AttributeValue, ProductVariant, ProductImage,
)
from apps.inventory.models import Stock


# ---------------------------------------------------------------------------
# Seed data
# ---------------------------------------------------------------------------

BRANDS = [
    {"name": "Island Threads", "slug": "island-threads"},
    {"name": "Serendib Style",  "slug": "serendib-style"},
    {"name": "Ceylon Craft",    "slug": "ceylon-craft"},
    {"name": "Lanka Luxe",      "slug": "lanka-luxe"},
]

CATEGORIES = [
    {"name": "Men",       "slug": "men"},
    {"name": "Women",     "slug": "women"},
    {"name": "New Arrivals", "slug": "new"},
]

# Each product: name, slug, category_slug, brand_slug, base_price, sale_price,
#               is_featured, is_new_arrival, description, images (list of Unsplash URLs)
PRODUCTS = [
    # ── MEN (8 products) ──────────────────────────────────────────────────
    {
        "name": "Ceylon Linen Kurta",
        "slug": "ceylon-linen-kurta",
        "category": "men",
        "brand": "island-threads",
        "base_price": "4500.00",
        "sale_price": "3800.00",
        "is_featured": True,
        "is_new_arrival": False,
        "short_description": "Breathable linen kurta with traditional embroidery.",
        "description": (
            "Crafted from premium Sri Lankan linen, this kurta features hand-embroidered "
            "motifs inspired by ancient Kandyan art. Perfect for both casual and semi-formal occasions."
        ),
        "images": [
            ("https://images.unsplash.com/photo-1594938298603-c8148f4cae50?w=600&q=80", True),
        ],
        "variants": [
            {"sku": "CLK-S", "size": "S"},
            {"sku": "CLK-M", "size": "M"},
            {"sku": "CLK-L", "size": "L"},
            {"sku": "CLK-XL", "size": "XL"},
        ],
        "stock": 25,
    },
    {
        "name": "Batik Print Shirt",
        "slug": "batik-print-shirt",
        "category": "men",
        "brand": "serendib-style",
        "base_price": "3200.00",
        "sale_price": None,
        "is_featured": True,
        "is_new_arrival": False,
        "short_description": "Classic batik shirt with island-inspired prints.",
        "description": (
            "A vibrant short-sleeve shirt showcasing authentic Sri Lankan batik patterns. "
            "Made from 100% cotton for all-day comfort in the tropical heat."
        ),
        "images": [
            ("https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80", True),
        ],
        "variants": [
            {"sku": "BPS-S", "size": "S"},
            {"sku": "BPS-M", "size": "M"},
            {"sku": "BPS-L", "size": "L"},
        ],
        "stock": 30,
    },
    {
        "name": "Colombo Slim Chinos",
        "slug": "colombo-slim-chinos",
        "category": "men",
        "brand": "lanka-luxe",
        "base_price": "5800.00",
        "sale_price": "4990.00",
        "is_featured": False,
        "is_new_arrival": False,
        "short_description": "Slim-fit chinos in earthy island tones.",
        "description": (
            "Tailored slim-fit chinos made from stretch-cotton blend. "
            "Available in Cinnamon, Coconut, and Spice — colours inspired by Sri Lanka's spice trade heritage."
        ),
        "images": [
            ("https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80", True),
        ],
        "variants": [
            {"sku": "CSC-30", "size": "30"},
            {"sku": "CSC-32", "size": "32"},
            {"sku": "CSC-34", "size": "34"},
            {"sku": "CSC-36", "size": "36"},
        ],
        "stock": 20,
    },
    {
        "name": "Handwoven Sarong Set",
        "slug": "handwoven-sarong-set",
        "category": "men",
        "brand": "ceylon-craft",
        "base_price": "2800.00",
        "sale_price": None,
        "is_featured": False,
        "is_new_arrival": True,
        "short_description": "Traditional handwoven sarong with matching shirt.",
        "description": (
            "A complete set featuring a handwoven cotton sarong and a coordinating short-sleeve shirt. "
            "Woven by artisans in Kandy using traditional techniques passed down through generations."
        ),
        "images": [
            ("https://images.unsplash.com/photo-1536922246289-88c42f957773?w=600&q=80", True),
        ],
        "variants": [
            {"sku": "HWS-ONE", "size": "One Size"},
        ],
        "stock": 15,
    },
    {
        "name": "Tropical Linen Trousers",
        "slug": "tropical-linen-trousers",
        "category": "men",
        "brand": "island-threads",
        "base_price": "4200.00",
        "sale_price": None,
        "is_featured": False,
        "is_new_arrival": True,
        "short_description": "Wide-leg linen trousers in resort style.",
        "description": (
            "Relaxed wide-leg linen trousers perfect for beach and resort wear. "
            "Elastic waistband and drawstring for a perfect fit."
        ),
        "images": [
            ("https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=600&q=80", True),
        ],
        "variants": [
            {"sku": "TLT-S", "size": "S"},
            {"sku": "TLT-M", "size": "M"},
            {"sku": "TLT-L", "size": "L"},
        ],
        "stock": 18,
    },
    {
        "name": "Spice Route Polo",
        "slug": "spice-route-polo",
        "category": "men",
        "brand": "serendib-style",
        "base_price": "3500.00",
        "sale_price": "2900.00",
        "is_featured": True,
        "is_new_arrival": False,
        "short_description": "Premium pique polo with subtle island emblem.",
        "description": (
            "A timeless polo shirt crafted from premium pique cotton. "
            "Features a discreet embroidered island emblem on the chest."
        ),
        "images": [
            ("https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80", True),
        ],
        "variants": [
            {"sku": "SRP-S", "size": "S"},
            {"sku": "SRP-M", "size": "M"},
            {"sku": "SRP-L", "size": "L"},
            {"sku": "SRP-XL", "size": "XL"},
        ],
        "stock": 22,
    },
    {
        "name": "Artisan Denim Jacket",
        "slug": "artisan-denim-jacket",
        "category": "men",
        "brand": "lanka-luxe",
        "base_price": "9500.00",
        "sale_price": None,
        "is_featured": False,
        "is_new_arrival": True,
        "short_description": "Denim jacket with hand-painted batik back panel.",
        "description": (
            "A premium denim jacket featuring a hand-painted batik art panel on the back, "
            "created by Sri Lankan artists. Each piece is unique."
        ),
        "images": [
            ("https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&q=80", True),
        ],
        "variants": [
            {"sku": "ADJ-M", "size": "M"},
            {"sku": "ADJ-L", "size": "L"},
            {"sku": "ADJ-XL", "size": "XL"},
        ],
        "stock": 10,
    },
    {
        "name": "Temple Run Joggers",
        "slug": "temple-run-joggers",
        "category": "men",
        "brand": "ceylon-craft",
        "base_price": "3900.00",
        "sale_price": "3200.00",
        "is_featured": False,
        "is_new_arrival": False,
        "short_description": "Comfortable joggers with ethnic waistband detail.",
        "description": (
            "Soft-touch jersey joggers featuring a woven ethnic pattern waistband. "
            "Designed for both active wear and leisurewear."
        ),
        "images": [
            ("https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&q=80", True),
        ],
        "variants": [
            {"sku": "TRJ-S", "size": "S"},
            {"sku": "TRJ-M", "size": "M"},
            {"sku": "TRJ-L", "size": "L"},
        ],
        "stock": 28,
    },

    # ── WOMEN (8 products) ────────────────────────────────────────────────
    {
        "name": "Lotus Bloom Saree",
        "slug": "lotus-bloom-saree",
        "category": "women",
        "brand": "ceylon-craft",
        "base_price": "12500.00",
        "sale_price": "9999.00",
        "is_featured": True,
        "is_new_arrival": False,
        "short_description": "Hand-painted lotus motif georgette saree.",
        "description": (
            "Exquisite georgette saree featuring hand-painted lotus motifs inspired by Sri Lanka's national flower. "
            "Comes with a matching blouse piece. One of our bestsellers for weddings and festivals."
        ),
        "images": [
            ("https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80", True),
        ],
        "variants": [
            {"sku": "LBS-ONE", "size": "One Size"},
        ],
        "stock": 12,
    },
    {
        "name": "Kandy Heritage Blouse",
        "slug": "kandy-heritage-blouse",
        "category": "women",
        "brand": "island-threads",
        "base_price": "3800.00",
        "sale_price": None,
        "is_featured": True,
        "is_new_arrival": False,
        "short_description": "Silk blouse with Kandyan architectural prints.",
        "description": (
            "A flowing silk blouse with delicate prints inspired by the architecture of Kandy's temples. "
            "A versatile piece that pairs beautifully with trousers or skirts."
        ),
        "images": [
            ("https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80", True),
        ],
        "variants": [
            {"sku": "KHB-XS", "size": "XS"},
            {"sku": "KHB-S",  "size": "S"},
            {"sku": "KHB-M",  "size": "M"},
            {"sku": "KHB-L",  "size": "L"},
        ],
        "stock": 20,
    },
    {
        "name": "Batik Wrap Dress",
        "slug": "batik-wrap-dress",
        "category": "women",
        "brand": "serendib-style",
        "base_price": "6500.00",
        "sale_price": "5500.00",
        "is_featured": True,
        "is_new_arrival": False,
        "short_description": "Elegant wrap dress in vibrant batik fabric.",
        "description": (
            "Wrap-style midi dress crafted from hand-dyed batik cotton. "
            "The adjustable tie waist flatters all figures. Available in Tropical Blue and Spice Red."
        ),
        "images": [
            ("https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80", True),
        ],
        "variants": [
            {"sku": "BWD-S", "size": "S"},
            {"sku": "BWD-M", "size": "M"},
            {"sku": "BWD-L", "size": "L"},
        ],
        "stock": 16,
    },
    {
        "name": "Pearl Lagoon Maxi",
        "slug": "pearl-lagoon-maxi",
        "category": "women",
        "brand": "lanka-luxe",
        "base_price": "7800.00",
        "sale_price": None,
        "is_featured": False,
        "is_new_arrival": True,
        "short_description": "Flowy maxi dress in ocean-inspired hues.",
        "description": (
            "A breathtaking maxi dress in cooling chiffon, inspired by Sri Lanka's turquoise lagoons. "
            "Features hand-embroidered pearl-shell detailing at the neckline."
        ),
        "images": [
            ("https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=600&q=80", True),
        ],
        "variants": [
            {"sku": "PLM-XS", "size": "XS"},
            {"sku": "PLM-S",  "size": "S"},
            {"sku": "PLM-M",  "size": "M"},
        ],
        "stock": 14,
    },
    {
        "name": "Cinnamon Garden Kurta",
        "slug": "cinnamon-garden-kurta",
        "category": "women",
        "brand": "island-threads",
        "base_price": "4200.00",
        "sale_price": "3500.00",
        "is_featured": False,
        "is_new_arrival": True,
        "short_description": "Cotton kurta with hand-block printed border.",
        "description": (
            "Light cotton kurta featuring a hand-block printed border at the hem and sleeves, "
            "using natural cinnamon-bark dye. Comfortable for daily wear in tropical climates."
        ),
        "images": [
            ("https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80", True),
        ],
        "variants": [
            {"sku": "CGK-S", "size": "S"},
            {"sku": "CGK-M", "size": "M"},
            {"sku": "CGK-L", "size": "L"},
            {"sku": "CGK-XL", "size": "XL"},
        ],
        "stock": 24,
    },
    {
        "name": "Sigiriya Embroidered Top",
        "slug": "sigiriya-embroidered-top",
        "category": "women",
        "brand": "ceylon-craft",
        "base_price": "3600.00",
        "sale_price": None,
        "is_featured": False,
        "is_new_arrival": True,
        "short_description": "Crop top with Sigiriya fresco-inspired embroidery.",
        "description": (
            "Lightweight crop top with intricate embroidery inspired by the ancient Sigiriya frescoes. "
            "Pairs perfectly with high-waisted trousers or skirts."
        ),
        "images": [
            ("https://images.unsplash.com/photo-1591103599999-b5c9e7247db2?w=600&q=80", True),
        ],
        "variants": [
            {"sku": "SET-XS", "size": "XS"},
            {"sku": "SET-S",  "size": "S"},
            {"sku": "SET-M",  "size": "M"},
        ],
        "stock": 18,
    },
    {
        "name": "Spice Sari Palazzo Set",
        "slug": "spice-sari-palazzo-set",
        "category": "women",
        "brand": "serendib-style",
        "base_price": "8900.00",
        "sale_price": "7500.00",
        "is_featured": True,
        "is_new_arrival": False,
        "short_description": "Sari-inspired palazzo pant set in silk blend.",
        "description": (
            "A modern take on traditional sari dressing — a silk-blend palazzo pant set "
            "with a draped front panel. Ideal for formal events and celebrations."
        ),
        "images": [
            ("https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?w=600&q=80", True),
        ],
        "variants": [
            {"sku": "SSP-S", "size": "S"},
            {"sku": "SSP-M", "size": "M"},
            {"sku": "SSP-L", "size": "L"},
        ],
        "stock": 10,
    },
    {
        "name": "Tea Garden Sundress",
        "slug": "tea-garden-sundress",
        "category": "women",
        "brand": "lanka-luxe",
        "base_price": "5200.00",
        "sale_price": None,
        "is_featured": False,
        "is_new_arrival": False,
        "short_description": "Casual sundress with tea-leaf block print.",
        "description": (
            "A relaxed A-line sundress in breathable cotton voile, featuring a signature "
            "tea-leaf block print in forest green. A holiday essential."
        ),
        "images": [
            ("https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80", True),
        ],
        "variants": [
            {"sku": "TGS-XS", "size": "XS"},
            {"sku": "TGS-S",  "size": "S"},
            {"sku": "TGS-M",  "size": "M"},
            {"sku": "TGS-L",  "size": "L"},
        ],
        "stock": 22,
    },

    # ── NEW ARRIVALS extras (4 additional so the new arrivals tab is rich) ─
    {
        "name": "Ocean Drive Linen Set",
        "slug": "ocean-drive-linen-set",
        "category": "men",
        "brand": "lanka-luxe",
        "base_price": "7600.00",
        "sale_price": "6500.00",
        "is_featured": False,
        "is_new_arrival": True,
        "short_description": "Matching linen shirt and shorts beach set.",
        "description": (
            "A co-ord linen set perfect for beach days and resort stays. "
            "Features contrast stitching and a relaxed fit for ultimate comfort."
        ),
        "images": [
            ("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80", True),
        ],
        "variants": [
            {"sku": "ODL-S", "size": "S"},
            {"sku": "ODL-M", "size": "M"},
            {"sku": "ODL-L", "size": "L"},
        ],
        "stock": 15,
    },
    {
        "name": "Monsoon Kaftan",
        "slug": "monsoon-kaftan",
        "category": "women",
        "brand": "ceylon-craft",
        "base_price": "5500.00",
        "sale_price": None,
        "is_featured": False,
        "is_new_arrival": True,
        "short_description": "Flowy kaftan in monsoon-inspired blue prints.",
        "description": (
            "An airy kaftan in hand-dyed blue cotton, inspired by Sri Lanka's monsoon season. "
            "One-size-fits-most silhouette with side pockets."
        ),
        "images": [
            ("https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80", True),
        ],
        "variants": [
            {"sku": "MK-ONE", "size": "One Size"},
        ],
        "stock": 20,
    },
    {
        "name": "Galle Fort Linen Blazer",
        "slug": "galle-fort-linen-blazer",
        "category": "men",
        "brand": "serendib-style",
        "base_price": "11500.00",
        "sale_price": "9800.00",
        "is_featured": True,
        "is_new_arrival": True,
        "short_description": "Lightweight linen blazer with heritage button details.",
        "description": (
            "A structured yet breathable linen blazer, perfect for smart-casual occasions. "
            "Features antique brass buttons inspired by Galle Fort's colonial architecture."
        ),
        "images": [
            ("https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&q=80", True),
        ],
        "variants": [
            {"sku": "GFL-M",  "size": "M"},
            {"sku": "GFL-L",  "size": "L"},
            {"sku": "GFL-XL", "size": "XL"},
        ],
        "stock": 8,
    },
    {
        "name": "Poya Moon Silk Scarf",
        "slug": "poya-moon-silk-scarf",
        "category": "women",
        "brand": "island-threads",
        "base_price": "2900.00",
        "sale_price": None,
        "is_featured": False,
        "is_new_arrival": True,
        "short_description": "Pure silk scarf with full-moon Poya print.",
        "description": (
            "A luxurious pure silk scarf featuring a hand-screen-printed design inspired by "
            "Sri Lanka's Poya (full moon) celebrations. A perfect gift or accessory."
        ),
        "images": [
            ("https://images.unsplash.com/photo-1601924921557-45e6dea0a157?w=600&q=80", True),
        ],
        "variants": [
            {"sku": "PMS-ONE", "size": "One Size"},
        ],
        "stock": 30,
    },
]


def download_image(url: str, filename: str) -> ContentFile:
    """Download an image from a URL and return a Django ContentFile."""
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=15) as response:
        data = response.read()
    return ContentFile(data, name=filename)


class Command(BaseCommand):
    help = "Seed the database with sample Sri Lankan fashion products."

    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING("🌿  Seeding catalog data…"))

        # ── Brands ────────────────────────────────────────────────────────
        brand_objs = {}
        for b in BRANDS:
            obj, created = Brand.objects.get_or_create(slug=b["slug"], defaults={"name": b["name"]})
            brand_objs[b["slug"]] = obj
            self.stdout.write(f"  {'✚' if created else '·'} Brand: {obj.name}")

        # ── Categories ────────────────────────────────────────────────────
        cat_objs = {}
        for c in CATEGORIES:
            obj, created = Category.objects.get_or_create(slug=c["slug"], defaults={"name": c["name"]})
            cat_objs[c["slug"]] = obj
            self.stdout.write(f"  {'✚' if created else '·'} Category: {obj.name}")

        # ── Size attribute ────────────────────────────────────────────────
        size_attr, _ = ProductAttribute.objects.get_or_create(
            slug="size", defaults={"name": "Size"}
        )

        # ── Products ──────────────────────────────────────────────────────
        for idx, p in enumerate(PRODUCTS, 1):
            product, created = Product.objects.get_or_create(
                slug=p["slug"],
                defaults={
                    "name":              p["name"],
                    "category":          cat_objs[p["category"]],
                    "brand":             brand_objs[p["brand"]],
                    "description":       p["description"],
                    "short_description": p["short_description"],
                    "base_price":        p["base_price"],
                    "sale_price":        p["sale_price"],
                    "is_featured":       p["is_featured"],
                    "is_new_arrival":    p["is_new_arrival"],
                    "is_active":         True,
                },
            )
            status = "✚ Created" if created else "· Exists "
            self.stdout.write(f"  {status}  [{idx:02d}] {product.name}")

            if not created:
                continue  # skip images/variants for already-seeded products

            # ── Images ────────────────────────────────────────────────────
            for img_url, is_primary in p["images"]:
                ext = "jpg"
                filename = f"{product.slug}-{is_primary}.{ext}"
                try:
                    self.stdout.write(f"           ↳ Downloading image …", ending="")
                    content = download_image(img_url, filename)
                    img_obj = ProductImage(
                        product=product,
                        alt_text=product.name,
                        is_primary=is_primary,
                        sort_order=0,
                    )
                    img_obj.image.save(filename, content, save=True)
                    self.stdout.write(self.style.SUCCESS(" ✓"))
                except Exception as exc:
                    self.stdout.write(self.style.WARNING(f" ✗ ({exc})"))

            # ── Variants & Stock ──────────────────────────────────────────
            for v in p["variants"]:
                size_val, _ = AttributeValue.objects.get_or_create(
                    attribute=size_attr,
                    value=v["size"],
                )
                variant, v_created = ProductVariant.objects.get_or_create(
                    sku=v["sku"],
                    defaults={"product": product, "is_active": True},
                )
                if v_created:
                    variant.attributes.add(size_val)

                # Create Stock record if missing
                Stock.objects.get_or_create(
                    variant=variant,
                    defaults={
                        "quantity":           p["stock"],
                        "reserved_quantity":  0,
                        "low_stock_threshold": 5,
                    },
                )

        self.stdout.write(self.style.SUCCESS("\n✅  Seeding complete!"))
