#!/bin/bash
# ============================================
# Master Server Setup Script
# All Rush Projects with SSL
# ============================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║           🚀 Rush Projects - Master Setup                ║"
echo "║                                                          ║"
echo "║   📦 rush-box    → rushboxes.com     (port 3000)        ║"
echo "║   🎬 rush-video  → rush.video        (port 3001)        ║"
echo "║   📷 rush-photo  → rush.photos       (port 3002)        ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# ============================================
# 1. Install Dependencies
# ============================================
echo -e "${YELLOW}📦 Installing dependencies...${NC}"

# Update system
apt-get update -y

# Install Docker if not exists
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Installing Docker...${NC}"
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
fi

# Install Docker Compose if not exists
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${YELLOW}Installing Docker Compose...${NC}"
    apt-get install -y docker-compose-plugin
fi

# Install Nginx
if ! command -v nginx &> /dev/null; then
    echo -e "${YELLOW}Installing Nginx...${NC}"
    apt-get install -y nginx
fi

# Install Certbot
if ! command -v certbot &> /dev/null; then
    echo -e "${YELLOW}Installing Certbot...${NC}"
    apt-get install -y certbot python3-certbot-nginx
fi

echo -e "${GREEN}✅ Dependencies installed${NC}"

# ============================================
# 2. Clone/Update Projects
# ============================================
echo -e "${YELLOW}📥 Setting up projects...${NC}"

# Rush Box
if [ -d "/root/rush-box" ]; then
    echo -e "${BLUE}Updating rush-box...${NC}"
    cd /root/rush-box && git pull origin main
else
    echo -e "${BLUE}Cloning rush-box...${NC}"
    cd /root && git clone https://github.com/AminParvardegary/rush-box-main.git rush-box
fi

# Rush Video
if [ -d "/root/rush-video" ]; then
    echo -e "${BLUE}Updating rush-video...${NC}"
    cd /root/rush-video && git pull origin main
else
    echo -e "${BLUE}Cloning rush-video...${NC}"
    cd /root && git clone https://github.com/AminParvardegary/rush-video.git rush-video
fi

# Rush Photo
if [ -d "/root/rush-photo" ]; then
    echo -e "${BLUE}Updating rush-photo...${NC}"
    cd /root/rush-photo && git pull origin main
else
    echo -e "${BLUE}Cloning rush-photo...${NC}"
    cd /root && git clone https://github.com/arminparvardegary/rush-photo.git rush-photo
fi

echo -e "${GREEN}✅ Projects ready${NC}"

# ============================================
# 3. Create Nginx Config
# ============================================
echo -e "${YELLOW}🔧 Configuring Nginx...${NC}"

# Backup existing config
cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup 2>/dev/null || true

# Create main nginx config
cat > /etc/nginx/nginx.conf << 'NGINX_MAIN'
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
    worker_connections 1024;
}

http {
    sendfile on;
    tcp_nopush on;
    types_hash_max_size 2048;
    client_max_body_size 100M;

    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;

    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml application/atom+xml image/svg+xml;

    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
NGINX_MAIN

# Remove default site
rm -f /etc/nginx/sites-enabled/default

# ============================================
# Rush Box - rushboxes.com (Port 3000)
# ============================================
cat > /etc/nginx/sites-available/rush-box << 'RUSHBOX'
server {
    listen 80;
    listen [::]:80;
    server_name rushboxes.com www.rushboxes.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name rushboxes.com www.rushboxes.com;

    ssl_certificate /etc/letsencrypt/live/rushboxes.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/rushboxes.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
}
RUSHBOX

# ============================================
# Rush Video - rush.video (Port 3001)
# ============================================
cat > /etc/nginx/sites-available/rush-video << 'RUSHVIDEO'
server {
    listen 80;
    listen [::]:80;
    server_name rush.video www.rush.video;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name rush.video www.rush.video;

    ssl_certificate /etc/letsencrypt/live/rush.video/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/rush.video/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
}
RUSHVIDEO

# ============================================
# Rush Photo - rush.photos (Port 3002)
# ============================================
cat > /etc/nginx/sites-available/rush-photo << 'RUSHPHOTO'
server {
    listen 80;
    listen [::]:80;
    server_name rush.photos www.rush.photos;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name rush.photos www.rush.photos;

    ssl_certificate /etc/letsencrypt/live/rush.photos/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/rush.photos/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
}
RUSHPHOTO

# Enable sites
ln -sf /etc/nginx/sites-available/rush-box /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/rush-video /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/rush-photo /etc/nginx/sites-enabled/

# Create certbot webroot
mkdir -p /var/www/certbot

echo -e "${GREEN}✅ Nginx configured${NC}"

# ============================================
# 4. Get SSL Certificates
# ============================================
echo -e "${YELLOW}🔒 Getting SSL certificates...${NC}"

# Stop nginx temporarily for standalone mode
systemctl stop nginx 2>/dev/null || true

# Get certificates
certbot certonly --standalone -d rushboxes.com -d www.rushboxes.com --non-interactive --agree-tos --email admin@rushboxes.com || echo "rushboxes.com SSL exists or failed"

certbot certonly --standalone -d rush.video -d www.rush.video --non-interactive --agree-tos --email admin@rush.video || echo "rush.video SSL exists or failed"

certbot certonly --standalone -d rush.photos -d www.rush.photos --non-interactive --agree-tos --email admin@rush.photos || echo "rush.photos SSL exists or failed"

echo -e "${GREEN}✅ SSL certificates ready${NC}"

# ============================================
# 5. Build and Start All Projects
# ============================================
echo -e "${YELLOW}🐳 Starting Docker containers...${NC}"

# Rush Box
echo -e "${BLUE}Starting rush-box...${NC}"
cd /root/rush-box
docker compose down 2>/dev/null || true
docker compose up -d --build

# Rush Video
echo -e "${BLUE}Starting rush-video...${NC}"
cd /root/rush-video
docker compose down 2>/dev/null || true
docker compose up -d --build

# Rush Photo
echo -e "${BLUE}Starting rush-photo...${NC}"
cd /root/rush-photo
docker compose down 2>/dev/null || true
docker compose up -d --build

echo -e "${GREEN}✅ All containers started${NC}"

# ============================================
# 6. Start Nginx
# ============================================
echo -e "${YELLOW}🌐 Starting Nginx...${NC}"

# Test config
nginx -t

# Start nginx
systemctl start nginx
systemctl enable nginx

echo -e "${GREEN}✅ Nginx started${NC}"

# ============================================
# 7. Wait and Verify
# ============================================
echo -e "${YELLOW}⏳ Waiting for services to be ready...${NC}"
sleep 10

# ============================================
# 8. Health Check
# ============================================
echo ""
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}                    🏥 Health Check                          ${NC}"
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"

check_service() {
    local name=$1
    local port=$2
    local domain=$3
    
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:$port 2>/dev/null | grep -qE "200|301|302"; then
        echo -e "${GREEN}✅ $name (port $port) - Running${NC}"
    else
        echo -e "${RED}❌ $name (port $port) - Not responding${NC}"
    fi
}

check_service "rush-box" 3000 "rushboxes.com"
check_service "rush-video" 3001 "rush.video"
check_service "rush-photo" 3002 "rush.photos"

# ============================================
# 9. Show Docker Status
# ============================================
echo ""
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}                  🐳 Docker Containers                       ${NC}"
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# ============================================
# 10. Final Summary
# ============================================
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              🎉 Setup Complete!                          ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}🌐 Your websites:${NC}"
echo ""
echo -e "   📦 Rush Box:   ${GREEN}https://rushboxes.com${NC}"
echo -e "   🎬 Rush Video: ${GREEN}https://rush.video${NC}"
echo -e "   📷 Rush Photo: ${GREEN}https://rush.photos${NC}"
echo ""
echo -e "${YELLOW}📌 Useful commands:${NC}"
echo "   docker ps                     - View running containers"
echo "   docker logs <container>       - View container logs"
echo "   systemctl status nginx        - Check nginx status"
echo "   certbot renew                 - Renew SSL certificates"
echo ""

