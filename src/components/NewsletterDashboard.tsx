
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
                {/* Email Preview with AlphaSignal styling */}
                <div style={{ 
                  maxWidth: '600px', 
                  margin: '0 auto', 
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                  backgroundColor: '#f5f5f5',
                  color: '#333',
                  lineHeight: '1.6',
                  padding: '20px',
                  borderRadius: '8px'
                }}>
                  <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '8px', overflow: 'hidden' }}>
                    
                    {/* Header */}
                    <div style={{ 
                      textAlign: 'right', 
                      padding: '15px 20px', 
                      fontSize: '12px', 
                      color: '#666', 
                      borderBottom: '1px solid #e0e0e0' 
                    }}>
                      Signup | Work With Us | Follow on X | Read on Web
                    </div>
                    
                    {/* Hero Section */}
                    <div style={{ 
                      background: 'linear-gradient(135deg, #4f7df3 0%, #3b5bdb 100%)', 
                      color: 'white', 
                      padding: '40px 30px', 
                      borderRadius: '15px', 
                      margin: '20px' 
                    }}>
                      <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>
                        <span style={{ 
                          backgroundColor: 'rgba(255,255,255,0.2)', 
                          padding: '8px 12px', 
                          borderRadius: '8px', 
                          display: 'inline-block' 
                        }}>A</span>
                      </div>
                      <div style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>
                        Hey Reader,
                      </div>
                      <div style={{ fontSize: '16px', marginBottom: '20px', opacity: '0.95' }}>
                        {subject || 'Welcome to AlphaSignal – the most read newsletter by AI developers.'}
                      </div>
                      <div style={{ fontSize: '16px', opacity: '0.95' }}>
                        We bring you the top 1% of news, papers, models, and repos, all summarized to keep you updated on the latest in AI.
                      </div>
                    </div>
                    
                    {/* Today's Signal Section */}
                    <div style={{ 
                      margin: '20px', 
                      border: '1px solid #e0e0e0', 
                      borderRadius: '10px', 
                      padding: '0', 
                      overflow: 'hidden' 
                    }}>
                      <div style={{ 
                        backgroundColor: '#f8f9fa', 
                        padding: '15px 20px', 
                        borderBottom: '1px solid #e0e0e0' 
                      }}>
                        <div style={{ 
                          color: '#4f7df3', 
                          fontWeight: '600', 
                          fontSize: '14px', 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.5px' 
                        }}>IN TODAY'S SIGNAL</div>
                      </div>
                      <div style={{ padding: '20px' }}>
                        <div style={{ fontSize: '13px', color: '#666', marginBottom: '25px' }}>
                          Read time: 4 min 18 sec
                        </div>
                        
                        {/* Content */}
                        <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: '#333' }}>
                          📰 Today's Content
                        </div>
                        <div style={{ fontSize: '14px', color: '#333', marginBottom: '20px' }}>
                          {content ? (
                            content.split('\n').map((line, index) => (
                              <div key={index} style={{ marginBottom: '10px' }}>
                                {line || '\u00A0'}
                              </div>
                            ))
                          ) : (
                            <div style={{ fontStyle: 'italic', color: '#666' }}>
                              › Your newsletter content will appear here...
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Forward Message */}
                    <div style={{ 
                      margin: '20px', 
                      border: '1px solid #e0e0e0', 
                      borderRadius: '10px', 
                      padding: '20px', 
                      textAlign: 'center' 
                    }}>
                      <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '5px' }}>
                        If you're enjoying this newsletter please forward this email to a colleague.
                      </div>
                      <div style={{ fontSize: '14px', color: '#666' }}>
                        It helps us keep this content free.
                      </div>
                    </div>
                    
                    {/* Feedback Section */}
                    <div style={{ 
                      margin: '20px', 
                      border: '1px solid #e0e0e0', 
                      borderRadius: '10px', 
                      padding: '30px', 
                      textAlign: 'center' 
                    }}>
                      <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#333' }}>
                        How was today's email?
                      </div>
                      <div>
                        <span style={{ color: '#4f7df3', margin: '0 15px', fontSize: '16px', fontWeight: '500' }}>Awesome</span>
                        <span style={{ color: '#4f7df3', margin: '0 15px', fontSize: '16px', fontWeight: '500' }}>Decent</span>
                        <span style={{ color: '#4f7df3', margin: '0 15px', fontSize: '16px', fontWeight: '500' }}>Not Great</span>
                      </div>
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
