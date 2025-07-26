import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';

const formatCurrency = (value) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1943'];

// O Dashboard agora recebe 'data' como uma prop
export const Dashboard = ({ data }) => {

  // useMemo recalcula os dados do gráfico apenas quando os 'data' mudam
  const chartData = useMemo(() => {
    if (!data || !data.items || data.items.length === 0) {
      return [];
    }
    // Agrupa os itens por categoria e soma os seus valores
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
        <p>Selecione a imagem de um recibo para ver os dados aqui.</p>
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
      
      {/* Gráfico */}
      <div style={{ width: '100%', height: 300 }}>
        <h3 className="text-lg font-semibold mb-2">Despesas por Categoria</h3>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};