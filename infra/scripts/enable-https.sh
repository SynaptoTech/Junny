#!/bin/bash

# HTTPS para Junny — executar no servidor onde rodam Docker + Nginx.

echo "Habilitando HTTPS para Junny..."

if ! command -v certbot &> /dev/null; then
    echo "Instalando certbot..."
    apt-get update
    apt-get install -y certbot python3-certbot-nginx
fi

echo "Obtendo certificados SSL..."
certbot --nginx \
  -d junny.dev.br \
  -d www.junny.dev.br \
  -d api.junny.dev.br \
  --non-interactive --agree-tos \
  --email quintino@synapto.com.br

echo "Configurando renovação automática..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

echo "HTTPS habilitado para Junny."
