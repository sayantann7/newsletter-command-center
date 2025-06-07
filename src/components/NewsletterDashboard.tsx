
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Send, Eye, Users, Mail, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NewsletterDashboard = () => {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!subject.trim() || !content.trim()) {
      toast({
        title: "ACCESS DENIED",
        description: "Subject and content are required to proceed.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      toast({
        title: "TRANSMISSION SUCCESSFUL",
        description: "Newsletter deployed to all active subscribers.",
      });
      setSubject('');
      setContent('');
    }, 2000);
  };

  const handleLogout = () => {
    toast({
      title: "SESSION TERMINATED",
      description: "Logging out of the system...",
    });
    // Simulate logout - in a real app this would redirect to sign-in
    setTimeout(() => {
      window.location.href = '/signin';
    }, 1000);
  };

  const stats = [
    { label: 'Active Subscribers', value: '25,847', icon: Users, color: 'text-terminal-green' },
    { label: 'Sent This Month', value: '12', icon: Mail, color: 'text-neon-orange' },
  ];

  return (
    <div className="min-h-screen bg-darker-bg p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-cyber font-bold text-neon-orange terminal-text">
              T.P*
            </h1>
            <p className="text-lg font-cyber text-muted-foreground mt-2">
              NEWSLETTER CONTROL PROTOCOL
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-terminal-green text-terminal-green">
              ONLINE
            </Badge>
            <Badge variant="outline" className="border-neon-orange text-neon-orange animate-glow-pulse">
              ACTIVE
            </Badge>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="font-mono border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              LOGOUT
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="cyber-border bg-card hover:bg-card/80 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-mono">{stat.label}</p>
                    <p className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="compose" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-secondary">
            <TabsTrigger value="compose" className="font-mono">COMPOSE</TabsTrigger>
            <TabsTrigger value="preview" className="font-mono">PREVIEW</TabsTrigger>
          </TabsList>

          <TabsContent value="compose" className="space-y-6">
            <Card className="cyber-border bg-card">
              <CardHeader>
                <CardTitle className="font-cyber text-neon-orange flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  MESSAGE COMPOSER
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-mono text-muted-foreground">SUBJECT LINE</label>
                  <Input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter transmission subject..."
                    className="font-mono bg-input border-border focus:border-neon-orange transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-mono text-muted-foreground">MESSAGE CONTENT</label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Compose your message for the network..."
                    className="min-h-[300px] font-mono bg-input border-border focus:border-neon-orange transition-colors resize-none"
                  />
                </div>

                <Separator className="bg-border" />

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">
                      {content.length} CHARS
                    </Badge>
                    <Badge variant="outline" className="font-mono">
                      {content.split('\n').length} LINES
                    </Badge>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsPreview(true)}
                      className="font-mono border-muted hover:border-neon-orange transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      PREVIEW
                    </Button>
                    <Button
                      onClick={handleSend}
                      disabled={isSending || !subject.trim() || !content.trim()}
                      className="font-mono bg-neon-orange hover:bg-neon-orange/80 text-black transition-colors terminal-glow"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {isSending ? 'TRANSMITTING...' : 'DEPLOY'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <Card className="cyber-border bg-card">
              <CardHeader>
                <CardTitle className="font-cyber text-neon-orange flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  TRANSMISSION PREVIEW
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Email Preview with exact styling from the template */}
                <div style={{ 
                  maxWidth: '600px', 
                  margin: '0 auto', 
                  padding: '40px', 
                  backgroundColor: '#ffffff',
                  fontFamily: "'Courier New', monospace",
                  color: '#b8460e',
                  lineHeight: '1.6'
                }}>
                  {/* Header */}
                  <div style={{ marginBottom: '30px' }}>
                    <div style={{ 
                      fontSize: '72px', 
                      fontWeight: '900', 
                      color: '#b8460e', 
                      marginBottom: '5px', 
                      letterSpacing: '2px' 
                    }}>
                      T.P<span style={{ color: '#b8460e' }}>*</span>
                    </div>
                    <div style={{ 
                      fontSize: '18px', 
                      fontWeight: 'bold', 
                      color: '#b8460e', 
                      textTransform: 'uppercase', 
                      letterSpacing: '3px', 
                      marginBottom: '30px' 
                    }}>
                      TERMINAL | PROTOCOL
                    </div>
                  </div>
                  
                  {/* Top separator */}
                  <div style={{ height: '2px', backgroundColor: '#b8460e', margin: '30px 0' }}></div>
                  
                  {/* Subject */}
                  <div style={{ fontSize: '16px', color: '#b8460e', fontWeight: 'bold', marginBottom: '20px' }}>
                    {subject || '[NO SUBJECT]'}
                  </div>
                  
                  {/* Content */}
                  <div style={{ fontSize: '16px', color: '#b8460e', fontWeight: 'bold' }}>
                    {content ? (
                      content.split('\n').map((line, index) => (
                        <div key={index} style={{ marginBottom: '20px' }}>
                          {line || '\u00A0'}
                        </div>
                      ))
                    ) : (
                      <div style={{ fontStyle: 'italic', color: '#b8460e' }}>
                        [CONTENT PREVIEW WILL APPEAR HERE]
                      </div>
                    )}
                  </div>
                  
                  {/* Signature */}
                  <div style={{ 
                    marginTop: '40px', 
                    fontWeight: 'bold', 
                    fontSize: '16px', 
                    color: '#b8460e' 
                  }}>
                    — tensor boy
                  </div>
                  
                  {/* Bottom separator */}
                  <div style={{ height: '2px', backgroundColor: '#b8460e', margin: '30px 0' }}></div>
                  
                  {/* Footer message */}
                  <div style={{ marginTop: '50px', textAlign: 'left' }}>
                    <div style={{ 
                      fontSize: '23px', 
                      fontWeight: 'bold', 
                      color: '#b8460e', 
                      lineHeight: '1.4' 
                    }}>
                      Hack the system.<br />
                      Or be hacked by it.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NewsletterDashboard;
