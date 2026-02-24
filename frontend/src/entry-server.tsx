import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Provider } from 'react-redux';
import { HelmetProvider, HelmetServerState } from 'react-helmet-async';
import { createReduxStore } from './store';
import { setSSRData } from './store/ssrSlice';
import { catalogApi } from './api';
import App from './App';

export async function render(url: string) {
    const store = createReduxStore();
    const helmetContext: { helmet?: HelmetServerState } = {};

    const path = url.split('?')[0];
    const searchParams = new URLSearchParams(url.split('?')[1] || '');

    try {
        if (path === '/') {
            const [featRes, newRes] = await Promise.all([
                catalogApi.getProducts({ is_featured: true, page_size: 4 }),
                catalogApi.getProducts({ is_new_arrival: true, page_size: 4 })
            ]);
            store.dispatch(setSSRData({ key: 'home', data: { featured: featRes.data.results, newArrivals: newRes.data.results } }));
        } else if (path === '/products') {
            const params: Record<string, string | number | boolean> = { page: 1 };
            searchParams.forEach((val, key) => {
                if (key !== 'page') params[key] = val;
            });
            const { data } = await catalogApi.getProducts(params);
            store.dispatch(setSSRData({ key: 'productListing', data }));
        } else if (path.startsWith('/products/')) {
            const slug = path.replace('/products/', '');
            const { data } = await catalogApi.getProductBySlug(slug);
            store.dispatch(setSSRData({ key: `productDetail-${slug}`, data }));
        }
    } catch (e) {
        console.error("SSR API Fetch error:", e);
    }

    const appHtml = ReactDOMServer.renderToString(
        <React.StrictMode>
            <Provider store={store}>
                <HelmetProvider context={helmetContext}>
                    <StaticRouter location={url}>
                        <App />
                    </StaticRouter>
                </HelmetProvider>
            </Provider>
        </React.StrictMode>
    );

    const helmet = helmetContext.helmet;
    const preloadedState = store.getState();

    return { appHtml, preloadedState, helmet };
}
