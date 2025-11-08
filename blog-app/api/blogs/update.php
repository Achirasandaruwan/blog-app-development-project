<?php
require_once '../../config/config.php';

if (!isLoggedIn()) {
    echo json_encode(['success' => false, 'error' => 'Unauthorized']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = intval($_POST['id'] ?? 0);
    $title = trim($_POST['title'] ?? '');
    $content = $_POST['content'] ?? '';
    
    $errors = [];
    
    if (empty($id)) {
        $errors[] = "Blog ID is required";
    }
    
    if (empty($title)) {
        $errors[] = "Title is required";
    }
    
    if (empty($content)) {
        $errors[] = "Content is required";
    }
    
    if (empty($errors)) {
        try {
            $pdo = getDBConnection();
            
            // Check if blog exists and user owns it
            $stmt = $pdo->prepare("SELECT user_id FROM blogPost WHERE id = ?");
            $stmt->execute([$id]);
            $blog = $stmt->fetch();
            
            if (!$blog) {
                $errors[] = "Blog not found";
            } elseif (!isBlogOwner($blog['user_id'])) {
                $errors[] = "You don't have permission to edit this blog";
            } else {
                $stmt = $pdo->prepare("UPDATE blogPost SET title = ?, content = ? WHERE id = ? AND user_id = ?");
                $stmt->execute([$title, $content, $id, getCurrentUserId()]);
                
                echo json_encode(['success' => true, 'message' => 'Blog updated successfully']);
                exit;
            }
        } catch (PDOException $e) {
            $errors[] = "Failed to update blog: " . $e->getMessage();
        }
    }
    
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

echo json_encode(['success' => false, 'error' => 'Invalid request method']);

