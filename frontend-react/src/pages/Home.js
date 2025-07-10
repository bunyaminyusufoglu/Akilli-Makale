import React from 'react';

const Home = () => (
    <div className='container'>
      <section className="text-center py-5">
        <div className="container">
          <h1 className="display-4 fw-bold">Yapay Zekayla Anında Makale Yazın!</h1>
          <p className="lead text-muted mt-3 mb-4">
            Hızlı, özgün ve kaliteli makaleler oluşturmanın en kolay yolu.
          </p>
          <div>
            <button className="btn btn-primary btn-lg me-3">Makale Yaz</button>
            <button className="btn btn-outline-secondary btn-lg">Örnekleri Gör</button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <div className="row text-center">

            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-lg">
                <div className="card-body">
                  <i className="fa-solid fa-star fs-1 text-primary mb-3"></i>
                  <h5 className="card-title fw-bold">Özgün İçerik</h5>
                  <p className="card-text text-muted">Yapay zekamızla %100 özgün makaleler oluşturun.</p>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-lg">
                <div className="card-body">
                  <i className="fa-solid fa-pencil fs-1 text-success mb-3"></i>
                  <h5 className="card-title fw-bold">Kolay Kullanım</h5>
                  <p className="card-text text-muted">Sadece konuyu girin, yazınız saniyeler içinde hazır.</p>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-lg">
                <div className="card-body">
                  <i className="fa-solid fa-clock-rotate-left fs-1 text-warning mb-3"></i>
                  <h5 className="card-title fw-bold">Hızlı Sonuç</h5>
                  <p className="card-text text-muted">Dakikalar değil, saniyeler içinde içerik üretin.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Popular Topics Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3">Popüler Konular</h2>
            <p className="text-muted">İlgi alanınıza göre makaleler keşfedin</p>
          </div>
          <div className="row justify-content-center g-3">
            {[
              { name: 'Teknoloji', icon: 'fas fa-laptop' },
              { name: 'Sağlık', icon: 'fas fa-heartbeat' },
              { name: 'Yazılım', icon: 'fas fa-code' },
              { name: 'Finans', icon: 'fas fa-dollar-sign' },
              { name: 'Moda', icon: 'fas fa-shopping-bag' },
              { name: 'Seyahat', icon: 'fas fa-plane' },
              { name: 'Eğitim', icon: 'fas fa-graduation-cap' },
              { name: 'İş Dünyası', icon: 'fas fa-briefcase' }
            ].map((topic, index) => (
              <div key={index} className="col-6 col-md-3">
                <div className="card h-100 border-0 shadow-lg topic-card text-center p-3">
                  <div className="card-body d-flex flex-column justify-content-center">
                    <i className={`${topic.icon} mb-2 text-primary`} style={{ fontSize: '1.5rem' }}></i>
                    <h6 className="card-title mb-0 fw-semibold">{topic.name}</h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <button className="btn btn-outline-primary px-4 py-2">
              Tüm Konuları Görüntüle →
            </button>
          </div>
        </div>
      </section>

    </div>
);

export default Home; 