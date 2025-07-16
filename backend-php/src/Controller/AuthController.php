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

    public function register() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            return $this->errorResponse('Sadece POST istekleri kabul edilir', 405);
        }
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) {
            return $this->errorResponse('Geçersiz JSON verisi', 400);
        }
        $requiredFields = ['first_name', 'last_name', 'email', 'password'];
        foreach ($requiredFields as $field) {
            if (empty($input[$field])) {
                return $this->errorResponse("$field alanı gereklidir", 400);
            }
        }
        if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
            return $this->errorResponse('Geçerli bir e-posta adresi giriniz', 400);
        }
        if (strlen($input['password']) < 6) {
            return $this->errorResponse('Şifre en az 6 karakter olmalıdır', 400);
        }
        if ($this->userModel->emailExists($input['email'])) {
            return $this->errorResponse('Bu e-posta adresi zaten kullanımda', 409);
        }
        try {
            $user = $this->userModel->create($input);
            if (!$user) {
                error_log('Kullanıcı oluşturulamadı!');
                $response = $this->errorResponse('Kullanıcı oluşturulamadı', 500);
                echo json_encode($response, JSON_UNESCAPED_UNICODE);
                exit();
            }
            $token = JWT::generate([
                'id' => $user['id'],
                'email' => $user['email'],
                'firstName' => $user['first_name'],
                'lastName' => $user['last_name'],
                'used_balance' => 0,
                'remaining_balance' => 50
            ]);
            $response = $this->successResponse('Kullanıcı başarıyla oluşturuldu', [
                'user' => $user,
                'token' => $token
            ]);
            echo json_encode($response, JSON_UNESCAPED_UNICODE);
            exit();
        } catch (Exception $e) {
            error_log('Kayıt işlemi başarısız: ' . $e->getMessage());
            $response = $this->errorResponse('Kayıt işlemi başarısız: ' . $e->getMessage(), 500);
            echo json_encode($response, JSON_UNESCAPED_UNICODE);
            exit();
        }
    }

    public function login() {
        // Debug: Log the request
        error_log("Login request received");
        error_log("Request method: " . $_SERVER['REQUEST_METHOD']);
        error_log("Raw input: " . file_get_contents('php://input'));
        
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            return $this->errorResponse('Sadece POST istekleri kabul edilir', 405);
        }
        $input = json_decode(file_get_contents('php://input'), true);
        error_log("Decoded input: " . json_encode($input));
        if (!$input) {
            return $this->errorResponse('Geçersiz JSON verisi', 400);
        }
        if (empty($input['email']) || empty($input['password'])) {
            return $this->errorResponse('E-posta ve şifre gereklidir', 400);
        }
        try {
            $user = $this->userModel->authenticate($input['email'], $input['password']);
            if (!$user) {
                return $this->errorResponse('Geçersiz e-posta veya şifre', 401);
            }
            $token = JWT::generate([
                'id' => $user['id'],
                'email' => $user['email'],
                'first_name' => $user['first_name'],    
                'last_name' => $user['last_name'],
                'used_balance' => $user['used_balance'],
                'remaining_balance' => $user['remaining_balance']
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
            return $this->successResponse('Kullanıcı bilgileri', [
                'user' => $user
            ]);
        } catch (Exception $e) {
            return $this->errorResponse('Profil bilgileri alınamadı: ' . $e->getMessage(), 500);
        }
    }

    public function updateProfile() {
        if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
            return $this->errorResponse('Sadece PUT istekleri kabul edilir', 405);
        }
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
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) {
            return $this->errorResponse('Geçersiz JSON verisi', 400);
        }
        try {
            if (isset($input['email']) && $input['email'] !== $payload['email']) {
                if ($this->userModel->emailExists($input['email'], $payload['id'])) {
                    return $this->errorResponse('Bu e-posta adresi zaten kullanımda', 409);
                }
            }
            $this->userModel->updateProfile($payload['id'], $input);
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