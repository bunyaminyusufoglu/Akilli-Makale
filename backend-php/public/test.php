<?php
header('Content-Type: application/json');

// Test if PHP is working
echo json_encode([
    'success' => true,
    'message' => 'PHP çalışıyor',
    'php_version' => PHP_VERSION,
    'time' => date('Y-m-d H:i:s')
]); 