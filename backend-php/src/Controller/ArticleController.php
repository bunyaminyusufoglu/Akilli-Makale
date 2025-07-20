<?php
namespace App\Controller;

use App\Model\Article;
use App\Database\Database;

class ArticleController
{
    /**
     * Makale ekler
     * @param int $userId
     * @param string $title
     * @param string $content
     * @return array
     */
    public function addArticle($userId, $title, $content)
    {
        // Kelime sayısı ve kredi hesapla
        $wordCount = str_word_count(strip_tags($content), 0, 'ğüşiöçĞÜŞİÖÇ');
        $creditUsed = (int) ceil($wordCount / 100);

        $db = Database::getInstance()->getConnection();
        $articleModel = new Article($db);
        $articleId = $articleModel->addArticle($userId, $title, $content, $wordCount, $creditUsed);

        return [
            'success' => true,
            'article_id' => $articleId,
            'word_count' => $wordCount,
            'credit_used' => $creditUsed
        ];
    }

    /**
     * Kullanıcının makalelerini getirir
     * @param int $userId
     * @return array
     */
    public function getUserArticles($userId)
    {
        $db = Database::getInstance()->getConnection();
        $articleModel = new Article($db);
        $articles = $articleModel->getArticlesByUser($userId);
        return [
            'success' => true,
            'articles' => $articles
        ];
    }

    /**
     * Makale siler
     * @param int $articleId
     * @param int $userId
     * @return array
     */
    public function deleteArticle($articleId, $userId)
    {
        $db = Database::getInstance()->getConnection();
        $articleModel = new Article($db);
        $deleted = $articleModel->deleteArticle($articleId, $userId);
        if ($deleted) {
            return [
                'success' => true,
                'message' => 'Makale silindi.'
            ];
        } else {
            return [
                'success' => false,
                'message' => 'Makale silinemedi veya yetkiniz yok.'
            ];
        }
    }

    /**
     * API: Makale oluştur (AI ile)
     */
    public function writeArticle() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            return ['success' => false, 'message' => 'Sadece POST istekleri kabul edilir'];
        }
        $input = json_decode(file_get_contents('php://input'), true);
        $title = trim($input['title'] ?? '');
        $subheadingCount = intval($input['subheading_count'] ?? 0);
        $lang = trim($input['lang'] ?? 'tr');
        $keywords = trim($input['keywords'] ?? '');
        $description = trim($input['description'] ?? '');
        if (!$title || $subheadingCount < 0) {
            http_response_code(400);
            return ['success' => false, 'message' => 'Başlık ve alt başlık sayısı zorunludur.'];
        }
        $prompt = "Başlık: $title\n";
        if ($keywords) $prompt .= "Anahtar Kelimeler: $keywords\n";
        if ($description) $prompt .= "Açıklama/İstek: $description\n";
        $prompt .= "Alt başlık sayısı: $subheadingCount\n";
        $prompt .= "Her alt başlık için detaylı paragraflar yaz.\n";
        try {
            $gemini = new \App\Model\GeminiService();
            $article = $gemini->generateArticle($prompt, $lang);
            return ['success' => true, 'article' => $article];
        } catch (\Exception $e) {
            http_response_code(500);
            return ['success' => false, 'message' => 'Makale oluşturulamadı: ' . $e->getMessage()];
        }
    }

    /**
     * API: Makale kaydet
     */
    public function saveArticle() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            return ['success' => false, 'message' => 'Sadece POST istekleri kabul edilir'];
        }
        $input = json_decode(file_get_contents('php://input'), true);
        $userId = intval($input['user_id'] ?? 0);
        $title = trim($input['title'] ?? '');
        $content = trim($input['content'] ?? '');
        if (!$userId || !$title || !$content) {
            http_response_code(400);
            return ['success' => false, 'message' => 'user_id, title ve content zorunludur.'];
        }
        try {
            $result = $this->addArticle($userId, $title, $content);
            return $result;
        } catch (\Exception $e) {
            http_response_code(500);
            return ['success' => false, 'message' => 'Makale kaydedilemedi: ' . $e->getMessage()];
        }
    }

    /**
     * API: Kullanıcının makalelerini getir
     */
    public function getArticles() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            return ['success' => false, 'message' => 'Sadece POST istekleri kabul edilir'];
        }
        $input = json_decode(file_get_contents('php://input'), true);
        $userId = intval($input['user_id'] ?? 0);
        if (!$userId) {
            http_response_code(400);
            return ['success' => false, 'message' => 'user_id zorunludur.'];
        }
        try {
            $result = $this->getUserArticles($userId);
            return $result;
        } catch (\Exception $e) {
            http_response_code(500);
            return ['success' => false, 'message' => 'Makaleler getirilemedi: ' . $e->getMessage()];
        }
    }

    /**
     * API: Makale sil
     */
    public function deleteArticleApi() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            return ['success' => false, 'message' => 'Sadece POST istekleri kabul edilir'];
        }
        $input = json_decode(file_get_contents('php://input'), true);
        $articleId = intval($input['article_id'] ?? 0);
        $userId = intval($input['user_id'] ?? 0);
        if (!$articleId || !$userId) {
            http_response_code(400);
            return ['success' => false, 'message' => 'article_id ve user_id zorunludur.'];
        }
        try {
            $db = Database::getInstance()->getConnection();
            $articleModel = new Article($db);
            $deleted = $articleModel->deleteArticle($articleId, $userId);
            if ($deleted) {
                return [
                    'success' => true,
                    'message' => 'Makale silindi.'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Makale silinemedi veya yetkiniz yok.'
                ];
            }
        } catch (\Exception $e) {
            http_response_code(500);
            return ['success' => false, 'message' => 'Makale silinemedi: ' . $e->getMessage()];
        }
    }
} 