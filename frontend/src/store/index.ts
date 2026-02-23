import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import type { AuthState } from './authSlice';
import cartReducer from './cartSlice';
import type { CartState } from './cartSlice';
import uiReducer from './uiSlice';
import type { UIState } from './uiSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        ui: uiReducer,
    },
});

export interface RootState {
    auth: AuthState;
    cart: CartState;
    ui: UIState;
}

export type AppDispatch = typeof store.dispatch;
