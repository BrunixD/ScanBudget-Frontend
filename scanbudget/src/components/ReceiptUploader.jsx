import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import Tesseract from 'tesseract.js';
import { parseReceiptText } from '../utils/parser';

// Use uma variável de ambiente para a URL da API para facilitar o deploy
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

export const ReceiptUploader = ({ onProcessingComplete }) => {
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const { getToken } = useAuth();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setErrorMessage('');
    setStatus('processing');

    try {
      const token = await getToken();
      if (!token) throw new Error("Não autenticado!");

      setStatus('uploading');
      const uploadUrlResponse = await fetch(`${API_URL}/api/generate-upload-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      });
      const { signedUrl, imageUrl } = await uploadUrlResponse.json();

      await fetch(signedUrl, { method: 'PUT', body: file });
      
      setStatus('scanning');
      const { data } = await Tesseract.recognize(file, 'eng', { logger: m => setProgress(parseInt(m.progress * 100)) });
      
      const parsedData = parseReceiptText(data.text);
      if (!parsedData.total) throw new Error("Não foi possível encontrar um total no recibo.");
      
      setStatus('saving');
      const saveResponse = await fetch(`${API_URL}/api/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...parsedData, imageUrl, rawText: data.text }),
      });

      if (!saveResponse.ok) throw new Error("Falha ao guardar a despesa.");
      
      setStatus('success');
      onProcessingComplete();
      setTimeout(() => setStatus('idle'), 2000);

    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Ocorreu um erro desconhecido.");
      setStatus('error');
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">Carregue o seu Recibo</h2>
      </div>
      
      <input type="file" accept="image/*" onChange={handleFileChange} disabled={status !== 'idle' && status !== 'error'} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>

      {status !== 'idle' && status !== 'error' && (
        <div>
          <p className="text-center font-semibold capitalize">{status}...</p>
          {status === 'scanning' && <progress value={progress} max="100" className="w-full" />}
        </div>
      )}

      {status === 'success' && <p className="text-center text-green-600">Guardado com sucesso!</p>}
      {status === 'error' && <p className="text-center text-red-600">Erro: {errorMessage}</p>}
    </div>
  );
};