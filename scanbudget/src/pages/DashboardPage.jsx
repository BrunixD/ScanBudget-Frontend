import React, { useState } from 'react';
import { ReceiptUploader } from '../components/dashboard/ReceiptUploader';
import { ReceiptAnalysis } from '../components/dashboard/ReceiptAnalysis'; // Importar o novo componente

export const DashboardPage = () => {
  const [processedData, setProcessedData] = useState(null);

  const handleProcessingComplete = (data) => {
    setProcessedData(data);
  };

  return (
    <div className="space-y-8">
      <ReceiptUploader onProcessingComplete={handleProcessingComplete} />
      <ReceiptAnalysis data={processedData} />
    </div>
  );
};