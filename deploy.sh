#!/bin/bash
# ============================================
# Rush Photo - Independent Deployment Script
# Domain: rush.photos | Port: 3002
# ============================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     📷 Rush Photo Deployment           ║${NC}"
echo -e "${BLUE}║     Domain: rush.photos                ║${NC}"
echo -e "${BLUE}║     Port: 3002                         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"

# Config
PROJECT_NAME="rush-photo"
CONTAINER_NAME="rush-photo-app"
PROJECT_DIR="/root/rush-photo"
PORT="3002"
DOMAIN="rush.photos"
NGINX_NETWORK="rush-box_rushbox-network"

# Check if running on server
if [ "$(pwd)" != "$PROJECT_DIR" ] && [ -d "$PROJECT_DIR" ]; then
    cd $PROJECT_DIR
    echo -e "${YELLOW}📂 Changed to: $PROJECT_DIR${NC}"
fi

# 1. Pull latest code
echo -e "${YELLOW}📥 Pulling latest code...${NC}"
git pull origin main 2>/dev/null || echo "Not a git repo or no remote"

# 2. Stop existing container (if any)
echo -e "${YELLOW}🛑 Stopping existing container...${NC}"
docker compose down 2>/dev/null || true
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

# 3. Build and start
echo -e "${YELLOW}🔨 Building and starting...${NC}"
docker compose up --build -d

# 4. Wait for container to be healthy
echo -e "${YELLOW}⏳ Waiting for container to start...${NC}"
sleep 5

# 5. Connect to nginx network (not needed since using host.docker.internal)
# But keeping for consistency
echo -e "${YELLOW}🔗 Network check...${NC}"
# docker network connect $NGINX_NETWORK $CONTAINER_NAME 2>/dev/null || echo "Using host network"

# 6. Health check
echo -e "${YELLOW}🏥 Running health check...${NC}"
MAX_RETRIES=10
RETRY=0
while [ $RETRY -lt $MAX_RETRIES ]; do
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT | grep -q "200\|301\|302"; then
        echo -e "${GREEN}✅ App is responding!${NC}"
        break
    fi
    RETRY=$((RETRY + 1))
    echo "Waiting... ($RETRY/$MAX_RETRIES)"
    sleep 3
done

if [ $RETRY -eq $MAX_RETRIES ]; then
    echo -e "${RED}⚠️  App might not be responding properly${NC}"
fi

# 7. Check SSL (if nginx is running)
if docker ps | grep -q "rushbox-nginx"; then
    echo -e "${YELLOW}🔒 Checking SSL...${NC}"
    if curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN 2>/dev/null | grep -q "200\|301\|302"; then
        echo -e "${GREEN}✅ SSL is working!${NC}"
    else
        echo -e "${YELLOW}⚠️  SSL might need setup. Run on server:${NC}"
        echo "docker exec rushbox-certbot certbot certonly --webroot -w /var/www/certbot -d $DOMAIN -d www.$DOMAIN --email admin@$DOMAIN --agree-tos --no-eff-email"
    fi
fi

# 8. Show status
echo ""
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""
echo "📋 Container Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "$CONTAINER_NAME|NAMES"
echo ""
echo "🌐 URLs:"
echo "   Local:  http://localhost:$PORT"
echo "   Public: https://$DOMAIN"
echo ""
echo -e "${YELLOW}📌 This project runs independently from:${NC}"
echo "   - rush-box (port 3000, rushboxes.com)"
echo "   - rush-video (port 3001, rush.video)"
