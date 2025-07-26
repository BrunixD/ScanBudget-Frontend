import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
// Já não precisamos da biblioteca da OpenAI
// import OpenAI from "openai"; 

// =============================================================
// AVISO DE SEGURANÇA (O mesmo de antes)
// =============================================================
// Esta abordagem expõe a sua chave de API no navegador.
// É ótima para desenvolvimento, mas para produção, mova esta função para o backend.
// =============================================================

async function parseReceiptWithAI(rawText) {
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    throw new Error("Chave da API Gemini (VITE_GEMINI_API_KEY) não encontrada no ficheiro .env");
  }

  // CORREÇÃO: Usar o nome do modelo mais recente
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

  const prompt = `
    Analise o texto de recibo seguinte e extraia os dados para um objeto JSON.
    Formato: { "merchant": "Nome da Loja", "date": "AAAA-MM-DD", "total": number, "items": [{"name": "Nome do item", "value": number, "category": "Categoria"}] }
    Categorias possíveis: Mercearia, Restaurante, Transporte, Compras, Lazer, Outros.
    Se não conseguir extrair um campo, retorne null para esse campo.
    A sua resposta deve ser APENAS o objeto JSON, sem nenhum texto, explicação ou markdown (como \`\`\`json).
  `;

  const requestBody = {
    contents: [{
      parts: [{
        text: `${prompt}\n\n--- TEXTO DO RECIBO ---\n${rawText}`
      }]
    }],
    // Adicionar configurações de segurança para evitar respostas bloqueadas
    safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
    ],
    // Garantir que a resposta é JSON
    generationConfig: {
        responseMimeType: "application/json",
    }
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("Erro da API Gemini:", errorBody);
      throw new Error(errorBody.error.message || 'Falha ao comunicar com a API do Gemini.');
    }

    const data = await response.json();
    const jsonText = data.candidates[0].content.parts[0].text;
    
    // Com responseMimeType: "application/json", a limpeza de markdown já não é necessária
    return JSON.parse(jsonText);

  } catch (error) {
    console.error("Erro no fluxo do Gemini:", error);
    throw new Error(`Falha no processamento com Gemini: ${error.message}`);
  }
}


// O nosso componente principal (sem alterações na lógica interna)
export const ReceiptUploader = ({ onProcessingComplete }) => {
  const [status, setStatus] = useState('idle'); // idle, scanning, processing_ai, success, error
  const [progress, setProgress] = useState(0);
  const [errorDetails, setErrorDetails] = useState('');

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setStatus('scanning');
    setProgress(0);
    setErrorDetails('');
    onProcessingComplete(null);

    try {
      // 1. OCR no Frontend
      const { data: { text } } = await Tesseract.recognize(
        file, 'por', { logger: m => setProgress(Math.floor(m.progress * 100)) }
      );

      // 2. Enviar para a OpenAI
      setStatus('processing_ai');
      const structuredData = await parseReceiptWithAI(text);

      // 3. Passar os dados para o componente pai
      onProcessingComplete(structuredData);
      setStatus('success');

    } catch (err) {
      console.error("Ocorreu um erro no fluxo:", err);
      setErrorDetails(err.message || 'Ocorreu um erro desconhecido.');
      setStatus('error');
    }
  };

  const reset = () => {
    setStatus('idle');
    setProgress(0);
    setErrorDetails('');
    onProcessingComplete(null);
  };

  // O JSX permanece o mesmo que a versão anterior
  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">Analisar um Recibo</h2>
        <p className="text-gray-500">Selecione uma imagem para extrair os dados com IA.</p>
      </div>

      {status === 'idle' && <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />}
      {status === 'scanning' && <p>A ler o texto... {progress}%</p>}
      {status === 'processing_ai' && <p>A extrair dados com Inteligência Artificial...</p>}
      {status === 'success' && <p className="text-green-600">Recibo analisado com sucesso! Veja o dashboard abaixo.</p>}
      {status === 'error' && <p className="text-red-600">Erro: {errorDetails}</p>}
      
      {(status === 'success' || status === 'error') && (
        <button onClick={reset} className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md">Analisar Outro Recibo</button>
      )}
    </div>
  );
};