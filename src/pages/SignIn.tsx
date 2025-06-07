
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Mail, Lock, Eye, EyeOff, Terminal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from "react-router-dom";
import { login } from "@/lib/utils";

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast({
        title: "ACCESS DENIED",
        description: "All credentials are required to proceed.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const userId = await login(username, password);
      localStorage.setItem("userId", userId);
      navigate("/");
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
      toast({
        title: "ACCESS GRANTED",
        description: "Welcome to the Protocol Network.",
      });
    }

  };

  return (
    <div className="min-h-screen bg-darker-bg flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <Terminal className="h-12 w-12 text-neon-orange terminal-text" />
          </div>
          <div>
            <h1 className="text-4xl font-cyber font-bold text-neon-orange terminal-text">
              T.P*
            </h1>
            <p className="text-lg font-cyber text-muted-foreground mt-2">
              PROTOCOL ACCESS TERMINAL
            </p>
          </div>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="outline" className="border-terminal-green text-terminal-green">
              SECURE
            </Badge>
            <Badge variant="outline" className="border-neon-orange text-neon-orange animate-glow-pulse">
              ENCRYPTED
            </Badge>
          </div>
        </div>

        {/* Sign In Form */}
        <Card className="cyber-border bg-card">
          <CardHeader>
            <CardTitle className="font-cyber text-neon-orange text-center">
              SYSTEM ACCESS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-mono text-muted-foreground">USERNAME</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username..."
                    className="font-mono bg-input border-border focus:border-neon-orange transition-colors pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-mono text-muted-foreground">PASSWORD</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your access key..."
                    className="font-mono bg-input border-border focus:border-neon-orange transition-colors pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Separator className="bg-border" />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full font-mono bg-neon-orange hover:bg-neon-orange/80 text-black transition-colors terminal-glow"
              >
                {isLoading ? 'AUTHENTICATING...' : 'INITIALIZE ACCESS'}
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <Separator className="bg-border" />
              
              <div className="text-center space-y-2">
                <p className="text-xs text-muted-foreground font-mono">
                  © 2025 Tomorrow Protocol. All rights reserved.
                </p>
                <p className="text-xs text-muted-foreground font-mono">
                  Unauthorized access is strictly prohibited.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Indicators */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-terminal-green rounded-full animate-pulse"></div>
            <span className="text-xs font-mono text-muted-foreground">NETWORK STATUS: ONLINE</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-neon-orange rounded-full animate-pulse"></div>
            <span className="text-xs font-mono text-muted-foreground">SECURITY LEVEL: MAXIMUM</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
