import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProfileThunk } from '@/store/authSlice';
import { fetchCartThunk } from '@/store/cartSlice';
import StoreLayout from '@/components/layout/StoreLayout';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';

// ── Lazy-loaded pages ──────────────────────────────────────
const Home = lazy(() => import('@/pages/Home'));
const ProductListing = lazy(() => import('@/pages/ProductListing'));
const ProductDetail = lazy(() => import('@/pages/ProductDetail'));
const Cart = lazy(() => import('@/pages/Cart'));
const Checkout = lazy(() => import('@/pages/Checkout'));
const OrderConfirmation = lazy(() => import('@/pages/OrderConfirmation'));
const OrderHistory = lazy(() => import('@/pages/OrderHistory'));
const Profile = lazy(() => import('@/pages/Profile'));
const Login = lazy(() => import('@/pages/auth/Login'));
const Register = lazy(() => import('@/pages/auth/Register'));
const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('@/pages/admin/Products'));
const AdminOrders = lazy(() => import('@/pages/admin/Orders'));
const AdminOrderDetail = lazy(() => import('@/pages/admin/OrderDetail'));
const AdminUsers = lazy(() => import('@/pages/admin/Users'));
const AdminProductForm = lazy(() => import('@/pages/admin/ProductForm'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// ── Page Loading Fallback ──────────────────────────────────
const PageLoader = () => (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
            <div className="skeleton" style={{ width: 120, height: 4, borderRadius: 2, margin: '0 auto' }} />
        </div>
    </div>
);

// ── Protected Route ────────────────────────────────────────
const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) => {
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (adminOnly && user?.role !== 'ADMIN' && user?.role !== 'STAFF') {
        return <Navigate to="/" replace />;
    }
    return <>{children}</>;
};

export default function App() {
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchCartThunk());
            dispatch(fetchProfileThunk());
        }
    }, [dispatch, isAuthenticated]);

    return (
        <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    {/* Store Routes */}
                    <Route element={<StoreLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/products" element={<ProductListing />} />
                        <Route path="/products/:slug" element={<ProductDetail />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                        <Route path="/order/:id/thank-you" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
                        <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="*" element={<NotFound />} />
                    </Route>

                    {/* Admin Routes */}
                    <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route element={<AdminProtectedRoute />}>
                        <Route element={<AdminLayout />}>
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                            <Route path="/admin/products" element={<AdminProducts />} />
                            <Route path="/admin/products/new" element={<AdminProductForm />} />
                            <Route path="/admin/products/:slug/edit" element={<AdminProductForm />} />
                            <Route path="/admin/orders" element={<AdminOrders />} />
                            <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
                            <Route path="/admin/users" element={<AdminUsers />} />
                        </Route>
                    </Route>
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}
