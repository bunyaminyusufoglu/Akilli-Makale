import React from 'react';

const MyArticlesContent = () => {
    //const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = '/login';
    }

    return (
    <div className="p-4">
      <h1 className="h3 fw-bold mb-4">Makalelerim</h1>
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <p className="text-muted">Makaleler listesi burada olacak...</p>
        </div>
      </div>
    </div>
    );
};

export default MyArticlesContent;