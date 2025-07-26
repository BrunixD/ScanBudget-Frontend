import React, { useEffect } from 'react';

export const Dashboard = () => {
  useEffect(() => {
    console.log("O componente Dashboard foi montado. Aqui iríamos buscar os dados.");
    // POR AGORA: Não fazemos nenhuma chamada à API.
  }, []);

  return (
    <div className="w-full p-6 bg-white rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Painel de Despesas</h2>
      <div className="text-center p-10 border-2 border-dashed rounded-lg">
        <p className="text-gray-500">O gráfico e a tabela de despesas irão aparecer aqui.</p>
      </div>
    </div>
  );
};