import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      toast.success("Login realizado com sucesso!");
      navigate("/dashboard"); // redireciona para dashboard
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        toast.error("Usuário não encontrado.");
      } else if (error.code === "auth/wrong-password") {
        toast.error("Senha incorreta.");
      } else {
        toast.error("Erro ao fazer login: " + error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold">Bem-vindo de volta</h1>
          <p className="text-gray-400 text-lg">
            Entre na sua conta para acessar o Dashboard.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#0e0e0e] rounded-2xl p-8 shadow-lg space-y-6 w-full"
        >
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
          <button className="w-full bg-gradient-to-r from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 py-2 rounded-lg text-white font-semibold hover:opacity-90">
            Entrar
          </button>
          <p className="text-sm text-center text-gray-400">
            Não tem uma conta?{" "}
            <Link to="/register" className="text-cyan-400 hover:underline">
              Criar conta
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
