import React from 'react';

export const ReceiptUploader = () => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Ficheiro selecionado:", file.name);
      // POR AGORA: Não fazemos nada com o ficheiro, apenas mostramos no console.
      alert(`Ficheiro "${file.name}" selecionado. A lógica de upload será implementada aqui.`);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">Carregue o seu Recibo</h2>
        <p className="text-gray-500">Nós iremos analisá-lo e fazer o resto.</p>
      </div>
      <input
        type="file"
        accept="image/*,application/pdf"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
      />
    </div>
  );
};