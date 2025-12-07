#!/bin/bash

#######################################
# Rush Photo - One-Click Deployment
# Domain: rush.photos
# Server: 159.203.122.182
#######################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

DOMAIN="rush.photos"
EMAIL="admin@rush.photos"
APP_DIR="/root/rush-photo"
REPO_URL="https://github.com/arminparvardegary/rush-photo.git"

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════╗"
echo "║     Rush Photo Deployment Script      ║"
echo "║     Domain: ${DOMAIN}               ║"
echo "╚═══════════════════════════════════════╝"
echo -e "${NC}"

# Check root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}❌ Please run as root${NC}"
    exit 1
fi

# 1. Update System
echo -e "\n${YELLOW}[1/7] 📦 Updating system...${NC}"
apt update -qq && apt upgrade -y -qq
apt install -y -qq git curl wget

# 2. Install Docker
echo -e "\n${YELLOW}[2/7] 🐳 Installing Docker...${NC}"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
    echo -e "${GREEN}✓ Docker installed${NC}"
else
    echo -e "${GREEN}✓ Docker already installed${NC}"
fi

# 3. Install Docker Compose
echo -e "\n${YELLOW}[3/7] 🐳 Installing Docker Compose...${NC}"
if ! docker compose version &> /dev/null; then
    apt install -y -qq docker-compose-plugin
    echo -e "${GREEN}✓ Docker Compose installed${NC}"
else
    echo -e "${GREEN}✓ Docker Compose already installed${NC}"
fi

# 4. Install Nginx & Certbot
echo -e "\n${YELLOW}[4/7] 🌐 Installing Nginx & Certbot...${NC}"
apt install -y -qq nginx certbot python3-certbot-nginx
systemctl enable nginx
echo -e "${GREEN}✓ Nginx & Certbot installed${NC}"

# 5. Clone/Pull Repository
echo -e "\n${YELLOW}[5/7] 📥 Setting up application...${NC}"
if [ -d "${APP_DIR}" ]; then
    cd ${APP_DIR}
    git pull origin main
    echo -e "${GREEN}✓ Repository updated${NC}"
else
    git clone ${REPO_URL} ${APP_DIR}
    cd ${APP_DIR}
    echo -e "${GREEN}✓ Repository cloned${NC}"
fi

# 6. Configure Nginx & SSL
echo -e "\n${YELLOW}[6/7] 🔒 Configuring SSL...${NC}"

# Create webroot for certbot
mkdir -p /var/www/certbot

# Initial nginx config (HTTP only for SSL challenge)
cat > /etc/nginx/sites-available/${DOMAIN} << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name rush.photos www.rush.photos;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 200 'Setting up...';
        add_header Content-Type text/plain;
    }
}
EOF

ln -sf /etc/nginx/sites-available/${DOMAIN} /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# Get SSL certificate
if [ ! -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]; then
    certbot certonly --webroot \
        -w /var/www/certbot \
        -d ${DOMAIN} \
        -d www.${DOMAIN} \
        --email ${EMAIL} \
        --agree-tos \
        --non-interactive
    echo -e "${GREEN}✓ SSL certificate obtained${NC}"
else
    echo -e "${GREEN}✓ SSL certificate exists${NC}"
fi

# Full nginx config with SSL
cat > /etc/nginx/sites-available/${DOMAIN} << 'EOF'
upstream rush_app {
    server 127.0.0.1:3000;
    keepalive 64;
}

# HTTP -> HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name rush.photos www.rush.photos;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name rush.photos www.rush.photos;

    # SSL
    ssl_certificate /etc/letsencrypt/live/rush.photos/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/rush.photos/privkey.pem;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;

    # Proxy to Next.js
    location / {
        proxy_pass http://rush_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache static files
    location /_next/static {
        proxy_pass http://rush_app;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
EOF

nginx -t && systemctl reload nginx
echo -e "${GREEN}✓ Nginx configured with SSL${NC}"

# 7. Build & Start Docker
echo -e "\n${YELLOW}[7/7] 🚀 Starting application...${NC}"
cd ${APP_DIR}
docker compose down 2>/dev/null || true
docker compose up -d --build

# Setup SSL auto-renewal
(crontab -l 2>/dev/null | grep -v certbot; echo "0 3 * * * certbot renew --quiet --post-hook 'systemctl reload nginx'") | crontab -

# Setup Firewall
ufw allow 22/tcp >/dev/null 2>&1
ufw allow 80/tcp >/dev/null 2>&1
ufw allow 443/tcp >/dev/null 2>&1
ufw --force enable >/dev/null 2>&1

# Wait for app to start
echo -e "\n${YELLOW}⏳ Waiting for app to start...${NC}"
sleep 10

# Check if running
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
    echo -e "${GREEN}✓ Application is running${NC}"
else
    echo -e "${YELLOW}⚠ App may still be starting, check logs: docker compose logs -f${NC}"
fi

echo -e "\n${GREEN}"
echo "╔═══════════════════════════════════════╗"
echo "║       🎉 Deployment Complete!         ║"
echo "╠═══════════════════════════════════════╣"
echo "║  Site: https://rush.photos            ║"
echo "╚═══════════════════════════════════════╝"
echo -e "${NC}"

echo -e "Commands:"
echo -e "  ${YELLOW}docker compose logs -f${NC}     - View logs"
echo -e "  ${YELLOW}docker compose restart${NC}    - Restart"
echo -e "  ${YELLOW}docker compose up -d --build${NC} - Rebuild"
echo ""
