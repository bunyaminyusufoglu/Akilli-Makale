import React from 'react';

const Header = () => {
  return (
    <div className="container-fluid border-bottom">
      <nav className="navbar navbar-expand-lg bg-white rounded-top" style={{paddingTop: 24, paddingLeft: 32, paddingRight: 32}}>
        <div className="container-fluid p-0" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <a className='navbar-brand fw-bold' href="/">
            Akıllı Makale
          </a>
          <div className="d-flex gap-3">
            <a className="btn btn-outline-primary" href="/login">Giriş</a>
            <a className="btn btn-primary" href="/register">Kayıt Ol</a>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header; 