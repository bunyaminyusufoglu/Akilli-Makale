<?php
namespace App\Model;

use App\Database\Database;

class User {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function create($data) {
        // Şifreyi hash'le
        $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        
        // Kullanıcı verilerini hazırla
        $userData = [
            'first_name' => $data['firstName'],
            'last_name' => $data['lastName'],
            'email' => $data['email'],
            'password' => $data['password'],
            'credits' => 5, // Yeni kullanıcıya 5 kredi ver
        ];

        try {
            $userId = $this->db->insert('users', $userData);
            
            // Kullanıcı bilgilerini döndür (şifre hariç)
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
        $sql = "SELECT id, first_name, last_name, email, credits, created_at, updated_at FROM users WHERE id = :id";
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

        // Şifreyi kaldır
        unset($user['password']);
        
        return $user;
    }

    public function updateCredits($userId, $credits) {
        $sql = "UPDATE users SET credits = :credits, updated_at = :updated_at WHERE id = :id";
        $params = [
            'credits' => $credits,
            'updated_at' => date('Y-m-d H:i:s'),
            'id' => $userId
        ];
        
        return $this->db->query($sql, $params);
    }

    public function updateProfile($userId, $data) {
        $updateData = [
            'first_name' => $data['firstName'],
            'last_name' => $data['lastName'],
            'updated_at' => date('Y-m-d H:i:s')
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
        $sql = "SELECT 
                    COUNT(*) as total_articles,
                    SUM(word_count) as total_words,
                    SUM(credits_used) as total_credits_used
                FROM articles 
                WHERE user_id = :user_id";
        
        return $this->db->fetch($sql, ['user_id' => $userId]);
    }
} 