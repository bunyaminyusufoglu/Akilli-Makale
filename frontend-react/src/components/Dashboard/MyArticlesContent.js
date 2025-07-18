import React, { useEffect, useState } from 'react';

const MyArticlesContent = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
  }, [token, user]);

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
                <li key={article.id} className="list-group-item">
                  <strong>{article.title}</strong>
                  <div className="text-muted" style={{ fontSize: 13 }}>
                    {article.created_at}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyArticlesContent;