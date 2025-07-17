<?php
require_once __DIR__ . '/../vendor/autoload.php';

use App\Model\GeminiService;

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// .env yükle
if (file_exists(__DIR__ . '/../.env')) {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
    $dotenv->load();
}

// POST verisini al
$input = json_decode(file_get_contents('php://input'), true);

$title = trim($input['title'] ?? '');
$subheadingCount = intval($input['subheading_count'] ?? 0);
$lang = trim($input['lang'] ?? 'tr');
$keywords = trim($input['keywords'] ?? '');
$description = trim($input['description'] ?? '');

if (!$title || $subheadingCount < 0) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Başlık ve alt başlık sayısı zorunludur.'
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

// Prompt oluştur
$prompt = "Başlık: $title\n";
if ($keywords) {
    $prompt .= "Anahtar Kelimeler: $keywords\n";
}
if ($description) {
    $prompt .= "Açıklama/İstek: $description\n";
}
$prompt .= "Alt başlık sayısı: $subheadingCount\n";
$prompt .= "Her alt başlık için detaylı paragraflar yaz.\n";

try {
    $gemini = new GeminiService();
    $article = $gemini->generateArticle($prompt, $lang);
    echo json_encode([
        'success' => true,
        'article' => $article
    ], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Makale oluşturulamadı: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
} 