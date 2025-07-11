import React, { useState } from 'react';
import UserSidebar from '../components/UserSidebar';
import UserHeader from '../components/UserHeader';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'write-article':
        return <WriteArticleContent />;
      case 'my-articles':
        return <MyArticlesContent />;
      case 'templates':
        return <TemplatesContent />;
      case 'settings':
        return <SettingsContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="dashboard-container">
      <UserHeader />
      <div className="dashboard-content">
        <UserSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="main-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

// Dashboard Content Component
const DashboardContent = () => (
  <div className="p-4">
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h1 className="h3 fw-bold">Dashboard</h1>
    </div>

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
                <h4 className="fw-bold mb-0">10</h4>
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
                <h4 className="fw-bold mb-0">10,247</h4>
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
                <h4 className="fw-bold mb-0">100</h4>
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
                <h4 className="fw-bold mb-0">25</h4>
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
              {[
                { title: 'Yapay Zeka ve Gelecek', date: '2 saat önce'},
                { title: 'React.js Best Practices', date: '1 gün önce'},
                { title: 'Modern Web Tasarımı', date: '3 gün önce'},
                { title: 'SEO Optimizasyonu', date: '1 hafta önce'}
              ].map((article, index) => (
                <div key={index} className="list-group-item border-0 px-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">{article.title}</h6>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <span className="badge bg-light text-dark">
                        <i className="fas fa-clock me-1"></i>
                        {article.date}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
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
              <button className="btn btn-outline-primary">
                <i className="fas fa-plus me-2"></i>
                Yeni Makale Oluştur
              </button>
              <button className="btn btn-outline-secondary">
                <i className="fas fa-file-alt me-2"></i>
                Makalelerim
              </button>
              <button className="btn btn-outline-info">
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

// Write Article Content Component
const WriteArticleContent = () => (
  <div className="p-4">
    <h1 className="h3 fw-bold mb-4">Yeni Makale Oluştur</h1>
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <p className="text-muted">Makale yazma özelliği burada olacak...</p>
      </div>
    </div>
  </div>
);

// My Articles Content Component
const MyArticlesContent = () => (
  <div className="p-4">
    <h1 className="h3 fw-bold mb-4">Makalelerim</h1>
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <p className="text-muted">Makaleler listesi burada olacak...</p>
      </div>
    </div>
  </div>
);

// Templates Content Component
const TemplatesContent = () => (
  <div className="p-4">
    <h1 className="h3 fw-bold mb-4">Şablonlar</h1>
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <p className="text-muted">Makale şablonları burada olacak...</p>
      </div>
    </div>
  </div>
);

// Settings Content Component
const SettingsContent = () => (
  <div className="p-4">
    <h1 className="h3 fw-bold mb-4">Ayarlar</h1>
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <p className="text-muted">Kullanıcı ayarları burada olacak...</p>
      </div>
    </div>
  </div>
);

export default Dashboard; 