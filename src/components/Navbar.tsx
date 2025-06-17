import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Terminal, Image, Menu, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const handleLogout = () => {
    toast({
      title: "SESSION TERMINATED",
      description: "Logging out of the system...",
    });
    localStorage.removeItem("userId");
    navigate('/signin');
  };

  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
    <Link to={to}>
      <Button
        variant={isActive(to) ? "default" : "outline"}
        className={`font-mono ${isActive(to) 
          ? "bg-neon-orange hover:bg-neon-orange/90 text-black" 
          : "border-muted-foreground text-muted-foreground hover:border-neon-orange"} 
          transition-colors`}
        onClick={() => setOpen(false)}
      >
        <Icon className="h-4 w-4 mr-2" />
        {label}
      </Button>
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border backdrop-blur-md bg-darker-bg/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-cyber font-bold text-neon-orange terminal-text">
            T.P<span className="text-neon-orange">*</span>
          </span>
          <Badge variant="outline" className="ml-3 border-neon-orange text-neon-orange animate-glow-pulse">
            ONLINE
          </Badge>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <NavLink to="/" icon={Terminal} label="DASHBOARD" />
          <NavLink to="/wallpapers" icon={Image} label="WALLPAPERS" />
          
          <Separator orientation="vertical" className="h-6 bg-border" />
          
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="font-mono border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            LOGOUT
          </Button>
        </div>

        {/* Mobile Navigation */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon" className="border-neon-orange text-neon-orange">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-darker-bg border-border">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <span className="text-2xl font-cyber font-bold text-neon-orange terminal-text">
                  T.P<span className="text-neon-orange">*</span>
                </span>
                <Button variant="outline" size="icon" onClick={() => setOpen(false)} className="border-neon-orange text-neon-orange">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4 flex-1">
                <div className="font-mono text-xs text-muted-foreground mb-4">MAIN NAVIGATION</div>
                <div className="flex flex-col gap-2">
                  <NavLink to="/" icon={Terminal} label="DASHBOARD" />
                  <NavLink to="/wallpapers" icon={Image} label="WALLPAPERS" />
                </div>
              </div>
              
              <div className="pt-6 mt-auto">
                <Separator className="bg-border mb-6" />
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="w-full font-mono border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  LOGOUT
                </Button>
                <div className="flex items-center justify-center gap-2 mt-6">
                  <div className="w-2 h-2 bg-terminal-green rounded-full animate-pulse"></div>
                  <span className="text-xs font-mono text-muted-foreground">SECURE CONNECTION</span>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;