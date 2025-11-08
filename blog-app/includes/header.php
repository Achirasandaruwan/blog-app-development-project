<?php
require_once __DIR__ . '/../config/config.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
    <meta name="base-url" content="<?php echo BASE_URL; ?>">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="format-detection" content="telephone=no">
    <title><?php echo isset($pageTitle) ? escape($pageTitle) . ' - ' : ''; ?>Blog App</title>
    <?php 
    // Try assetUrl first, fallback to direct path
    $cssUrl = assetUrl('/assets/css/style.css');
    $cssFallback = BASE_URL . '/assets/css/style.css';
    ?>
    <link rel="stylesheet" href="<?php echo $cssUrl; ?>" onerror="this.onerror=null; this.href='<?php echo $cssFallback; ?>';">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer">
    <style>
        
        * { -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; }
        body { 
            margin: 0; 
            padding: 0; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 0 20px; 
            width: 100%;
        }
        .loading { 
            text-align: center; 
            padding: 2rem; 
        }
        .error-messages { 
            background: #fee; 
            border: 1px solid #fcc; 
            padding: 1rem; 
            margin: 1rem 0; 
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="container">
            <div class="nav-brand">
                <a href="<?php echo BASE_URL; ?>/index.php">
                    <i class="fas fa-blog"></i> Blog App
                </a>
            </div>
            <div class="nav-menu">
                <a href="<?php echo BASE_URL; ?>/index.php" class="nav-link">
                    <i class="fas fa-home"></i> Home
                </a>
                <?php if (isLoggedIn()): ?>
                    <a href="<?php echo BASE_URL; ?>/editor.php" class="nav-link">
                        <i class="fas fa-plus"></i> New Post
                    </a>
                    <div class="nav-user">
                        <span class="nav-link">
                            <i class="fas fa-user"></i> <?php echo escape($_SESSION['username']); ?>
                        </span>
                        <a href="<?php echo BASE_URL; ?>/api/auth/logout.php" class="nav-link btn-logout">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </a>
                    </div>
                <?php else: ?>
                    <a href="<?php echo BASE_URL; ?>/login.php" class="nav-link">
                        <i class="fas fa-sign-in-alt"></i> Login
                    </a>
                    <a href="<?php echo BASE_URL; ?>/register.php" class="nav-link btn-primary">
                        <i class="fas fa-user-plus"></i> Register
                    </a>
                <?php endif; ?>
            </div>
            <button class="nav-toggle" id="navToggle">
                <i class="fas fa-bars"></i>
            </button>
        </div>
    </nav>

