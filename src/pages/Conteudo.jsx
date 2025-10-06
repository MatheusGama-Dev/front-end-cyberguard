// src/pages/Conteudo.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { 
  ArrowLeft, 
  CheckCircle, 
  Lock, 
  PlayCircle, 
  FileText,
  ChevronDown,
  ChevronRight,
  Award
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function Conteudo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  
  const [selectedModule, setSelectedModule] = useState(0);
  const [selectedLesson, setSelectedLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [expandedModules, setExpandedModules] = useState([0]);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  const [showCertificate, setShowCertificate] = useState(false);

  // Dados dos cursos com módulos e aulas
  const coursesData = {
    "privacidade-dados": {
      title: "Privacidade de Dados",
      description: "Aprenda como proteger suas informações pessoais na era digital",
      modules: [
        {
          id: 0,
          title: "Introdução à Privacidade",
          lessons: [
            {
              id: 0,
              title: "O que é Privacidade de Dados?",
              videoUrl: "https://www.youtube.com/embed/f_dzv0rG2NY",
              duration: "15:30",
              description: "Entenda os conceitos básicos de privacidade de dados",
              article: "https://seusite.com/artigo-privacidade"
            },
            {
              id: 1,
              title: "Por que a Privacidade é Importante?",
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              duration: "12:45",
              description: "Descubra a importância da proteção de dados pessoais"
            },
            {
              id: 2,
              title: "Tipos de Dados Pessoais",
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              duration: "18:20",
              description: "Conheça os diferentes tipos de dados que você gera"
            }
          ]
        },
        {
          id: 1,
          title: "Ameaças à Privacidade",
          lessons: [
            {
              id: 3,
              title: "Rastreamento Online",
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              duration: "20:15",
              description: "Como empresas rastreiam você na internet"
            },
            {
              id: 4,
              title: "Vazamento de Dados",
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              duration: "16:30",
              description: "Entenda como vazamentos acontecem"
            },
            {
              id: 5,
              title: "Engenharia Social",
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              duration: "14:50",
              description: "Técnicas usadas para obter informações pessoais"
            }
          ]
        },
        {
          id: 2,
          title: "Protegendo sua Privacidade",
          lessons: [
            {
              id: 6,
              title: "Senhas Fortes",
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              duration: "10:20",
              description: "Como criar senhas seguras"
            },
            {
              id: 7,
              title: "Autenticação em Dois Fatores",
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              duration: "13:15",
              description: "Adicione uma camada extra de segurança"
            },
            {
              id: 8,
              title: "VPN e Navegação Anônima",
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              duration: "17:40",
              description: "Proteja sua navegação online"
            },
            {
              id: 9,
              title: "Configurações de Privacidade",
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              duration: "19:25",
              description: "Ajuste suas configurações nas redes sociais"
            }
          ]
        },
        {
          id: 3,
          title: "Projeto Final",
          lessons: [
            {
              id: 10,
              title: "Auditoria de Privacidade Pessoal",
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              duration: "25:00",
              description: "Realize uma auditoria completa da sua privacidade online"
            },
            {
              id: 11,
              title: "Plano de Ação de Privacidade",
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              duration: "15:30",
              description: "Crie seu plano pessoal de proteção de dados"
            }
          ]
        }
      ]
    },
    "seguranca-internet": {
      title: "Segurança na Internet",
      description: "Navegue com segurança e evite armadilhas online",
      modules: [
        {
          id: 0,
          title: "Fundamentos de Segurança",
          lessons: [
            {
              id: 0,
              title: "Introdução à Segurança Online",
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              duration: "12:00"
            },
            {
              id: 1,
              title: "Principais Ameaças da Internet",
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              duration: "18:30"
            }
          ]
        },
        {
          id: 1,
          title: "Navegação Segura",
          lessons: [
            {
              id: 2,
              title: "Identificando Sites Seguros",
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              duration: "15:20"
            },
            {
              id: 3,
              title: "Extensões de Segurança",
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              duration: "20:15"
            }
          ]
        }
      ]
    },
    "phishing": {
      title: "Ataques de Phishing",
      description: "Identifique e evite fraudes digitais",
      modules: [
        {
          id: 0,
          title: "O que é Phishing",
          lessons: [
            {
              id: 0,
              title: "Introdução ao Phishing",
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              duration: "14:00"
            },
            {
              id: 1,
              title: "Tipos de Phishing",
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              duration: "16:30"
            }
          ]
        }
      ]
    }
  };

  const course = coursesData[id];

  // Carrega progresso do usuário
  useEffect(() => {
    if (!user || !id) return;

    const loadProgress = async () => {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          const courseProgress = data.courseProgress?.[id] || {};
          setCompletedLessons(courseProgress.completedLessons || []);
          
          // Se tem progresso, volta para a última aula
          if (courseProgress.lastLesson) {
            setSelectedModule(courseProgress.lastModule || 0);
            setSelectedLesson(courseProgress.lastLesson || 0);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar progresso:", error);
      } finally {
        setIsLoadingProgress(false);
      }
    };

    loadProgress();
  }, [user, id]);

  // Verifica se o curso está completo
  useEffect(() => {
    if (!course) return;
    
    const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
    if (completedLessons.length === totalLessons) {
      setShowCertificate(true);
    }
  }, [completedLessons, course]);

  const markLessonAsComplete = async (lessonId) => {
    if (!user || completedLessons.includes(lessonId)) return;

    const newCompletedLessons = [...completedLessons, lessonId];
    setCompletedLessons(newCompletedLessons);

    try {
      const userDocRef = doc(db, "users", user.uid);
      const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
      const progress = Math.round((newCompletedLessons.length / totalLessons) * 100);

      await updateDoc(userDocRef, {
        [`courseProgress.${id}`]: {
          completedLessons: newCompletedLessons,
          lastModule: selectedModule,
          lastLesson: lessonId,
          progress: progress,
          lastUpdated: new Date().toISOString()
        },
        [`progress.${id}`]: progress
      });

      toast.success("Aula concluída!");

      // Se completou o curso
      if (newCompletedLessons.length === totalLessons) {
        toast.success("🎉 Parabéns! Você completou o curso!");
        setShowCertificate(true);
      }
    } catch (error) {
      console.error("Erro ao atualizar progresso:", error);
      toast.error("Erro ao salvar progresso");
    }
  };

  const toggleModule = (moduleId) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const selectLesson = (moduleId, lessonId) => {
    setSelectedModule(moduleId);
    setSelectedLesson(lessonId);
  };

  const isLessonLocked = (lessonId) => {
    // Primeira aula sempre desbloqueada
    if (lessonId === 0) return false;
    // Verifica se a aula anterior foi completada
    return !completedLessons.includes(lessonId - 1);
  };

  const getCurrentLesson = () => {
    if (!course) return null;
    return course.modules[selectedModule]?.lessons[selectedLesson];
  };

  const getNextLesson = () => {
    if (!course) return null;
    
    const currentModuleLessons = course.modules[selectedModule].lessons;
    
    // Próxima aula no mesmo módulo
    if (selectedLesson < currentModuleLessons.length - 1) {
      return {
        moduleId: selectedModule,
        lessonId: selectedLesson + 1
      };
    }
    
    // Primeira aula do próximo módulo
    if (selectedModule < course.modules.length - 1) {
      return {
        moduleId: selectedModule + 1,
        lessonId: 0
      };
    }
    
    return null;
  };

  const goToNextLesson = () => {
    const next = getNextLesson();
    if (next) {
      selectLesson(next.moduleId, next.lessonId);
      if (!expandedModules.includes(next.moduleId)) {
        toggleModule(next.moduleId);
      }
    }
  };

  if (loading || isLoadingProgress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando curso...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold mb-4">Conteúdo não encontrado.</h1>
        <Link to="/dashboard" className="text-cyan-400 hover:underline">
          Voltar para o Dashboard
        </Link>
      </div>
    );
  }

  const currentLesson = getCurrentLesson();
  const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const courseProgress = Math.round((completedLessons.length / totalLessons) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Dashboard</span>
              </button>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold">{course.title}</h1>
                <p className="text-xs sm:text-sm text-gray-400">{course.description}</p>
              </div>
            </div>
            
            {/* Progresso */}
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-400">Seu Progresso</div>
                <div className="font-bold text-lg">{courseProgress}%</div>
              </div>
              <div className="w-32 bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-red-600 to-red-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${courseProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto">
        {/* Sidebar - Lista de Módulos e Aulas */}
        <aside className="lg:w-96 bg-gray-800/30 border-r border-gray-700 overflow-y-auto lg:h-[calc(100vh-80px)] lg:sticky lg:top-20">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg sm:text-xl">Conteúdo do Curso</h2>
              <span className="text-sm text-gray-400">
                {completedLessons.length}/{totalLessons}
              </span>
            </div>

            {/* Progresso Mobile */}
            <div className="md:hidden mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Progresso</span>
                <span className="font-bold">{courseProgress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-red-600 to-red-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${courseProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Módulos */}
            <div className="space-y-3">
              {course.modules.map((module) => (
                <div key={module.id} className="bg-gray-700/30 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {expandedModules.includes(module.id) ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                      <div className="text-left">
                        <div className="font-semibold text-sm sm:text-base">
                          Módulo {module.id + 1}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-400">
                          {module.title}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {module.lessons.filter(l => completedLessons.includes(l.id)).length}/{module.lessons.length}
                    </span>
                  </button>

                  {/* Aulas do Módulo */}
                  {expandedModules.includes(module.id) && (
                    <div className="border-t border-gray-600">
                      {module.lessons.map((lesson) => {
                        const isCompleted = completedLessons.includes(lesson.id);
                        const isLocked = isLessonLocked(lesson.id);
                        const isCurrent = selectedModule === module.id && selectedLesson === lesson.id;

                        return (
                          <button
                            key={lesson.id}
                            onClick={() => !isLocked && selectLesson(module.id, lesson.id)}
                            disabled={isLocked}
                            className={`w-full flex items-center gap-3 p-3 sm:p-4 hover:bg-gray-700/30 transition-colors text-left ${
                              isCurrent ? 'bg-red-600/20 border-l-4 border-red-500' : ''
                            } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <div className="flex-shrink-0">
                              {isCompleted ? (
                                <CheckCircle className="w-5 h-5 text-green-400" />
                              ) : isLocked ? (
                                <Lock className="w-5 h-5 text-gray-500" />
                              ) : (
                                <PlayCircle className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">
                                {lesson.title}
                              </div>
                              {lesson.duration && (
                                <div className="text-xs text-gray-400">
                                  {lesson.duration}
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Certificado */}
            {showCertificate && (
              <div className="mt-6 p-4 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-600/50 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Award className="w-6 h-6 text-yellow-400" />
                  <div>
                    <div className="font-bold">Parabéns!</div>
                    <div className="text-sm text-gray-300">Curso concluído</div>
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 py-2 rounded-lg font-semibold transition-all">
                  Baixar Certificado
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Conteúdo Principal */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {currentLesson && (
            <div className="space-y-6">
              {/* Player de Vídeo */}
              <div className="bg-black rounded-xl overflow-hidden shadow-2xl">
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full"
                    src={currentLesson.videoUrl}
                    title={currentLesson.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>

              {/* Informações da Aula */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-3">{currentLesson.title}</h2>
                {currentLesson.description && (
                  <p className="text-gray-300 mb-4">{currentLesson.description}</p>
                )}

                {/* Ações */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => markLessonAsComplete(currentLesson.id)}
                    disabled={completedLessons.includes(currentLesson.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold transition-all ${
                      completedLessons.includes(currentLesson.id)
                        ? 'bg-green-600/50 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-500'
                    }`}
                  >
                    <CheckCircle className="w-5 h-5" />
                    {completedLessons.includes(currentLesson.id)
                      ? 'Aula Concluída'
                      : 'Marcar como Concluída'}
                  </button>

                  {getNextLesson() && (
                    <button
                      onClick={goToNextLesson}
                      className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 py-3 px-6 rounded-lg font-semibold transition-all"
                    >
                      Próxima Aula →
                    </button>
                  )}
                </div>

                {/* Artigo (se existir) */}
                {currentLesson.article && (
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <a
                      href={currentLesson.article}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <FileText className="w-5 h-5" />
                      <span>Ler Artigo Complementar</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}