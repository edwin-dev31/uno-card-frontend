import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Routes, Route, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "./components/ui/toaster";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import GameTable from "./components/game/GameTable";
import GameLobby from "./components/game/GameLobby";
import { useAuthStorage } from "./hooks/useAuthStorage";

function App() {
  // We use a state to force re-render when auth status changes
  const [isAuthenticated, setIsAuthenticated] = useState(useAuthStorage().isAuthenticated);
  const { clearAuth, logout } = useAuthStorage();

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(useAuthStorage().isAuthenticated);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
  };

  return (
    <>
      <Helmet>
        <title>UNO Galactic Minions</title>
        <meta
          name="description"
          content="Juega al clásico juego de UNO con una temática galáctica de Minions. ¡Divertido, rápido y futurista!"
        />
        <meta property="og:title" content="UNO Galactic Minions" />
        <meta
          property="og:description"
          content="Juega al clásico juego de UNO con una temática galáctica de Minions. ¡Divertido, rápido y futurista!"
        />
      </Helmet>

      <div className="min-h-screen relative">
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            <Routes>
              <Route
                path="/login"
                element={
                  !isAuthenticated ? (
                    <motion.div
                      key="login"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="min-h-screen flex items-center justify-center p-4"
                    >
                      <LoginForm onLoginSuccess={handleLoginSuccess} />
                    </motion.div>
                  ) : (
                    <Navigate to="/game" />
                  )
                }
              />
              <Route
                path="/game"
                element={
                  isAuthenticated ? (
                    <motion.div
                      key="lobby"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <GameLobby />
                    </motion.div>
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/game/:id"
                element={
                  isAuthenticated ? (
                    <motion.div
                      key="game"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <GameTable onLogout={handleLogout} />
                    </motion.div>
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="*"
                element={<Navigate to={isAuthenticated ? "/game" : "/login"} />} 
              />
              <Route
                path="/register"
                element={
                  !isAuthenticated ? (
                    <motion.div
                      key="register"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="min-h-screen flex items-center justify-center p-4"
                    >
                      <RegisterForm />
                    </motion.div>
                  ) : (
                    <Navigate to="/game" />
                  )
                }
              />
            </Routes>
          </AnimatePresence>
        </div>
        <Toaster />
      </div>
    </>
  );
}

export default App;
