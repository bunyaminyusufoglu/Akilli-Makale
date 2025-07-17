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

        $db = Database::getInstance();
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
        $db = Database::getInstance();
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
        $db = Database::getInstance();
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
} 