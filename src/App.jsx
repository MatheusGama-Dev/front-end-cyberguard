import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white flex items-center justify-center px-4">
      <div className="max-w-4xl w-full flex flex-col md:flex-row bg-gray-900/70 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden">
        
        {/* Texto lateral */}
        <div className="md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-4xl font-extrabold mb-4">Bem-vindo de volta!</h2>
          <p className="text-gray-400 mb-6">
            Acesse sua conta ou crie uma nova para começar sua jornada.
          </p>
        </div>

        {/* Formulário */}
        <div className="md:w-1/2 p-10 bg-black/40">
          <form className="flex flex-col space-y-5">
            <input
              type="email"
              placeholder="E-mail"
              className="bg-gray-800 text-white p-3 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <input
              type="password"
              placeholder="Senha"
              className="bg-gray-800 text-white p-3 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-md font-semibold hover:opacity-90 transition"
            >
              Entrar
            </button>
            <p className="text-center text-gray-400 text-sm">
              Não tem uma conta? <a href="#" className="text-cyan-400 hover:underline">Crie aqui</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
