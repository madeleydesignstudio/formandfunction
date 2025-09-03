# Form & Function Calc Engine

A Python-based structural calculation engine for steel beam analysis using NumPy, Pandas, and SciPy. This service integrates with the Form & Function API to provide comprehensive structural engineering calculations.

## Features

- **Steel Beam Analysis**: Comprehensive structural analysis including:
  - Bending moment calculations
  - Shear force analysis  
  - Deflection calculations
  - Stress utilization checks
  - Eurocode 3 compliance
- **Load Types**: Support for uniform distributed loads and point loads
- **Material Grades**: S235, S275, S355, S460 steel grades
- **Optimal Beam Selection**: Automatically find the most economical beam for given loads
- **Safety Checks**: Configurable safety factors and serviceability limits
- **RESTful API**: FastAPI-based web service with automatic OpenAPI documentation

## Architecture

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
                        │ (Local: 8081)   │
                        │ (Prod: Vercel)  │
                        └─────────────────┘
```

## Prerequisites

- Python 3.8 or higher
- Go API running on port 8080 (steel beam data source)
- Virtual environment support
- [Vercel CLI](https://vercel.com/cli) (for deployment)

## Quick Start

### Local Development

1. **Start the calc engine:**
   ```bash
   ./start.sh
   ```

2. **Access the API documentation:**
   Open http://localhost:8081/docs in your browser

3. **Run tests:**
   ```bash
   python test_calc.py
   ```

### Production Deployment (Vercel)

1. **Deploy to Vercel:**
   ```bash
   npm run deploy
   # or
   vercel --prod
   ```

2. **Access production API:**
   - Production URL: https://www.engine.itsformfunction.com
   - API docs: https://www.engine.itsformfunction.com/docs
   - Health check: https://www.engine.itsformfunction.com/health

## Manual Installation

If you prefer to set up manually:

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables (optional)
export API_BASE_URL="http://localhost:8080"
export CALC_ENGINE_PORT="8081"

# Start the service
python main.py
```

## API Endpoints

### Development URLs (Local)
- Base URL: `http://localhost:8081`
- API Docs: `http://localhost:8081/docs`

### Production URLs (Vercel)
- Base URL: `https://www.engine.itsformfunction.com`
- API Docs: `https://www.engine.itsformfunction.com/docs`

### Health & Information

- `GET /` - Service information
- `GET /health` - Detailed health check including API connectivity
- `GET /beams` - Get all available steel beams from the Go API
- `GET /beams/{designation}` - Get specific beam information

### Calculations

- `POST /analyze` - Perform comprehensive beam analysis

#### Analysis Request Format

```json
{
  "beam_designation": "UB406x178x74",  // Optional - if not provided, optimal beam is selected
  "applied_load": 15.0,                // kN or kN/m depending on load_type
  "span_length": 6.0,                  // meters
  "load_type": "uniform",              // "uniform" or "point"
  "safety_factor": 1.6,                // Safety factor for design
  "material_grade": "S355"             // Steel grade: S235, S275, S355, S460
}
```

#### Analysis Response Format

```json
{
  "beam": {
    "section_designation": "UB406x178x74",
    "mass_per_metre": 74.6,
    // ... full beam properties
  },
  "applied_load": 15.0,
  "span_length": 6.0,
  "max_moment": 67.5,                  // kNm
  "max_shear": 45.0,                   // kN  
  "max_deflection": 12.34,             // mm
  "stress_utilization": 0.756,         // Ratio (should be ≤ 1.0)
  "deflection_limit_check": true,      // Passes L/250 limit
  "is_adequate": true,                 // Overall adequacy
  "safety_margin": 24.4,               // Percentage
  "recommendations": [
    "PASS: Beam is adequate for the applied loading."
  ]
}
```

## Engineering Calculations

### Bending Moments

- **Uniform Load**: M = wL²/8
- **Point Load (center)**: M = PL/4

### Deflections  

- **Uniform Load**: δ = 5wL⁴/(384EI)
- **Point Load (center)**: δ = PL³/(48EI)

### Stress Check

- Utilization = (Actual Stress) / (Allowable Stress)
- Allowable Stress = fy / Safety Factor
- Actual Stress = M / W (elastic section modulus)

### Serviceability Limits

- Deflection limit: L/250 (general construction)
- Can be customized for specific applications

## Example Usage

### Python Client

```python
import requests

# Analyze a specific beam
response = requests.post("http://localhost:8081/analyze", json={
    "beam_designation": "UB406x178x74",
    "applied_load": 12.0,
    "span_length": 8.0,
    "load_type": "uniform",
    "material_grade": "S355"
})

result = response.json()
print(f"Beam adequate: {result['is_adequate']}")
print(f"Stress utilization: {result['stress_utilization']}")
```

### cURL

```bash
curl -X POST "http://localhost:8081/analyze" \
     -H "Content-Type: application/json" \
     -d '{
       "applied_load": 20.0,
       "span_length": 6.0,
       "load_type": "uniform",
       "material_grade": "S355"
     }'
```

## Integration with Web Frontend

The calc engine is designed to be called from the React frontend with automatic environment switching:

```typescript
const analyzeBeam = async (loadData: CalculationRequest) => {
  const calcEngineUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8081'
    : 'https://www.engine.itsformfunction.com';
    
  const response = await fetch(`${calcEngineUrl}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loadData)
  });
  return response.json();
};
```

## Configuration

### Environment Variables

**Local Development:**
- `API_BASE_URL`: Go API base URL (default: http://localhost:8080)
- `CALC_ENGINE_PORT`: Port for calc engine (default: 8081)

**Production (Vercel):**
- `API_BASE_URL`: Production Go API URL (set in Vercel dashboard)
- Automatic scaling and serverless execution
- Custom domain: `www.engine.itsformfunction.com`

### Vercel Configuration

The `vercel.json` file configures serverless deployment:
- Python 3.11 runtime
- FastAPI with Mangum adapter
- Automatic routing to `/api/main.py`
- Environment variable support

## Development

### Running Tests

**Local Testing:**
```bash
# Run all tests
python test_calc.py

# Test specific functionality
python -c "from main import BeamAnalysis; analyzer = BeamAnalysis(); print(analyzer.fetch_beams_from_api())"

# Test local health
npm run calc:health
```

**Production Testing:**
```bash
# Test production health
npm run calc:health:prod

# Test production calculation
curl -X POST https://www.engine.itsformfunction.com/analyze \
  -H "Content-Type: application/json" \
  -d '{"applied_load": 10.0, "span_length": 6.0, "load_type": "uniform", "material_grade": "S355"}'
```

### Deployment Workflow

```bash
# Local development
./start.sh

# Preview deployment
npm run calc:deploy:preview

# Production deployment
npm run calc:deploy

# Check deployment logs
vercel logs
```

### Adding New Calculations

1. Add calculation method to `BeamAnalysis` class in both `main.py` and `api/main.py`
2. Update the analysis workflow in `perform_analysis()`
3. Add corresponding tests in `test_calc.py`
4. Test locally, then deploy to preview
5. Deploy to production after testing

### Code Quality

```bash
# Format code (includes serverless version)
npm run format

# Lint code (includes serverless version)
npm run lint

# Run with type checking
mypy main.py api/main.py
```

## Troubleshooting

### Local Development Issues

1. **"Unable to fetch beam data from API"**
   - Ensure Go API is running on port 8080
   - Check network connectivity
   - Verify API endpoint responds: `curl http://localhost:8080/beams`

2. **Import errors**
   - Activate virtual environment: `source venv/bin/activate`
   - Install dependencies: `pip install -r requirements.txt`

3. **Port already in use**
   - Change port: `export CALC_ENGINE_PORT=8082`
   - Kill existing process: `lsof -ti:8081 | xargs kill`

### Production (Vercel) Issues

1. **Deployment failures**
   - Check `vercel.json` configuration
   - Verify `requirements.txt` has correct dependencies
   - Ensure `api/main.py` exists and is valid

2. **Runtime errors**
   - Check Vercel function logs: `vercel logs`
   - Verify environment variables are set
   - Test API connectivity from serverless environment

3. **Timeout issues**
   - Optimize calculation performance
   - Consider Vercel Pro for longer execution times
   - Implement caching for frequently accessed data

### Debug Mode

**Local debugging:**
```bash
export LOG_LEVEL=DEBUG
python main.py
```

**Production debugging:**
```bash
# View deployment logs
vercel logs https://www.engine.itsformfunction.com

# Test with verbose output
vercel dev --debug
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

This project is part of the Form & Function engineering platform.