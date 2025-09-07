import React, { useState, useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useGame } from "../../hooks/useGame";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ui/use-toast";

const JoinGameForm = ({ onClose }) => {
  const [gameIdChars, setGameIdChars] = useState(Array(6).fill(""));
  const inputRefs = useRef([]);
  const game = useGame();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (value.length > 1) return;

    const newGameIdChars = [...gameIdChars];
    newGameIdChars[index] = value.toUpperCase();
    setGameIdChars(newGameIdChars);

    // Move focus to the next input
    if (value.length === 1 && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && gameIdChars[index] === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullGameId = gameIdChars.join("");
    if (fullGameId.length !== 6) {
      toast({
        title: "Invalid Game ID",
        description: "Please enter all 6 characters of the Game ID.",
        variant: "destructive",
      });
      return;
    }

    const response = await game.joinGame({ gameId: fullGameId });
    if (response.success) {
      toast({
        title: "Game Joined!",
        description: `You have successfully joined game ${fullGameId}.`,
      });
      navigate(`/game/${fullGameId}`);
    } else {
      toast({
        title: "Failed to Join Game",
        description: response.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="bg-slate-900/80 backdrop-blur-lg border-2 border-indigo-500/50 w-full max-w-md">
        <CardHeader>
          <CardTitle>Join Game</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="gameId">Code</Label>
              <div className="flex justify-center space-x-2">
                {gameIdChars.map((char, index) => (
                  <Input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={char}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => (inputRefs.current[index] = el)}
                    className="w-12 h-12 text-center text-2xl font-bold bg-slate-800/50 border-indigo-500/50 text-white placeholder:text-slate-400 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Join</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default JoinGameForm;
