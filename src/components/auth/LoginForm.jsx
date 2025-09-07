import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { useToast } from "../../components/ui/use-toast";
import { useLogin } from "../../hooks/useLogin";

const LoginForm = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { login } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(formData);

      if (result.success) {
        toast({
          title: "Connection Established!",
          description: `Welcome back. Mission: Win!`,
        });
        onLoginSuccess();
      } else {
        toast({
          title: "Access Denied",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "System Error",
        description: "Could not connect to the game server.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const fillDemoCredentials = () => {
    setFormData({ username: "test", password: "password123" });
    toast({
      title: "Test protocol activated",
      description: "Demo credentials loaded.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="bg-slate-900/60 backdrop-blur-lg border-2 border-indigo-500/50 shadow-2xl shadow-indigo-500/20">
        <CardHeader className="text-center">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CardTitle className="text-4xl font-bold text-white mb-2 tracking-widest">
              UNO CARDS
            </CardTitle>
          </motion.div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Label htmlFor="username" className="text-indigo-300">
                Player name
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className="bg-slate-800/50 border-indigo-500/50 text-white placeholder:text-slate-400 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="player Id"
                required
              />
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Label htmlFor="password" className="text-indigo-300">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="bg-slate-800/50 border-indigo-500/50 text-white placeholder:text-slate-400 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="••••••••"
                required
              />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-3 pt-4"
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 text-lg"
              >
                {isLoading ? "CONNECTING..." : "START"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={fillDemoCredentials}
                className="w-full bg-slate-800/50 border-indigo-500/50 text-indigo-300 hover:bg-slate-700/50 hover:text-white"
              >
                Use Test Access
              </Button>

              <Button
                asChild
                variant="link"
                className="w-full text-indigo-300 hover:text-white"
              >
                <Link to="/register">Don't have an account? Register</Link>
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LoginForm;
