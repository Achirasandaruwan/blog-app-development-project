
(function() {
    // Check for fetch API support (Safari compatibility)
    if (typeof fetch === 'undefined') {
        console.error('Fetch API is not supported in this browser. Please update your browser.');
        // Fallback: Show error message
        document.addEventListener('DOMContentLoaded', function() {
            const container = document.getElementById('blogsContainer');
            if (container) {
                container.innerHTML = '<div style="padding: 2rem; text-align: center; color: #c33;"><p>Your browser does not support modern web features. Please update to a newer version.</p></div>';
            }
        });
        return;
    }
    
    // Get BASE_URL from meta tag or calculate from current location
    if (typeof window.BASE_URL === 'undefined') {
        const baseUrlMeta = document.querySelector('meta[name="base-url"]');
        if (baseUrlMeta && baseUrlMeta.getAttribute('content')) {
            window.BASE_URL = baseUrlMeta.getAttribute('content').trim();
        } else {
            // Fallback: calculate from current location
            const origin = window.location.origin;
            const path = window.location.pathname;
            const pathParts = path.split('/').filter(p => p);
            if (pathParts.length > 0 && pathParts[0] === 'blog-app') {
                window.BASE_URL = origin + '/blog-app';
            } else {
                window.BASE_URL = origin;
            }
        }
        
        // Remove trailing slash if present
        if (window.BASE_URL.endsWith('/')) {
            window.BASE_URL = window.BASE_URL.slice(0, -1);
        }
        
        console.log('BASE_URL set to:', window.BASE_URL);
    }
    const BASE_URL = window.BASE_URL;

    // Wait for DOM to be fully loaded before initializing
    document.addEventListener('DOMContentLoaded', function() {
        // Mobile Navigation Toggle
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle) {
            navToggle.addEventListener('click', function() {
                navMenu.classList.toggle('active');
            });
        }
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navMenu && navToggle && 
                !navMenu.contains(e.target) && 
                !navToggle.contains(e.target) && 
                navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });

        // Home Page - Load and Display Blogs
        const blogsContainer = document.getElementById('blogsContainer');
        if (!blogsContainer) {
            return; // Not on the home page
        }
        
        let currentPage = 1;
        let currentSearch = '';
        
        async function loadBlogs(page = 1, search = '') {
            const container = document.getElementById('blogsContainer');
            const pagination = document.getElementById('pagination');
            const searchResults = document.getElementById('searchResults');
            
            container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading blogs...</div>';
            
            try {
                // Ensure BASE_URL is set to writeable
                if (!BASE_URL || BASE_URL === 'undefined') {
                    throw new Error('BASE_URL is not defined. Please check the page configuration.');
                }
                
                let url = `${BASE_URL}/api/blogs/get.php?page=${page}`;
                if (search) {
                    url += `&search=${encodeURIComponent(search)}`;
                }
                
                // Log URL for debugging
                console.log('Fetching blogs from:', url);
                console.log('BASE_URL:', BASE_URL);
                
                // (increased to 15 seconds for mobile)
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
                
                // Fetch with better browser compatibility
                const fetchOptions = {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    signal: controller.signal,
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    mode: 'cors'
                };
                
                const response = await fetch(url, fetchOptions);
                
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status}. Response: ${errorText.substring(0, 200)}`);
                }
                
                const contentType = response.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    const text = await response.text();
                    throw new Error(`Expected JSON but got: ${contentType}. Response: ${text.substring(0, 200)}`);
                }
                
                const data = await response.json();
                
                console.log('Blogs loaded successfully:', data);
                
                if (data.success) {
                    currentPage = data.page;
                    currentSearch = data.search;
                    
                    // Show search results count
                    if (search) {
                        searchResults.innerHTML = `
                            <p><strong>${data.total}</strong> result(s) found for "<strong>${escapeHtml(search)}</strong>"</p>
                        `;
                        searchResults.style.display = 'block';
                        document.getElementById('clearSearchBtn').style.display = 'inline-flex';
                    } else {
                        searchResults.style.display = 'none';
                        document.getElementById('clearSearchBtn').style.display = 'none';
                    }
                    
                    // Display blogs
                    if (data.blogs.length === 0) {
                        container.innerHTML = '<div class="loading"><p>No blogs found. Be the first to create one!</p></div>';
                    } else {
                        container.innerHTML = data.blogs.map(blog => `
                            <div class="blog-card">
                                <div class="blog-card-header">
                                    <h2 class="blog-card-title">
                                        <a href="${BASE_URL}/blog.php?id=${blog.id}">${escapeHtml(blog.title)}</a>
                                    </h2>
                                    <p class="blog-card-excerpt">${truncateText(blog.content, 150)}</p>
                                </div>
                                <div class="blog-card-meta">
                                    <div class="blog-author">
                                        <i class="fas fa-user"></i>
                                        <span>${escapeHtml(blog.username)}</span>
                                    </div>
                                    <div class="blog-date">
                                        <i class="fas fa-calendar"></i>
                                        <span>${formatDate(blog.created_at)}</span>
                                    </div>
                                </div>
                            </div>
                        `).join('');
                    }
                    
                    // Display pagination
                    const totalPages = Math.ceil(data.total / data.limit);
                    if (totalPages > 1) {
                        let paginationHTML = '';
                        
                        if (currentPage > 1) {
                            paginationHTML += `<button onclick="loadBlogs(${currentPage - 1}, '${currentSearch}')">Previous</button>`;
                        }
                        
                        for (let i = 1; i <= totalPages; i++) {
                            if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
                                paginationHTML += `<button class="${i === currentPage ? 'active' : ''}" 
                                    onclick="loadBlogs(${i}, '${currentSearch}')">${i}</button>`;
                            } else if (i === currentPage - 3 || i === currentPage + 3) {
                                paginationHTML += `<button disabled>...</button>`;
                            }
                        }
                        
                        if (currentPage < totalPages) {
                            paginationHTML += `<button onclick="loadBlogs(${currentPage + 1}, '${currentSearch}')">Next</button>`;
                        }
                        
                        pagination.innerHTML = paginationHTML;
                    } else {
                        pagination.innerHTML = '';
                    }
                } else {
                    container.innerHTML = '<div class="error-messages active"><p>Failed to load blogs. Please try again.</p></div>';
                }
            } catch (error) {
                console.error('Error loading blogs:', error);
                console.error('BASE_URL was:', BASE_URL);
                console.error('Current location:', window.location.href);
                
                let errorMessage = error.message;
                if (error.name === 'AbortError') {
                    errorMessage = 'Request timed out. Please check your internet connection and try again.';
                } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                    errorMessage = 'Network error. Please check your internet connection.';
                }
                
                // Show error message with inline styles (in case CSS didn't load)
                container.innerHTML = `
                    <div style="background: #fee; border: 2px solid #fcc; padding: 1.5rem; margin: 1rem 0; border-radius: 8px; color: #c33;">
                        <p style="margin: 0 0 0.5rem 0; font-weight: bold; font-size: 1.1rem;">Error loading blogs:</p>
                        <p style="margin: 0 0 1rem 0; color: #333;">${escapeHtml(errorMessage)}</p>
                        <p style="margin: 0 0 1rem 0; font-size: 0.9rem; color: #666; word-break: break-all;">
                            <strong>URL:</strong> ${escapeHtml(BASE_URL || 'Not set')}/api/blogs/get.php
                        </p>
                        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                            <button onclick="window.location.reload()" style="background: #3b82f6; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 4px; cursor: pointer; font-size: 1rem;">
                                🔄 Reload Page
                            </button>
                            <button onclick="if(typeof loadBlogs === 'function') { loadBlogs(${page}, '${currentSearch}'); } else { window.location.reload(); }" style="background: #6b7280; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 4px; cursor: pointer; font-size: 1rem;">
                                🔁 Retry
                            </button>
                        </div>
                    </div>
                `;
            }
        }
        
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        const clearSearchBtn = document.getElementById('clearSearchBtn');
        
        if (searchBtn) {
            searchBtn.addEventListener('click', function() {
                const search = searchInput.value.trim();
                loadBlogs(1, search);
            });
        }
        
        if (searchInput) {
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    const search = searchInput.value.trim();
                    loadBlogs(1, search);
                }
            });
        }
        
        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', function() {
                searchInput.value = '';
                loadBlogs(1, '');
            });
        }
        
        // Make loadBlogs available globally
        window.loadBlogs = loadBlogs;
        
        // Initial load
        loadBlogs();
    }); // End of DOMContentLoaded for blogs

    // Helpe Functions
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function truncateText(text, maxLength) {
        const plainText = text.replace(/<[^>]*>/g, '').replace(/[#*`_~]/g, '');
        if (plainText.length <= maxLength) {
            return escapeHtml(plainText);
        }
        return escapeHtml(plainText.substring(0, maxLength)) + '...';
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
})();

