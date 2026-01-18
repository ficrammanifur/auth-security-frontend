# Frontend Setup Guide

## Quick Start

### 1. Local Testing (Recommended First)

```bash
# Navigate to frontend directory
cd auth-security-frontend

# Start a simple HTTP server
python -m http.server 8000
# Or: npx http-server
```

Visit `http://localhost:8000` in your browser.

### 2. Update API URL

Edit `auth.js` line 3:

```javascript
// LOCAL TESTING
const API_BASE_URL = 'http://localhost:5000';

// PRODUCTION (Railway)
const API_BASE_URL = 'https://your-project.up.railway.app';
```

### 3. Test Login

Use demo credentials:
- **Username**: `admin`
- **Password**: `password123`

## File Structure

```
auth-security-frontend/
├── index.html          Main entry point (GitHub Pages serves this)
├── dashboard.html      Protected page after login
├── auth.js             All authentication logic
├── style.css           Styling (dark cyber theme)
├── README.md           Full documentation
└── SETUP.md            This file
```

## GitHub Pages Deployment

### Prerequisites

- GitHub account
- Git installed locally
- Repository created

### Steps

1. **Clone your repo**:
   ```bash
   git clone https://github.com/yourusername/yourrepo.git
   cd yourrepo
   ```

2. **Copy frontend files** to root or `docs/` folder:
   ```
   yourrepo/
   ├── index.html
   ├── dashboard.html
   ├── auth.js
   ├── style.css
   └── README.md
   ```

3. **Update API URL** in `auth.js`:
   ```javascript
   const API_BASE_URL = 'https://your-railway-backend.up.railway.app';
   ```

4. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Add authentication frontend"
   git push origin main
   ```

5. **Enable GitHub Pages**:
   - Go to Settings → Pages
   - Select `main` branch
   - Click Save
   - Wait ~1-2 minutes for deployment

6. **Access your site**:
   - `https://yourusername.github.io/yourrepo`
   - GitHub automatically serves `index.html`

## Troubleshooting

### Issue: Blank page on GitHub Pages
- **Solution**: Ensure `index.html` is in the root directory
- **Check**: Go to your repo settings → Pages → verify source is `main` branch

### Issue: Login doesn't work
- **Solution 1**: Update `API_BASE_URL` to your Railway backend URL
- **Solution 2**: Ensure backend CORS is configured for your GitHub Pages domain

### Issue: "Cannot GET /dashboard.html"
- **Solution**: This is normal - `dashboard.html` is loaded via JavaScript, not as a direct URL

### Issue: Styles not loading
- **Solution**: Check that `style.css` path is correct (should be in same directory as `index.html`)

## CORS Configuration

If using Railway backend, update `app.py` to allow your GitHub Pages domain:

```python
CORS(
    app,
    origins=[
        "https://yourusername.github.io",
        "http://localhost:8000"  # for local testing
    ],
    methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"]
)
```

## Local Backend Setup

To run backend locally for testing:

```bash
# Terminal 1: Backend
cd auth-security-backend
pip install -r requirements.txt
python app.py
# Runs on http://localhost:5000

# Terminal 2: Frontend
cd auth-security-frontend
python -m http.server 8000
# Runs on http://localhost:8000
```

Then in `auth.js`, set:
```javascript
const API_BASE_URL = 'http://localhost:5000';
```

## Security Notes

⚠️ **Before Production**

- [ ] Update `API_BASE_URL` to use HTTPS
- [ ] Backend CORS must be configured for your domain
- [ ] Use environment variables for sensitive URLs (if possible)
- [ ] Enable HTTPS on both frontend and backend
- [ ] Consider using httpOnly cookies instead of localStorage
- [ ] Implement rate limiting on login attempts

## Next Steps

1. Setup backend on Railway: `/auth-security-backend/README.md`
2. Configure CORS between frontend and backend
3. Deploy frontend to GitHub Pages
4. Test end-to-end authentication flow

## Support

See main README for architecture overview and security analysis.
