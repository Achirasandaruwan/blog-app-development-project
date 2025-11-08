// Use window.to base url to avioid conflicts when multiple scripts are loaded
if (typeof window.BASE_URL === 'undefined') {
    const baseUrlMeta = document.querySelector('meta[name="base-url"]');
    if (baseUrlMeta) {
        window.BASE_URL = baseUrlMeta.getAttribute('content');
    } else {
        const path = window.location.pathname;
        const pathParts = path.split('/').filter(p => p);
        if (pathParts.length > 0 && pathParts[0] === 'blog-app') {
            window.BASE_URL = window.location.origin + '/blog-app';
        } else {
            window.BASE_URL = window.location.origin;
        }
    }
}
const appBaseUrl = window.BASE_URL;

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await handleLogin();
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await handleRegister();
        });
    }
});

async function handleLogin() {
    const form = document.getElementById('loginForm');
    const errorDiv = document.getElementById('errorMessages');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    errorDiv.innerHTML = '';
    errorDiv.classList.remove('active');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    try {
        const response = await fetch(`${appBaseUrl}/api/auth/login.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(data).toString()
        });
        
        const result = await response.json();
        
        if (result.success) {
            window.location.href = appBaseUrl + '/index.php';
        } else {
            const errors = result.errors || [result.error || 'Login failed'];
            errorDiv.innerHTML = '<ul>' + errors.map(e => '<li>' + escapeHtml(e) + '</li>').join('') + '</ul>';
            errorDiv.classList.add('active');
        }
    } catch (error) {
        errorDiv.innerHTML = '<ul><li>Error: ' + escapeHtml(error.message) + '</li></ul>';
        errorDiv.classList.add('active');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

async function handleRegister() {
    const form = document.getElementById('registerForm');
    const errorDiv = document.getElementById('errorMessages');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    errorDiv.innerHTML = '';
    errorDiv.classList.remove('active');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validate password match
    if (data.password !== data.confirm_password) {
        errorDiv.innerHTML = '<ul><li>Passwords do not match</li></ul>';
        errorDiv.classList.add('active');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        return;
    }
    
    try {
        const response = await fetch(`${appBaseUrl}/api/auth/register.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(data).toString()
        });
        
        const result = await response.json();
        
        if (result.success) {
            window.location.href = appBaseUrl + '/index.php';
        } else {
            const errors = result.errors || [result.error || 'Registration failed'];
            errorDiv.innerHTML = '<ul>' + errors.map(e => '<li>' + escapeHtml(e) + '</li>').join('') + '</ul>';
            errorDiv.classList.add('active');
        }
    } catch (error) {
        errorDiv.innerHTML = '<ul><li>Error: ' + escapeHtml(error.message) + '</li></ul>';
        errorDiv.classList.add('active');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

