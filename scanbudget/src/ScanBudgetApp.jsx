import React, { useState } from 'react';
import { ReceiptUploader } from './components/ReceiptUploader';
import { Dashboard } from './components/Dashboard';

export const ScanBudgetApp = () => {
    const [dashboardKey, setDashboardKey] = useState(0);

    const handleProcessingComplete = () => {
        setDashboardKey(prevKey => prevKey + 1);
    }

    return (
        <div className="space-y-8">
            <ReceiptUploader onProcessingComplete={handleProcessingComplete} />
            <Dashboard key={dashboardKey} />
        </div>
    );
};