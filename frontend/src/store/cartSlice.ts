import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { cartApi } from '@/api';
import type { Cart } from '@/types';

export interface CartState {
    cart: Cart | null;
    isLoading: boolean;
    isDrawerOpen: boolean;
}

const initialState: CartState = {
    cart: null,
    isLoading: false,
    isDrawerOpen: false,
};

export const fetchCartThunk = createAsyncThunk('cart/fetch', async () => {
    const { data } = await cartApi.getCart();
    return data;
});

export const addToCartThunk = createAsyncThunk(
    'cart/addItem',
    async ({ variant_id, quantity }: { variant_id: string; quantity: number }) => {
        const { data } = await cartApi.addItem(variant_id, quantity);
        return data;
    }
);

export const updateCartItemThunk = createAsyncThunk(
    'cart/updateItem',
    async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
        const { data } = await cartApi.updateItem(itemId, quantity);
        return data;
    }
);

export const removeCartItemThunk = createAsyncThunk(
    'cart/removeItem',
    async (itemId: string) => {
        const { data } = await cartApi.removeItem(itemId);
        return data;
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        openDrawer(state) { state.isDrawerOpen = true; },
        closeDrawer(state) { state.isDrawerOpen = false; },
        setCart(state, action: PayloadAction<Cart>) { state.cart = action.payload; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCartThunk.pending, (state) => { state.isLoading = true; })
            .addCase(fetchCartThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cart = action.payload;
            })
            .addCase(addToCartThunk.fulfilled, (state, action) => {
                state.cart = action.payload;
                state.isDrawerOpen = true;
            })
            .addCase(updateCartItemThunk.fulfilled, (state, action) => {
                state.cart = action.payload;
            })
            .addCase(removeCartItemThunk.fulfilled, (state, action) => {
                state.cart = action.payload;
            });
    },
});

export const { openDrawer, closeDrawer, setCart } = cartSlice.actions;
export default cartSlice.reducer;
