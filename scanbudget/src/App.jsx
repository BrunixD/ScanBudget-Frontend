import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, logout } from './firebase';
import { Auth } from './components/Auth'; // Importamos o nosso novo componente

function App() {
  const [user] = useAuthState(auth); // Usamos o hook aqui para mostrar/esconder o botão de logout

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <header className="w-full max-w-4xl flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">🧠 ScanBudget</h1>
          {user && (
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          )}
      </header>
      
      <main className="w-full max-w-4xl flex justify-center">
        <Auth />
      </main>
    </div>
  );
}

export default App;