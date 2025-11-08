
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

document.addEventListener('DOMContentLoaded', async function() {
    const container = document.getElementById('blogContainer');
    
    try {
        const response = await fetch(`${appBaseUrl}/api/blogs/get.php?id=${blogId}`);
        const data = await response.json();
        
        if (data.success && data.blog) {
            const blog = data.blog;
            
            let actionsHTML = '';
            if (blog.is_owner) {
                actionsHTML = `
                    <div class="blog-actions">
                        <a href="${appBaseUrl}/editor.php?id=${blog.id}" class="btn btn-secondary">
                            <i class="fas fa-edit"></i> Edit
                        </a>
                        <button onclick="deleteBlog(${blog.id})" class="btn btn-danger">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                `;
            }
            
            container.innerHTML = `
                <div class="blog-header">
                    <h1 class="blog-title">${escapeHtml(blog.title)}</h1>
                    <div class="blog-meta">
                        <div>
                            <div class="blog-author">
                                <i class="fas fa-user"></i>
                                <span>${escapeHtml(blog.username)}</span>
                            </div>
                            <div class="blog-date">
                                <i class="fas fa-calendar"></i>
                                <span>${formatDate(blog.created_at)}</span>
                            </div>
                        </div>
                        ${actionsHTML}
                    </div>
                </div>
                <div class="blog-content">
                    ${renderMarkdown(blog.content)}
                </div>
            `;
        } else {
            container.innerHTML = '<div class="error-messages active"><p>Blog not found.</p></div>';
        }
    } catch (error) {
        container.innerHTML = '<div class="error-messages active"><p>Error loading blog: ' + error.message + '</p></div>';
    }
});

async function deleteBlog(id) {
    if (!confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch(`${appBaseUrl}/api/blogs/delete.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `id=${id}`
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Blog deleted successfully!');
            window.location.href = appBaseUrl + '/index.php';
        } else {
            alert('Error: ' + (data.error || 'Failed to delete blog'));
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Simple Markdown renderer
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

