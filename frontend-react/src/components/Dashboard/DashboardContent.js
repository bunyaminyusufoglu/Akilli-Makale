import React, { useEffect, useState } from 'react';

const DashboardContent = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    const token = localStorage.getItem("token");
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token || !user) return;
        const fetchArticles = async () => {
            setLoading(true);
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
                }
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, [token, user?.id]);

    if (!token) {
        window.location.href = '/login';
    }

    return (
    <div className="p-4">
      <h1 className="h3 fw-bold mb-4">Dashboard</h1>
      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <i className="fas fa-file-alt text-primary fs-2"></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="card-title text-muted mb-1">Toplam Makale</h6>
                  <h4 className="fw-bold mb-0">{articles.length}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <i className="fas fa-eye text-success fs-2"></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="card-title text-muted mb-1">Toplam Kelime</h6>
                  <h4 className="fw-bold mb-0">{articles.reduce((total, article) => total + article.word_count, 0)}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <i className="fas fa-credit-card text-danger fs-2"></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="card-title text-muted mb-1">Harcanan Kredi</h6>
                  <h4 className="fw-bold mb-0">{user.used_balance}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <i className="fas fa-credit-card text-warning fs-2"></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="card-title text-muted mb-1">Kalan Kredi</h6>
                  <h4 className="fw-bold mb-0">{user.remaining_balance}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      {/* Recent Articles */}
      <div className="row">
        <div className="col-md-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="fw-bold mb-0">Son Makaleler</h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                {loading && <div>Yükleniyor...</div>}
                {!loading && articles.slice(0, 4).map((article) => (
                  <div key={article.id} className="list-group-item border-0 px-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">{article.title}</h6>
                      </div>
                      <div className="d-flex align-items-center gap-3">
                        <span className="badge bg-light text-dark">
                          <i className="fas fa-clock me-1"></i>
                          {article.created_at}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {!loading && articles.length === 0 && (
                  <div className="text-muted">Henüz makaleniz yok.</div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="fw-bold mb-0">Hızlı İşlemler</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button className="btn btn-outline-primary" onClick={() => window.location.href = '/write-article'}>
                  <i className="fas fa-plus me-2"></i>
                  Yeni Makale Oluştur
                </button>
                <button className="btn btn-outline-secondary" onClick={() => window.location.href = '/my-articles'}>
                  <i className="fas fa-file-alt me-2"></i>
                  Makalelerim
                </button>
                <button className="btn btn-outline-info" onClick={() => window.location.href = '/settings'}>
                  <i className="fas fa-cog me-2"></i>
                  Ayarlar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
};

export default DashboardContent;