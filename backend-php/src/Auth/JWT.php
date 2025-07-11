<?php
namespace App\Auth;

use Firebase\JWT\JWT as FirebaseJWT;
use Firebase\JWT\Key;

class JWT {
    private static $secret = null;
    private static $algorithm = 'HS256';

    private static function getSecret() {
        if (self::$secret === null) {
            self::$secret = $_ENV['JWT_SECRET'] ?? 'your-secret-key-change-this-in-production';
        }
        return self::$secret;
    }

    public static function generate($payload) {
        $issuedAt = time();
        $expirationTime = $issuedAt + (60 * 60 * 24 * 7); // 7 gün

        $token = [
            'iat' => $issuedAt,
            'exp' => $expirationTime,
            'data' => $payload
        ];

        return FirebaseJWT::encode($token, self::getSecret(), self::$algorithm);
    }

    public static function validate($token) {
        try {
            $decoded = FirebaseJWT::decode($token, new Key(self::getSecret(), self::$algorithm));
            return (array) $decoded;
        } catch (\Exception $e) {
            return false;
        }
    }

    public static function refresh($token) {
        $decoded = self::validate($token);
        if (!$decoded) {
            return false;
        }

        // Yeni token oluştur
        return self::generate($decoded['data']);
    }

    public static function getPayload($token) {
        $decoded = self::validate($token);
        if (!$decoded) {
            return false;
        }

        return $decoded['data'];
    }
} 