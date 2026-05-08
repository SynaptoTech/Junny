import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine, isMainModule } from '@angular/ssr/node';
import express from 'express';
import fs from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import bootstrap from './main.server';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const indexHtml = join(serverDistFolder, 'index.server.html');

const app = express();
const commonEngine = new CommonEngine();

function resolveDocsDistFolder(): string | null {
  // When running `apps/web` SSR locally, we want `/docs/*` to be served from the VitePress build.
  // In production this is typically done by nginx/reverse-proxy; this makes local SSR parity easy.
  const candidates = [
    // monorepo root executions
    resolve(process.cwd(), 'apps/docs/.vitepress/dist'),
    resolve(process.cwd(), 'apps/docs/dist'),
    // running with cwd = `apps/web`
    resolve(process.cwd(), '../docs/.vitepress/dist'),
    resolve(process.cwd(), '../docs/dist'),
    // running with cwd = `apps/web/dist/...`
    resolve(process.cwd(), '../../docs/.vitepress/dist'),
    resolve(process.cwd(), '../../docs/dist'),
    // relative to `apps/web/dist/server`
    resolve(serverDistFolder, '../../../docs/.vitepress/dist'),
    resolve(serverDistFolder, '../../../docs/dist'),
    // some build setups nest one more level
    resolve(serverDistFolder, '../../../../apps/docs/.vitepress/dist'),
    resolve(serverDistFolder, '../../../../apps/docs/dist'),
  ];

  for (const folder of candidates) {
    try {
      if (fs.existsSync(folder) && fs.statSync(folder).isDirectory()) return folder;
    } catch {
      // ignore
    }
  }
  return null;
}

/** MD60 — headers de segurança para SSR Node (Docker prod usa nginx estático). */
app.use((_req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  );
  next();
});

// Serve VitePress docs (if present) under `/docs/*`.
const docsDistFolder = resolveDocsDistFolder();
if (docsDistFolder) {
  app.use(
    '/docs',
    express.static(docsDistFolder, {
      maxAge: '1h',
      index: 'index.html',
    }),
  );
}

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.get(
  '**',
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html'
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.get('**', (req, res, next) => {
  const { protocol, originalUrl, baseUrl, headers } = req;

  commonEngine
    .render({
      bootstrap,
      documentFilePath: indexHtml,
      url: `${protocol}://${headers.host}${originalUrl}`,
      publicPath: browserDistFolder,
      providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
    })
    .then((html) => res.send(html))
    .catch((err) => next(err));
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export default app;
