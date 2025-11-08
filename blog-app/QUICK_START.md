# Quick Start Guide

## Local Development (XAMPP)

### 1. Database Setup
```sql
-- Open phpMyAdmin and run:
CREATE DATABASE blog_app;
USE blog_app;
-- Then import database/schema.sql
```

### 2. Configuration
Edit `config/database.php`:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'blog_app');
define('DB_USER', 'root');
define('DB_PASS', '');
```

Edit `config/config.php`:
```php
define('BASE_URL', 'http://localhost/blog-app');
```

### 3. Access
Open browser: `http://localhost/blog-app`

## InfinityFree Deployment

### 1. Database Setup
- Create database in InfinityFree control panel
- Import `database/schema.sql` via phpMyAdmin

### 2. Configuration
Edit `config/database.php` with InfinityFree credentials:
```php
define('DB_HOST', 'sqlXXX.epizy.com');
define('DB_NAME', 'epiz_XXXXXX_blogapp');
define('DB_USER', 'epiz_XXXXXX');
define('DB_PASS', 'your_password');
```

Edit `config/config.php`:
```php
define('BASE_URL', 'https://yourdomain.epizy.com');
error_reporting(0); // For production
```

### 3. Upload
- Upload all files via FTP to `htdocs` folder
- Set permissions: Files (644), Directories (755)

### 4. Test
Visit your InfinityFree URL and register an account!

## Default Features

✅ User Registration & Login
✅ Create, Read, Update, Delete Blogs
✅ Markdown Editor with Preview
✅ Search Functionality
✅ Responsive Design
✅ Authorization (users can only edit their own blogs)

## File Structure

```
blog-app/
├── api/          # Backend API endpoints
├── assets/       # CSS and JavaScript
├── config/       # Configuration files
├── database/     # SQL schema
├── includes/     # Header and footer
└── *.php         # Main pages
```

## Troubleshooting

**Database Error?**
- Check credentials in `config/database.php`
- Verify database exists
- Check MySQL service is running

**404 Errors?**
- Verify BASE_URL in `config/config.php`
- Check `.htaccess` file exists

**CSS/JS Not Loading?**
- Verify BASE_URL is correct
- Check file paths in browser console

For detailed instructions, see `README.md` or `INFINITYFREE_DEPLOYMENT.md`

