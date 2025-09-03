# Vercel Deployment Guide - Form & Function Calc Engine

This guide walks you through deploying the Python calculation engine to Vercel as a serverless application.

## Prerequisites

- [Vercel CLI](https://vercel.com/cli) installed
- [Vercel account](https://vercel.com/signup)
- Go API deployed and accessible (for beam data)
- Node.js/Bun for local development

## Quick Deployment

### 1. Install Vercel CLI

```bash
npm i -g vercel
# or
curl -sL https://vercel.com/download | tar -xz && mv vercel /usr/local/bin
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Deploy from calc-engine directory

```bash
cd apps/calc-engine
vercel --prod
```

Follow the prompts to configure your deployment.

## Detailed Setup

### 1. Project Configuration

The `vercel.json` file is already configured for serverless deployment:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/main.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/api/main"
    }
  ],
  "functions": {
    "api/main.py": {
      "runtime": "@vercel/python@3.11.0"
    }
  }
}
```

### 2. Environment Variables

Set these environment variables in Vercel dashboard:

**Required:**
- `API_BASE_URL` - URL of your Go API (e.g., `https://your-api.vercel.app`)

**Optional:**
- `BEAM_API_TIMEOUT` - API timeout in seconds (default: 10)
- `DEFAULT_SAFETY_FACTOR` - Default safety factor (default: 1.6)
- `LOG_LEVEL` - Logging level (default: INFO)

### 3. Custom Domain Setup

1. Go to your Vercel project dashboard
2. Navigate to Settings > Domains
3. Add `www.engine.itsformfunction.com`
4. Configure DNS:
   ```
   Type: CNAME
   Name: www.engine
   Value: cname.vercel-dns.com
   ```

## Deployment Steps

### Step 1: Prepare the Application

```bash
# Navigate to calc-engine directory
cd apps/calc-engine

# Verify files are in place
ls -la
# Should show: api/, vercel.json, requirements.txt, etc.

# Test locally first
python api/main.py  # Won't work directly, but checks imports
```

### Step 2: Initial Deployment

```bash
# Deploy to Vercel
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: form-function-calc-engine
# - Directory: ./
# - Framework: Other
# - Build command: (leave empty)
# - Output directory: (leave empty)
```

### Step 3: Configure Environment Variables

Via Vercel CLI:
```bash
vercel env add API_BASE_URL
# Enter your Go API URL when prompted
```

Via Vercel Dashboard:
1. Go to project settings
2. Click Environment Variables
3. Add `API_BASE_URL` with your Go API URL

### Step 4: Production Deployment

```bash
vercel --prod
```

### Step 5: Verify Deployment

Test the endpoints:

```bash
# Health check
curl https://www.engine.itsformfunction.com/health

# Get beams
curl https://www.engine.itsformfunction.com/beams

# Test calculation
curl -X POST https://www.engine.itsformfunction.com/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "applied_load": 10.0,
    "span_length": 6.0,
    "load_type": "uniform",
    "material_grade": "S355"
  }'
```

## Project Structure for Vercel

```
apps/calc-engine/
├── api/
│   └── main.py          # Serverless FastAPI app
├── vercel.json          # Vercel configuration
├── requirements.txt     # Python dependencies
├── main.py             # Original development server (not used in production)
├── .env.example        # Environment variables template
└── DEPLOYMENT.md       # This file
```

## Troubleshooting

### Common Issues

**1. Import Errors**
```
Error: No module named 'numpy'
```
Solution: Ensure `requirements.txt` is in the root of the calc-engine directory.

**2. API Connection Failures**
```
Error: Unable to fetch beam data from API
```
Solutions:
- Verify `API_BASE_URL` environment variable is set correctly
- Ensure Go API is deployed and accessible
- Check CORS settings on Go API

**3. Timeout Errors**
```
Error: Function execution timed out
```
Solutions:
- Optimize calculation algorithms
- Consider caching beam data
- Increase timeout in Vercel settings (Pro plan required)

**4. Cold Start Issues**
```
Slow initial responses
```
Solutions:
- This is normal for serverless functions
- Consider upgrading to Vercel Pro for faster cold starts
- Implement warming strategies if needed

### Debugging

**View logs:**
```bash
vercel logs https://www.engine.itsformfunction.com
```

**Check function details:**
```bash
vercel inspect https://www.engine.itsformfunction.com
```

**Local development:**
```bash
vercel dev
```

### Performance Optimization

**1. Minimize Dependencies**
- Only include necessary packages in `requirements.txt`
- Consider using lighter alternatives to heavy packages

**2. Optimize Calculations**
- Cache frequently used calculations
- Use vectorized operations with NumPy
- Minimize API calls to Go backend

**3. Memory Management**
- Vercel functions have memory limits
- Monitor memory usage in function logs
- Optimize data structures

## Environment-Specific Configuration

### Development
- Uses local Go API (`http://localhost:8080`)
- Full error messages and debugging
- Development dependencies available

### Production (Vercel)
- Uses production Go API URL
- Minimal error messages for security
- Only production dependencies
- Automatic scaling and CDN

## Monitoring and Maintenance

### Health Monitoring

Set up monitoring for:
- `/health` endpoint availability
- Response times
- Error rates
- API connectivity

### Updates and Deployments

**Deploy updates:**
```bash
# Test locally first
vercel dev

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

**Rollback if needed:**
```bash
vercel rollback [deployment-id]
```

### Scaling Considerations

Vercel automatically scales serverless functions, but consider:
- Function execution limits (10 seconds on Free plan)
- Concurrent execution limits
- Memory limits (1008 MB on Free plan)
- Bandwidth limits

Upgrade to Vercel Pro for production workloads.

## Security Best Practices

1. **Environment Variables**
   - Never commit API keys or secrets
   - Use Vercel's environment variable system
   - Different variables for different environments

2. **CORS Configuration**
   - Specify exact origins in production
   - Don't use wildcard (*) in production CORS settings

3. **Input Validation**
   - All inputs are validated using Pydantic models
   - Implement rate limiting if needed

4. **Error Handling**
   - Don't expose internal error details in production
   - Log errors for debugging but sanitize public responses

## Integration with Frontend

Update your frontend to use the production URL:

```typescript
const calcEngineUrl = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8081'
  : 'https://www.engine.itsformfunction.com';
```

## Support and Resources

- [Vercel Python Runtime Documentation](https://vercel.com/docs/functions/serverless-functions/runtimes/python)
- [FastAPI with Vercel Guide](https://vercel.com/guides/using-fastapi-with-vercel)
- [Vercel CLI Reference](https://vercel.com/cli)

## Cost Considerations

### Vercel Pricing
- **Hobby (Free)**: 100GB bandwidth, 10s function execution
- **Pro ($20/month)**: 1TB bandwidth, 10s function execution, custom domains
- **Enterprise**: Unlimited bandwidth, custom execution time

### Usage Estimation
- Each calculation request: ~100-500ms execution time
- Beam data fetch: ~50-200ms per request
- Memory usage: ~50-100MB per function execution

Monitor usage in Vercel dashboard to optimize costs.

---

**Deployment Complete! 🚀**

Your calc engine is now running serverlessly at https://www.engine.itsformfunction.com