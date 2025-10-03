import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Conteudo from "./pages/Conteudo"; 
import Chat from "./pages/Chat";
import Forum from "./pages/forum"; // ⚠️ Certifique-se de ter este componente

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/forum/:courseId"
            element={
              <PrivateRoute>
                <Forum />
              </PrivateRoute>
            }
          />

          <Route
            path="/conteudo/:id"
            element={
              <PrivateRoute>
                <Conteudo />
              </PrivateRoute>
            }
          />

          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>

      {/* Container de notificações do Toastify */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;
