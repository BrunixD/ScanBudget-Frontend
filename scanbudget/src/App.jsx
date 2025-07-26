import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Header } from './components/layout/Header';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProtectedLayout } from './components/layout/ProtectedLayout';

// =============================================================
// Componente Principal da Aplicação com a Lógica de Roteamento
// =============================================================
function App() {
  const { isLoggedIn, loading } = useAuth();

  // 1. Enquanto o estado de autenticação está a ser verificado, mostramos um ecrã de loading.
  // Isto evita "flashes" de conteúdo e redirecionamentos prematuros.
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>A carregar aplicação...</p>
      </div>
    );
  }

  // 2. O roteamento principal, agora que já sabemos o estado de autenticação.
  return (
    <BrowserRouter>
      <Routes>
        {isLoggedIn ? (
          // ROTAS PARA UTILIZADORES LOGADOS
          <>
            <Route element={<ProtectedLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              {/* Adicione outras rotas protegidas aqui, ex: <Route path="/profile" ... /> */}
            </Route>
            {/* Redireciona a rota raiz para o dashboard se estiver logado */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </>
        ) : (
          // ROTAS PARA UTILIZADORES NÃO LOGADOS
          <>
            <Route path="/auth" element={<AuthPage />} />
            {/* Redireciona qualquer outra rota para a página de autenticação se não estiver logado */}
            <Route path="*" element={<Navigate to="/auth" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;