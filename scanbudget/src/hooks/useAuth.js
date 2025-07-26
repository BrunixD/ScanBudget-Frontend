import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase';

// Este hook simplifica o acesso ao estado de autenticação em toda a app
export const useAuth = () => {
  const [user, loading, error] = useAuthState(auth);

  return {
    user,
    loading,
    error,
    isLoggedIn: !!user, // Um boolean simples para saber se está logado
  };
};