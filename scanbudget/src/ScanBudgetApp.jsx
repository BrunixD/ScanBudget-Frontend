import React, { useState } from 'react';
import { ReceiptUploader } from './components/ReceiptUploader';
import { Dashboard } from './components/Dashboard';

// Agora recebemos o objeto 'user' do Firebase como uma prop
export const ScanBudgetApp = ({ user }) => {
    const [dashboardKey, setDashboardKey] = useState(0);

    const handleProcessingComplete = () => {
        setDashboardKey(prevKey => prevKey + 1);
    }

    return (
        <div className="space-y-8 w-full">
            {/* Passamos o 'user' para os componentes que precisam de fazer pedidos à API */}
            <ReceiptUploader onProcessingComplete={handleProcessingComplete} user={user} />
            <Dashboard key={dashboardKey} user={user} />
        </div>
    );
};