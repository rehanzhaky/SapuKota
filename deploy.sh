#!/bin/bash

# SapuKota Deployment Script
# Script untuk deploy/update aplikasi di VPS

echo "🚀 SapuKota Deployment Script"
echo "================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/var/www/SapuKota"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"
PM2_APP_NAME="sapukota-backend"

# Check if project directory exists
if [ ! -d "$PROJECT_DIR" ]; then
  echo -e "${RED}Error: Project directory not found at $PROJECT_DIR${NC}"
  exit 1
fi

echo -e "${BLUE}Current directory: $PROJECT_DIR${NC}"
echo ""

# Function to ask yes/no
ask_yes_no() {
  while true; do
    read -p "$1 (y/n): " yn
    case $yn in
      [Yy]* ) return 0;;
      [Nn]* ) return 1;;
      * ) echo "Please answer yes or no.";;
    esac
  done
}

# Pull latest code
if ask_yes_no "Pull latest code from Git?"; then
  echo -e "${YELLOW}[1] Pulling latest code...${NC}"
  cd $PROJECT_DIR
  git pull origin main
  echo -e "${GREEN}✅ Code updated${NC}"
fi

# Update backend
if ask_yes_no "Update backend?"; then
  echo -e "${YELLOW}[2] Updating backend...${NC}"
  cd $BACKEND_DIR
  
  # Install dependencies
  echo "Installing dependencies..."
  npm install --production
  
  # Run migrations if needed
  if ask_yes_no "Run database migrations?"; then
    echo "Running migrations..."
    mysql -u sapukota_user -p sapukota < migrations/update_reports_table.sql 2>/dev/null
    mysql -u sapukota_user -p sapukota < migrations/add_coordinates_to_reports.sql 2>/dev/null
    mysql -u sapukota_user -p sapukota < migrations/add_petugas_tracking.sql 2>/dev/null
    mysql -u sapukota_user -p sapukota < migrations/add_petugas_gps_tracking.sql 2>/dev/null
    mysql -u sapukota_user -p sapukota < migrations/add_user_gps_tracking.sql 2>/dev/null
    echo -e "${GREEN}✅ Migrations completed${NC}"
  fi
  
  # Restart PM2
  echo "Restarting backend..."
  pm2 restart $PM2_APP_NAME
  echo -e "${GREEN}✅ Backend updated and restarted${NC}"
fi

# Update frontend
if ask_yes_no "Update frontend?"; then
  echo -e "${YELLOW}[3] Updating frontend...${NC}"
  cd $FRONTEND_DIR
  
  # Install dependencies
  echo "Installing dependencies..."
  npm install
  
  # Build for production
  echo "Building for production..."
  npm run build
  
  echo -e "${GREEN}✅ Frontend built${NC}"
fi

# Restart Nginx
if ask_yes_no "Restart Nginx?"; then
  echo -e "${YELLOW}[4] Restarting Nginx...${NC}"
  systemctl restart nginx
  echo -e "${GREEN}✅ Nginx restarted${NC}"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Show status
echo -e "${BLUE}Service Status:${NC}"
echo ""

echo -e "${YELLOW}PM2 Status:${NC}"
pm2 status

echo ""
echo -e "${YELLOW}Nginx Status:${NC}"
systemctl status nginx --no-pager -l

echo ""
echo -e "${BLUE}Recent Backend Logs:${NC}"
pm2 logs $PM2_APP_NAME --lines 10 --nostream

echo ""
echo -e "${BLUE}Access your app at:${NC}"
echo "http://$(curl -s ifconfig.me)"
echo ""
