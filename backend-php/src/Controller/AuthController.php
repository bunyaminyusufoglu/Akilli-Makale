<?php
namespace App\Controller;

use App\Model\User;
use App\Auth\JWT;
use Exception;

class AuthController {
    private $userModel;

    public function __construct() { 
        $this->userModel = new User();
    }

    public function test() {
        try {
            $this->userModel = new User();
            return $this->successResponse('Veritabanı bağlantısı başarılı');
        } catch (Exception $e) {
            return $this->errorResponse('Veritabanı hatası: ' . $e->getMessage(), 500);
        }
    }

    public function register() {
        // Sadece POST isteklerini kabul et
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            return $this->errorResponse('Sadece POST istekleri kabul edilir', 405);
        }

        // JSON verisini al
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            return $this->errorResponse('Geçersiz JSON verisi', 400);
        }

        // Gerekli alanları kontrol et
        $requiredFields = ['firstName', 'lastName', 'email', 'password'];
        foreach ($requiredFields as $field) {
            if (empty($input[$field])) {
                return $this->errorResponse("$field alanı gereklidir", 400);
            }
        }

        // E-posta formatını kontrol et
        if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
            return $this->errorResponse('Geçerli bir e-posta adresi giriniz', 400);
        }

        // Şifre uzunluğunu kontrol et
        if (strlen($input['password']) < 6) {
            return $this->errorResponse('Şifre en az 6 karakter olmalıdır', 400);
        }

        // E-posta adresinin kullanımda olup olmadığını kontrol et
        if ($this->userModel->emailExists($input['email'])) {
            return $this->errorResponse('Bu e-posta adresi zaten kullanımda', 409);
        }

        try {
            // Kullanıcıyı oluştur
            $user = $this->userModel->create($input);
            
            // JWT token oluştur
            $token = JWT::generate([
                'id' => $user['id'],
                'email' => $user['email'],
                'firstName' => $user['first_name'],
                'lastName' => $user['last_name']
            ]);

            return $this->successResponse('Kullanıcı başarıyla oluşturuldu', [
                'user' => $user,
                'token' => $token
            ]);

        } catch (Exception $e) {
            return $this->errorResponse('Kayıt işlemi başarısız: ' . $e->getMessage(), 500);
        }
    }

    public function login() {
        // Sadece POST isteklerini kabul et
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            return $this->errorResponse('Sadece POST istekleri kabul edilir', 405);
        }

        // JSON verisini al
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            return $this->errorResponse('Geçersiz JSON verisi', 400);
        }

        // Gerekli alanları kontrol et
        if (empty($input['email']) || empty($input['password'])) {
            return $this->errorResponse('E-posta ve şifre gereklidir', 400);
        }

        try {
            // Kullanıcıyı doğrula
            $user = $this->userModel->authenticate($input['email'], $input['password']);
            
            if (!$user) {
                return $this->errorResponse('Geçersiz e-posta veya şifre', 401);
            }

            // JWT token oluştur
            $token = JWT::generate([
                'id' => $user['id'],
                'email' => $user['email'],
                'firstName' => $user['first_name'],
                'lastName' => $user['last_name']
            ]);

            return $this->successResponse('Giriş başarılı', [
                'user' => $user,
                'token' => $token
            ]);

        } catch (Exception $e) {
            return $this->errorResponse('Giriş işlemi başarısız: ' . $e->getMessage(), 500);
        }
    }

    public function profile() {
        // Authorization header'ını kontrol et
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        
        if (empty($authHeader) || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            return $this->errorResponse('Authorization token gereklidir', 401);
        }

        $token = $matches[1];
        $payload = JWT::getPayload($token);
        
        if (!$payload) {
            return $this->errorResponse('Geçersiz token', 401);
        }

        try {
            $user = $this->userModel->findById($payload['id']);
            
            if (!$user) {
                return $this->errorResponse('Kullanıcı bulunamadı', 404);
            }

            // Kullanıcı istatistiklerini al
            $stats = $this->userModel->getStats($user['id']);

            return $this->successResponse('Kullanıcı bilgileri', [
                'user' => $user,
                'stats' => $stats
            ]);

        } catch (Exception $e) {
            return $this->errorResponse('Profil bilgileri alınamadı: ' . $e->getMessage(), 500);
        }
    }

    public function updateProfile() {
        // Sadece PUT isteklerini kabul et
        if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
            return $this->errorResponse('Sadece PUT istekleri kabul edilir', 405);
        }

        // Authorization header'ını kontrol et
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        
        if (empty($authHeader) || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            return $this->errorResponse('Authorization token gereklidir', 401);
        }

        $token = $matches[1];
        $payload = JWT::getPayload($token);
        
        if (!$payload) {
            return $this->errorResponse('Geçersiz token', 401);
        }

        // JSON verisini al
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            return $this->errorResponse('Geçersiz JSON verisi', 400);
        }

        try {
            // E-posta değişikliği varsa kontrol et
            if (isset($input['email']) && $input['email'] !== $payload['email']) {
                if ($this->userModel->emailExists($input['email'], $payload['id'])) {
                    return $this->errorResponse('Bu e-posta adresi zaten kullanımda', 409);
                }
            }

            // Profili güncelle
            $this->userModel->updateProfile($payload['id'], $input);
            
            // Güncellenmiş kullanıcı bilgilerini al
            $user = $this->userModel->findById($payload['id']);

            return $this->successResponse('Profil başarıyla güncellendi', [
                'user' => $user
            ]);

        } catch (Exception $e) {
            return $this->errorResponse('Profil güncellenemedi: ' . $e->getMessage(), 500);
        }
    }

    private function successResponse($message, $data = null) {
        $response = [
            'success' => true,
            'message' => $message
        ];

        if ($data !== null) {
            $response['data'] = $data;
        }

        return $response;
    }

    private function errorResponse($message, $statusCode = 400) {
        http_response_code($statusCode);
        return [
            'success' => false,
            'message' => $message
        ];
    }
} 