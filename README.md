# Frontend - Hybrid Authentication Security Lab

Modern, portfolio-grade frontend for JWT authentication learning. Pure HTML/CSS/JavaScript with dark cyber theme and neon accents.

## Overview

This frontend implements a complete authentication flow with login and protected dashboard pages. It's an **educational security lab** demonstrating JWT token handling, localStorage management, and API communication patterns.

**Demo Credentials**: `admin` / `password123`

Note: This application intentionally includes security vulnerabilities for learning purposes. See the security section below.

## Files

- `login.html` - Login page with form validation and error handling
- `dashboard.html` - Protected dashboard showing authenticated user info
- `auth.js` - JWT token handling and API communication logic
- `style.css` - Dark theme styling with animations and responsive design

## Features

✨ **Modern Design**
- Dark cyber theme with neon cyan/green accents
- Smooth animations and transitions
- Responsive mobile-first layout
- Light mode support via system preferences

🔐 **Authentication**
- JWT token storage in localStorage
- Automatic token verification on dashboard load
- Token expiration handling with auto-redirect
- Secure logout functionality

📡 **API Integration**
- POST /login - User authentication
- GET /protected - Protected endpoint verification
- Error handling and retry logic
- CORS-compatible requests

🎯 **UX Polish**
- Loading states on login button
- Real-time form validation
- Auto-dismissing error alerts
- Accessibility features (ARIA, semantic HTML)

## Setup

### 1. Update Backend URL

Edit `auth.js` and replace the placeholder URL:

```javascript
const API_BASE_URL = 'https://your-railway-backend.up.railway.app';
```

Replace with your actual Railway backend URL.

### 2. Deploy to GitHub Pages

```bash
# Push to GitHub repository
git add .
git commit -m "Add frontend"
git push origin main
```

Then enable GitHub Pages in repository settings:
1. Go to Settings → Pages
2. Select `main` branch as source
3. Your site will be available at `https://yourusername.github.io/yourrepo`

### 3. Local Testing

Serve files locally (requires CORS-enabled backend):

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Using Live Server (VS Code)
# Right-click index.html → Open with Live Server
```

Access at `http://localhost:8000` (or the port shown)

## Configuration

### API Base URL

The `API_BASE_URL` constant in `auth.js` determines which backend to communicate with:

```javascript
const API_BASE_URL = 'https://your-railway-backend.up.railway.app';
```

### Token Storage

Tokens are stored in browser localStorage under the key `auth_token`:

```javascript
const TOKEN_KEY = 'auth_token';
```

## Security Notes

⚠️ **This is an educational project demonstrating intentional vulnerabilities**

### Current Vulnerabilities

1. **localStorage Token Storage** - Tokens stored in localStorage are vulnerable to XSS attacks
2. **Missing HTTPS Requirement** - Should enforce HTTPS in production
3. **No CSRF Protection** - Missing anti-CSRF tokens
4. **No Rate Limiting** - Frontend doesn't rate limit login attempts
5. **Plaintext API URL** - Backend URL visible in client-side code

### Production Improvements

- Use httpOnly secure cookies instead of localStorage
- Implement refresh token rotation
- Add CSRF token validation
- Implement client-side rate limiting
- Use environment variables for API URL
- Add Content Security Policy (CSP) headers
- Implement token encryption in transit (HTTPS only)
- Add request signing/integrity verification

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### "Backend URL" Error

Make sure the `API_BASE_URL` in `auth.js` points to your running Flask backend.

### CORS Errors

The backend must have CORS enabled and include your frontend origin:

```python
CORS(app, origins=["https://yourusername.github.io"])
```

### Token Expires Immediately

Check that `JWT_EXPIRATION_HOURS` on the backend is set appropriately (default: 24 hours).

### Dashboard Blank After Login

Check browser console (F12) for errors. Ensure the `/protected` endpoint on backend is working.

## Performance

- No external dependencies (pure vanilla JS)
- CSS animations use GPU acceleration
- Minimal JavaScript (~5KB gzipped)
- Zero build process required

## API Endpoints Used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/login` | Authenticate user, receive JWT |
| GET | `/protected` | Verify token, get user data |
| GET | `/health` | Backend health check |

## Development

### Adding Features

1. **New Form Fields** - Add to login.html and update JavaScript validation
2. **UI Changes** - Modify style.css with the defined CSS variables
3. **API Calls** - Add fetch requests in auth.js with error handling
4. **New Pages** - Create HTML file and link from navigation

### Code Organization

- `login.html` - Entry point with form
- `dashboard.html` - Protected view after authentication
- `auth.js` - All API and auth logic (single responsibility)
- `style.css` - All styling (no inline styles)

## License

Educational purpose only. Use for learning authentication concepts.

## Related

- Backend: `/auth-security-backend/README.md`
- Main Project: `/README.md`
- Security Analysis: `/SECURITY.md`
- Deployment Guide: `/DEPLOYMENT.md`
