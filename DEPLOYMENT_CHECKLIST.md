# Deployment Checklist - Hybrid Authentication Security Lab

## ✓ Project Structure (COMPLETE)

```
✓ auth-security-frontend/
  ✓ index.html (ENTRY POINT - GitHub Pages serves this)
  ✓ dashboard.html
  ✓ auth.js (with API_BASE_URL placeholder)
  ✓ style.css (dark cyber theme)
  ✓ README.md
  ✓ SETUP.md

✓ auth-security-backend/
  ✓ app.py (Flask API - 4 endpoints)
  ✓ requirements.txt
  ✓ Dockerfile
  ✓ railway.json
  ✓ .env.example
  ✓ README.md

✓ Documentation/
  ✓ README.md (main overview)
  ✓ INTEGRATION.md (setup guide)
  ✓ DEPLOYMENT.md (deployment steps)
  ✓ SECURITY.md (vulnerability analysis)
  ✓ PROJECT_STRUCTURE.md (file reference)
  ✓ DEPLOYMENT_CHECKLIST.md (this file)
```

## Phase 1: Local Testing

Before deploying to production, test everything locally.

### Backend (Local)

- [ ] Navigate to `auth-security-backend/`
- [ ] Install dependencies: `pip install -r requirements.txt`
- [ ] Start Flask: `python app.py`
- [ ] Verify at `http://localhost:5000/health` (should return JSON)
- [ ] Check 4 endpoints working:
  - [ ] POST `/login` with `admin`/`password123`
  - [ ] GET `/protected` with JWT token
  - [ ] POST `/verify` with token
  - [ ] GET `/health` returns status

### Frontend (Local)

- [ ] Navigate to `auth-security-frontend/`
- [ ] Update `auth.js`: `const API_BASE_URL = 'http://localhost:5000'`
- [ ] Start HTTP server: `python -m http.server 8000`
- [ ] Access `http://localhost:8000`
- [ ] Test login flow:
  - [ ] Username: `admin`, Password: `password123`
  - [ ] Should redirect to dashboard
  - [ ] Should show username and "Authenticated" badge
  - [ ] Refresh page - should stay logged in
  - [ ] Click logout - should go back to login

### Debug Checklist

- [ ] No console errors (F12 Developer Tools)
- [ ] Network tab shows successful requests to backend
- [ ] Local authentication tokens work
- [ ] Session persists on page refresh
- [ ] Logout clears token and redirects

## Phase 2: Deploy Backend (Railway)

### Create Railway Account

- [ ] Sign up at `https://railway.app`
- [ ] Create new project

### Deploy from GitHub

```bash
cd auth-security-backend
git init
git add .
git commit -m "Initial backend deployment"
git remote add origin <your-github-url>
git push -u origin main
```

- [ ] Connect GitHub repo to Railway
- [ ] Railway auto-deploys on push
- [ ] Wait for deployment to complete (2-3 min)
- [ ] Copy deployment URL: `https://your-project.up.railway.app`

### Configure Environment Variables

In Railway dashboard, set:

- [ ] `FLASK_ENV` = `production`
- [ ] `SECRET_KEY` = Generate strong key (e.g., use OpenSSL)
- [ ] `JWT_EXPIRATION_HOURS` = `24`
- [ ] `PORT` = `8080`

### Test Backend on Railway

- [ ] Visit `https://your-project.up.railway.app/health`
- [ ] Should return JSON status
- [ ] Test `/login` endpoint with cURL or Postman:
  ```bash
  curl -X POST https://your-project.up.railway.app/login \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"password123"}'
  ```
- [ ] Should return token
- [ ] Test `/protected` with Bearer token

## Phase 3: Deploy Frontend (GitHub Pages)

### Create GitHub Repository

- [ ] Create repo: `https://github.com/new`
- [ ] Name it `auth-security-frontend`
- [ ] Make it **PUBLIC** (required for Pages)

### Update and Push Frontend

In `auth-security-frontend/auth.js`:
```javascript
const API_BASE_URL = 'https://your-project.up.railway.app'; // Update this
```

Then:
```bash
cd auth-security-frontend
git init
git add .
git commit -m "Add authentication frontend"
git remote add origin https://github.com/yourusername/auth-security-frontend.git
git branch -M main
git push -u origin main
```

- [ ] Files pushed to GitHub
- [ ] Check repo on GitHub (see all files)

### Enable GitHub Pages

In GitHub repository:
1. Go to **Settings** (top right)
2. Scroll to **Pages** section
3. Select **Branch**: `main`
4. Click **Save**
5. Wait 1-2 minutes
6. You'll see: "Your site is live at `https://yourusername.github.io/auth-security-frontend`"

- [ ] GitHub Pages enabled
- [ ] Deployment URL visible
- [ ] Green checkmark appears

## Phase 4: Configure CORS

### Update Backend CORS

Edit `auth-security-backend/app.py` (around line 25):

```python
CORS(
    app,
    origins=[
        "https://yourusername.github.io",  # Your GitHub Pages domain
        "http://localhost:8000"             # Local testing
    ],
    methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"]
)
```

### Redeploy Backend

```bash
cd auth-security-backend
git add app.py
git commit -m "Configure CORS for GitHub Pages"
git push
```

- [ ] CORS updated in code
- [ ] Changes pushed to GitHub
- [ ] Railway auto-deploys (wait 2-3 min)
- [ ] Backend ready for frontend requests

## Phase 5: End-to-End Testing

### Frontend on GitHub Pages

- [ ] Visit your GitHub Pages URL:
  ```
  https://yourusername.github.io/auth-security-frontend
  ```
- [ ] Page loads (not blank)
- [ ] Login form visible
- [ ] Credentials shown: `admin` / `password123`

### Test Login Flow

- [ ] Enter username: `admin`
- [ ] Enter password: `password123`
- [ ] Click "Sign In"
- [ ] Button shows loading spinner
- [ ] Redirects to dashboard (within 1 second)
- [ ] Dashboard displays:
  - [ ] "Authenticated" badge (green)
  - [ ] Username: "admin"
  - [ ] Token Status: "Valid"
  - [ ] Welcome message

### Test Persistence

- [ ] On dashboard, refresh page (F5)
- [ ] Should NOT redirect to login
- [ ] Should show same authenticated state
- [ ] Username still visible

### Test Logout

- [ ] Click "Logout" button
- [ ] Redirects to login page
- [ ] localStorage cleared (check DevTools)
- [ ] Trying to access dashboard directly redirects to login

### Test Error Cases

- [ ] Wrong password → "Invalid credentials" error
- [ ] Empty username → Form validation error
- [ ] No backend response → "Network error" message
- [ ] Expired token → "Session expired" message

## Phase 6: Security Review

- [ ] Review `SECURITY.md` for 10 vulnerabilities
- [ ] Understand each attack scenario in `auth-security-backend/README.md`
- [ ] Identify intentional weak points
- [ ] Don't use in production with real data

## Phase 7: Documentation

- [ ] README.md explains project
- [ ] INTEGRATION.md used for setup
- [ ] DEPLOYMENT.md followed step-by-step
- [ ] PROJECT_STRUCTURE.md referenced for architecture
- [ ] Each folder has own README

## Troubleshooting Guide

### Login doesn't work

1. Check `API_BASE_URL` in frontend `auth.js`
2. Verify Railway backend is running (`/health` endpoint)
3. Check browser console (F12) for errors
4. Verify CORS configured in backend

### CORS error on login

1. Update `app.py` CORS origins with GitHub Pages domain
2. Redeploy backend (push to GitHub)
3. Wait 2-3 minutes for deployment
4. Clear browser cache (Ctrl+Shift+Delete)

### Blank page on GitHub Pages

1. Check repo has all files: `index.html`, `auth.js`, `style.css`, `dashboard.html`
2. Verify GitHub Pages enabled in Settings
3. Try direct file URL: `.../index.html`
4. Check GitHub Actions for deployment status

### Styles not loading

1. Verify `style.css` is in same directory as `index.html`
2. Check that CSS path is relative (not absolute)
3. Clear browser cache
4. Check network tab for failed CSS requests

### Token not persisting

1. Check browser allows localStorage
2. Verify no `Private/Incognito` mode (disables storage)
3. Check localStorage key is `auth_token`
4. Verify token is actually being stored (DevTools → Application)

### Backend returns 500 error

1. Check Railway logs
2. Verify environment variables are set
3. Check for Python syntax errors
4. Restart Railway deployment

## Final Checklist

- [ ] All files in correct location
- [ ] `index.html` is entry point (not `login.html`)
- [ ] Backend deployed to Railway
- [ ] Frontend deployed to GitHub Pages
- [ ] CORS configured for frontend domain
- [ ] API_BASE_URL updated in frontend
- [ ] End-to-end login/logout works
- [ ] Token persists on refresh
- [ ] All documentation reviewed
- [ ] Security vulnerabilities understood

## Success Criteria

When complete, you should be able to:

1. ✓ Visit `https://yourusername.github.io/auth-security-frontend`
2. ✓ See login form with demo credentials
3. ✓ Login with `admin` / `password123`
4. ✓ View dashboard showing authenticated user
5. ✓ Refresh page and stay logged in
6. ✓ Logout and return to login
7. ✓ Understand intentional security vulnerabilities
8. ✓ Use as educational lab for JWT authentication

## Next Steps After Deployment

1. Study the codebase
2. Try to exploit intentional vulnerabilities
3. Learn how fixes would work
4. Modify to add new features
5. Use as portfolio project
6. Share with others learning authentication

## Support

- **Frontend**: `auth-security-frontend/README.md`
- **Backend**: `auth-security-backend/README.md`
- **Setup**: `auth-security-frontend/SETUP.md`
- **Security**: `SECURITY.md`
- **Integration**: `INTEGRATION.md`
- **Architecture**: `PROJECT_STRUCTURE.md`

---

**Status**: Ready for production deployment
**Last Updated**: January 2026
**Version**: 1.0
