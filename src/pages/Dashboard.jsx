export default function Dashboard() {
  const topics = [
    {
      title: "Privacidade de Dados",
      description: "Aprenda como proteger suas informações pessoais na era digital.",
      button: "OBTER AGORA",
      icon: "/image/moneydados.png",
    },
    {
      title: "Segurança na Internet",
      description: "Dicas práticas para navegar com segurança e evitar armadilhas online.",
      button: "VER DETALHES",
      icon: "/image/ghost.png",
    },
    {
      title: "Ataques de Phishing",
      description: "Identifique e evite fraudes digitais e e-mails maliciosos.",
      button: "ENTRAR",
      icon: "/image/fsociety.png",
    },
  ];
  

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-start px-6 py-16">
      {/* Introdução */}
      <div className="max-w-3xl text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-4 drop-shadow-lg">Bem-vindo à Cyberguard</h1>
        <p className="text-gray-400 text-base leading-relaxed">
          Nossa missão é capacitar você com conhecimento essencial sobre segurança digital. 
          Explore nossos tópicos para aprender a se proteger contra ameaças virtuais, 
          preservar sua privacidade e navegar com confiança na internet.
        </p>
      </div>

      {/* Tópicos */}
      <div className="mt-6 w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {topics.map((topic, index) => (
          <div
            key={index}
            className="bg-[#0c0c0c] border border-[#1e1e1e] rounded-2xl p-8 shadow-[0_0_15px_#111] hover:shadow-red-600/30 transition-all duration-300 flex flex-col items-center text-center"
          >
            <img
              src={topic.icon}
              alt={topic.title}
              className="h-28 mb-6 opacity-90 transition-transform duration-300 hover:scale-105"
            />
            <h2 className="text-lg font-semibold mb-1">{topic.title}</h2>
            <p className="text-sm text-gray-400 mb-6 px-2">{topic.description}</p>
            <button className="bg-gradient-to-r from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 text-white py-2 px-6 rounded-full text-sm font-bold tracking-wide transition-all duration-200 shadow-md">
              {topic.button} →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
