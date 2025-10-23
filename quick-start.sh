#!/bin/bash

# Ekidna2 Quick Start Script
# This script helps you quickly set up and start the entire stack

set -e

echo "================================================"
echo "  Ekidna2 - Quick Start Setup"
echo "================================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker is not installed${NC}"
        echo "Please install Docker first: https://docs.docker.com/get-docker/"
        exit 1
    fi
    echo -e "${GREEN}✓ Docker is installed${NC}"
}

# Check if Docker daemon is running
check_docker_running() {
    if ! docker info &> /dev/null; then
        echo -e "${RED}❌ Docker daemon is not running${NC}"
        echo ""
        echo "Please start Docker Desktop and try again."
        echo ""
        echo "Windows: Start Docker Desktop from the Start menu"
        echo "Mac: Start Docker Desktop from Applications"
        echo "Linux: Run 'sudo systemctl start docker'"
        echo ""
        exit 1
    fi
    echo -e "${GREEN}✓ Docker daemon is running${NC}"
}

# Check if Docker Compose is installed
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}❌ Docker Compose is not installed${NC}"
        echo "Please install Docker Compose: https://docs.docker.com/compose/install/"
        exit 1
    fi
    echo -e "${GREEN}✓ Docker Compose is installed${NC}"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js is not installed${NC}"
        echo "Please install Node.js 20+: https://nodejs.org/"
        exit 1
    fi
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓ Node.js $NODE_VERSION is installed${NC}"
}

# Setup environment file
setup_env() {
    if [ ! -f .env ]; then
        echo -e "${YELLOW}⚠ .env file not found. Creating from template...${NC}"
        cp .env.example .env
        echo -e "${GREEN}✓ .env file created${NC}"
        echo -e "${YELLOW}⚠ Please edit .env file and update the following:${NC}"
        echo "  - DB_PASSWORD (use a strong password)"
        echo "  - JWT_SECRET (generate with: openssl rand -base64 32)"
        echo "  - EMAIL_USER and EMAIL_PASSWORD (for email functionality)"
        echo ""
        read -p "Press Enter to continue after updating .env..."
    else
        echo -e "${GREEN}✓ .env file exists${NC}"
    fi
}

# Install backend dependencies
install_backend() {
    echo ""
    echo -e "${BLUE}📦 Installing backend dependencies...${NC}"
    cd backend
    npm install
    cd ..
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
}

# Start Docker services
start_docker() {
    echo ""
    echo -e "${BLUE}🐳 Starting Docker services...${NC}"
    docker-compose up -d
    echo -e "${GREEN}✓ Docker services started${NC}"

    # Wait for database to be ready
    echo -e "${YELLOW}⏳ Waiting for database to be ready...${NC}"
    sleep 5

    # Check if services are running
    echo ""
    echo "Docker services status:"
    docker-compose ps
}

# Install MVP dependencies
install_mvp() {
    echo ""
    echo -e "${BLUE}📦 Installing MVP dependencies...${NC}"
    cd MVP
    if [ ! -d "node_modules" ]; then
        npm install
    else
        echo "  (already installed, skipping)"
    fi

    # Setup MVP .env
    if [ ! -f .env ]; then
        echo "VITE_API_BASE_URL=http://localhost:3001/api" > .env
        echo -e "${GREEN}✓ MVP .env created${NC}"
    fi
    cd ..
}

# Install Website dependencies
install_website() {
    echo ""
    echo -e "${BLUE}📦 Installing Website dependencies...${NC}"
    cd website
    if [ ! -d "node_modules" ]; then
        npm install
    else
        echo "  (already installed, skipping)"
    fi

    # Setup website .env
    if [ ! -f .env ]; then
        echo "VITE_API_BASE_URL=http://localhost:3001/api" > .env
        echo -e "${GREEN}✓ Website .env created${NC}"
    fi
    cd ..
}

# Test backend
test_backend() {
    echo ""
    echo -e "${BLUE}🧪 Testing backend API...${NC}"
    sleep 2

    HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/health)

    if [ "$HEALTH_CHECK" = "200" ]; then
        echo -e "${GREEN}✓ Backend API is healthy${NC}"
    else
        echo -e "${RED}❌ Backend API health check failed (HTTP $HEALTH_CHECK)${NC}"
        echo "Check logs with: docker-compose logs backend"
    fi
}

# Show next steps
show_next_steps() {
    echo ""
    echo "================================================"
    echo -e "${GREEN}✓ Setup Complete!${NC}"
    echo "================================================"
    echo ""
    echo "Your Ekidna2 backend is now running!"
    echo ""
    echo "📍 Services:"
    echo "  • Backend API:  http://localhost:3001/api"
    echo "  • Database UI:  http://localhost:8080 (Adminer)"
    echo "  • Health check: http://localhost:3001/api/health"
    echo ""
    echo "🔐 Default Admin Credentials:"
    echo "  • Email:    admin@ekidna.org"
    echo "  • Password: admin123"
    echo "  ⚠️  CHANGE THIS PASSWORD IMMEDIATELY!"
    echo ""
    echo "📝 Next Steps:"
    echo ""
    echo "1. Test the API:"
    echo "   curl http://localhost:3001/api/health"
    echo ""
    echo "2. Start MVP Dashboard:"
    echo "   cd MVP && npm run dev"
    echo "   Open: http://localhost:5174"
    echo ""
    echo "3. Start Website:"
    echo "   cd website && npm run dev"
    echo "   Open: http://localhost:5173"
    echo ""
    echo "📖 Documentation:"
    echo "  • Backend:    backend/README.md"
    echo "  • Deployment: DEPLOYMENT.md"
    echo "  • Migration:  MIGRATION_GUIDE.md"
    echo ""
    echo "🔧 Useful Commands:"
    echo "  • View logs:        docker-compose logs -f"
    echo "  • Stop services:    docker-compose down"
    echo "  • Restart services: docker-compose restart"
    echo "  • Database backup:  docker exec ekidna_db pg_dump -U ekidna_user ekidna_db > backup.sql"
    echo ""
    echo "================================================"
}

# Main execution
main() {
    echo "Checking prerequisites..."
    check_docker
    check_docker_running
    check_docker_compose
    check_node

    echo ""
    setup_env

    # Ask user what to install
    echo ""
    echo "What would you like to do?"
    echo "1) Full setup (Backend + MVP + Website)"
    echo "2) Backend only"
    echo "3) Frontend only (MVP + Website)"
    echo ""
    read -p "Enter choice [1-3]: " choice

    case $choice in
        1)
            install_backend
            start_docker
            test_backend
            install_mvp
            install_website
            show_next_steps
            ;;
        2)
            install_backend
            start_docker
            test_backend
            show_next_steps
            ;;
        3)
            install_mvp
            install_website
            echo ""
            echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
            echo ""
            echo "Start MVP: cd MVP && npm run dev"
            echo "Start Website: cd website && npm run dev"
            ;;
        *)
            echo -e "${RED}Invalid choice${NC}"
            exit 1
            ;;
    esac
}

# Run main function
main
