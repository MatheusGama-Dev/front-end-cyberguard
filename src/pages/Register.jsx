import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      alert('Conta criada com sucesso!');
      navigate('/'); // volta pra tela de login
    } else {
      alert(data.error || 'Erro ao criar conta');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold">Crie sua conta</h1>
          <p className="text-gray-400 text-lg">
            Cadastre-se e tenha acesso à plataforma.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#0e0e0e] rounded-2xl p-8 shadow-lg space-y-6 w-full"
        >
          <div>
            <label className="block text-sm text-gray-400 mb-1">Nome Completo</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full bg-[#1a1a1a] text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500"
              placeholder="Seu nome"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">E-mail</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-[#1a1a1a] text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500"
              placeholder="Seu e-mail"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Senha</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-[#1a1a1a] text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500"
              placeholder="Sua senha"
              required
            />
          </div>
          <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-700 py-2 rounded-lg text-white font-semibold hover:opacity-90">
            Criar conta
          </button>
          <p className="text-sm text-center text-gray-400">
            Já tem uma conta?{' '}
            <Link to="/" className="text-cyan-400 hover:underline">Entrar</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
