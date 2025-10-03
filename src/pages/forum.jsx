// src/pages/Forum.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  increment,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { ArrowLeft, ThumbsUp, ThumbsDown, CheckCircle, MessageSquare, Send } from "lucide-react";
import { toast } from "react-toastify";

export default function Forum() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [replies, setReplies] = useState([]);
  const [showNewThread, setShowNewThread] = useState(false);
  const [isLoadingThreads, setIsLoadingThreads] = useState(true);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);

  // Formulário de novo tópico
  const [newThreadForm, setNewThreadForm] = useState({
    title: "",
    content: "",
  });

  // Formulário de resposta
  const [replyContent, setReplyContent] = useState("");

  const courses = {
    "privacidade-dados": "Privacidade de Dados",
    "seguranca-internet": "Segurança na Internet",
    "phishing": "Ataques de Phishing",
    "criptografia": "Criptografia Avançada",
    "seguranca-empresas": "Segurança Corporativa",
    "backup-seguro": "Backup e Recuperação",
    "lgpd": "LGPD e Conformidade",
    "redes-seguras": "Segurança em Redes",
  };

  const courseName = courses[courseId] || "Fórum Geral";

  // Redireciona se não estiver logado
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  // Carrega threads do curso
  useEffect(() => {
    if (!courseId) return;

    const threadsRef = collection(db, "forum_threads");
    const q = query(
      threadsRef,
      where("courseId", "==", courseId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const threadsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setThreads(threadsData);
      setIsLoadingThreads(false);
    });

    return unsubscribe;
  }, [courseId]);

  // Carrega respostas do thread selecionado
  useEffect(() => {
    if (!selectedThread) return;

    setIsLoadingReplies(true);
    const repliesRef = collection(db, "forum_replies");
    const q = query(
      repliesRef,
      where("threadId", "==", selectedThread.id),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const repliesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReplies(repliesData);
      setIsLoadingReplies(false);
    });

    return unsubscribe;
  }, [selectedThread]);

  const handleCreateThread = async (e) => {
    e.preventDefault();
    if (!newThreadForm.title.trim() || !newThreadForm.content.trim() || !user) return;

    try {
      await addDoc(collection(db, "forum_threads"), {
        courseId,
        title: newThreadForm.title,
        content: newThreadForm.content,
        authorId: user.uid,
        authorName: user.displayName || user.email.split("@")[0],
        createdAt: serverTimestamp(),
        repliesCount: 0,
        upvotes: [],
        downvotes: [],
        solved: false,
      });

      setNewThreadForm({ title: "", content: "" });
      setShowNewThread(false);
      toast.success("Tópico criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar tópico:", error);
      toast.error("Erro ao criar tópico");
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim() || !user || !selectedThread) return;

    try {
      await addDoc(collection(db, "forum_replies"), {
        threadId: selectedThread.id,
        content: replyContent,
        authorId: user.uid,
        authorName: user.displayName || user.email.split("@")[0],
        createdAt: serverTimestamp(),
        upvotes: [],
        downvotes: [],
        isSolution: false,
      });

      // Incrementa contador de respostas
      const threadRef = doc(db, "forum_threads", selectedThread.id);
      await updateDoc(threadRef, {
        repliesCount: increment(1),
      });

      setReplyContent("");
      toast.success("Resposta enviada!");
    } catch (error) {
      console.error("Erro ao enviar resposta:", error);
      toast.error("Erro ao enviar resposta");
    }
  };

  const handleVote = async (itemType, itemId, voteType) => {
    if (!user) return;

    try {
      const collectionName = itemType === "thread" ? "forum_threads" : "forum_replies";
      const itemRef = doc(db, collectionName, itemId);

      const item = itemType === "thread" 
        ? threads.find(t => t.id === itemId)
        : replies.find(r => r.id === itemId);

      const hasUpvoted = item?.upvotes?.includes(user.uid);
      const hasDownvoted = item?.downvotes?.includes(user.uid);

      if (voteType === "up") {
        if (hasUpvoted) {
          await updateDoc(itemRef, {
            upvotes: arrayRemove(user.uid),
          });
        } else {
          await updateDoc(itemRef, {
            upvotes: arrayUnion(user.uid),
            ...(hasDownvoted && { downvotes: arrayRemove(user.uid) }),
          });
        }
      } else {
        if (hasDownvoted) {
          await updateDoc(itemRef, {
            downvotes: arrayRemove(user.uid),
          });
        } else {
          await updateDoc(itemRef, {
            downvotes: arrayUnion(user.uid),
            ...(hasUpvoted && { upvotes: arrayRemove(user.uid) }),
          });
        }
      }
    } catch (error) {
      console.error("Erro ao votar:", error);
      toast.error("Erro ao votar");
    }
  };

  const handleMarkAsSolution = async (replyId) => {
    if (!user || !selectedThread || selectedThread.authorId !== user.uid) {
      toast.error("Apenas o autor pode marcar a solução");
      return;
    }

    try {
      const replyRef = doc(db, "forum_replies", replyId);
      await updateDoc(replyRef, {
        isSolution: true,
      });

      const threadRef = doc(db, "forum_threads", selectedThread.id);
      await updateDoc(threadRef, {
        solved: true,
        solvedAt: serverTimestamp(),
      });

      toast.success("Resposta marcada como solução!");
    } catch (error) {
      console.error("Erro ao marcar solução:", error);
      toast.error("Erro ao marcar como solução");
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return "";
    const date = timestamp.toDate();
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m atrás`;
    if (hours < 24) return `${hours}h atrás`;
    if (days < 7) return `${days}d atrás`;
    return date.toLocaleDateString();
  };

  const getVoteScore = (upvotes = [], downvotes = []) => {
    return upvotes.length - downvotes.length;
  };

  if (loading || isLoadingThreads) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando fórum...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Dashboard</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold">{courseName}</h1>
                <p className="text-gray-400 text-sm">Fórum de Discussão</p>
              </div>
            </div>
            <button
              onClick={() => setShowNewThread(!showNewThread)}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 px-4 py-2 rounded-lg font-semibold transition-all"
            >
              + Novo Tópico
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <h2 className="font-bold text-lg mb-4">Tópicos</h2>
              
              {showNewThread && (
                <form onSubmit={handleCreateThread} className="mb-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                  <input
                    type="text"
                    placeholder="Título do tópico..."
                    value={newThreadForm.title}
                    onChange={(e) => setNewThreadForm({ ...newThreadForm, title: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                  <textarea
                    placeholder="Descreva sua dúvida ou discussão..."
                    value={newThreadForm.content}
                    onChange={(e) => setNewThreadForm({ ...newThreadForm, content: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 mb-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                  <div className="flex gap-2">
                    <button type="submit" className="flex-1 bg-red-600 hover:bg-red-500 py-2 rounded-lg font-semibold">
                      Criar
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewThread(false)}
                      className="flex-1 bg-gray-600 hover:bg-gray-500 py-2 rounded-lg font-semibold"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {threads.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">Nenhum tópico ainda. Seja o primeiro!</p>
                ) : (
                  threads.map((thread) => (
                    <div
                      key={thread.id}
                      onClick={() => setSelectedThread(thread)}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedThread?.id === thread.id
                          ? "bg-red-600/20 border border-red-500"
                          : "bg-gray-700/30 hover:bg-gray-700/50 border border-transparent"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-sm line-clamp-2">{thread.title}</h3>
                        {thread.solved && <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 ml-2" />}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{thread.authorName}</span>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {thread.repliesCount || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="w-3 h-3" />
                            {getVoteScore(thread.upvotes, thread.downvotes)}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{formatDate(thread.createdAt)}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {!selectedThread ? (
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-12 text-center">
                <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Selecione um tópico para ver a discussão</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-2">{selectedThread.title}</h2>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{selectedThread.authorName}</span>
                        <span>{formatDate(selectedThread.createdAt)}</span>
                        {selectedThread.solved && (
                          <span className="flex items-center gap-1 text-green-400">
                            <CheckCircle className="w-4 h-4" />
                            Resolvido
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4 whitespace-pre-wrap">{selectedThread.content}</p>
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-700">
                    <button
                      onClick={() => handleVote("thread", selectedThread.id, "up")}
                      className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors ${
                        selectedThread.upvotes?.includes(user?.uid)
                          ? "bg-green-600 text-white"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{selectedThread.upvotes?.length || 0}</span>
                    </button>
                    <button
                      onClick={() => handleVote("thread", selectedThread.id, "down")}
                      className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors ${
                        selectedThread.downvotes?.includes(user?.uid)
                          ? "bg-red-600 text-white"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                    >
                      <ThumbsDown className="w-4 h-4" />
                      <span>{selectedThread.downvotes?.length || 0}</span>
                    </button>
                    <span className="text-gray-400">
                      Score: {getVoteScore(selectedThread.upvotes, selectedThread.downvotes)}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Respostas ({replies.length})</h3>
                  {isLoadingReplies ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500 mx-auto"></div>
                    </div>
                  ) : replies.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">Nenhuma resposta ainda. Seja o primeiro a responder!</p>
                  ) : (
                    replies.map((reply) => (
                      <div
                        key={reply.id}
                        className={`bg-gray-800/50 border rounded-xl p-4 ${
                          reply.isSolution ? "border-green-500 bg-green-900/10" : "border-gray-700"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="font-bold text-sm">{reply.authorName[0].toUpperCase()}</span>
                            </div>
                            <div>
                              <div className="font-semibold">{reply.authorName}</div>
                              <div className="text-xs text-gray-400">{formatDate(reply.createdAt)}</div>
                            </div>
                          </div>
                          {reply.isSolution && (
                            <span className="flex items-center gap-1 text-green-400 text-sm">
                              <CheckCircle className="w-4 h-4" />
                              Solução
                            </span>
                          )}
                        </div>
                        <p className="text-gray-300 mb-4 whitespace-pre-wrap">{reply.content}</p>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleVote("reply", reply.id, "up")}
                            className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors text-sm ${
                              reply.upvotes?.includes(user?.uid)
                                ? "bg-green-600 text-white"
                                : "bg-gray-700 hover:bg-gray-600"
                            }`}
                          >
                            <ThumbsUp className="w-4 h-4" />
                            <span>{reply.upvotes?.length || 0}</span>
                          </button>
                          <button
                            onClick={() => handleVote("reply", reply.id, "down")}
                            className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors text-sm ${
                              reply.downvotes?.includes(user?.uid)
                                ? "bg-red-600 text-white"
                                : "bg-gray-700 hover:bg-gray-600"
                            }`}
                          >
                            <ThumbsDown className="w-4 h-4" />
                            <span>{reply.downvotes?.length || 0}</span>
                          </button>
                          <span className="text-gray-400 text-sm">
                            Score: {getVoteScore(reply.upvotes, reply.downvotes)}
                          </span>
                          {!selectedThread.solved && selectedThread.authorId === user?.uid && !reply.isSolution && (
                            <button
                              onClick={() => handleMarkAsSolution(reply.id)}
                              className="ml-auto flex items-center gap-2 bg-green-600 hover:bg-green-500 px-3 py-1 rounded-lg text-sm transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Marcar como Solução
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleReply} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                  <textarea
                    placeholder="Escreva sua resposta..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 mb-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 px-6 py-2 rounded-lg font-semibold transition-all"
                  >
                    <Send className="w-4 h-4" />
                    Enviar Resposta
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}