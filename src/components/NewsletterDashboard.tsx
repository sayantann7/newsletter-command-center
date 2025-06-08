
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Send, Eye, Users, Mail, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getTotalEmailsSent, getTotalSubscribers, sendEmail, sendTestEmail } from '@/lib/utils';

const NewsletterDashboard = () => {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [totalSubscribers, setTotalSubscribers] = useState(0);
  const [totalEmailsSent, setTotalEmailsSent] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subscribers = await getTotalSubscribers();
        setTotalSubscribers(subscribers);

        const emailsSent = await getTotalEmailsSent();
        setTotalEmailsSent(emailsSent);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "DATA FETCH ERROR",
          description: "Unable to retrieve subscriber or email data.",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, []);

  const handleTestSend = async () => {
    if (!subject.trim() || !content.trim()) {
      toast({
        title: "ACCESS DENIED",
        description: "Subject and content are required to proceed.",
        variant: "destructive",
      });
      return;
    }
    try {
      await sendTestEmail(subject, content);
      toast({
        title: "TEST TRANSMISSION SUCCESSFUL",
        description: "Test email sent successfully.",
      });
    } catch (error) {
      console.error("Error sending test email:", error);
      toast({
        title: "TEST TRANSMISSION FAILED",
        description: "There was an error sending the test email.",
        variant: "destructive",
      });
    }
  }

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

    try {
      await sendEmail(subject, content);
      toast({
        title: "TRANSMISSION SUCCESSFUL",
        description: "Newsletter deployed to all active subscribers.",
      });
      setSubject('');
      setContent('');
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "TRANSMISSION FAILED",
        description: "There was an error sending the newsletter.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
      toast({
        title: "TRANSMISSION SUCCESSFUL",
        description: "Newsletter deployed to all active subscribers.",
      });
    }
  };

  const handleLogout = () => {
    toast({
      title: "SESSION TERMINATED",
      description: "Logging out of the system...",
    });
    // Simulate logout - in a real app this would redirect to sign-in
    
    localStorage.removeItem("userId");

    window.location.href = '/signin';
  };

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
            <Badge variant="outline" className="border-neon-orange text-neon-orange animate-glow-pulse">
              ONLINE
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
          <Card className="cyber-border bg-card hover:bg-card/80 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-mono">Active Subscribers</p>
                    <p className={`text-2xl font-bold font-mono text-terminal-green`}>{totalSubscribers}</p>
                  </div>
                  <Users className={`h-8 w-8 text-terminal-green`} />
                </div>
              </CardContent>
            </Card>
            <Card className="cyber-border bg-card hover:bg-card/80 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-mono">Sent This Month</p>
                    <p className={`text-2xl font-bold font-mono text-neon-orange`}>{totalEmailsSent}</p>
                  </div>
                  <Mail className={`h-8 w-8 text-neon-orange`} />
                </div>
              </CardContent>
            </Card>
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
                      onClick={() => handleTestSend()}
                      className="font-mono border-muted hover:border-neon-orange transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      TEST
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
                  NEWSLETTER PREVIEW
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Email Preview with Terminal Protocol styling */}
                <div style={{ 
                  maxWidth: '600px', 
                  margin: '0 auto', 
                  fontFamily: "'Courier New', monospace",
                  backgroundColor: '#0d0d0f',
                  color: '#b8460e',
                  lineHeight: '1.6',
                  padding: '0',
                  borderRadius: '8px',
                  border: '1px solid #b8460e',
                  overflow: 'hidden'
                }}>
                  
                  {/* Header */}
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '30px 20px', 
                    borderBottom: '2px solid #b8460e',
                    background: 'linear-gradient(135deg, rgba(184, 70, 14, 0.1) 0%, rgba(184, 70, 14, 0.05) 100%)'
                  }}>
                    <div style={{ 
                      fontSize: '48px', 
                      fontWeight: '900', 
                      marginBottom: '10px', 
                      letterSpacing: '3px',
                      textShadow: '0 0 10px rgba(184, 70, 14, 0.5)'
                    }}>
                      T.P<span style={{ color: '#b8460e' }}>*</span>
                    </div>
                    <div style={{ 
                      fontSize: '14px', 
                      fontWeight: 'bold', 
                      textTransform: 'uppercase', 
                      letterSpacing: '4px',
                      opacity: '0.8'
                    }}>
                      TERMINAL | PROTOCOL
                    </div>
                  </div>
                  
                  {/* Subject Section */}
                  <div style={{ 
                    padding: '30px 30px 20px 30px',
                    borderBottom: '1px solid rgba(184, 70, 14, 0.3)'
                  }}>
                    <div style={{ 
                      fontSize: '20px', 
                      fontWeight: 'bold', 
                      marginBottom: '10px',
                      textShadow: '0 0 5px rgba(184, 70, 14, 0.3)'
                    }}>
                      › {subject || 'SYSTEM TRANSMISSION'}
                    </div>
                    <div style={{ 
                      fontSize: '12px', 
                      opacity: '0.7',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      INCOMING MESSAGE
                    </div>
                  </div>
                  
                  {/* Content Section */}
                  <div style={{ 
                    padding: '30px',
                    minHeight: '200px'
                  }}>
                    <div style={{ 
                      fontSize: '14px', 
                      marginBottom: '20px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      opacity: '0.8'
                    }}>
                      MESSAGE CONTENT:
                    </div>
                    
                    <div style={{ 
                      fontSize: '14px', 
                      lineHeight: '1.8',
                      paddingLeft: '20px',
                      borderLeft: '2px solid rgba(184, 70, 14, 0.3)',
                      marginBottom: '30px'
                    }}>
                      {content ? (
                        content.split('\n').map((line, index) => (
                          <div key={index} style={{ marginBottom: '8px' }}>
                            › {line || '\u00A0'}
                          </div>
                        ))
                      ) : (
                        <div style={{ fontStyle: 'italic', opacity: '0.6' }}>
                          › Your transmission content will appear here...
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Terminal Footer */}
                  <div style={{ 
                    padding: '20px 30px',
                    borderTop: '2px solid #b8460e',
                    background: 'linear-gradient(135deg, rgba(184, 70, 14, 0.1) 0%, rgba(184, 70, 14, 0.05) 100%)',
                    textAlign: 'center'
                  }}>
                    <div style={{ 
                      fontSize: '16px', 
                      fontWeight: 'bold', 
                      marginBottom: '15px',
                      textShadow: '0 0 5px rgba(184, 70, 14, 0.3)'
                    }}>
                      — tensor boy
                    </div>
                    
                    <div style={{ 
                      fontSize: '12px', 
                      opacity: '0.7',
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                      marginBottom: '20px'
                    }}>
                      END TRANSMISSION
                    </div>
                    
                    <div style={{ 
                      fontSize: '18px', 
                      fontWeight: 'bold', 
                      lineHeight: '1.4',
                      textShadow: '0 0 8px rgba(184, 70, 14, 0.4)'
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
