<?php
namespace App\Controller;

class HelloController {
    public static function index() {
        return [
            'success' => true,
            'message' => 'Merhaba, API çalışıyor!',
            'data' => [
                'time' => date('Y-m-d H:i:s'),
            ]
        ];
    }
} 