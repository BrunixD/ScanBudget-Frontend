import React, { useState } from 'react';
import { signUp, signIn } from '../../config/firebase';

export const SignInUpScreen = () => {
  // Controla se estamos no modo 'login' ou 'registo'
  const [isLogin, setIsLogin] = useState(true); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validação simples de palavra-passe para o registo
    if (!isLogin && password.length < 6) {
      setError('A palavra-passe deve ter pelo menos 6 caracteres.');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      // Se for bem-sucedido, o hook useAuthState na App irá detetar a mudança 
      // e o router irá redirecionar para a página principal. Não precisamos de fazer nada aqui.
    } catch (err) {
      // Mapear erros comuns do Firebase para mensagens mais amigáveis
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('E-mail ou palavra-passe incorretos.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está a ser utilizado.');
      } else {
        setError('Ocorreu um erro. Verifique as suas credenciais e tente novamente.');
      }
      console.error("Erro de autenticação:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-900">
        {isLogin ? 'Aceder à sua Conta' : 'Criar Nova Conta'}
      </h2>
      
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Endereço de e-mail
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="seu-email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Palavra-passe
          </label>
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
          >
            {loading ? 'A processar...' : (isLogin ? 'Entrar' : 'Registar')}
          </button>
        </div>
      </form>

      <div className="text-sm text-center text-gray-600">
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setError(''); // Limpa o erro ao trocar de modo
            setEmail('');   // Limpa os campos
            setPassword('');
          }}
          disabled={loading}
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          {isLogin ? 'Não tem uma conta? Registe-se aqui.' : 'Já tem uma conta? Faça login.'}
        </button>
      </div>
    </div>
  );
};