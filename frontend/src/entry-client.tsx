import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { createReduxStore } from './store';
import App from './App';
import './styles/index.css';

declare global {
    interface Window {
        __PRELOADED_STATE__?: any;
    }
}

const preloadedState = window.__PRELOADED_STATE__;
delete window.__PRELOADED_STATE__;

const store = createReduxStore(preloadedState);

ReactDOM.hydrateRoot(
    document.getElementById('root')!,
    <React.StrictMode>
        <Provider store={store}>
            <HelmetProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.9rem',
                            borderRadius: 'var(--radius-sm)',
                        },
                    }}
                />
            </HelmetProvider>
        </Provider>
    </React.StrictMode>
);
