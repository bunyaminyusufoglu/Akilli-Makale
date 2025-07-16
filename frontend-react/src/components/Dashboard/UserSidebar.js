import React from 'react';

const UserSidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'fas fa-tachometer-alt',
      description: 'Genel bakış'
    },
    {
      id: 'write-article',
      label: 'Makale Yaz',
      icon: 'fas fa-pen-fancy',
      description: 'Yeni makale oluştur'
    },
    {
      id: 'my-articles',
      label: 'Makalelerim',
      icon: 'fas fa-file-alt',
      description: 'Tüm makalelerim'
    },
    {
      id: 'settings',
      label: 'Ayarlar',
      icon: 'fas fa-cog',
      description: 'Hesap ayarları'
    }
  ];

  return (
    <aside className="user-sidebar bg-white border-end shadow-sm" style={{ width: '280px', minHeight: 'calc(100vh - 80px)' }}>
      <div className="p-3">
        {/* Quick Actions */}
        <div className="mb-4">
          <h6 className="text-muted text-uppercase small fw-bold mb-3">Hızlı İşlemler</h6>
          <div className="d-grid gap-2">
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => setActiveTab('write-article')}
            >
              <i className="fas fa-plus me-2"></i>
              Yeni Makale
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="mb-4">
          <h6 className="text-muted text-uppercase small fw-bold mb-3">Menü</h6>
          <nav className="nav flex-column">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`nav-link text-start border-0 rounded-3 mb-1 ${
                  activeTab === item.id 
                    ? 'bg-primary text-white' 
                    : 'text-muted hover-bg-light'
                }`}
                onClick={() => setActiveTab(item.id)}
                style={{
                  transition: 'all 0.2s ease',
                  padding: '12px 16px'
                }}
              >
                <div className="d-flex align-items-center">
                  <i className={`${item.icon} me-3`} style={{ width: '20px' }}></i>
                  <div>
                    <div className="fw-semibold">{item.label}</div>
                    <small className="opacity-75">{item.description}</small>
                  </div>
                </div>
              </button>
            ))}
          </nav>
        </div>


        {/* Help Section */}
        <div>
          <h6 className="text-muted text-uppercase small fw-bold mb-3">Yardım</h6>
          <div className="d-grid gap-2">
            <button className="btn btn-outline-info btn-sm">
              <i className="fas fa-question-circle me-2"></i>
              Yardım Merkezi
            </button>
            <button className="btn btn-outline-secondary btn-sm">
              <i className="fas fa-comments me-2"></i>
              Destek
            </button>
            <button className="btn btn-outline-danger btn-sm">
              <i className="fas fa-sign-out-alt me-2"></i>
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default UserSidebar; 