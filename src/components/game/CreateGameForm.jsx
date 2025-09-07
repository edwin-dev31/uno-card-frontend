import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useGame } from "../../hooks/useGame";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ui/use-toast";

const CreateGameForm = ({ onClose }) => {
  const [name, setName] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(2);
  const game = useGame();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await game.createGame({
      name,
      maxPlayers,
      status: "WAITING",
    });
    if (response.success) {
      toast({
        title: "Game Created!",
        description: `Share this code with your friends: ${response.data.code}`,
        duration: 5000,
      });
      localStorage.setItem('gameCode', response.data.code);
      localStorage.setItem('maxPlayers', maxPlayers);
      navigate(`/game/${response.data.code}`);
    } else {
      toast({
        title: "Game Creation Error",
        description: response.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="bg-slate-900/80 backdrop-blur-lg border-2 border-indigo-500/50 w-full max-w-md">
        <CardHeader>
          <CardTitle>Create New Game</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Game Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="maxPlayers">Max Players</Label>
              <Input
                id="maxPlayers"
                type="number"
                min="2"
                max="10"
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(parseInt(e.target.value, 10))}
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateGameForm;
