# Form & Function Full Stack Setup Guide

A comprehensive guide to setting up the complete Form & Function engineering platform with Go API, React frontend, and Python calculation engine.

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Web     │───▶│   Go API        │───▶│  Steel Beam     │
│   Frontend      │    │   (Railway)     │    │  Database       │
│   (Vercel)      │    └─────────────────┘    └─────────────────┘
└─────────────────┘             │
         │                      │
         │              ┌─────────────────┐
         └─────────────▶│  Python Calc    │
                        │  Engine         │
                        │  (Railway)      │
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
From the root directory:

```bash
# Install frontend dependencies
bun install

# Start frontend only (calc engine now deployed separately)
npm run dev
```

This will start:
- React frontend on http://localhost:3001

**Note:** The Python calc engine is now deployed independently on Railway at https://engine.itsformfunction.com

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

### 3. Python Calculation Engine (Independent Project)

The calc engine is now a separate project deployed on Railway.

**For local development:**
```bash
# Clone the independent calc engine project
git clone <formandfunction-calcengine-repo-url>
cd formandfunction-calcengine

# Run setup script (recommended)
./start.sh

# OR manual setup:
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

**Verification:**
- Local: http://localhost:8081
- Production: https://engine.itsformfunction.com
- API docs: https://engine.itsformfunction.com/docs
- Health check: https://engine.itsformfunction.com/health

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

**Calc Engine (Independent Project):**
```bash
cd ../formandfunction-calcengine  # Separate repository
./start.sh
```

### Running Multiple Services

**Frontend Only:**
```bash
npm run dev
```

**Note:** The calc engine is now deployed independently on Railway. For full local development, you'll need to run the calc engine from its separate repository.

### Available Scripts

From the root `formandfunction` directory:

```bash
# Frontend development
npm run dev              # Start frontend dev server
npm run build            # Build frontend for production
npm run lint             # Lint TypeScript/React code

# Note: Calc engine is now an independent project on Railway
# See formandfunction-calcengine repository for calc engine operations
```

## Testing the Stack

### 1. API Health Checks

```bash
# Test Go API
curl http://localhost:8080/beams

# Test Python calc engine (Production)
curl https://engine.itsformfunction.com/health

# Test calc engine calculation (Production)
curl -X POST https://engine.itsformfunction.com/analyze \
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
# Run automated calc engine tests (from separate repository)
cd ../formandfunction-calcengine
python test_calc.py

# Or test production directly
python test_calc.py https://engine.itsformfunction.com
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

**Python calc engine issues (Independent Project):**
- Verify Python 3.8+: `python3 --version`
- Recreate virtual environment: `rm -rf venv && python3 -m venv venv`
- Check API connectivity: The calc engine needs the Go API accessible
- For local development, clone the separate formandfunction-calcengine repository

**CORS issues:**
- Ensure all services are running on specified ports
- Check Vite proxy configuration in `apps/web/vite.config.ts`
- Verify CORS settings in Go API and Python calc engine

### Service Dependencies
**Service Dependencies**

**Current Architecture:**
1. Go API (Railway) - Independent deployment
2. Python calc engine (Railway) - Independent deployment, depends on Go API
3. React frontend (Vercel) - Independent deployment, calls both APIs

**Service health endpoints:**
- Go API: https://your-go-api.railway.app/
- Calc engine: https://engine.itsformfunction.com/health
- Frontend: https://your-frontend.vercel.app (visual check)

## Production Deployment

### Environment Variables
**Environment Variables**

**Go API (Railway):**
- `PORT`: Automatically set by Railway

**Python Calc Engine (Railway - Independent Project):**
- `API_BASE_URL`: Production Go API URL
- `PORT`: Automatically set by Railway

**React Frontend (Vercel):**
- Environment-specific URLs configured in code
- Development: localhost URLs
- Production: Railway deployment URLs

### Railway Deployments

**Go API:**
- Repository: `formandfunction-api`
- Platform: Railway
- Custom domain: Configure as needed

**Python Calc Engine:**
- Repository: `formandfunction-calcengine` (Independent project)
- Platform: Railway
- Custom domain: `engine.itsformfunction.com`
- Docker-based deployment

**React Frontend:**
- Repository: `formandfunction` (turborepo)
- Platform: Vercel
- Custom domain: Configure as needed

## API Documentation

### Go API Endpoints (Railway)
- `GET /` - API information
- `GET /beams` - List all steel beams
- `GET /beams/{designation}` - Get specific beam
- `POST /beams` - Add new beam
- `PUT /beams/{designation}` - Update beam
- `DELETE /beams/{designation}` - Delete beam

### Python Calc Engine Endpoints (Railway - Independent)
- `GET /` - Service information
- `GET /health` - Detailed health check
- `GET /beams` - Proxy to Go API beams
- `POST /analyze` - Perform beam analysis
- `GET /docs` - Interactive API documentation
- Base URL: https://engine.itsformfunction.com

## Contributing

### Development Setup
1. Fork the repositories:
   - `formandfunction` (turborepo with frontend)
   - `formandfunction-api` (Go API)
   - `formandfunction-calcengine` (Python calc engine)
2. Create feature branches in relevant repositories
3. Make changes and test locally
4. Run linting and tests
5. Submit pull requests to respective repositories

### Code Style
- **Go**: `gofmt` and `go vet`
- **TypeScript/React**: ESLint + Prettier
- **Python**: Black formatter + Flake8 linter

### Testing
- Go API: `go test ./...` (in formandfunction-api repo)
- Frontend: `npm run test` (in formandfunction repo)
- Python Calc Engine: `python test_calc.py` (in formandfunction-calcengine repo)

## Support

For issues and questions:
1. Check this setup guide
2. Review service-specific README files in respective repositories
3. Check API documentation at https://engine.itsformfunction.com/docs
4. Submit issues to the appropriate repository:
   - Frontend issues: `formandfunction` repository
   - Go API issues: `formandfunction-api` repository  
   - Calc engine issues: `formandfunction-calcengine` repository

---

**Happy Engineering! 🏗️**