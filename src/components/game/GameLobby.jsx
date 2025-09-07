import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import CreateGameForm from "./CreateGameForm";
import JoinGameForm from "./JoinGameForm";

const GameLobby = () => {
  const [showCreateGame, setShowCreateGame] = useState(false);
  const [showJoinGame, setShowJoinGame] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl font-bold mb-2">UNO Galactic Minions</h1>
        <p className="text-lg text-indigo-300">Choose your mission</p>
      </motion.div>

      <motion.img
        src="/images/mark.png"
        alt="Uno Card"
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
        transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
        className="w-64 h-auto mb-8"
      />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex space-x-6"
      >
        <Button
          onClick={() => setShowCreateGame(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg text-lg transform hover:scale-105 transition-transform duration-300"
        >
          Create Game
        </Button>
        <Button
          onClick={() => setShowJoinGame(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg text-lg transform hover:scale-105 transition-transform duration-300"
        >
          Join Game
        </Button>
      </motion.div>

      {showCreateGame && <CreateGameForm onClose={() => setShowCreateGame(false)} />}
      {showJoinGame && <JoinGameForm onClose={() => setShowJoinGame(false)} />}
    </div>
  );
};

export default GameLobby;
