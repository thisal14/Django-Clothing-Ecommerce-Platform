import { createSlice } from '@reduxjs/toolkit';

export interface UIState {
    mobileMenuOpen: boolean;
    searchOpen: boolean;
}

const initialState: UIState = { mobileMenuOpen: false, searchOpen: false };

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleMobileMenu(state) { state.mobileMenuOpen = !state.mobileMenuOpen; },
        closeMobileMenu(state) { state.mobileMenuOpen = false; },
        toggleSearch(state) { state.searchOpen = !state.searchOpen; },
        closeSearch(state) { state.searchOpen = false; },
    },
});

export const { toggleMobileMenu, closeMobileMenu, toggleSearch, closeSearch } = uiSlice.actions;
export default uiSlice.reducer;
