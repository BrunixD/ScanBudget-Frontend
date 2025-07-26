import React from 'react';
import { logout } from '../../config/firebase';
import { useAuth } from '../../hooks/useAuth';

export const Header = () => {
  const { isLoggedIn } = useAuth();
  
  return (
    <header className="w-full max-w-5xl flex justify-between items-center p-4 bg-white shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800">🧠 ScanBudget</h1>
      {isLoggedIn && (
        <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
          Logout
        </button>
      )}
    </header>
  );
};