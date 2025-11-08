<?php
$pageTitle = 'Blog Post';
require_once 'includes/header.php';

$blogId = isset($_GET['id']) ? intval($_GET['id']) : 0;
if (!$blogId) {
    redirect(BASE_URL . '/index.php');
}
?>
<main class="main-content">
    <div class="container">
        <div id="blogContainer" class="blog-single">
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i> Loading blog...
            </div>
        </div>
    </div>
</main>
<script>
    const blogId = <?php echo $blogId; ?>;
</script>
<script src="<?php echo assetUrl('/assets/js/blog.js'); ?>"></script>
<?php require_once 'includes/footer.php'; ?>

