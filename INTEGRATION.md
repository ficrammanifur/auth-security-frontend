# Frontend-Backend Integration Guide

Complete guide to connect the frontend and backend components of the Hybrid Authentication Security Lab.

## Architecture Overview

```
┌─────────────────────────────┐
│  Frontend (GitHub Pages)    │
│  ✓ index.html (entry)       │
│  ✓ dashboard.html           │
│  ✓ auth.js                  │
│  ✓ style.css                │
└──────────────┬──────────────┘
               │ HTTP/HTTPS
               │ Bearer Token (JWT)
               │
┌──────────────▼──────────────┐
│  Backend (Railway)          │
│  ✓ Flask API                │
│  ✓ JWT Auth                 │
│  ✓ /login endpoint          │
│  ✓ /protected endpoint      │
└─────────────────────────────┘
```

## Step 1: Setup Backend on Railway

### 1.1 Deploy to Railway

```bash
cd auth-security-backend

# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up
```

### 1.2 Get Backend URL

After deployment, Railway provides a URL like:
```
https://your-project-name.up.railway.app
```

Save this URL - you'll need it in the next step.

### 1.3 Configure Environment Variables

In Railway dashboard, set these variables:

```
SECRET_KEY = your-secure-random-string
JWT_EXPIRATION_HOURS = 24
FLASK_ENV = production
PORT = 8080
```

## Step 2: Setup Frontend on GitHub

### 2.1 Create GitHub Repository

1. Go to github.com/new
2. Create repository (e.g., `auth-security-frontend`)
3. Make it public (for GitHub Pages)

### 2.2 Push Frontend Code

```bash
cd auth-security-frontend

# Initialize git
git init
git add .
git commit -m "Initial commit: authentication frontend"

# Add remote
git remote add origin https://github.com/yourusername/auth-security-frontend.git
git branch -M main
git push -u origin main
```

### 2.3 Update API URL

Edit `auth.js`:

```javascript
// Replace this line:
const API_BASE_URL = 'http://localhost:5000';

// With your Railway URL:
const API_BASE_URL = 'https://your-project-name.up.railway.app';
```

Commit and push:
```bash
git add auth.js
git commit -m "Update backend URL to Railway deployment"
git push
```

### 2.4 Enable GitHub Pages

1. Go to repository Settings
2. Scroll to "Pages" section
3. Select `main` branch as source
4. Click Save
5. Wait 1-2 minutes for deployment

Your site will be available at:
```
https://yourusername.github.io/auth-security-frontend
```

## Step 3: Configure CORS

The backend must allow requests from your frontend domain.

### 3.1 Update Backend CORS

Edit `auth-security-backend/app.py`:

```python
CORS(
    app,
    origins=[
        "https://yourusername.github.io",  # GitHub Pages domain
        "http://localhost:8000",             # Local testing
        "http://localhost:5000"              # Local backend testing
    ],
    methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"]
)
```

### 3.2 Deploy Updated Backend

```bash
cd auth-security-backend
git add app.py
git commit -m "Update CORS for GitHub Pages domain"
git push
# Railway auto-deploys on push
```

## Step 4: Test End-to-End

### 4.1 Test Login

1. Visit `https://yourusername.github.io/auth-security-frontend`
2. Enter credentials:
   - Username: `admin`
   - Password: `password123`
3. Click "Sign In"
4. Should redirect to dashboard showing authenticated user

### 4.2 Verify Authentication

On dashboard, you should see:
- ✓ Authenticated badge (green)
- ✓ Username displayed
- ✓ Token status: Valid
- ✓ Message: "Welcome back, admin!"

### 4.3 Test Token Persistence

1. Refresh the dashboard page
2. You should remain logged in (token persists)
3. Try logging out
4. Should redirect to login page

## Troubleshooting

### Error: "Cannot fetch from API"

**Cause**: API URL incorrect or backend not running

**Solution**:
1. Verify `API_BASE_URL` in `auth.js`
2. Check that Railway backend is deployed
3. Ensure backend URL is correct (https://, not http://)

### Error: "CORS error"

**Cause**: Backend CORS not configured for frontend domain

**Solution**:
1. Update backend `app.py` with your GitHub Pages domain
2. Redeploy backend: `git push` (Railway auto-deploys)
3. Wait a few seconds for changes to take effect

### Error: "Invalid credentials"

**Check**:
- Backend is running and responding to `/login`
- Using correct demo credentials: `admin` / `password123`
- Backend database (USERS dict) is intact

**Solution**: Restart backend if running locally

### Dashboard shows "Session expired"

**Cause**: Token expired or backend `/protected` endpoint not working

**Solution**:
1. Login again
2. Check backend logs for errors
3. Verify `JWT_EXPIRATION_HOURS` is set correctly (default 24h)

### Blank page on GitHub Pages

**Cause**: `index.html` not found

**Solution**:
1. Verify file structure in repository
2. Check GitHub Pages settings (should show green checkmark)
3. Try force refresh: `Ctrl+Shift+R`

## Local Development

To test locally before GitHub Pages deployment:

### Terminal 1: Backend
```bash
cd auth-security-backend
pip install -r requirements.txt
python app.py
# Runs on http://localhost:5000
```

### Terminal 2: Frontend
```bash
cd auth-security-frontend
python -m http.server 8000
# Runs on http://localhost:8000
```

### Update API URL (Local)
In `auth.js`:
```javascript
const API_BASE_URL = 'http://localhost:5000';
```

Visit `http://localhost:8000` and test.

## Security Checklist

Before using in production:

- [ ] Backend on Railway (not local/unencrypted)
- [ ] All HTTPS (enforce in CORS origins)
- [ ] Strong `SECRET_KEY` set in Railway environment
- [ ] CORS restricted to known domains
- [ ] Frontend API URL uses HTTPS
- [ ] GitHub Pages domain verified
- [ ] No credentials in code
- [ ] `.env.example` doesn't contain real secrets
- [ ] Review SECURITY.md for intentional vulnerabilities

## File Structure After Integration

```
project-root/
├── auth-security-frontend/     (GitHub Repository)
│   ├── index.html              (Entry point)
│   ├── dashboard.html
│   ├── auth.js                 (Contains API_BASE_URL)
│   ├── style.css
│   ├── README.md
│   ├── SETUP.md
│   └── .git/
│
├── auth-security-backend/      (Separate Railway Project)
│   ├── app.py                  (Contains CORS config)
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── railway.json
│   ├── .env.example
│   ├── README.md
│   └── .git/
```

## Next Steps

1. Deploy both frontend and backend
2. Test end-to-end authentication
3. Review security vulnerabilities in SECURITY.md
4. Learn attack scenarios in README.md
5. Use as a security learning lab

## Support

See individual READMEs:
- `auth-security-frontend/README.md` - Frontend documentation
- `auth-security-backend/README.md` - Backend documentation
- `SECURITY.md` - Security analysis and vulnerabilities
- `DEPLOYMENT.md` - Detailed deployment instructions
