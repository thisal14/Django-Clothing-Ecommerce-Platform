# E-Commerce Application ("In Sri Lanka")

Welcome to the **"In Sri Lanka"** E-Commerce platform repository. This project is a full-stack, modern web application designed for selling premium, island-inspired clothing.

## 🏗️ System Architecture

This application uses a **Decoupled Client-Server (Headless) Architecture**. It consists of a completely independent backend API and a frontend Single Page Application (SPA). They communicate securely via JSON over HTTP.

### Backend (REST API)
The backend is built with Python and the **Django REST Framework (DRF)**. It acts as the data and business logic layer.
- **Framework:** Django 5.x + Django REST Framework
- **Architecture Pattern:** "Fat Models, Skinny Views" & RESTful API
- **Modular Apps:** The backend is divided into domain-specific applications (`accounts`, `catalog`, `orders`, etc.) for scalability.
- **Authentication:** JWT (JSON Web Tokens) securely stored in **HTTP-Only Cookies** to prevent XSS attacks.
- **Key Libraries:** `djangorestframework-simplejwt`, `django-environ` (for environment variables), `drf-spectacular` (for API documentation), `django-filter`.

### Frontend (SPA)
The frontend is a modern **React Component-Based Architecture**.
- **Framework:** React 18 + Vite
- **Language:** TypeScript for type safety across components and API responses.
- **State Management:** **Redux Toolkit** (Slices) for global state management (e.g., Cart, Authentication).
- **Routing:** React Router DOM.
- **API Client:** Axios (configured with interceptors to handle cookie-credentials and automatic token refresh).
- **Styling:** CSS variables and modular component styling.

---

## 🚀 Features

- **Product Catalog:** Browse products by category, view detailed product information, pricing, and stock status.
- **Authentication:** Secure user registration, login, and session management using HTTP-only JWTs.
- **Shopping Cart:** Add, update, and remove items from the cart. State is managed globally via Redux.
- **Checkout Flow:** Secure checkout process with transactional order creation to prevent data inconsistency (race conditions).
- **Inventory Management:** Basic stock tracking (in-stock, low-stock indicators).
- **Security:** CSRF protection, rate limiting on auth endpoints, and hardened cookie settings (`SameSite=Lax`, `Secure` in production).

---

## 🛠️ Project Structure

```text
├── backend/                  # Django REST API
│   ├── apps/                 # Domain-driven Django apps
│   │   ├── accounts/         # User auth & profiles
│   │   ├── catalog/          # Products, categories, brands
│   │   └── orders/           # Cart, checkout, order history
│   ├── config/               # Main Django project configuration
│   │   ├── settings/         # Split settings (base, dev, prod)
│   ├── media/                # User-uploaded files and product images
│   ├── manage.py             # Django CLI
│   └── requirements.txt      # Python dependencies
│
├── frontend/                 # React SPA
│   ├── src/
│   │   ├── api/              # Axios client and API service modules
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # View components (Home, Checkout, etc.)
│   │   ├── store/            # Redux Toolkit store and slices
│   │   └── types/            # TypeScript interfaces
│   ├── package.json          # Node dependencies
│   └── vite.config.ts        # Vite bundler configuration
└── README.md                 # This documentation
```

---

## 💻 Local Development Setup

### 1. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\Activate.ps1
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy `.env.example` to `.env` and configure your environment variables (Database, Secret Key).
5. Run migrations:
   ```bash
   python manage.py migrate
   ```
6. Start the development server:
   ```bash
   python manage.py runserver
   ```
   *The API will be available at `http://localhost:8000`*

### 2. Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The UI will be available at `http://localhost:5173`*

---

## 📚 API Documentation
When the backend server is running, the interactive Swagger/OpenAPI documentation is available at:
`http://localhost:8000/api/schema/swagger-ui/`
