# 🌴 In Sri Lanka — E-Commerce Platform

Welcome to the **"In Sri Lanka"** E-Commerce platform — a full-stack, modern web application for selling premium, island-inspired clothing and accessories.

---

## 🏗️ System Architecture

This application uses a **Decoupled Client-Server (Headless) Architecture**. The backend REST API and the frontend SPA are completely independent and communicate securely via JSON over HTTP.

### Backend (REST API)
Built with Python and **Django REST Framework (DRF)** as the data and business logic layer.

| Aspect | Detail |
|---|---|
| **Framework** | Django 5.x + Django REST Framework |
| **Architecture** | Domain-Driven Design — "Fat Models, Skinny Views" |
| **Authentication** | JWT stored in **HTTP-Only Cookies** (XSS-safe) |
| **Modular Apps** | `accounts`, `catalog`, `cart`, `orders`, `payments`, `shipping`, `promotions`, `analytics` |
| **Key Libraries** | `simplejwt`, `django-environ`, `drf-spectacular`, `django-filter`, `django-ratelimit` |

### Frontend (SPA)
A modern **React Component-Based Architecture**.

| Aspect | Detail |
|---|---|
| **Framework** | React 18 + Vite |
| **Language** | TypeScript |
| **State Management** | Redux Toolkit (auth, cart slices) |
| **Routing** | React Router DOM v6 |
| **API Client** | Axios with interceptors (auto token refresh) |
| **Styling** | Custom CSS variable design system + Tailwind CSS v4 |

---

## 🚀 Features

### Customer-Facing Store
- 🛍️ **Product Catalog** — Browse products by category with detailed views, pricing, and stock status.
- 🔐 **Authentication** — Secure registration, login, and session management via HTTP-only JWTs.
- 🛒 **Shopping Cart** — Persistent cart state managed globally via Redux Toolkit.
- 💳 **Checkout Flow** — Transactional order creation with shipping method selection.
- 📦 **Order History** — View past orders and track their status.
- 👤 **Profile Management** — Edit personal details and manage saved delivery addresses.

### Admin Portal (`/admin`)
- 🔒 **Dedicated Admin Login** — Isolated portal at `/admin/login` with role-based access control (ADMIN / STAFF roles only).
- 📊 **Dashboard** — Overview metrics (Revenue, Orders, Products, Customers).
- 📦 **Product Management** — Full CRUD: list, create, edit, and delete products.
- 🧾 **Order Management** — View all orders and update their fulfilment status inline.
- 🖼️ **Platform-Themed UI** — Admin interface uses the same design system and CSS variables as the customer store for visual consistency.

### Security
- CSRF protection on all mutating endpoints.
- Rate limiting on authentication endpoints (10 login attempts/min).
- Hardened cookie settings (`HttpOnly`, `SameSite=Lax`, `Secure` in production).
- `AdminProtectedRoute` ensures only staff/admin roles can access the `/admin` routes.

---

## 🗂️ Project Structure

```text
Ecommerce-App/
├── backend/                        # Django REST API
│   ├── apps/
│   │   ├── accounts/               # Users, auth, JWT, addresses
│   │   ├── catalog/                # Products, categories, brands
│   │   ├── cart/                   # Shopping cart & items
│   │   ├── orders/                 # Checkout & order history
│   │   ├── payments/               # Payment initiation
│   │   ├── shipping/               # Shipping methods
│   │   ├── promotions/             # Coupons & discounts
│   │   └── analytics/              # Admin dashboard metrics
│   ├── config/
│   │   ├── settings/               # Split settings (base, dev, prod)
│   │   └── urls.py
│   ├── media/                      # User-uploaded files
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/                       # React SPA
    ├── src/
    │   ├── api/                    # Axios client + service modules
    │   ├── components/
    │   │   ├── admin/              # AdminLayout, AdminProtectedRoute
    │   │   └── layout/             # StoreLayout, Navbar, Footer
    │   ├── pages/
    │   │   ├── admin/              # Dashboard, Products, Orders, AdminLogin
    │   │   ├── auth/               # Login, Register
    │   │   └── ...                 # Home, ProductListing, Cart, Checkout, etc.
    │   ├── store/                  # Redux Toolkit slices (auth, cart)
    │   ├── styles/                 # Global CSS design system (index.css)
    │   └── types/                  # TypeScript interfaces
    ├── vite.config.ts
    └── package.json
```

---

## 💻 Local Development Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL (or SQLite for quick local dev)

### 1. Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Create and activate virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1    # Windows
# source venv/bin/activate     # macOS/Linux

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment
cp .env.example .env
# Edit .env with your DB credentials and secret key

# 5. Run migrations
python manage.py migrate

# 6. Create an admin user
python manage.py createsuperuser

# 7. Start the server
python manage.py runserver
```

> API available at: `http://localhost:8000`

### 2. Frontend Setup

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Start the Vite dev server
npm run dev
```

> UI available at: `http://localhost:5173`

---

## 🔑 Admin Portal Access

| URL | Purpose |
|---|---|
| `http://localhost:5173/admin/login` | Admin sign-in page |
| `http://localhost:5173/admin/dashboard` | Main admin dashboard |
| `http://localhost:5173/admin/products` | Product management |
| `http://localhost:5173/admin/orders` | Order management |

To access the admin portal, your user account must have `is_staff=True` or the role `ADMIN`/`STAFF` in the database. You can promote any user via the Django shell:

```bash
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
u = User.objects.get(email='you@example.com')
u.is_staff = True
u.role = 'ADMIN'
u.save()
print('Done')
"
```

---

## 📚 API Documentation

With the backend running, interactive Swagger/OpenAPI docs are available at:

`http://localhost:8000/api/schema/swagger-ui/`

---

## 🧪 Tech Stack Summary

| Layer | Technology |
|---|---|
| Backend Framework | Django 5 + DRF |
| Auth | JWT (simplejwt) in HTTP-Only Cookies |
| Frontend Framework | React 18 + TypeScript + Vite |
| State Management | Redux Toolkit |
| Styling | Custom CSS vars + Tailwind CSS v4 |
| API Client | Axios |
| Database | PostgreSQL (SQLite for dev) |
