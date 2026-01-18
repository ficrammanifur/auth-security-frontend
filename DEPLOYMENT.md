# Deployment Guide

Complete step-by-step guide to deploy the Hybrid Authentication Security Lab.

## Frontend Deployment (GitHub Pages)

### Step 1: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `auth-lab` (or similar)
3. Make it Public (required for free GitHub Pages)
4. Click "Create repository"

### Step 2: Push Code to GitHub

```bash
# Navigate to your project
cd /path/to/auth-lab

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: Hybrid Auth Lab"

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/auth-lab.git
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Settings → Pages
3. Under "Build and deployment":
   - Source: Deploy from a branch
   - Branch: `main`
   - Folder: `/ (root)`
4. Save

Your site will be available at: `https://YOUR_USERNAME.github.io/auth-lab`

## Backend Deployment (Railway)

### Step 1: Create Railway Account

1. Visit [railway.app](https://railway.app)
2. Sign up with GitHub
3. Authorize Railway

### Step 2: Create New Project

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create project in the repo directory
cd /path/to/auth-lab
railway init
```

### Step 3: Configure Environment

In Railway Dashboard:

1. Go to your project
2. Click "Variables" tab
3. Add variables:

```
SECRET_KEY=your-super-secret-key-that-is-very-long-and-random
FLASK_ENV=production
PORT=5000
```

For `SECRET_KEY`, generate a strong random string:
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Step 4: Deploy

```bash
# From project directory
railway up
```

Railway will automatically detect the Dockerfile and deploy.

### Step 5: Get Your URL

1. Open Railway Dashboard
2. Click your project
3. Click "Deployments" tab
4. Copy the public URL (looks like: `https://auth-lab-production.up.railway.app`)

## Connect Frontend to Backend

After deploying both, connect them:

### Update `auth.js`

Edit the first line with your Railway URL:

```javascript
const API_BASE_URL = 'https://your-project.up.railway.app';
```

### Commit and Push

```bash
git add auth.js
git commit -m "Update backend URL for production"
git push origin main
```

GitHub Pages will automatically redeploy.

## Verify Deployment

### Test Frontend

1. Visit `https://YOUR_USERNAME.github.io/auth-lab`
2. You should see the login page
3. Try demo credentials: `admin` / `password123`
4. Should redirect to dashboard showing username

### Test Backend

```bash
# Health check
curl https://your-project.up.railway.app/health

# Test login
curl -X POST https://your-project.up.railway.app/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'
```

## Troubleshooting

### "CORS Error" when logging in
- Verify `API_BASE_URL` in `auth.js` matches your Railway URL exactly
- Check Railway backend is running (check deployments tab)
- Verify CORS is enabled in `app.py`

### "404 Not Found" on GitHub Pages
- Ensure `login.html` is in repository root
- Check GitHub Pages settings point to `/ (root)`
- Verify files were pushed to main branch

### "Connection refused" to backend
- Check Railway deployment is active
- Verify SECRET_KEY is set in Railway dashboard
- Check Railway logs for errors: `railway logs`

### Token not working after deployment
- Tokens are valid for 24 hours from issue time
- Try re-logging in to get a fresh token
- Check browser localStorage isn't disabled

## Production Checklist

Before using in production:

- [ ] Change `SECRET_KEY` to a strong random value
- [ ] Enable HTTPS (Railway handles this automatically)
- [ ] Add rate limiting to prevent brute force
- [ ] Implement password hashing (bcrypt)
- [ ] Use a real database instead of in-memory storage
- [ ] Enable CSRF protection
- [ ] Set secure cookie flags
- [ ] Implement refresh tokens
- [ ] Add proper logging and monitoring
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Regular security audits

## Updating Deployment

### Frontend Updates

```bash
# Make changes to HTML/CSS/JS files
git add .
git commit -m "Description of changes"
git push origin main
# GitHub Pages updates automatically (may take 1-2 minutes)
```

### Backend Updates

```bash
# Make changes to Python files
git add app.py  # or other files
git commit -m "Description of changes"
git push origin main
# Railway redeploys automatically (may take 2-5 minutes)
```

## Monitoring

### Check Frontend Health

- Manually visit your GitHub Pages URL
- Check browser console for errors (F12)
- Clear browser cache if needed

### Check Backend Health

```bash
# Via Railway Dashboard
# - Deployments tab shows live status
# - Logs tab shows server output
# - Metrics tab shows CPU/Memory/Network

# Via Terminal
railway logs

# Via Curl
curl https://your-project.up.railway.app/health
```

## Cost Considerations

- **GitHub Pages**: Free
- **Railway**: 
  - Free tier: $5 credit per month
  - Small Flask app uses ~$0.10-0.50/month
  - Generous free tier for learning

## Support

- Railway Docs: https://railway.app/docs
- GitHub Pages: https://pages.github.com
- Flask Docs: https://flask.palletsprojects.com
- JWT: https://jwt.io

---

**Happy deploying!**
