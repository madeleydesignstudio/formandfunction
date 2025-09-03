# Form & Function Full Stack Setup Guide

A comprehensive guide to setting up the complete Form & Function engineering platform with Go API, React frontend, and Python calculation engine.

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Web     │───▶│   Go API        │───▶│  Steel Beam     │
│   Frontend      │    │   (Port 8080)   │    │  Database       │
│   (Port 3001)   │    └─────────────────┘    └─────────────────┘
└─────────────────┘             │
         │                      │
         │              ┌─────────────────┐
         └─────────────▶│  Python Calc    │
                        │  Engine         │
                        │  (Port 8081)    │
                        └─────────────────┘
```

## Prerequisites

### System Requirements
- **Node.js** 20+ (for React frontend)
- **Bun** 1.2.18+ (package manager)
- **Go** 1.25+ (for API backend)
- **Python** 3.8+ (for calculation engine)
- **Git** (for version control)

### Installation Commands

**macOS (using Homebrew):**
```bash
# Install Node.js and Bun
brew install node
curl -fsSL https://bun.sh/install | bash

# Install Go
brew install go

# Install Python (if not already installed)
brew install python@3.11

# Verify installations
node --version    # Should be 20+
bun --version     # Should be 1.2.18+
go version        # Should be 1.25+
python3 --version # Should be 3.8+
```

**Ubuntu/Debian:**
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Bun
curl -fsSL https://bun.sh/install | bash

# Install Go
sudo apt-get install golang-go

# Install Python
sudo apt-get install python3 python3-pip python3-venv

# Verify installations
node --version
bun --version
go version
python3 --version
```

## Quick Start (All Services)

The fastest way to get everything running:

```bash
# Clone and setup the project
git clone <repository-url>
cd itsformandfunction/formandfunction

# Install frontend dependencies
bun install

# Start all services at once
npm run start-all
```

This will start:
- Go API on http://localhost:8080
- React frontend on http://localhost:3001
- Python calc engine on http://localhost:8081

## Individual Service Setup

### 1. Go API Backend

```bash
# Navigate to API directory
cd formandfunction-api

# Install dependencies
go mod tidy

# Start the API server
go run main.go
```

**Verification:**
- API: http://localhost:8080
- Endpoints: http://localhost:8080/beams

### 2. React Frontend

```bash
# Navigate to web app directory
cd formandfunction/apps/web

# Install dependencies (if not done globally)
bun install

# Start development server
bun dev
```

**Verification:**
- Frontend: http://localhost:3001
- Should show steel beam data and calculator

### 3. Python Calculation Engine

```bash
# Navigate to calc engine directory
cd formandfunction/apps/calc-engine

# Run setup script (recommended)
./start.sh

# OR manual setup:
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

**Verification:**
- Calc engine: http://localhost:8081
- API docs: http://localhost:8081/docs
- Health check: http://localhost:8081/health

## Development Workflow

### Running Individual Services

**Go API only:**
```bash
cd formandfunction-api
go run main.go
```

**Frontend only:**
```bash
cd formandfunction/apps/web
bun dev
```

**Calc Engine only:**
```bash
cd formandfunction/apps/calc-engine
./start.sh
```

### Running Multiple Services

**Frontend + Calc Engine:**
```bash
npm run full-stack
```

**All services:**
```bash
npm run start-all
```

### Available Scripts

From the root `formandfunction` directory:

```bash
# Frontend development
npm run dev              # Start frontend dev server
npm run build            # Build frontend for production
npm run lint             # Lint TypeScript/React code

# Calc engine operations
npm run calc:start       # Start calc engine with setup
npm run calc:dev         # Start calc engine directly
npm run calc:test        # Run calc engine tests
npm run calc:health      # Check calc engine health

# Combined operations
npm run full-stack       # Frontend + calc engine
npm run start-all        # All three services
```

## Testing the Stack

### 1. API Health Checks

```bash
# Test Go API
curl http://localhost:8080/beams

# Test Python calc engine
curl http://localhost:8081/health

# Test calc engine calculation
curl -X POST http://localhost:8081/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "applied_load": 10.0,
    "span_length": 6.0,
    "load_type": "uniform",
    "material_grade": "S355"
  }'
```

### 2. Frontend Integration Test

1. Navigate to http://localhost:3001
2. Click "Fetch Steel Beams" to test Go API connection
3. Scroll down to the "Steel Beam Calculator"
4. Enter loading parameters and click "Analyze Beam"
5. Verify calculation results appear

### 3. End-to-End Test

```bash
# Run automated calc engine tests
cd apps/calc-engine
python test_calc.py
```

## Troubleshooting

### Common Issues

**Port conflicts:**
```bash
# Check what's using a port
lsof -i :8080  # For Go API
lsof -i :3001  # For React frontend  
lsof -i :8081  # For calc engine

# Kill process using port
lsof -ti:8080 | xargs kill
```

**Go API issues:**
- Ensure Go 1.25+ is installed
- Check `go.mod` file exists in `formandfunction-api/`
- Verify no other service is using port 8080

**Frontend issues:**
- Clear node_modules: `rm -rf node_modules && bun install`
- Check Bun version: `bun --version`
- Ensure all workspace dependencies are installed

**Python calc engine issues:**
- Verify Python 3.8+: `python3 --version`
- Recreate virtual environment: `rm -rf venv && python3 -m venv venv`
- Check API connectivity: The calc engine needs the Go API running

**CORS issues:**
- Ensure all services are running on specified ports
- Check Vite proxy configuration in `apps/web/vite.config.ts`
- Verify CORS settings in Go API and Python calc engine

### Service Dependencies

**Start order for manual setup:**
1. Go API (port 8080) - Must start first
2. Python calc engine (port 8081) - Depends on Go API
3. React frontend (port 3001) - Can start independently

**Service health endpoints:**
- Go API: http://localhost:8080/ 
- Calc engine: http://localhost:8081/health
- Frontend: http://localhost:3001 (visual check)

## Production Deployment

### Environment Variables

**Go API:**
- `PORT`: Server port (default: 8080)

**Python Calc Engine:**
- `API_BASE_URL`: Go API URL (default: http://localhost:8080)
- `CALC_ENGINE_PORT`: Calc engine port (default: 8081)

**React Frontend:**
- Built-in proxy handles API routing in development
- For production, configure reverse proxy (nginx/Apache)

### Docker Setup (Optional)

Create `docker-compose.yml` in project root:

```yaml
version: '3.8'
services:
  api:
    build: ./formandfunction-api
    ports:
      - "8080:8080"
    
  calc-engine:
    build: ./formandfunction/apps/calc-engine
    ports:
      - "8081:8081"
    depends_on:
      - api
    environment:
      - API_BASE_URL=http://api:8080
    
  frontend:
    build: ./formandfunction/apps/web
    ports:
      - "3001:3001"
    depends_on:
      - api
      - calc-engine
```

## API Documentation

### Go API Endpoints
- `GET /` - API information
- `GET /beams` - List all steel beams
- `GET /beams/{designation}` - Get specific beam
- `POST /beams` - Add new beam
- `PUT /beams/{designation}` - Update beam
- `DELETE /beams/{designation}` - Delete beam

### Python Calc Engine Endpoints  
- `GET /` - Service information
- `GET /health` - Detailed health check
- `GET /beams` - Proxy to Go API beams
- `POST /analyze` - Perform beam analysis
- `GET /docs` - Interactive API documentation

## Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make changes and test locally
4. Run linting and tests
5. Submit a pull request

### Code Style
- **Go**: `gofmt` and `go vet`
- **TypeScript/React**: ESLint + Prettier
- **Python**: Black formatter + Flake8 linter

### Testing
- Go: `go test ./...`
- Frontend: `npm run test`
- Python: `python test_calc.py`

## Support

For issues and questions:
1. Check this setup guide
2. Review service-specific README files
3. Check API documentation at http://localhost:8081/docs
4. Submit an issue on the repository

---

**Happy Engineering! 🏗️**