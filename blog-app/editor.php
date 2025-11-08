<?php
$pageTitle = 'Editor';
require_once 'includes/header.php';

if (!isLoggedIn()) {
    redirect(BASE_URL . '/login.php');
}

$editId = isset($_GET['id']) ? intval($_GET['id']) : 0;
?>
<main class="main-content">
    <div class="container">
        <div class="editor-container">
            <h1><?php echo $editId ? 'Edit Blog Post' : 'Create New Blog Post'; ?></h1>
            
            <form id="blogForm" class="blog-form">
                <input type="hidden" id="blogId" value="<?php echo $editId; ?>">
                
                <div class="form-group">
                    <label for="title">Title *</label>
                    <input type="text" id="title" name="title" class="form-control" required 
                           placeholder="Enter blog title...">
                </div>
                
                <div class="form-group">
                    <label for="content">Content *</label>
                    <div class="editor-toolbar">
                        <button type="button" class="toolbar-btn" data-command="bold" title="Bold">
                            <i class="fas fa-bold"></i>
                        </button>
                        <button type="button" class="toolbar-btn" data-command="italic" title="Italic">
                            <i class="fas fa-italic"></i>
                        </button>
                        <button type="button" class="toolbar-btn" data-command="heading" title="Heading">
                            <i class="fas fa-heading"></i>
                        </button>
                        <button type="button" class="toolbar-btn" data-command="link" title="Link">
                            <i class="fas fa-link"></i>
                        </button>
                        <button type="button" class="toolbar-btn" data-command="code" title="Code">
                            <i class="fas fa-code"></i>
                        </button>
                        <button type="button" class="toolbar-btn" data-command="quote" title="Quote">
                            <i class="fas fa-quote-right"></i>
                        </button>
                        <button type="button" class="toolbar-btn" data-command="list" title="List">
                            <i class="fas fa-list"></i>
                        </button>
                    </div>
                    <textarea id="content" name="content" class="form-control editor-textarea" required 
                              placeholder="Write your blog content here... (Markdown supported)"></textarea>
                    <div class="editor-preview" id="preview"></div>
                </div>
                
                <div class="form-actions">
                    <button type="button" id="previewToggle" class="btn btn-secondary">
                        <i class="fas fa-eye"></i> Toggle Preview
                    </button>
                    <button type="button" id="cancelBtn" class="btn btn-secondary">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> <?php echo $editId ? 'Update' : 'Publish'; ?>
                    </button>
                </div>
            </form>
        </div>
    </div>
</main>
<script>
    const editId = <?php echo $editId; ?>;
    const baseUrl = '<?php echo BASE_URL; ?>';
</script>
<script src="<?php echo assetUrl('/assets/js/editor.js'); ?>"></script>
<?php require_once 'includes/footer.php'; ?>

