import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import cartReducer from './cartSlice';
import uiReducer from './uiSlice';
import ssrReducer from './ssrSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    cart: cartReducer,
    ui: uiReducer,
    ssr: ssrReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export function createReduxStore(preloadedState?: Partial<RootState>) {
    return configureStore({
        reducer: rootReducer,
        preloadedState,
    });
}

const dummyStore = createReduxStore();

export type AppDispatch = typeof dummyStore.dispatch;
