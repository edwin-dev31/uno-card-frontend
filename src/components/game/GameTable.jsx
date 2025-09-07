import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/ui/button";
import { useToast } from "../../components/ui/use-toast";
import UnoCard from "../../components/game/UnoCard";
import PlayerHand from "../../components/game/PlayerHand";
import { useGame } from "../../hooks/useGame";
import { useAuthStorage } from "../../hooks/useAuthStorage";
import { LogOut } from "lucide-react";

const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

const GameTable = ({ onLogout }) => {
  const [gameState, setGameState] = useState(null);
  const [topCard, setTopCard] = useState(null);
  const [playerCards, setPlayerCards] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [initialDealDone, setInitialDealDone] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const { toast } = useToast();

  const { token } = useAuthStorage();
  const gameId = localStorage.getItem("gameCode");
  const {
    getGameState,
    getTopCard,
    getPlayerCards,
    playCard,
    drawCard,
    getCurrentPlayer,
    nextTurn,
    startGame,
    dealCards,
  } = useGame(gameId);

  const currentUser = decodeToken(token);
  const isGameCreator = true; // TODO: reemplazar por lógica real

  const maxPlayers = parseInt(localStorage.getItem("maxPlayers") || "4", 10);

  const syncGameState = useCallback(async () => {
    if (requestCount >= 5) return;
    try {
      setRequestCount((prev) => prev + 1);
      const [stateRes, topCardRes, cardsRes, currentPlayerRes] =
        await Promise.all([
          getGameState(),
          getTopCard(),
          getPlayerCards(),
          getCurrentPlayer(),
        ]);

      if (stateRes.success) setGameState(stateRes.data);
      if (topCardRes.success) setTopCard(topCardRes.data);
      if (cardsRes.success) setPlayerCards(cardsRes.data);
      if (currentPlayerRes.success) {
        setCurrentPlayer(currentPlayerRes.data.currentPlayer);
      }
    } catch (error) {
      toast({
        title: "Synchronization Error",
        description: "Could not fetch game state.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    getGameState,
    getTopCard,
    getPlayerCards,
    getCurrentPlayer,
    toast,
    requestCount,
  ]);

  useEffect(() => {
    syncGameState();
  }, []);

  useEffect(() => {
    if (!initialDealDone) return;
    const interval = setInterval(syncGameState, 5000);
    return () => clearInterval(interval);
  }, [initialDealDone, syncGameState]);

  const handleStartGame = async () => {
    try {
      setIsLoading(true);
      const startRes = await startGame();
      if (!startRes.success) throw new Error("Failed to start game");

      const players = allPlayers.map((p) => p.id);
      const dealRes = await dealCards({
        gameId: parseInt(gameId),
        players,
        cardsPerPlayer: 7,
      });

      if (!dealRes.success) throw new Error("Failed to deal cards");

      setInitialDealDone(true);
      await syncGameState();
    } catch (error) {
      toast({
        title: "Error Starting Game",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isMyTurn = currentUser?.username === currentPlayer;

  const isCardPlayable = (card) => {
    if (card.id === "back") return false;
    if (!topCard || !isMyTurn) return false;
    return (
      card.color === topCard.color ||
      card.value === topCard.value ||
      card.type === "wild"
    );
  };

  const handlePlayCard = useCallback(
    async (card) => {
      if (!isCardPlayable(card)) {
        toast({
          title: "Invalid Move",
          description: "You can't play that card now.",
          variant: "destructive",
        });
        return;
      }
      try {
        const response = await playCard(card.id);
        if (response.success) {
          toast({
            title: "Masterful Move!",
            description: `You played a ${card.color} ${card.value}.`,
          });
          await syncGameState();
          await nextTurn();
        } else {
          toast({
            title: "Invalid Move",
            description: response.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Could not play card.",
          variant: "destructive",
        });
      }
    },
    [playCard, toast, syncGameState, nextTurn, isCardPlayable]
  );

  const handleDrawCard = useCallback(async () => {
    try {
      const response = await drawCard();
      if (response.success) {
        toast({
          title: "New Card Acquired",
          description: "You drew a card.",
        });
        await syncGameState();
        await nextTurn();
      } else {
        toast({
          title: "Deck Error",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not draw card.",
        variant: "destructive",
      });
    }
  }, [drawCard, toast, syncGameState, nextTurn]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="text-7xl"
        >
          🌀
        </motion.div>
        <p className="text-2xl ml-4 font-bold tracking-widest">LOADING...</p>
      </div>
    );
  }

  const allPlayers =
    gameState?.players?.length > 0
      ? gameState.players
      : Array.from({ length: maxPlayers }).map((_, i) => ({
          id: i + 1,
          username: `Player ${i + 1}`,
        }));

  const initialHand = Array(7).fill({ id: "back", image: "/images/mark.png" });

  const currentUserPlayer = allPlayers.find(
    (p) => p.username === currentUser?.username
  );
  const otherPlayers = allPlayers.filter(
    (p) => p.username !== currentUser?.username
  );

  return (
    <div className="min-h-screen p-4 flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center mb-4 z-20">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-indigo-300 tracking-wider">
            UNO Galactic Minions
          </h1>
          {isGameCreator && !initialDealDone && (
            <Button onClick={handleStartGame}>Start Game</Button>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-slate-800/50 border border-indigo-500/30 rounded-lg px-4 py-2 flex items-center gap-3">
            <span className="text-white font-semibold">
              {currentUser?.username} (You)
            </span>
          </div>
          <Button
            onClick={onLogout}
            variant="destructive"
            className="bg-red-600/80 hover:bg-red-700/80"
          >
            <LogOut className="w-5 h-5 mr-2" /> Exit
          </Button>
        </div>
      </header>

      {/* Mesa */}
      <main className="flex-grow flex items-center justify-center relative">
        <div className="game-table w-full h-full relative">
          {/* Mano del jugador actual */}
          {currentUserPlayer && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30">
              <PlayerHand
                cards={initialDealDone ? playerCards : initialHand}
                onPlayCard={handlePlayCard}
                isCardPlayable={isCardPlayable}
                player={currentUserPlayer}
                isCurrentUser={true}
                angle={0}
              />
            </div>
          )}

          {/* Manos de otros jugadores */}
          {otherPlayers.map((player, index) => {
            const numPlayers = otherPlayers.length; // Number of other players
            // Distribute players evenly in an arc at the top
            const angle = 180 + (180 / (numPlayers + 1)) * (index + 1);
            const radius =
              Math.min(window.innerWidth, window.innerHeight) / 2.8;
            const x = Math.cos((angle - 90) * (Math.PI / 180)) * radius;
            const y = Math.sin((angle - 90) * (Math.PI / 180)) * radius;

            return (
              <div
                key={player.id}
                className="absolute top-1/2 left-1/2"
                style={{
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${angle}deg)`,
                }}
              >
                <PlayerHand
                  cards={initialHand}
                  onPlayCard={() => {}}
                  isCardPlayable={() => false}
                  player={player}
                  isCurrentUser={false}
                  angle={angle}
                />
              </div>
            );
          })}

          {/* Centro: mazo + carta en juego */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-8 z-10">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="cursor-pointer group"
              onClick={handleDrawCard}
            >
              <div className="uno-card uno-card-deck w-20 h-32 rounded-lg flex items-center justify-center bg-indigo-600">
                <div className="text-white font-bold text-2xl text-center drop-shadow-lg">
                  UNO
                </div>
              </div>
            </motion.div>

            <AnimatePresence>
              {topCard && (
                <motion.div
                  key={topCard.id}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <UnoCard card={topCard} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Turno actual */}
          {currentPlayer && (
            <motion.div
              key={currentPlayer}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-10 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-6 py-2 rounded-full font-bold text-lg shadow-lg shadow-yellow-500/30 pulse-animation z-20"
            >
              Turn: {currentPlayer}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default GameTable;
