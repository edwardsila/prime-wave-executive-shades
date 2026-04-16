#!/bin/bash

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}Prime Wave Executive Shades${NC}"
echo -e "${BLUE}Installation Script${NC}"
echo -e "${BLUE}================================${NC}\n"

# Check if Node.js is installed
echo -e "${YELLOW}Checking prerequisites...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js is not installed. Please install Node.js from https://nodejs.org/${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js found: $(node --version)${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${YELLOW}npm is not installed. Please install npm${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm found: $(npm --version)${NC}\n"

# Install Backend Dependencies
echo -e "${BLUE}Installing Backend Dependencies...${NC}"
cd backend
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend dependencies installed successfully${NC}\n"
else
    echo -e "${YELLOW}✗ Failed to install backend dependencies${NC}"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${BLUE}Creating .env file...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created. Please edit it with your MongoDB URI and JWT secret${NC}\n"
else
    echo -e "${YELLOW}⚠ .env file already exists${NC}\n"
fi

cd ..

# Install Frontend Dependencies
echo -e "${BLUE}Installing Frontend Dependencies...${NC}"
cd frontend
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend dependencies installed successfully${NC}\n"
else
    echo -e "${YELLOW}✗ Failed to install frontend dependencies${NC}"
    exit 1
fi

cd ..

# Summary
echo -e "${BLUE}================================${NC}"
echo -e "${GREEN}Installation Complete!${NC}"
echo -e "${BLUE}================================${NC}\n"

echo -e "${YELLOW}Next Steps:${NC}"
echo -e "1. Edit backend/.env with your MongoDB URI"
echo -e "2. Start backend: ${GREEN}cd backend && npm run dev${NC}"
echo -e "3. In another terminal, start frontend: ${GREEN}cd frontend && npm start${NC}"
echo -e "4. Visit http://localhost:3000 in your browser\n"

echo -e "${YELLOW}For detailed setup instructions, see SETUP_GUIDE.md${NC}"
