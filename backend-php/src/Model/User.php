<?php
namespace App\Model;

use App\Database\Database;

class User {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function create($data) {
        $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        $userData = [
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'used_balance' => 0,
            'remaining_balance' => 50
        ];
        try {
            $userId = $this->db->insert('users', $userData);
            unset($userData['password']);
            $userData['id'] = $userId;
            return $userData;
        } catch (\Exception $e) {
            throw new \Exception("Kullanıcı oluşturulamadı: " . $e->getMessage());
        }
    }

    public function findByEmail($email) {
        $sql = "SELECT * FROM users WHERE email = :email";
        return $this->db->fetch($sql, ['email' => $email]);
    }

    public function findById($id) {
        $sql = "SELECT id, first_name, last_name, email, used_balance, remaining_balance FROM users WHERE id = :id";
        return $this->db->fetch($sql, ['id' => $id]);
    }

    public function authenticate($email, $password) {
        $user = $this->findByEmail($email);
        if (!$user) {
            return false;
        }
        if (!password_verify($password, $user['password'])) {
            return false;
        }
        unset($user['password']);
        return $user;
    }

    public function updateProfile($userId, $data) {
        $updateData = [
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name']
        ];
        if (isset($data['password']) && !empty($data['password'])) {
            $updateData['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        }
        return $this->db->update('users', $updateData, 'id = :id', ['id' => $userId]);
    }

    public function emailExists($email, $excludeId = null) {
        $sql = "SELECT COUNT(*) as count FROM users WHERE email = :email";
        $params = ['email' => $email];
        if ($excludeId) {
            $sql .= " AND id != :id";
            $params['id'] = $excludeId;
        }
        $result = $this->db->fetch($sql, $params);
        return $result['count'] > 0;
    }

    public function getStats($userId) {
        // Eğer makale tablosu yoksa, boş döndür
        return [
            'total_articles' => 0,
            'total_words' => 0,
            'total_credits_used' => 0
        ];
    }
} 