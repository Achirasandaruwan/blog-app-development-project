<?php
require_once '../../config/config.php';

if (!isLoggedIn()) {
    echo json_encode(['success' => false, 'error' => 'Unauthorized']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = intval($_POST['id'] ?? 0);
    
    if (empty($id)) {
        echo json_encode(['success' => false, 'error' => 'Blog ID is required']);
        exit;
    }
    
    try {
        $pdo = getDBConnection();
        
        // Check if blog exists and user owns it
        $stmt = $pdo->prepare("SELECT user_id FROM blogPost WHERE id = ?");
        $stmt->execute([$id]);
        $blog = $stmt->fetch();
        
        if (!$blog) {
            echo json_encode(['success' => false, 'error' => 'Blog not found']);
            exit;
        }
        
        if (!isBlogOwner($blog['user_id'])) {
            echo json_encode(['success' => false, 'error' => 'You don\'t have permission to delete this blog']);
            exit;
        }
        
        $stmt = $pdo->prepare("DELETE FROM blogPost WHERE id = ? AND user_id = ?");
        $stmt->execute([$id, getCurrentUserId()]);
        
        echo json_encode(['success' => true, 'message' => 'Blog deleted successfully']);
        exit;
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'error' => 'Failed to delete blog: ' . $e->getMessage()]);
        exit;
    }
}

echo json_encode(['success' => false, 'error' => 'Invalid request method']);

