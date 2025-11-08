// Blog Editor JavaScript

// Get BASE_URL from meta tag or calculate from current location
// Use window.BASE_URL to avoid conflicts when multiple scripts are loaded
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
    const form = document.getElementById('blogForm');
    const titleInput = document.getElementById('title');
    const contentTextarea = document.getElementById('content');
    const previewDiv = document.getElementById('preview');
    const previewToggle = document.getElementById('previewToggle');
    const cancelBtn = document.getElementById('cancelBtn');
    const toolbarBtns = document.querySelectorAll('.toolbar-btn');
    
    // Load blog if editing
    if (editId > 0) {
        loadBlog(editId);
    }
    
    // Preview toggle
    if (previewToggle) {
        previewToggle.addEventListener('click', function() {
            previewDiv.classList.toggle('active');
            if (previewDiv.classList.contains('active')) {
                updatePreview();
            }
        });
    }
    
    // Update preview on content change
    if (contentTextarea) {
        contentTextarea.addEventListener('input', function() {
            if (previewDiv.classList.contains('active')) {
                updatePreview();
            }
        });
    }
    
    // Toolbar buttons
    toolbarBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const command = this.dataset.command;
            insertMarkdown(command);
        });
    });
    
    // Form submission
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            await saveBlog();
        });
    }
    
    // Cancel button
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
                window.location.href = appBaseUrl + '/index.php';
            }
        });
    }
});

async function loadBlog(id) {
    try {
        const response = await fetch(`${appBaseUrl}/api/blogs/get.php?id=${id}`);
        const data = await response.json();
        
        if (data.success && data.blog) {
            if (data.blog.is_owner) {
                document.getElementById('title').value = data.blog.title;
                document.getElementById('content').value = data.blog.content;
            } else {
                alert('You do not have permission to edit this blog.');
                window.location.href = appBaseUrl + '/index.php';
            }
        } else {
            alert('Blog not found.');
            window.location.href = appBaseUrl + '/index.php';
        }
    } catch (error) {
        alert('Error loading blog: ' + error.message);
    }
}

async function saveBlog() {
    const title = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();
    const blogId = document.getElementById('blogId').value;
    
    if (!title || !content) {
        alert('Please fill in all required fields.');
        return;
    }
    
    const submitBtn = document.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    
    try {
        const url = blogId > 0 ? `${appBaseUrl}/api/blogs/update.php` : `${appBaseUrl}/api/blogs/create.php`;
        let body = `title=${encodeURIComponent(title)}&content=${encodeURIComponent(content)}`;
        
        if (blogId > 0) {
            body += `&id=${blogId}`;
        }
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert(blogId > 0 ? 'Blog updated successfully!' : 'Blog created successfully!');
            if (data.id) {
                window.location.href = `${appBaseUrl}/blog.php?id=${data.id}`;
            } else {
                window.location.href = `${appBaseUrl}/blog.php?id=${blogId}`;
            }
        } else {
            const errors = data.errors || [data.error || 'Failed to save blog'];
            alert('Error: ' + errors.join('\n'));
        }
    } catch (error) {
        alert('Error: ' + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

function insertMarkdown(command) {
    const textarea = document.getElementById('content');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    let replacement = '';
    
    switch (command) {
        case 'bold':
            replacement = `**${selectedText || 'bold text'}**`;
            break;
        case 'italic':
            replacement = `*${selectedText || 'italic text'}*`;
            break;
        case 'heading':
            replacement = `## ${selectedText || 'Heading'}`;
            break;
        case 'link':
            replacement = `[${selectedText || 'link text'}](url)`;
            break;
        case 'code':
            replacement = selectedText ? `\`${selectedText}\`` : '`code`';
            break;
        case 'quote':
            replacement = `> ${selectedText || 'quote'}`;
            break;
        case 'list':
            replacement = `- ${selectedText || 'list item'}`;
            break;
    }
    
    textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    textarea.focus();
    textarea.setSelectionRange(start + replacement.length, start + replacement.length);
}

function updatePreview() {
    const content = document.getElementById('content').value;
    const preview = document.getElementById('preview');
    preview.innerHTML = renderMarkdown(content);
}

function renderMarkdown(text) {
    let html = escapeHtml(text);
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
    
    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');
    
    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    // Blockquotes
    html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');
    
    // Lists
    html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
    html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/^\+ (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    
    // Paragraphs
    html = html.split('\n\n').map(para => {
        if (!para.trim().startsWith('<') && para.trim()) {
            return '<p>' + para.trim() + '</p>';
        }
        return para;
    }).join('\n');
    
    // Line breaks
    html = html.replace(/\n/g, '<br>');
    
    return html;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

