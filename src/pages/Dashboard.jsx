import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import { MessageSquare, Search, Menu, X } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [userProgress, setUserProgress] = useState({});
  const [activeCarousel, setActiveCarousel] = useState(0);
  const [showAchievement, setShowAchievement] = useState(false);
  const [userStats, setUserStats] = useState({
    completedCourses: 0,
    inProgress: 0,
    timeSpent: "0h 0m",
    achievements: 0,
    streak: 0,
    level: "Iniciante"
  });
  const [recentAchievements, setRecentAchievements] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;

    const loadUserData = async () => {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserProgress(data.progress || {});
          setUserStats(data.stats || userStats);
          setRecentAchievements(data.achievements || []);
        } else {
          await setDoc(userDocRef, {
            email: user.email,
            displayName: user.displayName || user.email.split("@")[0],
            progress: {},
            stats: userStats,
            achievements: [],
            createdAt: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar seus dados");
      } finally {
        setIsLoadingData(false);
      }
    };

    loadUserData();
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCarousel((prev) => (prev + 1) % featuredCarousel.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (Object.keys(userProgress).length > 0) {
      const completed = Object.values(userProgress).filter(p => p >= 100).length;
      const inProgress = Object.values(userProgress).filter(p => p > 0 && p < 100).length;
      
      let level = "Iniciante";
      if (completed >= 5) level = "Avançado";
      else if (completed >= 2) level = "Intermediário";

      setUserStats(prev => ({
        ...prev,
        completedCourses: completed,
        inProgress: inProgress,
        level: level
      }));
    }
  }, [userProgress]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logout realizado com sucesso!");
      navigate("/login");
    } catch (error) {
      toast.error("Erro ao fazer logout");
    }
  };

  const categories = [
    { id: "todos", name: "Todos", icon: "📚", count: 8 },
    { id: "iniciante", name: "Iniciante", icon: "🟢", count: 4 },
    { id: "avancado", name: "Avançado", icon: "🔴", count: 2 },
    { id: "empresarial", name: "Empresa", icon: "🏢", count: 2 },
    { id: "certificacao", name: "Certificado", icon: "📜", count: 6 }
  ];

  const featuredCarousel = [
    {
      id: "destaque-1",
      title: "Novo: Segurança em IoT",
      description: "Proteja dispositivos conectados contra ameaças modernas",
      badge: "LANÇAMENTO",
      color: "from-purple-600 to-blue-600"
    },
    {
      id: "destaque-2", 
      title: "Certificação Internacional",
      description: "Certificação reconhecida pelo mercado",
      badge: "CERTIFICAÇÃO",
      color: "from-green-600 to-emerald-600"
    },
    {
      id: "destaque-3",
      title: "Workshop Gratuito",
      description: "Participe do nosso workshop sobre cibersegurança",
      badge: "EVENTO",
      color: "from-orange-600 to-red-600"
    }
  ];

  const topics = [
    {
      id: "privacidade-dados",
      title: "Privacidade de Dados",
      description: "Aprenda como proteger suas informações pessoais na era digital.",
      button: "CONTINUAR",
      icon: "🔒",
      category: "iniciante",
      featured: true,
      duration: "4h",
      level: "Iniciante",
      rating: 4.8,
      students: "1.2k",
      lessons: 12,
      certified: true,
      tags: ["Popular", "Essencial"]
    },
    {
      id: "seguranca-internet",
      title: "Segurança na Internet",
      description: "Dicas práticas para navegar com segurança e evitar armadilhas online.",
      button: "CONTINUAR", 
      icon: "💻",
      category: "iniciante",
      featured: false,
      duration: "3h",
      level: "Iniciante",
      rating: 4.6,
      students: "892",
      lessons: 8,
      certified: true,
      tags: ["Básico"]
    },
    {
      id: "phishing",
      title: "Ataques de Phishing",
      description: "Identifique e evite fraudes digitais e e-mails maliciosos.",
      button: "CONTINUAR",
      icon: "🎣",
      category: "avancado",
      featured: true,
      duration: "2.5h",
      level: "Intermediário",
      rating: 4.9,
      students: "567",
      lessons: 6,
      certified: false,
      tags: ["Avançado", "Hot"]
    },
    {
      id: "criptografia",
      title: "Criptografia Avançada",
      description: "Domine técnicas avançadas de proteção de dados através da criptografia.",
      button: "COMEÇAR",
      icon: "🔐",
      category: "avancado",
      featured: false,
      duration: "6h",
      level: "Avançado",
      rating: 4.7,
      students: "234",
      lessons: 10,
      certified: true,
      tags: ["Complexo"]
    },
    {
      id: "seguranca-empresas",
      title: "Segurança Corporativa",
      description: "Proteja sua empresa contra ameaças cibernéticas com estratégias corporativas.",
      button: "ACESSAR",
      icon: "🛡️",
      category: "empresarial",
      featured: true,
      duration: "8h",
      level: "Avançado", 
      rating: 4.8,
      students: "456",
      lessons: 14,
      certified: true,
      tags: ["Empresa", "Premium"]
    },
    {
      id: "backup-seguro",
      title: "Backup e Recuperação",
      description: "Aprenda a fazer backups seguros e recuperar dados em caso de incidentes.",
      button: "CONTINUAR",
      icon: "☁️",
      category: "iniciante",
      featured: false,
      duration: "3h",
      level: "Iniciante",
      rating: 4.5,
      students: "678",
      lessons: 7,
      certified: true,
      tags: ["Prático"]
    },
    {
      id: "lgpd",
      title: "LGPD e Conformidade",
      description: "Entenda a Lei Geral de Proteção de Dados e requirements de conformidade.",
      button: "VER CERTIFICADO",
      icon: "⚖️",
      category: "empresarial",
      featured: true,
      duration: "5h",
      level: "Intermediário",
      rating: 4.9,
      students: "789",
      lessons: 9,
      certified: true,
      tags: ["Legal", "Obrigatório"]
    },
    {
      id: "redes-seguras",
      title: "Segurança em Redes",
      description: "Proteja redes corporativas e domésticas contra invasões.",
      button: "COMEÇAR",
      icon: "🌐",
      category: "avancado",
      featured: false,
      duration: "7h",
      level: "Avançado",
      rating: 4.8,
      students: "345",
      lessons: 11,
      certified: true,
      tags: ["Técnico"]
    }
  ];

  const filteredTopics = selectedCategory === "todos" 
    ? topics 
    : selectedCategory === "certificacao"
    ? topics.filter(topic => topic.certified)
    : topics.filter(topic => topic.category === selectedCategory);

  const searchedTopics = filteredTopics.filter(topic =>
    topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topic.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topic.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading || isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando seus dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {showAchievement && (
        <div className="fixed top-4 right-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-lg z-50 animate-bounce max-w-xs sm:max-w-sm">
          <div className="flex items-center space-x-3">
            <span className="text-xl sm:text-2xl">🏆</span>
            <div className="text-sm sm:text-base">
              <div className="font-bold">Conquista Desbloqueada!</div>
              <div className="opacity-90">Curso Concluído!</div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-red-600 to-red-700 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-lg">
                <span className="font-bold text-white text-base sm:text-lg">CG</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Cyberguard
                </h1>
                <p className="text-gray-400 text-xs sm:text-sm">Security Academy</p>
              </div>
            </div>
            
            {/* Desktop Search */}
            <div className="hidden lg:block relative flex-1 max-w-md mx-6">
              <input
                type="text"
                placeholder="Buscar cursos..."
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="lg:hidden p-2 bg-gray-800 rounded-lg border border-gray-700"
              >
                <Search className="w-5 h-5" />
              </button>
              
              {/* User Menu - Desktop */}
              <div className="hidden md:flex items-center space-x-3 bg-gray-800 rounded-xl px-3 py-2 border border-gray-700">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="font-bold text-white text-sm sm:text-base">
                    {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
                <div className="text-xs sm:text-sm">
                  <div className="font-medium truncate max-w-[100px]">
                    {user?.displayName || user?.email?.split("@")[0]}
                  </div>
                  <div className="text-gray-400">{userStats.level}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                  title="Sair"
                >
                  🚪
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 bg-gray-800 rounded-lg border border-gray-700"
              >
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {showSearch && (
            <div className="lg:hidden mt-3 relative">
              <input
                type="text"
                placeholder="Buscar cursos..."
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
            </div>
          )}

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden mt-3 bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-700">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="font-bold text-white">
                    {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
                <div>
                  <div className="font-medium">{user?.displayName || user?.email?.split("@")[0]}</div>
                  <div className="text-gray-400 text-sm">Nível {userStats.level}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-500 py-2 rounded-lg font-semibold transition-colors"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Carousel */}
        <div className="relative bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 border border-gray-700 overflow-hidden">
          <div className="flex transition-transform duration-500 ease-in-out" 
               style={{ transform: `translateX(-${activeCarousel * 100}%)` }}>
            {featuredCarousel.map((item) => (
              <div key={item.id} className="flex-shrink-0 w-full">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex-1 text-center md:text-left">
                    <span className={`bg-gradient-to-r ${item.color} text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4 inline-block shadow-lg`}>
                      {item.badge}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">{item.title}</h2>
                    <p className="text-gray-300 text-base sm:text-lg mb-4 sm:mb-6">{item.description}</p>
                    <button className="bg-white text-gray-900 hover:bg-gray-100 py-2.5 sm:py-3 px-6 sm:px-8 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base">
                      Explorar Agora →
                    </button>
                  </div>
                  <div className="flex-1 flex justify-center md:justify-end">
                    <div className="w-48 h-36 sm:w-64 sm:h-48 bg-gradient-to-br from-red-900/20 to-red-600/10 rounded-2xl border border-red-800/30 flex items-center justify-center shadow-2xl">
                      <span className="text-5xl sm:text-6xl">🎯</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center space-x-2 sm:space-x-3 mt-4 sm:mt-6">
            {featuredCarousel.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveCarousel(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  index === activeCarousel ? "bg-white w-6 sm:w-8" : "bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 sm:p-4 text-center backdrop-blur-sm">
            <div className="text-xl sm:text-2xl font-bold text-green-400">{userStats.completedCourses}</div>
            <div className="text-xs sm:text-sm text-gray-400">Concluídos</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 sm:p-4 text-center backdrop-blur-sm">
            <div className="text-xl sm:text-2xl font-bold text-yellow-400">{userStats.inProgress}</div>
            <div className="text-xs sm:text-sm text-gray-400">Em Progresso</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 sm:p-4 text-center backdrop-blur-sm">
            <div className="text-xl sm:text-2xl font-bold text-blue-400">{userStats.timeSpent}</div>
            <div className="text-xs sm:text-sm text-gray-400">Tempo</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 sm:p-4 text-center backdrop-blur-sm">
            <div className="text-xl sm:text-2xl font-bold text-purple-400">{userStats.achievements}</div>
            <div className="text-xs sm:text-sm text-gray-400">Conquistas</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 sm:p-4 text-center backdrop-blur-sm">
            <div className="text-xl sm:text-2xl font-bold text-red-400">{userStats.streak}</div>
            <div className="text-xs sm:text-sm text-gray-400">Dias Seguidos</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 sm:p-4 text-center backdrop-blur-sm">
            <div className="text-xl sm:text-2xl font-bold text-cyan-400">{userStats.level}</div>
            <div className="text-xs sm:text-sm text-gray-400">Nível</div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                  }`}
                >
                  <span className="text-base sm:text-lg">{category.icon}</span>
                  <span className="hidden sm:inline">{category.name}</span>
                  <span className="sm:hidden">{category.name.split(' ')[0]}</span>
                  <span className="bg-gray-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs">
                    {category.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Courses Grid */}
            {searchedTopics.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-base sm:text-lg">Nenhum curso encontrado</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {searchedTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="bg-gray-800/50 border border-gray-700 rounded-2xl p-4 sm:p-6 hover:border-red-500/30 transition-all duration-300 group backdrop-blur-sm"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-gray-600 text-2xl sm:text-3xl flex-shrink-0">
                          {topic.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base sm:text-xl font-bold mb-2 line-clamp-2">{topic.title}</h3>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {topic.tags.map((tag, index) => (
                              <span key={index} className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 sm:py-1 rounded-full border border-red-500/30">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      {topic.featured && (
                        <span className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white text-xs px-2 sm:px-3 py-1 rounded-full font-bold flex-shrink-0 ml-2">
                          TOP
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed line-clamp-2">{topic.description}</p>

                    {/* Meta Info */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400 mb-4">
                      <div className="flex items-center space-x-2">
                        <span>⏱️ {topic.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>📚 {topic.lessons} aulas</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>⭐ {topic.rating}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>👥 {topic.students}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {userProgress[topic.id] > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-xs sm:text-sm text-gray-400 mb-2">
                          <span>Progresso</span>
                          <span>{userProgress[topic.id]}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-red-600 to-red-500 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${userProgress[topic.id]}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {/* Actions */}
                    <div className="flex flex-col gap-2 sm:gap-3">
                      <div className="flex justify-between items-center gap-2">
                        <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm">
                          <span className="text-gray-400 capitalize">{topic.level}</span>
                          {topic.certified && (
                            <span className="text-green-400 flex items-center space-x-1">
                              <span>📜</span>
                              <span className="hidden sm:inline">Certificado</span>
                            </span>
                          )}
                        </div>
                        <Link
                          to={`/conteudo/${topic.id}`}
                          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-red-500/25 group-hover:scale-105 text-xs sm:text-sm"
                        >
                          {userProgress[topic.id] === 100 ? "CERTIFICADO" : 
                           userProgress[topic.id] > 0 ? "CONTINUAR" : "COMEÇAR"}
                        </Link>
                      </div>
                      
                      <Link
                        to={`/forum/${topic.id}`}
                        className="w-full flex items-center justify-center gap-2 bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-white py-2 px-4 rounded-xl font-medium transition-all duration-200 border border-gray-600 hover:border-gray-500 text-xs sm:text-sm"
                      >
                        <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Fórum</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar - Hidden on mobile, shown on lg+ */}
          <div className="hidden lg:block w-80 space-y-6">
            {/* Achievements */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="font-bold text-lg mb-4 flex items-center space-x-2">
                <span>🏆</span>
                <span>Conquistas Recentes</span>
              </h3>
              <div className="space-y-4">
                {recentAchievements.length > 0 ? (
                  recentAchievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{achievement.name}</div>
                        <div className="text-xs text-gray-400">{achievement.date}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm text-center py-4">
                    Complete cursos para desbloquear conquistas!
                  </p>
                )}
              </div>
            </div>

            {/* Overall Progress */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="font-bold text-lg mb-4">Seu Progresso</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Cursos Concluídos</span>
                    <span>{userStats.completedCourses}/{topics.length}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(userStats.completedCourses / topics.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Em Progresso</span>
                    <span>{userStats.inProgress}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${(userStats.inProgress / topics.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Chat Button */}
      <Link
        to="/chat"
        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-200 group hover:scale-110 z-40"
      >
        <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-xs text-white font-bold">💬</span>
        </div>
      </Link>
    </div>
  );
}