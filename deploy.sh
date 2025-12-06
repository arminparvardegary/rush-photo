#!/bin/bash

#######################################
# Rush Photo - Server Deployment Script
# Domain: rush.photos
# Server IP: 159.203.122.182
#######################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

DOMAIN="rush.photos"
EMAIL="admin@rush.photos"  # Change this to your email for SSL notifications
APP_DIR="/root/rush-photo"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Rush Photo Deployment Script${NC}"
echo -e "${BLUE}   Domain: ${DOMAIN}${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Please run as root (use sudo)${NC}"
    exit 1
fi

# Step 1: Update system
echo -e "${YELLOW}[1/8] Updating system packages...${NC}"
apt update && apt upgrade -y

# Step 2: Install Docker if not installed
echo -e "${YELLOW}[2/8] Installing Docker...${NC}"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    systemctl enable docker
    systemctl start docker
    echo -e "${GREEN}Docker installed successfully${NC}"
else
    echo -e "${GREEN}Docker already installed${NC}"
fi

# Step 3: Install Docker Compose if not installed
echo -e "${YELLOW}[3/8] Installing Docker Compose...${NC}"
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    apt install -y docker-compose-plugin
    echo -e "${GREEN}Docker Compose installed successfully${NC}"
else
    echo -e "${GREEN}Docker Compose already installed${NC}"
fi

# Step 4: Install Nginx
echo -e "${YELLOW}[4/8] Installing Nginx...${NC}"
if ! command -v nginx &> /dev/null; then
    apt install -y nginx
    systemctl enable nginx
    echo -e "${GREEN}Nginx installed successfully${NC}"
else
    echo -e "${GREEN}Nginx already installed${NC}"
fi

# Step 5: Install Certbot
echo -e "${YELLOW}[5/8] Installing Certbot...${NC}"
if ! command -v certbot &> /dev/null; then
    apt install -y certbot python3-certbot-nginx
    echo -e "${GREEN}Certbot installed successfully${NC}"
else
    echo -e "${GREEN}Certbot already installed${NC}"
fi

# Step 6: Setup application directory
echo -e "${YELLOW}[6/8] Setting up application...${NC}"

# Check if directory exists
if [ ! -d "${APP_DIR}" ]; then
    echo -e "${RED}Directory ${APP_DIR} not found${NC}"
    echo -e "${YELLOW}Please clone the repository first:${NC}"
    echo -e "${YELLOW}  git clone https://github.com/arminparvardegary/rush-photo.git ${APP_DIR}${NC}"
    exit 1
fi

cd ${APP_DIR}

# Pull latest changes
echo -e "${YELLOW}Pulling latest changes from GitHub...${NC}"
git pull origin main

# Step 7: Configure Nginx (temporary config for SSL)
echo -e "${YELLOW}[7/8] Configuring Nginx for SSL...${NC}"

# Create certbot webroot directory
mkdir -p /var/www/certbot

# Temporary nginx config for SSL certificate acquisition
cat > /etc/nginx/sites-available/rush-photo << 'NGINX_TEMP'
server {
    listen 80;
    listen [::]:80;
    server_name rush.photos www.rush.photos;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 200 'Rush Photo - Setting up SSL...';
        add_header Content-Type text/plain;
    }
}
NGINX_TEMP

# Enable site
ln -sf /etc/nginx/sites-available/rush-photo /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and reload nginx
nginx -t && systemctl reload nginx

# Step 8: Get SSL Certificate
echo -e "${YELLOW}[8/8] Obtaining SSL certificate...${NC}"

# Check if certificate already exists
if [ -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]; then
    echo -e "${GREEN}SSL certificate already exists${NC}"
else
    certbot certonly --webroot \
        -w /var/www/certbot \
        -d ${DOMAIN} \
        -d www.${DOMAIN} \
        --email ${EMAIL} \
        --agree-tos \
        --non-interactive
    echo -e "${GREEN}SSL certificate obtained successfully${NC}"
fi

# Apply full nginx config with SSL
cp ${APP_DIR}/nginx.conf /etc/nginx/sites-available/rush-photo
nginx -t && systemctl reload nginx

# Build and start Docker container
echo -e "${YELLOW}Building and starting Docker container...${NC}"
cd ${APP_DIR}
docker compose down 2>/dev/null || true
docker compose up -d --build

# Setup auto-renewal for SSL
echo -e "${YELLOW}Setting up SSL auto-renewal...${NC}"
(crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet --post-hook 'systemctl reload nginx'") | crontab -

# Setup firewall
echo -e "${YELLOW}Configuring firewall...${NC}"
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Your site is now live at:"
echo -e "${BLUE}https://${DOMAIN}${NC}"
echo ""
echo -e "Useful commands:"
echo -e "  View logs:     ${YELLOW}docker compose logs -f${NC}"
echo -e "  Restart app:   ${YELLOW}docker compose restart${NC}"
echo -e "  Stop app:      ${YELLOW}docker compose down${NC}"
echo -e "  Rebuild app:   ${YELLOW}docker compose up -d --build${NC}"
echo ""

