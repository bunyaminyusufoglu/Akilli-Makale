<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Check if vendor autoload exists
if (!file_exists(__DIR__ . '/../vendor/autoload.php')) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Vendor autoload.php bulunamadı. Composer install çalıştırın.'
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

require_once __DIR__ . '/../vendor/autoload.php';

// Use statements
use App\Controller\AuthController;

try {
    // Load environment variables (if .env file exists)
    if (file_exists(__DIR__ . '/../.env')) {
        try {
            $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
            $dotenv->load();
        } catch (Exception $e) {
            error_log("Dotenv Error: " . $e->getMessage());
            // Continue without .env file
        }
    }

    // Basit routing - Fix URL parsing for subdirectories
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $uri = rtrim($uri, '/');
    
    // Remove the subdirectory path from URI
    $scriptName = dirname($_SERVER['SCRIPT_NAME']);
    if ($scriptName !== '/') {
        $uri = str_replace($scriptName, '', $uri);
    }
    
    $uri = rtrim($uri, '/');
    $method = $_SERVER['REQUEST_METHOD'];

    // Debug: Log the request
    error_log("Original URI: " . parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
    error_log("Processed URI: $uri");
    error_log("Script Name: $scriptName");

    // API routes - Only user-related endpoints
    $routes = [
        'GET' => [
            '/api/profile' => [AuthController::class, 'profile'],
            '/api/test' => [AuthController::class, 'test'],
            // Alternative routes for subdirectory
            '/Akilli-Makale/backend-php/public/api/profile' => [AuthController::class, 'profile'],
            '/Akilli-Makale/backend-php/public/api/test' => [AuthController::class, 'test']
        ],
        'POST' => [
            '/api/register' => [AuthController::class, 'register'],
            '/api/login' => [AuthController::class, 'login'],
            // Alternative routes for subdirectory
            '/Akilli-Makale/backend-php/public/api/register' => [AuthController::class, 'register'],
            '/Akilli-Makale/backend-php/public/api/login' => [AuthController::class, 'login']
        ],
        'PUT' => [
            '/api/profile' => [AuthController::class, 'updateProfile'],
            // Alternative routes for subdirectory
            '/Akilli-Makale/backend-php/public/api/profile' => [AuthController::class, 'updateProfile']
        ]
    ];

    // Route matching
    $routeFound = false;

    if (isset($routes[$method][$uri])) {
        $routeFound = true;
        [$controllerClass, $methodName] = $routes[$method][$uri];
        
        try {
            $controller = new $controllerClass();
            $response = $controller->$methodName();
            echo json_encode($response, JSON_UNESCAPED_UNICODE);
        } catch (Exception $e) {
            error_log("API Error: " . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Sunucu hatası: ' . $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], JSON_UNESCAPED_UNICODE);
        }
    }

    // 404 - Route not found
    if (!$routeFound) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Endpoint bulunamadı: ' . $method . ' ' . $uri,
            'available_routes' => array_keys($routes[$method] ?? []),
            'debug_info' => [
                'original_uri' => parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH),
                'processed_uri' => $uri,
                'script_name' => $scriptName
            ]
        ], JSON_UNESCAPED_UNICODE);
    }

} catch (Exception $e) {
    error_log("Critical Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Kritik hata: ' . $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ], JSON_UNESCAPED_UNICODE);
} 