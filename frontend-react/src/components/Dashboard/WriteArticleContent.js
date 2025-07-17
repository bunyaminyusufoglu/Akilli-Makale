import React, { useState } from 'react';

const WriteArticleContent = () => {
  const [form, setForm] = useState({
    title: '',
    keywords: '',
    prompt: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [article, setArticle] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setArticle('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.keywords.trim()) {
      setError('Başlık ve anahtar kelimeler zorunludur.');
      return;
    }
    setIsLoading(true);
    setError('');
    setArticle('');
    try {
      const response = await fetch('http://localhost/Akilli-Makale/backend-php/public/api/generate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          keywords: form.keywords,
          prompt: form.prompt,
          subtitle_count: form.subtitle_count,
          language: form.language

        })
      });
      const data = await response.json();
      if (response.ok && data.success && data.article) {
        setArticle(data.article);
      } else {
        setError(data.message || 'Makale oluşturulamadı.');
      }
    } catch (err) {
      setError('Sunucuya bağlanılamadı.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          {error && (
            <div className="alert alert-danger" role="alert">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label fw-semibold">
                <i className="fas fa-heading me-2 text-muted"></i>
                Makale Başlığı (H1)
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Başlık giriniz"
                disabled={isLoading}
                required
              />

            </div>
            <div className="mb-3">
              <label htmlFor="title" className="form-label fw-semibold">
                <i className="fas fa-list-ul me-2 text-muted"></i>
                Alt Başlık Sayısı (H2-H6)
              </label>
              <input
                type="number"
                className="form-control"
                id="subtitle_count"
                name="subtitle_count"
                value={form.subtitle_count}
                onChange={handleChange}
                placeholder="Alt başlık sayısı giriniz"
                disabled={isLoading}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="title" className="form-label fw-semibold">
                <i className="fas fa-language me-2 text-muted"></i>
                Makale Dil
              </label>
              <select className="form-select" id="language" name="language" value={form.language} onChange={handleChange} disabled={isLoading}>
                <option value="tr">Türkçe</option>
                <option value="en">İngilizce</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="keywords" className="form-label fw-semibold">
                <i className="fas fa-key me-2 text-muted"></i>
                Anahtar Kelimeler <span className="text-muted">(virgülle ayırın)</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="keywords"
                name="keywords"
                value={form.keywords}
                onChange={handleChange}
                placeholder="ör: yapay zeka, makale, teknoloji"
                disabled={isLoading}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="prompt" className="form-label fw-semibold">
                <i className="fas fa-info-circle me-2 text-muted"></i>
                Kısa Açıklama / İstek <span className="text-muted">(isteğe bağlı)</span>
              </label>
              <textarea
                className="form-control"
                id="prompt"
                name="prompt"
                rows={3}
                value={form.prompt}
                onChange={handleChange}
                placeholder="Makale ile ilgili özel bir isteğiniz varsa yazın..."
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary fw-semibold px-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Makale oluşturuluyor...
                </>
              ) : (
                <>
                  <i className="fas fa-robot me-2"></i>
                  Makale Oluştur
                </>
              )}
            </button>
          </form>
          {article && (
            <div className="mt-4">
              <h5 className="fw-bold mb-2">Oluşturulan Makale</h5>
              <div className="bg-light border rounded p-3" style={{ whiteSpace: 'pre-line' }}>
                {article}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WriteArticleContent;