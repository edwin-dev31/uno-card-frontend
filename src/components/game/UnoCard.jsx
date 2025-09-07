import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

const UnoCard = ({
  card,
  onClick,
  className,
  isPlayable = false,
  ...props
}) => {
  if (!card) return null;

  // If the card is a back card, render the back image
  if (card.id === "back") {
    return (
      <motion.div
        className={cn("uno-card", className)}
        onClick={onClick}
        {...props}
      >
        <img
          src={card.image}
          alt="Card Back"
          cclassName="w-full h-full object-contain"
        />
      </motion.div>
    );
  }

  // Otherwise, render the front of the card
  return (
    <motion.div
      className={cn(
        "uno-card select-none flex items-center justify-center",
        isPlayable && "card-glow",
        className
      )}
      onClick={onClick}
      {...props}
    >
      <img
        src={card.image}
        alt={`${card.color} ${card.value}`}
        className="w-full h-full"
      />
    </motion.div>
  );
};

export default UnoCard;