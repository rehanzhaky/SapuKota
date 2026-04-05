#!/bin/bash

# SapuKota VPS Setup Script
# Script ini membantu setup environment di VPS Hostinger

echo "🚀 SapuKota VPS Setup Script"
echo "================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}Please run as root (use: sudo bash setup-vps.sh)${NC}"
  exit
fi

echo -e "${YELLOW}[1/8] Updating system...${NC}"
apt update && apt upgrade -y

echo -e "${YELLOW}[2/8] Installing Node.js 18...${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

echo -e "${YELLOW}[3/8] Installing MySQL Server...${NC}"
apt install -y mysql-server

echo -e "${YELLOW}[4/8] Installing Git...${NC}"
apt install -y git

echo -e "${YELLOW}[5/8] Installing PM2...${NC}"
npm install -g pm2

echo -e "${YELLOW}[6/8] Installing Nginx...${NC}"
apt install -y nginx

echo -e "${YELLOW}[7/8] Installing UFW Firewall...${NC}"
apt install -y ufw

echo -e "${YELLOW}[8/8] Configuring Firewall...${NC}"
ufw --force enable
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp

echo ""
echo -e "${GREEN}✅ Base setup completed!${NC}"
echo ""
echo "Next steps:"
echo "1. Run: mysql_secure_installation"
echo "2. Create database and user (see DEPLOYMENT_HOSTINGER.md)"
echo "3. Clone/upload your project"
echo "4. Setup backend .env file"
echo "5. Run migrations"
echo "6. Start with PM2"
echo ""
echo "Installed versions:"
node --version
npm --version
mysql --version | head -1
nginx -v
pm2 --version
