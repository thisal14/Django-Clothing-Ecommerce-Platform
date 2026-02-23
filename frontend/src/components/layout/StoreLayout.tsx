import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from '@/components/cart/CartDrawer';

export default function StoreLayout() {
    return (
        <>
            <Navbar />
            <CartDrawer />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    );
}
