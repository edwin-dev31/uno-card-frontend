import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import UnoCard from "../../components/game/UnoCard";

const PlayerHand = ({
  cards,
  onPlayCard,
  isCardPlayable,
  player,
  angle,
  isCurrentUser,
}) => {
  const cardVariants = {
    initial: { y: 50, opacity: 0, scale: 0.8 },
    animate: (i) => ({
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.08,
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    }),
    exit: { y: -50, opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  // Common container for player info and cards
  const HandContent = () => (
    <div className="flex flex-col items-center">
      <div className="flex justify-center items-center space-x-2 mb-2">
        <span
          className={`font-semibold text-white ${
            isCurrentUser ? "text-lg" : "text-sm"
          }`}
        >
          {player.username}
        </span>
        <span
          className={`text-indigo-300 ${isCurrentUser ? "text-sm" : "text-xs"}`}
        >
          ({cards.length} cards)
        </span>
      </div>
      <div
        className={`flex justify-center items-end h-full ${
          isCurrentUser ? "space-x-[-50px]" : "space-x-[-25px]"
        }`}
      >
        <AnimatePresence>
          {cards.map((card, index) => (
            <motion.div
              key={card.id || `back-${index}`}
              custom={index}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              whileHover={
                isCurrentUser ? { y: -25, scale: 1.1, zIndex: 50 } : {}
              }
              style={{
                transformOrigin: "bottom center",
                width: isCurrentUser ? "100px" : "50px",
                height: isCurrentUser ? "150px" : "75px",
              }}
            >
              <UnoCard
                card={card}
                onClick={() => onPlayCard(card)}
                isPlayable={isCardPlayable(card)}
                className={isCardPlayable(card) ? "cursor-pointer" : ""}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );

  if (isCurrentUser) {
    return <HandContent />;
  }

  return (
    <div style={{ transform: `rotate(-${angle}deg)` }}>
      <HandContent />
    </div>
  );
};

export default PlayerHand;
