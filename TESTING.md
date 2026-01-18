# Frontend Testing Guide

## Pre-Deployment Checklist

Before pushing to GitHub Pages, test these 4 things locally:

### 1. Check API_BASE_URL is Correct

```bash
# Open auth.js and verify line 4:
const API_BASE_URL = 'https://auth-security-backend-production.up.railway.app';
```

✅ Must be `https://` (not `http://`)
✅ Must be YOUR actual Railway URL
❌ Must NOT be `localhost`

### 2. Verify Backend is Running

```bash
# Test backend health endpoint
curl https://auth-security-backend-production.up.railway.app/health

# Should return:
# {"status":"healthy","timestamp":"2024-01-19T12:00:00"}
```

### 3. Test Locally with Python

```bash
# Terminal 1: Start local server
cd auth-security-frontend
python -m http.server 8000

# Terminal 2: In browser, visit
http://localhost:8000
```

Login test:
- Username: `admin`
- Password: `password123`

Expected result:
- ✅ Login succeeds
- ✅ Redirects to dashboard.html
- ✅ Shows username "admin"
- ✅ Token stored in localStorage

### 4. DevTools Console Check

Open DevTools (F12) → Console tab during login:

```javascript
// Should see:
[v0] Login successful, token stored: {username: "admin", expiresIn: 24}
[v0] Authentication verified: {username: "admin", id: 1}
```

❌ If you see CORS errors or "Network error":
- API_BASE_URL is wrong
- Backend is offline
- CORS headers not set on backend

## Production Deployment Testing

After deploying to GitHub Pages:

### Step 1: Visit Your GitHub Pages URL

```
https://yourusername.github.io/auth-security-frontend/
```

Should load login page with no errors.

### Step 2: Test Login from GitHub Pages

1. Open DevTools (F12)
2. Go to Console tab
3. Login with `admin` / `password123`
4. Watch console for messages

Expected:
```
[v0] Login successful, token stored: {username: "admin", expiresIn: 24}
[v0] Authentication verified: {username: "admin", id: 1}
```

### Step 3: Check Network Tab

In DevTools Network tab during login:

- **POST /login** - Should return 200 with token
- **GET /protected** - Should return 200 with user data

Both should go to `api-base-url.up.railway.app`

### Step 4: Verify localStorage

In DevTools → Application → Storage → localStorage:

Should show:
```
auth_token: eyJ0eXAiOiJKV1QiLCJhbGc...
```

## Common Issues

### Issue: "Network error. Please check the backend URL"

**Cause**: API_BASE_URL wrong or backend offline

**Fix**:
1. Check API_BASE_URL in auth.js (must be HTTPS)
2. Test backend: `curl https://your-url.up.railway.app/health`
3. Verify CORS headers in Flask app.py

### Issue: CORS Error in Console

**Cause**: Backend not allowing your frontend origin

**Fix in app.py**:
```python
CORS(app, origins=["https://yourusername.github.io"])
```

### Issue: Login Works but Dashboard Blank

**Cause**: Redirect not working or /protected endpoint fails

**Fix**:
1. Check browser console for errors
2. Verify /protected endpoint returns user data
3. Check token is stored in localStorage

### Issue: "Your session has expired"

**Cause**: Token invalid or JWT_SECRET mismatch

**Fix**:
1. Check SECRET_KEY in backend app.py
2. Clear localStorage and login again
3. Verify JWT_EXPIRATION_HOURS is set

## Test Credentials

```
username: admin
password: password123

username: user
password: password123
```

## Performance Check

Open DevTools → Network tab:

- Total size should be < 200 KB
- All files should load < 1 second
- No 404 errors

## Security Note

This testing setup exposes:
- Backend URL in frontend code
- JWT tokens in localStorage
- Demo credentials in plain text

This is educational. In production, use environment variables and httpOnly cookies.

## Next Steps

After successful testing:

1. Push code to GitHub
2. Enable GitHub Pages in repository settings
3. Share URL with friends to test!

Related guides:
- `README.md` - Full documentation
- `SETUP.md` - Installation details
- `../DEPLOYMENT.md` - Full deployment guide
