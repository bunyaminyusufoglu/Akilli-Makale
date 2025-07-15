import React, { useState } from 'react';
import UserSidebar from '../components/Dashboard/UserSidebar';
import UserHeader from '../components/Dashboard/UserHeader';
import DashboardContent from '../components/Dashboard/DashboardContent';
import WriteArticleContent from '../components/Dashboard/WriteArticleContent';
import MyArticlesContent from '../components/Dashboard/MyArticlesContent';
import SettingsContent from '../components/Dashboard/SettingsContent';

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

export default Dashboard; 