<?php
require_once '../../config/config.php';

// set proper headers to json response
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Vary: Origin');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    $pdo = getDBConnection();
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'error' => 'Database connection failed',
        'message' => $e->getMessage()
    ]);
    exit;
}

// Get single blog by ID
if (isset($_GET['id'])) {
    $id = intval($_GET['id']);
    $stmt = $pdo->prepare("
        SELECT b.*, u.username, u.email 
        FROM blogPost b 
        JOIN user u ON b.user_id = u.id 
        WHERE b.id = ?
    ");
    $stmt->execute([$id]);
    $blog = $stmt->fetch();
    
    if ($blog) {
        // Add ownership flag if user is logged in
        if (isLoggedIn()) {
            $blog['is_owner'] = isBlogOwner($blog['user_id']);
        }
        echo json_encode(['success' => true, 'blog' => $blog]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Blog not found']);
    }
    exit;
}

// Get all blogs  and search
$page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
$limit = 10;
$offset = ($page - 1) * $limit;
$search = isset($_GET['search']) ? trim($_GET['search']) : '';

$whereClause = '';
$params = [];

if (!empty($search)) {
    // (works on all MySQL versions)
    $whereClause = "WHERE b.title LIKE ? OR b.content LIKE ?";
    $searchTerm = "%{$search}%";
    $params = [$searchTerm, $searchTerm];
}

// Get total count
$countSql = "SELECT COUNT(*) as total FROM blogPost b $whereClause";
$countStmt = $pdo->prepare($countSql);
$countStmt->execute($params);
$total = $countStmt->fetch()['total'];

// Get blogs
$sql = "
    SELECT b.*, u.username, u.email 
    FROM blogPost b 
    JOIN user u ON b.user_id = u.id 
    $whereClause
    ORDER BY b.created_at DESC 
    LIMIT ? OFFSET ?
";
$params[] = $limit;
$params[] = $offset;
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$blogs = $stmt->fetchAll();

// Add ownership flags
if (isLoggedIn()) {
    foreach ($blogs as &$blog) {
        $blog['is_owner'] = isBlogOwner($blog['user_id']);
    }
}

echo json_encode([
    'success' => true,
    'blogs' => $blogs,
    'total' => intval($total),
    'page' => $page,
    'limit' => $limit,
    'search' => $search
]);

