<?php
require_once __DIR__ . '/../vendor/autoload.php';

use App\Controller\ArticleController;

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (file_exists(__DIR__ . '/../.env')) {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
    $dotenv->load();
}

$input = json_decode(file_get_contents('php://input'), true);
$articleId = intval($input['article_id'] ?? 0);
$userId = intval($input['user_id'] ?? 0);

if (!$articleId || !$userId) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'article_id ve user_id zorunludur.'
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

try {
    $controller = new ArticleController();
    $result = $controller->deleteArticle($articleId, $userId);
    echo json_encode($result, JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Makale silinemedi: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
} 