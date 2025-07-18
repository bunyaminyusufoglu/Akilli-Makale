<?php
namespace App\Model;

class GeminiService
{
    private $apiKey;
    private $apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

    public function __construct()
    {
        $this->apiKey = getenv('GEMINI_API_KEY');
        if (!$this->apiKey) {
            throw new \Exception('Gemini API anahtarı bulunamadı.');
        }
    }

    /**
     * Makale yazdırmak için Gemini API'ye istek atar
     * @param string $prompt Kullanıcıdan gelen başlık, anahtar kelime veya açıklama
     * @param string $lang Makale dili (varsayılan: tr)
     * @return string Makale metni
     */
    public function generateArticle(string $prompt, string $lang = 'tr'): string
    {
        $data = [
            'contents' => [
                [
                    'parts' => [
                        [
                            'text' => "{$prompt}\nLütfen {$lang} dilinde detaylı ve özgün bir makale yaz."
                        ]
                    ]
                ]
            ]
        ];

        $url = $this->apiUrl . '?key=' . $this->apiKey;
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json'
        ]);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200) {
            throw new \Exception('Gemini API hatası: ' . $response);
        }

        $result = json_decode($response, true);
        // Gemini API response parsing
        $text = $result['candidates'][0]['content']['parts'][0]['text'] ?? null;
        if (!$text) {
            throw new \Exception('Gemini API yanıtı beklenen formatta değil.');
        }
        return $text;
    }
} 