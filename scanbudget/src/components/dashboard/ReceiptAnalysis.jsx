import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const formatCurrency = (value) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);

// Este componente agora recebe os dados do último recibo analisado
export const ReceiptAnalysis = ({ data }) => {
  // useMemo recalcula os dados do gráfico apenas quando os 'data' mudam
  const chartData = useMemo(() => {
    if (!data || !data.items || !data.items.length) return [];
    
    const categoryTotals = data.items.reduce((acc, item) => {
      const category = item.category || 'Outros';
      acc[category] = (acc[category] || 0) + item.value;
      return acc;
    }, {});

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2)),
    }));
  }, [data]);

  // Se não houver dados, mostra uma mensagem
  if (!data) {
    return (
      <div className="p-6 mt-8 bg-white rounded-xl shadow-md text-center text-gray-500">
        <p>Selecione a imagem de um recibo para ver a análise aqui.</p>
      </div>
    );
  }

  // Se houver dados, mostra o dashboard completo
  return (
    <div className="p-6 mt-8 bg-white rounded-xl shadow-md space-y-6">
      <div className="text-center border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">{data.merchant || 'Recibo'}</h2>
        <p className="text-gray-500">{data.date}</p>
        <p className="text-3xl font-bold mt-2 text-indigo-600">{data.total ? formatCurrency(data.total) : 'Total não encontrado'}</p>
      </div>
      
      {/* Gráfico de Categorias */}
      <div style={{ width: '100%', height: 300 }}>
        <h3 className="text-lg font-semibold mb-2">Despesas por Categoria</h3>
        <ResponsiveContainer>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={formatCurrency} />
            <YAxis type="category" dataKey="name" width={100} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Bar dataKey="value" fill="#8884d8" name="Total"/>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Tabela com TODOS os itens */}
      <div>
        <h3 className="font-semibold mb-2">Itens do Recibo</h3>
        <div className="max-h-96 overflow-y-auto border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Valor</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">{item.name}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800 text-right font-mono">{formatCurrency(item.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};