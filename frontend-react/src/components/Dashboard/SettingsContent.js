import React, { useState } from 'react';

const SettingsContent = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleEdit = () => {
    setEditMode(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setEditMode(false);
    setForm({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          password: form.newPassword ? form.newPassword : undefined
        })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSuccess('Ayarlar başarıyla kaydedildi!');
        setEditMode(false);
        // localStorage'daki user bilgisini güncelle
        localStorage.setItem('user', JSON.stringify(data.data.user));
      } else {
        setError(data.message || 'Güncelleme başarısız.');
      }
    } catch (err) {
      setError('Sunucuya bağlanılamadı.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex align-items-center mb-3">
            <div className="flex-shrink-0">
              <i className="fas fa-user-circle fa-3x text-primary"></i>
            </div>
            <div className="flex-grow-1 ms-3">
              <h4 className="mb-0">{user.first_name} {user.last_name}</h4>
              <span className="text-muted">{user.email}</span>
            </div>
            {!editMode && (
              <button className="btn btn-outline-primary ms-auto" onClick={handleEdit}>
                <i className="fas fa-edit me-1"></i> Düzenle
              </button>
            )}
          </div>
          <hr />
          {error && (
            <div className="alert alert-danger" role="alert">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success" role="alert">
              <i className="fas fa-check-circle me-2"></i>
              {success}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="first_name" className="form-label fw-semibold">
                  <i className="fas fa-user me-2 text-muted"></i>
                  Ad
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="first_name"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  disabled={!editMode || isLoading}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="last_name" className="form-label fw-semibold">
                  <i className="fas fa-user me-2 text-muted"></i>
                  Soyad
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="last_name"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  disabled={!editMode || isLoading}
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">
                <i className="fas fa-envelope me-2 text-muted"></i>
                E-posta
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled={!editMode || isLoading}
              />
            </div>
            {editMode && (
              <>
                <hr className="my-4" />
                <h5 className="fw-bold mb-3">Şifre Değiştir</h5>
                <div className="mb-3">
                  <label htmlFor="currentPassword" className="form-label fw-semibold">
                    <i className="fas fa-lock me-2 text-muted"></i>
                    Mevcut Şifre
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="currentPassword"
                    name="currentPassword"
                    value={form.currentPassword}
                    onChange={handleChange}
                    placeholder="Mevcut şifreniz"
                    disabled={isLoading}
                  />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="newPassword" className="form-label fw-semibold">
                      <i className="fas fa-key me-2 text-muted"></i>
                      Yeni Şifre
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="newPassword"
                      name="newPassword"
                      value={form.newPassword}
                      onChange={handleChange}
                      placeholder="Yeni şifre"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="confirmNewPassword" className="form-label fw-semibold">
                      <i className="fas fa-key me-2 text-muted"></i>
                      Yeni Şifre Tekrarı
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmNewPassword"
                      name="confirmNewPassword"
                      value={form.confirmNewPassword}
                      onChange={handleChange}
                      placeholder="Yeni şifre tekrar"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary fw-semibold px-4"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Kaydediliyor...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>
                        Kaydet
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary fw-semibold px-4"
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    İptal
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsContent;