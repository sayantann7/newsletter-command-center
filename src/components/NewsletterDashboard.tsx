
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Send, Eye, Users, Activity, Mail, Calendar } from 'lucide-react';
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

  const stats = [
    { label: 'Active Subscribers', value: '25,847', icon: Users, color: 'text-terminal-green' },
    { label: 'Sent This Month', value: '12', icon: Mail, color: 'text-neon-orange' },
    { label: 'Open Rate', value: '78.3%', icon: Activity, color: 'text-terminal-green' },
    { label: 'Next Scheduled', value: 'Manual', icon: Calendar, color: 'text-muted-foreground' },
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
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <div className="border border-border rounded-md p-6 bg-background">
                  <div className="space-y-4">
                    <div className="border-b border-border pb-4">
                      <h3 className="text-lg font-bold font-cyber text-foreground">
                        {subject || '[NO SUBJECT]'}
                      </h3>
                      <p className="text-sm text-muted-foreground font-mono">
                        From: Tomorrow Protocol &lt;noreply@tomorrowprotocol.io&gt;
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      {content ? (
                        content.split('\n').map((line, index) => (
                          <p key={index} className="font-mono text-foreground leading-relaxed">
                            {line || '\u00A0'}
                          </p>
                        ))
                      ) : (
                        <p className="text-muted-foreground font-mono italic">
                          [CONTENT PREVIEW WILL APPEAR HERE]
                        </p>
                      )}
                    </div>
                    
                    <Separator className="bg-border" />
                    
                    <div className="text-xs text-muted-foreground font-mono">
                      <p>© 2025 Tomorrow Protocol. All rights reserved.</p>
                      <p>You received this because you're subscribed to our updates.</p>
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
