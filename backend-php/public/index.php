<?php
require_once __DIR__ . '/../vendor/autoload.php';

use App\Controller\HelloController;

header('Content-Type: application/json');

// Basit routing
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = rtrim($uri, '/');

if ($uri === '' || $uri === '/hello') {
    $response = HelloController::index();
    echo json_encode($response);
    exit;
}

// 404
http_response_code(404);
echo json_encode([
    'success' => false,
    'message' => 'Endpoint bulunamadı.'
]); 