import React from 'react';

const Footer = () => {
    return (
        <footer className="text-center text-lg-start bg-body-tertiary text-muted">
        <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
            <div>
                <a href="https://www.facebook.com/profile.php?id=100093161000000" className="me-4 text-reset">
                    <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://x.com/akillimakale" className="me-4 text-reset">
                    <i className="fab fa-twitter"></i>
                </a>
                <a href="https://www.instagram.com/akillimakale" className="me-4 text-reset">
                    <i className="fab fa-instagram"></i>
                </a>
            </div>
        </section>

        <section className="">
            <div className="container text-center text-md-start mt-5">
                <div className="row mt-3">
                    <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                        <h6 className="text-uppercase fw-bold mb-4">
                            <i className="fas fa-gem me-3"></i>Akıllı Makale
                        </h6>
                        <p>
                            Akıllı Makale, akıllı makale yazma ve yönetim platformudur.
                        </p>
                    </div>
                    <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                    <h6 className="text-uppercase fw-bold mb-4">
                        Menüler
                    </h6>
                    <p>
                        <a href="#!" className="text-reset">Hakkımızda</a>
                    </p>
                    <p>
                        <a href="#!" className="text-reset">İletişim</a>
                    </p>
                    </div>
                    <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                    <h6 className="text-uppercase fw-bold mb-4">
                        Kullanışlı Linkler
                    </h6>
                    <p>
                        <a href="#!" className="text-reset">Fiyatlar</a>
                    </p>
                    <p>
                        <a href="#!" className="text-reset">Ayarlar</a>
                    </p>
                    <p>
                        <a href="#!" className="text-reset">Siparişler</a>
                    </p>
                    <p>
                        <a href="#!" className="text-reset">Yardım</a>
                    </p>
                    </div>
                    <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                    <h6 className="text-uppercase fw-bold mb-4">İletişim</h6>
                    <p><i className="fas fa-home me-3"></i> İstanbul, Türkiye</p>
                    <p>
                        <i className="fas fa-envelope me-3"></i>
                        info@akillimakale.com
                    </p>
                    <p><i className="fas fa-phone me-3"></i> +90 555 555 55 55</p>
                    <p><i className="fas fa-print me-3"></i> +90 555 555 55 55</p>
                    </div>
                </div>
            </div>
        </section>
        <div className="text-center p-4">
            © 2025 Copyright <a href="https://www.akillimakale.com">Akıllı Makale</a> | Tüm hakları saklıdır.
        </div>
        </footer>
    );
};

export default Footer;