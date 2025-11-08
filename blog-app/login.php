<?php
$pageTitle = 'Login';
require_once 'includes/header.php';

if (isLoggedIn()) {
    redirect(BASE_URL . '/index.php');
}
?>
<main class="main-content">
    <div class="container">
        <div class="auth-container">
            <div class="auth-card">
                <h1><i class="fas fa-sign-in-alt"></i> Login</h1>
                <p class="auth-subtitle">Welcome back! Please login to your account.</p>
                
                <form id="loginForm" class="auth-form">
                    <div id="errorMessages" class="error-messages"></div>
                    
                    <div class="form-group">
                        <label for="email">Email *</label>
                        <input type="email" id="email" name="email" class="form-control" required 
                               placeholder="your.email@example.com">
                    </div>
                    
                    <div class="form-group">
                        <label for="password">Password *</label>
                        <input type="password" id="password" name="password" class="form-control" required 
                               placeholder="Enter your password">
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-block">
                        <i class="fas fa-sign-in-alt"></i> Login
                    </button>
                    
                    <p class="auth-footer">
                        Don't have an account? <a href="<?php echo BASE_URL; ?>/register.php">Register here</a>
                    </p>
                </form>
            </div>
        </div>
    </div>
</main>
<script src="<?php echo assetUrl('/assets/js/auth.js'); ?>"></script>
<?php require_once 'includes/footer.php'; ?>

