import React from 'react';
import { ReceiptUploader } from '../components/dashboard/ReceiptUploader';
import { Dashboard } from '../components/dashboard/Dashboard';

export const DashboardPage = () => {
  return (
    <div className="space-y-8">
      <ReceiptUploader />
      <Dashboard />
    </div>
  );
};