import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import compression from 'compression';
import sirv from 'sirv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 4000;
const base = process.env.BASE || '/';

async function createServer() {
    const app = express();
    let vite;

    if (!isProduction) {
        const { createServer: createViteServer } = await import('vite');
        vite = await createViteServer({
            server: { middlewareMode: true },
            appType: 'custom',
            base
        });
        app.use(vite.middlewares);
    } else {
        app.use(compression());
        app.use(base, sirv('./dist/client', { extensions: [] }));
    }

    // Serve HTML
    app.use(async (req, res, next) => {
        try {
            const url = req.originalUrl.replace(base, '');

            let template;
            let render;

            if (!isProduction) {
                // Always read fresh template in dev
                template = await fs.readFile(path.resolve(__dirname, 'index.html'), 'utf-8');
                template = await vite.transformIndexHtml(url, template);
                const entry = await vite.ssrLoadModule('/src/entry-server.tsx');
                render = entry.render;
            } else {
                template = await fs.readFile(path.resolve(__dirname, 'dist/client/index.html'), 'utf-8');
                const entry = await import('./dist/server/entry-server.js');
                render = entry.render;
            }

            const { appHtml, preloadedState, helmet } = await render(url);

            let html = template.replace(`<!--app-html-->`, appHtml);

            let preloadedStateString = `<script>window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}</script>`;
            html = html.replace(`<!--preload-state-->`, preloadedStateString);

            if (helmet) {
                let headTags = `
                    ${helmet.title.toString()}
                    ${helmet.priority.toString()}
                    ${helmet.meta.toString()}
                    ${helmet.link.toString()}
                    ${helmet.script.toString()}
                `;
                html = html.replace(`<!--app-head-->`, headTags);
            } else {
                html = html.replace(`<!--app-head-->`, "");
            }

            res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
        } catch (e) {
            vite?.ssrFixStacktrace(e);
            console.error(e.stack);
            await fs.writeFile('request_error.log', String(e.stack));
            res.status(500).end(e.stack);
        }
    });

    return app;
}

createServer().then((app) => {
    app.listen(port, () => {
        console.log(`Server started at http://localhost:${port}`);
    });
});
