import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
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
import { useRegister } from "../../hooks/useRegister";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { register } = useRegister();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await register(formData);

      if (result.success) {
        toast({
          title: "Registration Complete!",
          description: "Your account has been created. You can now log in.",
        });
        navigate("/login");
      } else {
        toast({
          title: "Registration Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "System Error",
        description: "Could not complete registration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="bg-slate-900/60 backdrop-blur-lg border-2 border-green-500/50 shadow-2xl shadow-green-500/20">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold text-white mb-2 tracking-widest">
            Create Account
          </CardTitle>
          <CardDescription className="text-[#02537F]-300 text-lg">
            Join the galactic mission
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Label htmlFor="username" className="text-[#02537F]-300">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                className="bg-slate-800/50 border-green-500/50 text-white"
                placeholder="minion-galactico"
              />
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Label htmlFor="email" className="text-[#02537F]-300">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-slate-800/50 border-green-500/50 text-white"
                placeholder="agente@minion.com"
              />
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Label htmlFor="password" className="text-[#02537F]-300">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="bg-slate-800/50 border-green-500/50 text-white"
                placeholder="••••••••"
              />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-3 pt-4"
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0367A6] hover:bg-[#02537F] text-white font-bold py-3 text-lg"
              >
                {isLoading ? "CREATING ACCOUNT..." : "REGISTER"}
              </Button>
              <Button
                asChild
                variant="link"
                className="w-full text-[#02537F]-300 hover:text-white"
              >
                <Link to="/login">Already have an account? Log In</Link>
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RegisterForm;
