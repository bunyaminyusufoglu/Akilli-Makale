import React from 'react';

const Header = () => {
  return (
    <div className="container border-bottom">
        <nav className="navbar navbar-expand-lg bg-white rounded-top" style={{paddingTop: 24, paddingLeft: 32, paddingRight: 32}}>
      <div className="container-fluid p-0" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <a className="navbar-brand fw-bold" href="#" style={{fontSize: 22}}>
          <span style={{ color: '#2563eb', fontWeight: 700 }}>Akıllı</span>
          <span style={{ color: '#111', fontWeight: 700 }}> Makale</span>
        </a>
        <div className="d-flex gap-3">
          <a className="btn btn-link" href="#" style={{color: '#222', fontSize: 16}}>Giriş</a>
          <a className="btn btn-primary" href="#" style={{fontSize: 16}}>Kayıt Ol</a>
        </div>
      </div>
    </nav>
    </div>
  );
};

export default Header; 