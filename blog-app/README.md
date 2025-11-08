# Blog Application

A full-featured blog application built with HTML, CSS, JavaScript (frontend), PHP (backend), and MySQL (database).

## Features

### User Authentication & Authorization
- User registration and login
- Secure password hashing
- Session management
- Authorization ensures users can only edit/delete their own blogs

### Blog Management
- Create, read, update, and delete blog posts
- Markdown editor with live preview
- Search functionality with result count
- Pagination for blog listings
- Responsive design for all devices

### Frontend Features
- Modern, professional UI design
- Responsive layout (mobile, tablet, desktop)
- Single blog view page
- Blog editor with Markdown support
- Clean and intuitive user interface

## Project Structure

```
blog-app/
├── api/
│   ├── auth/
│   │   ├── login.php
│   │   ├── register.php
│   │   └── logout.php
│   └── blogs/
│       ├── create.php
│       ├── update.php
│       ├── delete.php
│       └── get.php
├── assets/
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── main.js
│       ├── blog.js
│       ├── editor.js
│       └── auth.js
├── config/
│   ├── config.php
│   └── database.php
├── database/
│   └── schema.sql
├── includes/
│   ├── header.php
│   └── footer.php
├── index.php
├── blog.php
├── editor.php
├── login.php
├── register.php
├── .htaccess
└── README.md
```

## Local Setup (XAMPP)

### Prerequisites
- XAMPP installed and running
- PHP 7.4 or higher
- MySQL/MariaDB

### Installation Steps

1. **Place the project in XAMPP htdocs folder**
   ```
   C:\xampp\htdocs\blog-app
   ```

2. **Create the database**
   - Open phpMyAdmin (http://localhost/phpmyadmin)
   - Import the `database/schema.sql` file
   - Or run the SQL commands manually

3. **Configure database connection**
   - Open `config/database.php`
   - Update the database credentials if needed:
     ```php
     define('DB_HOST', 'localhost');
     define('DB_NAME', 'blog_app');
     define('DB_USER', 'root');
     define('DB_PASS', '');
     ```

4. **Configure base URL**
   - Open `config/config.php`
   - Ensure BASE_URL is set correctly:
     ```php
     define('BASE_URL', 'http://localhost/blog-app');
     ```

5. **Start Apache and MySQL in XAMPP Control Panel**

6. **Access the application**
   - Open your browser and navigate to: `http://localhost/blog-app`

## Hosting on InfinityFree

### Prerequisites
- InfinityFree account (free hosting)
- FTP client (FileZilla, WinSCP, etc.)
- Database access from InfinityFree control panel

### Deployment Steps

1. **Create a database on InfinityFree**
   - Log in to your InfinityFree control panel
   - Go to "MySQL Databases"
   - Create a new database (note the database name)
   - Create a database user and password
   - Grant all privileges to the user

2. **Update configuration files**
   - Open `config/database.php`
   - Update with your InfinityFree database credentials:
     ```php
     define('DB_HOST', 'sqlXXX.epizy.com'); // Your InfinityFree MySQL host
     define('DB_NAME', 'epiz_XXXXXX_blogapp'); // Your database name
     define('DB_USER', 'epiz_XXXXXX'); // Your database username
     define('DB_PASS', 'your_password'); // Your database password
     ```
   
   - Open `config/config.php`
   - Update BASE_URL with your InfinityFree domain:
     ```php
     define('BASE_URL', 'https://yourdomain.epizy.com');
     ```

3. **Create database tables**
   - Use phpMyAdmin in InfinityFree control panel
   - Select your database
   - Import `database/schema.sql` or run the SQL commands manually

4. **Upload files via FTP**
   - Connect to your InfinityFree FTP server
   - Upload all files to the `htdocs` or `public_html` directory
   - Ensure file permissions are correct (644 for files, 755 for directories)

5. **Configure .htaccess**
   - The `.htaccess` file is already included for URL rewriting
   - Ensure it's uploaded to the root directory

6. **Test your application**
   - Visit your InfinityFree URL
   - Register a new account
   - Create your first blog post

### Important Notes for InfinityFree

- **File Permissions**: Ensure PHP files have 644 permissions
- **Directory Permissions**: Directories should have 755 permissions
- **PHP Version**: InfinityFree supports PHP 7.4 and 8.0
- **Database Limits**: Free accounts have database size limits
- **Error Reporting**: Set `error_reporting(0)` in production (update `config/config.php`)

## Database Schema

### User Table
- `id` - Primary key
- `username` - Unique username
- `email` - Unique email address
- `password` - Hashed password
- `role` - User role (default: 'user')
- `created_at` - Timestamp

### BlogPost Table
- `id` - Primary key
- `user_id` - Foreign key to user table
- `title` - Blog post title
- `content` - Blog post content (Markdown supported)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## Security Features

- Password hashing using PHP's `password_hash()`
- Prepared statements to prevent SQL injection
- XSS protection with `htmlspecialchars()`
- Session-based authentication
- Authorization checks for blog operations
- CSRF protection (can be enhanced)

## Markdown Support

The blog editor supports the following Markdown features:
- Headers (# ## ###)
- **Bold** text
- *Italic* text
- `Inline code`
- Code blocks
- Links
- Blockquotes
- Lists

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Troubleshooting

### Database Connection Error
- Verify database credentials in `config/database.php`
- Ensure MySQL service is running
- Check database name, username, and password

### 404 Errors
- Verify BASE_URL in `config/config.php`
- Check `.htaccess` file is present
- Ensure mod_rewrite is enabled (for InfinityFree)

### Session Issues
- Check PHP session configuration
- Verify file permissions
- Clear browser cookies

### Permission Denied
- Check file and directory permissions
- Ensure PHP has write access to session directory

## License

This project is open source and available for educational purposes.

## Support

For issues or questions, please check:
- InfinityFree documentation: https://infinityfree.net/support/
- PHP documentation: https://www.php.net/docs.php
- MySQL documentation: https://dev.mysql.com/doc/

