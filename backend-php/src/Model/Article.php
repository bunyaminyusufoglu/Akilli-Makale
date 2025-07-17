<?php
namespace App\Model;

use PDO;

class Article
{
    private $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    /**
     * Yeni makale ekler
     * @param int $userId
     * @param string $title
     * @param string $content
     * @param int $wordCount
     * @param int $creditUsed
     * @return int Eklenen makalenin ID'si
     */
    public function addArticle($userId, $title, $content, $wordCount, $creditUsed)
    {
        $stmt = $this->db->prepare("INSERT INTO articles (user_id, title, content, word_count, credit_used) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$userId, $title, $content, $wordCount, $creditUsed]);
        return $this->db->lastInsertId();
    }

    /**
     * Belirli bir kullanıcıya ait makaleleri getirir
     * @param int $userId
     * @return array
     */
    public function getArticlesByUser($userId)
    {
        $stmt = $this->db->prepare("SELECT * FROM articles WHERE user_id = ? ORDER BY id DESC");
        $stmt->execute([$userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Bir makaleyi siler (sadece ilgili kullanıcıya aitse)
     * @param int $articleId
     * @param int $userId
     * @return bool
     */
    public function deleteArticle($articleId, $userId)
    {
        $stmt = $this->db->prepare("DELETE FROM articles WHERE id = ? AND user_id = ?");
        return $stmt->execute([$articleId, $userId]);
    }
} 