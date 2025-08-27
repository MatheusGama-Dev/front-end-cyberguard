import { useParams, Link } from 'react-router-dom';

export default function Conteudo() {
  const { id } = useParams();

  // Simula dados dos conteúdos (você pode depois puxar isso de um banco ou API)
  const conteudos = {
    "privacidade-dados": {
      title: "Privacidade de Dados",
      videoUrl: "https://youtu.be/NcXsK_u4ixI?si=avK1gErYBBn_neq6",
      artigo: "https://seusite.com/artigo-privacidade",
    },
    "seguranca-internet": {
      title: "Segurança na Internet",
      videoUrl: "https://www.youtube.com/embed/YOUTUBE_ID_SEGURANCA",
      artigo: "https://seusite.com/artigo-seguranca",
    },
    "phishing": {
      title: "Ataques de Phishing",
      videoUrl: "https://www.youtube.com/embed/YOUTUBE_ID_PHISHING",
      artigo: "https://seusite.com/artigo-phishing",
    },
  };

  const conteudo = conteudos[id];

  if (!conteudo) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold mb-4">Conteúdo não encontrado.</h1>
        <Link to="/dashboard" className="text-cyan-400 hover:underline">Voltar para o Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-start p-6">
      <div className="max-w-4xl w-full text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">{conteudo.title}</h1>
        <iframe
          className="w-full aspect-video mb-6"
          src={conteudo.videoUrl}
          title={conteudo.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
        <a
          href={conteudo.artigo}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gradient-to-r from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 text-white py-2 px-6 rounded-full font-bold tracking-wide shadow-md transition-all duration-200"
        >
          Ler Artigo Completo →
        </a>
        <div className="mt-6">
          <Link to="/dashboard" className="text-cyan-400 hover:underline">← Voltar para o Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
