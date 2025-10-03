import { useParams, Link } from 'react-router-dom';

export default function Conteudo() {
  const { id } = useParams();

  // Simula dados dos conteúdos
  const conteudos = {
    "privacidade-dados": {
      title: "Privacidade de Dados",
      videoUrl: "https://www.youtube.com/embed/f_dzv0rG2NY",
      artigo: "https://seusite.com/artigo-privacidade",
    },
    "seguranca-internet": {
      title: "Segurança na Internet",
      videoUrl: "https://www.youtube.com/embed/SEU_ID_VIDEO_AQUI",
      artigo: "https://seusite.com/artigo-seguranca",
    },
    "phishing": {
      title: "Ataques de Phishing",
      videoUrl: "https://www.youtube.com/embed/SEU_ID_VIDEO_AQUI",
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
// Atualizar progresso ao assistir vídeo
const handleVideoProgress = () => {
  // Lógica para calcular % assistido
  updateProgress(courseId, percentage);
}
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-start p-6">
      <div className="max-w-4xl w-full text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">{conteudo.title}</h1>
        
        {/* Player de Vídeo */}
        <div className="w-full aspect-video mb-6 rounded-lg overflow-hidden shadow-lg">
          <iframe
            className="w-full h-full"
            src={conteudo.videoUrl}
            title={`Vídeo sobre ${conteudo.title}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>

        {/* Botão do Artigo */}
        <a
          href={conteudo.artigo}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gradient-to-r from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 text-white py-3 px-8 rounded-full font-bold tracking-wide shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          Ler Artigo Completo →
        </a>

        {/* Botão Voltar */}
        <div className="mt-8">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center text-cyan-400 hover:text-cyan-300 hover:underline transition-all duration-200"
          >
            <span className="mr-2">←</span>
            Voltar para o Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}