import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const UserHeader = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log('Logout clicked');
    // Redirect to login page
    window.location.href = '/login';
  };

  return (
    <header className="user-header bg-white border-bottom shadow-sm">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center py-3">
          {/* Logo */}
          <div className="d-flex align-items-center">
            <Link to="/dashboard" className="navbar-brand fw-bold text-decoration-none">
              <i className="fas fa-brain text-primary me-2"></i>
              Akıllı Makale
            </Link>
          </div>

          {/* Right Side */}
          <div className="d-flex align-items-center gap-3">
            {/* User Profile */}
            <div className="position-relative">
              <button
                className="btn btn-link text-decoration-none d-flex align-items-center gap-2"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px' }}>
                  <i className="fas fa-user"></i>
                </div>
                <span className="d-none d-md-block">Ahmet Yılmaz</span>
                <i className="fas fa-chevron-down"></i>
              </button>

              {/* User Dropdown */}
              {showDropdown && (
                <div className="position-absolute end-0 mt-2 dropdown-menu show" style={{ minWidth: '200px', zIndex: 1000 }}>
                  <div className="dropdown-header">
                    <div className="d-flex align-items-center">
                      <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2" style={{ width: '40px', height: '40px' }}>
                        <i className="fas fa-user"></i>
                      </div>
                      <div>
                        <div className="fw-bold">Ahmet Yılmaz</div>
                        <small className="text-muted">ahmet@email.com</small>
                      </div>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link to="/profile" className="dropdown-item">
                    <i className="fas fa-user me-2"></i>
                    Profil
                  </Link>
                  <Link to="/settings" className="dropdown-item">
                    <i className="fas fa-cog me-2"></i>
                    Ayarlar
                  </Link>
                  <Link to="/help" className="dropdown-item">
                    <i className="fas fa-question-circle me-2"></i>
                    Yardım
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Çıkış Yap
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showDropdown || showNotifications) && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ zIndex: 999 }}
          onClick={() => {
            setShowDropdown(false);
            setShowNotifications(false);
          }}
        ></div>
      )}
    </header>
  );
};

export default UserHeader; 