<?php
$pageTitle = 'Register';
require_once 'includes/header.php';

if (isLoggedIn()) {
    redirect(BASE_URL . '/index.php');
}
?>
<main class="main-content">
    <div class="container">
        <div class="auth-container">
            <div class="auth-card">
                <h1><i class="fas fa-user-plus"></i> Register</h1>
                <p class="auth-subtitle">Create a new account to start blogging.</p>
                
                <form id="registerForm" class="auth-form">
                    <div id="errorMessages" class="error-messages"></div>
                    
                    <div class="form-group">
                        <label for="username">Username *</label>
                        <input type="text" id="username" name="username" class="form-control" required 
                               placeholder="Choose a username" minlength="3">
                    </div>
                    
                    <div class="form-group">
                        <label for="email">Email *</label>
                        <input type="email" id="email" name="email" class="form-control" required 
                               placeholder="your.email@example.com">
                    </div>
                    
                    <div class="form-group">
                        <label for="password">Password *</label>
                        <input type="password" id="password" name="password" class="form-control" required 
                               placeholder="At least 6 characters" minlength="6">
                    </div>
                    
                    <div class="form-group">
                        <label for="confirm_password">Confirm Password *</label>
                        <input type="password" id="confirm_password" name="confirm_password" class="form-control" required 
                               placeholder="Re-enter your password">
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-block">
                        <i class="fas fa-user-plus"></i> Register
                    </button>
                    
                    <p class="auth-footer">
                        Already have an account? <a href="<?php echo BASE_URL; ?>/login.php">Login here</a>
                    </p>
                </form>
            </div>
        </div>
    </div>
</main>
<script src="<?php echo assetUrl('/assets/js/auth.js'); ?>"></script>
<?php require_once 'includes/footer.php'; ?>

