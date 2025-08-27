import { Link } from "react-router-dom";

export default function Dashboard() {
  const topics = [
    {
      id: "privacidade-dados",
      title: "Privacidade de Dados",
      description: "Aprenda como proteger suas informações pessoais na era digital.",
      button: "OBTER AGORA",
      icon: "/image/moneydados.png",
    },
    {
      id: "seguranca-internet",
      title: "Segurança na Internet",
      description: "Dicas práticas para navegar com segurança e evitar armadilhas online.",
      button: "VER DETALHES",
      icon: "/image/ghost.png",
    },
    {
      id: "phishing",
      title: "Ataques de Phishing",
      description: "Identifique e evite fraudes digitais e e-mails maliciosos.",
      button: "ENTRAR",
      icon: "/image/fsociety.png",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-start px-6 py-16 relative">
      <div className="max-w-3xl text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-4 drop-shadow-lg">Bem-vindo à Cyberguard</h1>
        <p className="text-gray-400 text-base leading-relaxed">
          Nossa missão é capacitar você com conhecimento essencial sobre segurança digital.
        </p>
      </div>

      {/* Tópicos */}
      <div className="mt-6 w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className="bg-[#0c0c0c] border border-[#1e1e1e] rounded-2xl p-8 shadow-[0_0_15px_#111] hover:shadow-red-600/30 transition-all duration-300 flex flex-col items-center text-center"
          >
            <img
              src={topic.icon}
              alt={topic.title}
              className="h-28 mb-6 opacity-90 transition-transform duration-300 hover:scale-105"
            />
            <h2 className="text-lg font-semibold mb-1">{topic.title}</h2>
            <p className="text-sm text-gray-400 mb-6 px-2">{topic.description}</p>
            <Link
              to={`/conteudo/${topic.id}`}
              className="bg-gradient-to-r from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 text-white py-2 px-6 rounded-full text-sm font-bold tracking-wide transition-all duration-200 shadow-md"
            >
              {topic.button} →
            </Link>
          </div>
        ))}
      </div>

      {/* Botão flutuante do chat */}
      <Link
        to="/chat"
        className="fixed bottom-5 right-5 bg-black hover:bg-blue-500 p-3 rounded-full shadow-lg flex items-center justify-center z-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 text-white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
          />
        </svg>
      </Link>
    </div>
  );
}
