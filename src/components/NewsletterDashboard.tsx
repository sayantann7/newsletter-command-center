import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Send, Eye, Users, Mail, LogOut, Code, Type, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getTotalEmailsSent, getTotalSubscribers, sendEmail, sendTestEmail } from '@/lib/utils';

const NewsletterDashboard = () => {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [contentMode, setContentMode] = useState<'text' | 'html'>('text');
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

  const generateCompleteEmailHTML = () => {
    const emailContent = contentMode === 'html' ? htmlContent : content;
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 20px; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Arial, sans-serif; background-color: #ffffff; color: #333333; line-height: 1.6; padding: 0; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
    
    <!-- Header -->
    <div style="text-align: center; padding: 30px 20px; border-bottom: 1px solid #e5e7eb; background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);">
      <div style="font-size: 32px; font-weight: 900; margin-bottom: 8px; letter-spacing: 1px; color: #1f2937;">
        T.P<span style="color: #f97316;">*</span>
      </div>
      <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: #6b7280;">
        TENSOR | PROTOCOL
      </div>
    </div>
    
    <!-- Subject Section -->
    ${subject ? `
    <div style="padding: 25px 20px; border-bottom: 1px solid #f3f4f6; background-color: #ffffff;">
      <div style="font-size: 20px; font-weight: 700; margin-bottom: 5px; color: #1f2937;">
        ${subject}
      </div>
      <div style="font-size: 10px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">
        INCOMING TRANSMISSION
      </div>
    </div>
    ` : ''}
    
    <!-- Content Section -->
    <div style="padding: 25px 20px; background-color: #ffffff; min-height: 200px;">
      ${contentMode === 'html' ? 
        (htmlContent || '<div style="font-style: italic; color: #9ca3af; font-size: 14px;">Your HTML content will appear here...</div>') 
        : 
        (content ? 
          `<div style="font-size: 14px; line-height: 1.7; color: #374151; white-space: pre-wrap;">${content}</div>` 
          : 
          '<div style="font-style: italic; color: #9ca3af; font-size: 14px;">Your message content will appear here...</div>'
        )
      }
    </div>
    
    <!-- Footer -->
    <div style="padding: 20px; border-top: 1px solid #e5e7eb; background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%); text-align: center;">
      <div style="font-size: 14px; font-weight: 600; margin-bottom: 10px; color: #1f2937;">
        — tensor boy
      </div>
      
      <div style="font-size: 10px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; font-weight: 500;">
        END TRANSMISSION
      </div>
      
      <div style="font-size: 14px; font-weight: 500; line-height: 1.5; color: #6b7280;">
        Hack the system.<br />
        Or be hacked by it.
      </div>
    </div>
    
  </div>
</body>
</html>`;
  };

  const handleTestSend = async () => {
    const completeEmailHTML = generateCompleteEmailHTML();
    if (!subject.trim() || !completeEmailHTML.trim()) {
      toast({
        title: "ACCESS DENIED",
        description: "Subject and content are required to proceed.",
        variant: "destructive",
      });
      return;
    }
    try {
      await sendTestEmail(subject, completeEmailHTML);
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
    const emailContent = contentMode === 'html' ? htmlContent : content;
    if (!subject.trim() || !emailContent.trim()) {
      toast({
        title: "ACCESS DENIED",
        description: "Subject and content are required to proceed.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      const completeEmailHTML = generateCompleteEmailHTML();
      await sendEmail(subject, completeEmailHTML);
      toast({
        title: "TRANSMISSION SUCCESSFUL",
        description: "Newsletter deployed to all active subscribers.",
      });
      setSubject('');
      setContent('');
      setHtmlContent('');
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "TRANSMISSION FAILED",
        description: "There was an error sending the newsletter.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
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

  const insertImageTemplate = () => {
    const imageTemplate = `<img src="https://your-image-url.com/image.jpg" alt="Description" style="width: 100%; max-width: 600px; height: auto; border-radius: 8px; margin: 20px 0;" />`;
    setHtmlContent(prev => prev + '\n' + imageTemplate);
  };

  const insertSectionTemplate = () => {
    const sectionTemplate = `
<div style="margin: 20px 0; padding: 20px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #007bff;">
  <h3 style="margin: 0 0 10px 0; color: #333; font-size: 18px;">Section Title</h3>
  <p style="margin: 0; color: #666; line-height: 1.6;">Your content here...</p>
</div>`;
    setHtmlContent(prev => prev + '\n' + sectionTemplate);
  };

  const getCurrentContent = () => {
    return contentMode === 'html' ? htmlContent : content;
  };

  const getCurrentContentLength = () => {
    return getCurrentContent().length;
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

                {/* Content Mode Toggle */}
                <div className="flex items-center gap-4">
                  <label className="text-sm font-mono text-muted-foreground">CONTENT MODE</label>
                  <div className="flex gap-2">
                    <Button
                      variant={contentMode === 'text' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setContentMode('text')}
                      className="font-mono"
                    >
                      <Type className="h-4 w-4 mr-2" />
                      TEXT
                    </Button>
                    <Button
                      variant={contentMode === 'html' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setContentMode('html')}
                      className="font-mono"
                    >
                      <Code className="h-4 w-4 mr-2" />
                      HTML
                    </Button>
                  </div>
                </div>

                {/* HTML Tools */}
                {contentMode === 'html' && (
                  <div className="space-y-2">
                    <label className="text-sm font-mono text-muted-foreground">QUICK TOOLS</label>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={insertImageTemplate}
                        className="font-mono text-xs"
                      >
                        <Image className="h-3 w-3 mr-1" />
                        ADD IMAGE
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={insertSectionTemplate}
                        className="font-mono text-xs"
                      >
                        ADD SECTION
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-mono text-muted-foreground">
                    {contentMode === 'html' ? 'HTML CONTENT' : 'MESSAGE CONTENT'}
                  </label>
                  {contentMode === 'text' ? (
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Compose your message for the network..."
                      className="min-h-[300px] font-mono bg-input border-border focus:border-neon-orange transition-colors resize-none"
                    />
                  ) : (
                    <Textarea
                      value={htmlContent}
                      onChange={(e) => setHtmlContent(e.target.value)}
                      placeholder={`Enter HTML content with inline styles:

<div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
  <h2 style="color: #333; margin-bottom: 10px;">Your Title</h2>
  <p style="color: #666; line-height: 1.6;">Your content...</p>
  <img src="https://your-image-url.com" style="width: 100%; border-radius: 8px;" />
</div>`}
                      className="min-h-[400px] font-mono bg-input border-border focus:border-neon-orange transition-colors resize-none text-xs"
                    />
                  )}
                </div>

                <Separator className="bg-border" />

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">
                      {getCurrentContentLength()} CHARS
                    </Badge>
                    <Badge variant="outline" className="font-mono">
                      {getCurrentContent().split('\n').length} LINES
                    </Badge>
                    <Badge variant="outline" className="font-mono">
                      {contentMode.toUpperCase()} MODE
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
                      disabled={isSending || !subject.trim() || !getCurrentContent().trim()}
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
                {/* Email Preview */}
                <div style={{ 
                  maxWidth: '600px', 
                  margin: '0 auto', 
                  fontFamily: "'Segoe UI', Arial, sans-serif",
                  backgroundColor: '#ffffff',
                  color: '#333333',
                  lineHeight: '1.6',
                  padding: '0',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
                }}>
                  
                  {/* Header */}
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '30px 20px', 
                    borderBottom: '1px solid #e5e7eb',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)'
                  }}>
                    <div style={{ 
                      fontSize: '32px', 
                      fontWeight: '900', 
                      marginBottom: '8px', 
                      letterSpacing: '1px',
                      color: '#1f2937'
                    }}>
                      T.P<span style={{ color: '#f97316' }}>*</span>
                    </div>
                    <div style={{ 
                      fontSize: '12px', 
                      fontWeight: '600', 
                      textTransform: 'uppercase', 
                      letterSpacing: '2px',
                      color: '#6b7280'
                    }}>
                      TENSOR | PROTOCOL
                    </div>
                  </div>
                  
                  {/* Subject Section */}
                  {subject && (
                    <div style={{ 
                      padding: '25px 20px',
                      borderBottom: '1px solid #f3f4f6',
                      backgroundColor: '#ffffff'
                    }}>
                      <div style={{ 
                        fontSize: '20px', 
                        fontWeight: '700', 
                        marginBottom: '5px',
                        color: '#1f2937'
                      }}>
                        {subject}
                      </div>
                      <div style={{ 
                        fontSize: '10px', 
                        color: '#9ca3af',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        fontWeight: '500'
                      }}>
                        INCOMING TRANSMISSION
                      </div>
                    </div>
                  )}
                  
                  {/* Content Section */}
                  <div style={{ 
                    padding: '25px 20px',
                    backgroundColor: '#ffffff',
                    minHeight: '200px'
                  }}>
                    {contentMode === 'html' ? (
                      htmlContent ? (
                        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                      ) : (
                        <div style={{ 
                          fontStyle: 'italic', 
                          color: '#9ca3af',
                          fontSize: '14px'
                        }}>
                          Your HTML content will appear here...
                        </div>
                      )
                    ) : (
                      content ? (
                        <div style={{ 
                          fontSize: '14px', 
                          lineHeight: '1.7',
                          color: '#374151',
                          whiteSpace: 'pre-wrap'
                        }}>
                          {content}
                        </div>
                      ) : (
                        <div style={{ 
                          fontStyle: 'italic', 
                          color: '#9ca3af',
                          fontSize: '14px'
                        }}>
                          Your message content will appear here...
                        </div>
                      )
                    )}
                  </div>
                  
                  {/* Footer */}
                  <div style={{ 
                    padding: '20px',
                    borderTop: '1px solid #e5e7eb',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                    textAlign: 'center'
                  }}>
                    <div style={{ 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      marginBottom: '10px',
                      color: '#1f2937'
                    }}>
                      — tensor boy
                    </div>
                    
                    <div style={{ 
                      fontSize: '10px', 
                      color: '#9ca3af',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: '15px',
                      fontWeight: '500'
                    }}>
                      END TRANSMISSION
                    </div>
                    
                    <div style={{ 
                      fontSize: '14px', 
                      fontWeight: '500', 
                      lineHeight: '1.5',
                      color: '#6b7280'
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
