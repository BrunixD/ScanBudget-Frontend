import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

const formatCurrency = (value) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);

export const Dashboard = ({ user }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

   useEffect(() => {
    const fetchExpenses = async () => {
      // ESTA VERIFICAÇÃO É CRUCIAL
      if (!user) {
        console.log("Dashboard: A aguardar pelo objeto 'user'...");
        return; 
      }

      try {
        setLoading(true);
        const token = await user.getIdToken();
        // console.log("Dashboard: Token obtido, a fazer o pedido fetch."); // Descomente para depurar

        const response = await fetch(`${API_URL}/api/expenses`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error('Falha ao obter despesas do backend');
        }
        
        const data = await response.json();
        setExpenses(data);
      } catch (error) {
        console.error('Erro ao obter despesas:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExpenses();
  }, [user]);

  // Memoize the chart data so it's not recalculated on every render
  const chartData = useMemo(() => {
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.total;
      return acc;
    }, {});

    return Object.entries(categoryTotals).map(([name, total]) => ({
      name,
      total,
    }));
  }, [expenses]);


  if (loading) {
    return <div className="text-center p-10">Loading Dashboard...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Expense Dashboard</h2>
      
      {/* Chart */}
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Bar dataKey="total" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Expenses Table */}
      <div>
        <h3 className="font-semibold mb-2">Recent Expenses</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {expenses.slice(0, 5).map((exp) => ( // Show latest 5
                <tr key={exp.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{exp.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{exp.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{formatCurrency(exp.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};