    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand">
                    <h3 class="footer-title">
                        <i class="fas fa-blog"></i> Blog App
                    </h3>
                    <p class="footer-description">
                        Share your thoughts, ideas, and stories with the world.
                        A modern platform for bloggers to express themselves.
                    </p>
                    <div class="footer-social">
                        <a href="https://www.facebook.com/achira.sandaruwan.9" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                        <a href="https://www.linkedin.com/in/achira-sandaruwan-7802b6306/" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>
                    </div>
                </div>

                <div class="footer-links-group">
                    <div class="footer-section">
                        <h4 class="footer-heading">Quick Links</h4>
                        <ul class="footer-links">
                            <li><a href="<?php echo BASE_URL; ?>/index.php"><i class="fas fa-home"></i> Home</a></li>
                            <?php if (isLoggedIn()): ?>
                                <li><a href="<?php echo BASE_URL; ?>/editor.php"><i class="fas fa-plus"></i> Create Post</a></li>
                                <li><a href="<?php echo BASE_URL; ?>/api/auth/logout.php"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
                            <?php else: ?>
                                <li><a href="<?php echo BASE_URL; ?>/login.php"><i class="fas fa-sign-in-alt"></i> Login</a></li>
                                <li><a href="<?php echo BASE_URL; ?>/register.php"><i class="fas fa-user-plus"></i> Register</a></li>
                            <?php endif; ?>
                        </ul>
                    </div>

                    <div class="footer-section">
                        <h4 class="footer-heading">Resources</h4>
                        <ul class="footer-links">
                            <li><a href="#"><i class="fas fa-edit"></i> Markdown Editor</a></li>
                            <li><a href="#"><i class="fas fa-search"></i> Search Blogs</a></li>
                            <li><a href="#"><i class="fas fa-user-shield"></i> Secure Platform</a></li>
                            <li><a href="#"><i class="fas fa-mobile-alt"></i> Responsive Design</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="footer-meta">
                <div class="footer-legal">
                    <a href="#">Privacy Policy</a>
                    <span>•</span>
                    <a href="#">Terms of Service</a>
                    <span>•</span>
                    <a href="#">Cookie Policy</a>
                </div>
            </div>

            <div class="footer-bottom">
                <p>&copy; <?php echo date('Y'); ?> Blog App &middot; Web Development Project</p>
            </div>
        </div>
    </footer>
    <script src="<?php echo assetUrl('/assets/js/main.js'); ?>" crossorigin="anonymous"></script>
</body>
</html>

