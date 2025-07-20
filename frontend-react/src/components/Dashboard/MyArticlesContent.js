import React, { useEffect, useState } from 'react';

const MyArticlesContent = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [previewArticle, setPreviewArticle] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Kullanıcıyı localStorage'dan al
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || !user) {
      window.location.href = '/login';
      return;
    }

    const fetchArticles = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('/api/get_articles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },          
          body: JSON.stringify({ user_id: user.id })
        });
        const data = await response.json();
        if (response.ok && data.success && data.articles) {
          setArticles(data.articles);
        } else {
          setError(data.message || 'Makaleler getirilemedi.');
        }
      } catch (err) {
        setError('Sunucuya bağlanılamadı.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [token, user?.id]);

  const deleteArticle = async (articleId, userId) => {
    if (!window.confirm("Bu makaleyi silmek istediğinize emin misiniz?")) return;
    try {
      const response = await fetch('/api/delete_article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ article_id: articleId, user_id: userId })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setArticles(prev => prev.filter(article => article.id !== articleId));
        alert('Makale başarıyla silindi.');
      } else {
        alert(data.message || 'Makale silinemedi.');
      }
    } catch (err) {
      alert('Sunucuya bağlanılamadı.');
    }
  };

  const showArticlePreview = (article) => {
    setPreviewArticle(article);
    setShowPreview(true);
  };

  const closePreview = () => {
    setShowPreview(false);
    setPreviewArticle(null);
  };

  // ESC tuşu ile modal'ı kapatma
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27 && showPreview) {
        closePreview();
      }
    };
    
    if (showPreview) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; // Sayfa kaydırmayı engelle
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset'; // Sayfa kaydırmayı geri aç
    };
  }, [showPreview]);

  if (!token || !user) return null;

  return (
    <div className="p-4">
      <h1 className="h3 fw-bold mb-4">Makalelerim</h1>
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          {loading && <p>Yükleniyor...</p>}
          {error && <div className="alert alert-danger">{error}</div>}
          {!loading && !error && articles.length === 0 && (
            <p className="text-muted">Henüz makaleniz yok.</p>
          )}
          {!loading && !error && articles.length > 0 && (
            <ul className="list-group">
              {articles.map(article => (
                <div className="card mb-3 shadow-sm" key={article.id}>
                  <div className="card-body" style={{ padding: '10px' }}>
                  <h5 className="card-title">{article.title}</h5>
                  <p className="card-text">
                    {article.content ? article.content.substring(0, 100) + '...' : ''}
                  </p>
                  <p className="card-text">
                    <small className="text-muted">{article.word_count} kelime</small>
                  </p>
                  <p className="card-text">
                    <small className="text-muted">{article.created_at}</small>
                  </p>
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => deleteArticle(article.id, user.id)}
                    >
                      Sil
                    </button>
                    <button
                      className="btn btn-outline-info btn-sm"
                      onClick={() => showArticlePreview(article)}
                    >
                      Ön İzleme
                    </button>
                  </div>
                </div>
              </div>
              
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Ön İzleme Modal */}
      {showPreview && previewArticle && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.5)', 
            zIndex: 1050 
          }}
          onClick={closePreview}
        >
          <div 
            className="bg-white rounded shadow-lg"
            style={{ 
              maxWidth: '90%', 
              maxHeight: '90%', 
              width: '800px',
              overflow: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{previewArticle.title}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={closePreview}
                ></button>
              </div>
            </div>
            <div className="p-4">
              <div className="mb-3">
                <strong>Başlık:</strong> {previewArticle.title}
              </div>
              <div className="mb-3">
                <strong>İçerik:</strong>
                <div className="mt-2 p-3 bg-light rounded">
                  {previewArticle.content}
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <strong>Kelime Sayısı:</strong> {previewArticle.word_count}
                </div>
                <div className="col-md-6">
                  <strong>Oluşturulma Tarihi:</strong> {previewArticle.created_at}
                </div>
              </div>
            </div>
            <div className="p-4 border-top">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={closePreview}
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyArticlesContent;