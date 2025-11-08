<?php
require_once '../../config/config.php';

if (!isLoggedIn()) {
    echo json_encode(['success' => false, 'error' => 'Unauthorized']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = trim($_POST['title'] ?? '');
    $content = $_POST['content'] ?? '';
    
    $errors = [];
    
    if (empty($title)) {
        $errors[] = "Title is required";
    }
    
    if (empty($content)) {
        $errors[] = "Content is required";
    }
    
    if (empty($errors)) {
        try {
            $pdo = getDBConnection();
            $stmt = $pdo->prepare("INSERT INTO blogPost (user_id, title, content) VALUES (?, ?, ?)");
            $stmt->execute([getCurrentUserId(), $title, $content]);
            
            $blogId = $pdo->lastInsertId();
            echo json_encode(['success' => true, 'message' => 'Blog created successfully', 'id' => $blogId]);
            exit;
        } catch (PDOException $e) {
            $errors[] = "Failed to create blog: " . $e->getMessage();
        }
    }
    
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

echo json_encode(['success' => false, 'error' => 'Invalid request method']);

