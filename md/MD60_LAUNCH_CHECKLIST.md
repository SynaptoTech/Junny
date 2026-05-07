# MD60 — Checklist operacional (pré-deploy)

Use before tagging a release of **landing v2**. Aligns with [MD60_JUNNY_LANDING_FINAL_ASSEMBLY_PRODUCTION_CHECKLIST.md](./MD60_JUNNY_LANDING_FINAL_ASSEMBLY_PRODUCTION_CHECKLIST.md).

## Build local

- [ ] `npm run build:web` (sem erros)
- [ ] `npm run build:docs` (sem erros)

## Lighthouse (Chrome, modo anónimo, produção ou build estático servido)

- [ ] Performance ≥ 95 (meta do produto; ajustar se deploy/CDN não estiver configurado)
- [ ] Accessibility ≥ 95
- [ ] Best Practices ≥ 95
- [ ] SEO = 100

## Mobile / UX

- [ ] iPhone Safari (ou simulador): navbar, hero, CTAs, secções, footer
- [ ] Android Chrome: idem
- [ ] Teclado: skip link → foco no conteúdo; tab na navbar e selector de idioma

## SEO / social

- [ ] `https://junny.dev.br/` `robots.txt` e `sitemap.xml`
- [ ] Pré-visualização: Open Graph / X / LinkedIn / WhatsApp (debugger ou envio de teste)
- [ ] `hreflang` (EN, PT-BR, ES, x-default) na `index.html`

## Segurança / headers (produção)

- [ ] Resposta com `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` (Nginx + `public/_headers` onde aplicável)
- [ ] CSP: afinar por ambiente se necessário (Angular + fonts + JSON-LD)

## Conteúdo e marca

- [ ] Logo e favicon corretos em `apps/web/public`
- [ ] Links GitHub, Docs (`/docs/`), Roadmap, CTAs válidos
- [ ] Copy enterprise: elegante, não corporativo pesado; open source em primeiro plano

## Internacionalização

- [ ] EN como padrão (`/`, conteúdo)
- [ ] `/en`, `/pt-br`, `/es` a carregar landing; `<html lang>` coerente ao navegar

## Hospedagem (quando aplicável)

- [ ] SSL e domínio canónico
- [ ] Brotli/gzip + cache de assets com hash
- [ ] CDN / Cloudflare: cache e regras alinhadas com `immutable` para JS/CSS

## Pós-deploy

- [ ] Teste manual dos passos do onboarding (workspace → docs → install → primeiro pedido)
- [ ] Screenshots ou GIF para README/Social (hero, integrações, observability) — quando existirem assets
