// === CONFIGURATION ===
// Railway Backend URL (PRODUCTION)
// Replace with your actual Railway project URL when deploying
const API_BASE_URL = 'https://auth-security-backend-production.up.railway.app';
const TOKEN_KEY = 'auth_token';

// Login Handler
async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('loginBtn');
    const errorAlert = document.getElementById('errorAlert');
    const errorMessage = document.getElementById('errorMessage');
    
    // Validation
    if (!username || !password) {
        showError('Please enter both username and password');
        return;
    }
    
    // Disable button and show loading state
    loginBtn.disabled = true;
    loginBtn.classList.add('loading');
    errorAlert.classList.add('hidden');
    
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Login failed. Please try again.');
        }
        
        // Store token in localStorage
        if (data.token) {
            localStorage.setItem(TOKEN_KEY, data.token);
            console.log('[v0] Login successful, token stored:', {
                username: data.username,
                expiresIn: data.expiresIn
            });
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 500);
        } else {
            throw new Error('No token received from server');
        }
        
    } catch (error) {
        console.error('[v0] Login error:', error);
        showError(error.message || 'Network error. Please check the backend URL.');
        loginBtn.disabled = false;
        loginBtn.classList.remove('loading');
    }
}

// Verify Authentication
async function verifyAuth() {
    const token = localStorage.getItem(TOKEN_KEY);
    const errorAlert = document.getElementById('errorAlert');
    const loadingAlert = document.getElementById('loadingAlert');
    
    if (!token) {
        console.log('[v0] No token found, redirecting to login');
        window.location.href = 'login.html';
        return;
    }
    
    // Show loading state
    if (loadingAlert) {
        loadingAlert.classList.remove('hidden');
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/protected`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            console.log('[v0] Token invalid, clearing storage');
            localStorage.removeItem(TOKEN_KEY);
            throw new Error(data.message || 'Authentication failed');
        }
        
        // Update UI with user data
        if (document.getElementById('displayUsername')) {
            document.getElementById('displayUsername').textContent = data.username || 'User';
            document.getElementById('statusText').textContent = `Welcome back, ${data.username}!`;
            document.getElementById('tokenStatus').textContent = 'Valid';
        }
        
        console.log('[v0] Authentication verified:', data);
        
    } catch (error) {
        console.error('[v0] Auth verification failed:', error);
        
        if (document.getElementById('errorAlert')) {
            document.getElementById('errorMessage').textContent = 
                'Your session has expired. Please login again.';
            document.getElementById('errorAlert').classList.remove('hidden');
        }
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
            localStorage.removeItem(TOKEN_KEY);
            window.location.href = 'login.html';
        }, 2000);
    } finally {
        if (loadingAlert) {
            loadingAlert.classList.add('hidden');
        }
    }
}

// Logout Handler
function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    console.log('[v0] User logged out');
    window.location.href = 'login.html';
}

// Utility: Show Error Message
function showError(message) {
    const errorAlert = document.getElementById('errorAlert');
    const errorMessage = document.getElementById('errorMessage');
    
    if (errorAlert && errorMessage) {
        errorMessage.textContent = message;
        errorAlert.classList.remove('hidden');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorAlert.classList.add('hidden');
        }, 5000);
    }
}

// Global error handler for debugging
window.addEventListener('error', (event) => {
    console.error('[v0] Global error:', event.error);
});
