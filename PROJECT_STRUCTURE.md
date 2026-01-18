# Project Structure - Hybrid Authentication Security Lab

## Complete Repository Layout

```
auth-security-lab/
│
├── 📁 auth-security-frontend/          ← Deploy to GitHub Pages
│   ├── index.html                      ← ENTRY POINT (root landing)
│   ├── dashboard.html                  ← Protected page
│   ├── auth.js                         ← All JS logic & API calls
│   ├── style.css                       ← Dark theme styling
│   ├── README.md                       ← Frontend docs
│   ├── SETUP.md                        ← Local dev guide
│   └── .git/                           ← GitHub repo
│
├── 📁 auth-security-backend/           ← Deploy to Railway
│   ├── app.py                          ← Flask API (4 endpoints)
│   ├── requirements.txt                ← Dependencies
│   ├── Dockerfile                      ← Container config
│   ├── railway.json                    ← Railway metadata
│   ├── .env.example                    ← Env vars template
│   ├── README.md                       ← Backend docs
│   └── .git/                           ← GitHub repo (optional)
│
├── README.md                           ← Main project overview
├── INTEGRATION.md                      ← Frontend-backend setup
├── DEPLOYMENT.md                       ← Deployment guide
├── SECURITY.md                         ← Vulnerability analysis
├── PROJECT_STRUCTURE.md                ← This file
└── .gitignore                          ← Git ignore rules
```

## Quick Reference

### Frontend (Pure HTML/CSS/JS)

| File | Purpose | Size |
|------|---------|------|
| `index.html` | Login form & entry point | 66 lines |
| `dashboard.html` | Protected dashboard | 61 lines |
| `auth.js` | JWT & API logic | 158 lines |
| `style.css` | Dark cyber theme | 566 lines |

**Total**: ~850 lines, zero dependencies

### Backend (Flask API)

| File | Purpose |
|------|---------|
| `app.py` | Flask app with 4 JWT endpoints | 336 lines |
| `requirements.txt` | Python packages (Flask, PyJWT, CORS) | 7 lines |
| `Dockerfile` | Production container | 21 lines |
| `railway.json` | Railway deployment config | 12 lines |

**Total**: ~376 lines of code

### Documentation

| File | Content |
|------|---------|
| `README.md` | Main project architecture & overview |
| `INTEGRATION.md` | Step-by-step frontend-backend setup |
| `DEPLOYMENT.md` | Detailed deployment to GitHub Pages & Railway |
| `SECURITY.md` | 10 intentional vulnerabilities explained |
| `auth-security-frontend/SETUP.md` | Local development guide |
| `auth-security-frontend/README.md` | Frontend-specific docs |
| `auth-security-backend/README.md` | Backend-specific docs |

## Deployment Architecture

```
GitHub Pages                    Railway.app
┌──────────────────┐           ┌──────────────────┐
│  index.html      │           │  Flask API       │
│  dashboard.html  │──────────→│  ✓ /login        │
│  auth.js         │ HTTPS     │  ✓ /protected    │
│  style.css       │ JWT       │  ✓ /verify       │
│                  │ Bearer    │  ✓ /health       │
└──────────────────┘           └──────────────────┘

your-username.github.io     your-project.up.railway.app
```

## Entry Points

### Frontend
- **Local Dev**: `http://localhost:8000/index.html` (or just `http://localhost:8000`)
- **GitHub Pages**: `https://username.github.io/repo/` (GitHub serves `index.html` automatically)

### Backend
- **Local Dev**: `http://localhost:5000`
- **Railway**: `https://your-project.up.railway.app`

## API Endpoints

### Provided by Backend

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/` | No | API info |
| GET | `/health` | No | Health check |
| POST | `/login` | No | Get JWT token |
| GET | `/protected` | Yes | Protected resource |
| POST | `/verify` | No | Verify token validity |

### Frontend Calls

```javascript
// Login
POST /login
{ username, password }
← { token, username, expiresIn }

// Dashboard Load
GET /protected
Authorization: Bearer {token}
← { username, message }

// Logout
localStorage.removeItem('auth_token')
```

## Configuration Files

### auth.js (Frontend)
```javascript
const API_BASE_URL = 'https://your-project.up.railway.app'; // Update this
const TOKEN_KEY = 'auth_token';
```

### app.py (Backend)
```python
CORS(app, origins=["https://username.github.io"]) # Update this
SECRET_KEY = os.getenv('SECRET_KEY', 'weak-key')   # Update in Railway
```

### .env.example (Backend)
```
FLASK_ENV=production
SECRET_KEY=your-strong-key-here
JWT_EXPIRATION_HOURS=24
PORT=8080
```

## Setup Checklist

- [ ] Frontend files in correct location
- [ ] `index.html` is entry point (not `login.html`)
- [ ] `auth.js` has correct `API_BASE_URL`
- [ ] Backend deployed to Railway
- [ ] Backend CORS configured for frontend domain
- [ ] GitHub Pages enabled and serving files
- [ ] Test login with `admin` / `password123`
- [ ] Verify token persists on page refresh
- [ ] Review SECURITY.md for vulnerabilities

## Next Steps

1. **Local Testing**:
   - Start backend: `python app.py`
   - Start frontend: `python -m http.server 8000`
   - Test at `http://localhost:8000`

2. **Deploy Frontend**:
   - Push to GitHub
   - Enable GitHub Pages
   - Site available at `https://username.github.io/repo`

3. **Deploy Backend**:
   - Deploy to Railway
   - Get production URL
   - Update frontend `auth.js`

4. **Connect**:
   - Update backend CORS for frontend domain
   - Test end-to-end authentication
   - Review security documentation

## Key Files to Modify

**Before Deployment:**

1. `auth-security-frontend/auth.js` - Update `API_BASE_URL`
2. `auth-security-backend/app.py` - Update CORS origins
3. Railway environment variables - Set `SECRET_KEY`

**Everything else** is ready to use as-is.

## Repository Types

- **Frontend Repository**: GitHub (public for Pages)
- **Backend Repository**: Optional (can use Railway's built-in Git)
- **Documentation**: Can be in either repo or separate

## Important Notes

⚠️ **Frontend Entry Point**
- Must be `index.html` (GitHub Pages serves this automatically)
- Don't access via `/login.html` URL
- Reference other files relatively: `dashboard.html`, `auth.js`

⚠️ **Security**
- This is an **educational lab** with intentional vulnerabilities
- Review SECURITY.md before using in production
- Don't store real user data
- Use for learning purposes only

⚠️ **API Communication**
- Frontend uses localStorage (not secure in production)
- All requests use Bearer tokens
- CORS must be configured on backend
- HTTPS required for production

## File Sizes

```
auth-security-frontend/
  index.html      66 lines  (~2 KB)
  dashboard.html  61 lines  (~2 KB)
  auth.js        158 lines  (~6 KB)
  style.css      566 lines (~18 KB)
  Total         851 lines (~28 KB)

auth-security-backend/
  app.py         336 lines (~12 KB)
  requirements   7 lines    (~1 KB)
  Dockerfile     21 lines   (~1 KB)
  Total         364 lines (~14 KB)

Documentation
  README.md      612 lines
  INTEGRATION.md 306 lines
  SECURITY.md    527 lines
  Total        1445 lines
```

## Support

See individual documentation:
- `auth-security-frontend/README.md` - Frontend help
- `auth-security-backend/README.md` - Backend help
- `SECURITY.md` - Security analysis
- `INTEGRATION.md` - Setup help
- `DEPLOYMENT.md` - Deployment help
