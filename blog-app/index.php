<?php
$pageTitle = 'Home';
require_once 'includes/header.php';
?>
<main class="main-content">
    <div class="container">
        <div class="page-header">
            <h2>Latest Blog Posts</h2>
            <div class="search-container">
                <input type="text" id="searchInput" placeholder="Search blogs..." class="search-input">
                <button id="searchBtn" class="btn btn-primary">
                    <i class="fas fa-search"></i> Search
                </button>
                <button id="clearSearchBtn" class="btn btn-secondary" style="display: none;">
                    <i class="fas fa-times"></i> Clear
                </button>
            </div>
        </div>
        
        <div id="searchResults" class="search-results" style="display: none;"></div>
        
        <div id="blogsContainer" class="blogs-grid">
            <div class="loading" id="loadingIndicator">
                <i class="fas fa-spinner fa-spin"></i> Loading blogs...
            </div>
        </div>
        <script>
            // Debug: Log BASE_URL immediately
            (function() {
                const baseUrlMeta = document.querySelector('meta[name="base-url"]');
                const baseUrl = baseUrlMeta ? baseUrlMeta.getAttribute('content') : window.location.origin;
                console.log('Page loaded. BASE_URL from meta:', baseUrl);
                console.log('Current URL:', window.location.href);
            })();
        </script>
        
        <div id="pagination" class="pagination"></div>
    </div>
</main>
<?php require_once 'includes/footer.php'; ?>

