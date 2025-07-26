import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, signUp, signIn } from '../firebase';
import { ScanBudgetApp } from '../ScanBudgetApp';

// O componente Auth continua a ser o nosso "porteiro"
export const Auth = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div className="text-center p-10"><p>A carregar...</p></div>;
  }
  if (user) {
    return <ScanBudgetApp user={user} />;
  }
  
  return <SignInUpScreen />; // Mostra o novo ecrã de login/registo
};

// O novo ecrã que lida com o formulário
const SignInUpScreen = () => {
  // Controla se estamos no modo 'login' ou 'registo'
  const [isLogin, setIsLogin] = useState(true); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpa erros anteriores

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      // Se for bem-sucedido, o useAuthState irá detetar a mudança e o componente Auth irá renderizar a app
    } catch (err) {
      // Mapear erros comuns do Firebase para mensagens mais amigáveis
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('E-mail ou palavra-passe incorretos.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está a ser utilizado.');
      } else {
        setError('Ocorreu um erro. Tente novamente.');
      }
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-900">
        {isLogin ? 'Login' : 'Criar Conta'}
      </h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password"className="block text-sm font-medium text-gray-700">Palavra-passe</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isLogin ? 'Entrar' : 'Registar'}
          </button>
        </div>
      </form>
      <div className="text-sm text-center">
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
          }}
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          {isLogin ? 'Não tem uma conta? Registe-se' : 'Já tem uma conta? Faça login'}
        </button>
      </div>
    </div>
  );
};