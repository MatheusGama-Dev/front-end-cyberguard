import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { ArrowLeft } from "lucide-react"; // <- ícone

export default function Chat() {
  const navigate = useNavigate();
  const [user, setUser] = useState(undefined); // undefined = carregando
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Atualiza usuário logado no Client
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return unsubscribe;
  }, []);

  // Redireciona se não estiver logado
  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Carrega mensagens em tempo real
  useEffect(() => {
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
    return unsubscribe;
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      await addDoc(collection(db, "messages"), {
        text: newMessage,
        uid: user.uid,
        name: user.displayName || user.email.split("@")[0],
        createdAt: serverTimestamp(),
      });
      setNewMessage("");
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
    }
  };

  // Voltar para o dashboard sem deslogar
  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const formatTime = (timestamp) => {
    if (!timestamp?.toDate) return "";
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gray-900">
        Carregando...
      </div>
    );
  }

  if (user === null) {
    return null; // já será redirecionado
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Chat</h1>
        <button
          onClick={handleBackToDashboard}
          className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Dashboard</span>
        </button>
      </header>

      <main className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.uid === user.uid ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.uid === user.uid
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-700 text-white rounded-bl-none"
                }`}
              >
                {msg.uid !== user.uid && (
                  <div className="font-semibold text-sm">{msg.name}</div>
                )}
                <div className="text-sm">{msg.text}</div>
                <div className="text-xs opacity-70 text-right mt-1">
                  {formatTime(msg.createdAt)}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <form onSubmit={sendMessage} className="p-4 bg-gray-800 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1 px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
