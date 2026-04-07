#!/bin/bash

echo "🚀 Creating admin user on SapuKota service..."
echo ""
echo "⚠️  IMPORTANT: When prompted, select 'SapuKota' service (NOT MySQL)!"
echo "   Use arrow keys to move up to 'SapuKota', then press Enter"
echo ""
read -p "Press Enter to continue..."

cd "$(dirname "$0")"/..
railway run npm run seed:admin
