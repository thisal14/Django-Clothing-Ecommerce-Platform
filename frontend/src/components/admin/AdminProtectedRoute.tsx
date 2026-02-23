import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function AdminProtectedRoute() {
    const { isAuthenticated, user, isLoading } = useSelector((state: RootState) => state.auth);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isAuthenticated || !user || (user.role !== 'ADMIN' && user.role !== 'STAFF')) {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
}
