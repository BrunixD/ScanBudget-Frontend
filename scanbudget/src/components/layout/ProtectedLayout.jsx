import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export const ProtectedLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <Header />
      <main className="w-full max-w-5xl p-4">
        <Outlet /> {/* As nossas páginas protegidas (ex: Dashboard) serão renderizadas aqui */}
      </main>
    </div>
  );
};