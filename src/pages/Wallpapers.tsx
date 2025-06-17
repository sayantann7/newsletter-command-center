import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, Check, ImageIcon, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAllWallpapers, approveWallpaper } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Wallpaper {
  id: string;
  imageUrl: string;
  author?: string;
  isApproved?: boolean;
}

const Wallpapers = () => {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [showApproved, setShowApproved] = useState<string>("pending");
  const { toast } = useToast();

  // Load approved wallpapers from local storage when component mounts
  useEffect(() => {
    const loadApprovedWallpapers = () => {
      try {
        const savedApprovals = localStorage.getItem('approvedWallpapers');
        if (savedApprovals) {
          const approvedIds = JSON.parse(savedApprovals);
          return approvedIds;
        }
      } catch (error) {
        console.error("Error loading approved wallpapers from storage:", error);
      }
      return [];
    };
    
    // Apply local approvals after fetching wallpapers
    const approvedIds = loadApprovedWallpapers();
    
    const enhancedFetchWallpapers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllWallpapers();
        console.log("Fetched wallpapers:", data); // Debug log
        
        // Apply local approvals to the fetched data
        if (approvedIds.length > 0) {
          const updatedWallpapers = data.map((wallpaper: Wallpaper) => 
            approvedIds.includes(wallpaper.id) 
              ? { ...wallpaper, isApproved: true } 
              : wallpaper
          );
          setWallpapers(updatedWallpapers);
        } else {
          setWallpapers(data || []);
        }
      } catch (error) {
        console.error("Error fetching wallpapers:", error);
        setError("Failed to load wallpapers. Please try again.");
        toast({
          title: "DATA FETCH ERROR",
          description: "Unable to retrieve wallpaper data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    enhancedFetchWallpapers();
  }, []); // Run only once on mount

  const fetchWallpapers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllWallpapers();
      console.log("Fetched wallpapers:", data);
      
      // Preserve approved status from local storage
      const savedApprovals = localStorage.getItem('approvedWallpapers');
      const approvedIds = savedApprovals ? JSON.parse(savedApprovals) : [];
      
      if (approvedIds.length > 0) {
        const updatedWallpapers = data.map((wallpaper: Wallpaper) => 
          approvedIds.includes(wallpaper.id) 
            ? { ...wallpaper, isApproved: true } 
            : wallpaper
        );
        setWallpapers(updatedWallpapers);
      } else {
        setWallpapers(data || []);
      }
    } catch (error) {
      console.error("Error fetching wallpapers:", error);
      setError("Failed to load wallpapers. Please try again.");
      toast({
        title: "DATA FETCH ERROR",
        description: "Unable to retrieve wallpaper data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (wallpaper: Wallpaper) => {
    if (!wallpaper.id) {
      toast({
        title: "APPROVAL FAILED",
        description: "Missing wallpaper identifier.",
        variant: "destructive",
      });
      return;
    }

    setApproving(prev => ({ ...prev, [wallpaper.id]: true }));
    
    try {
      await approveWallpaper(wallpaper.id);
      
      // Update local state to reflect approval
      setWallpapers(prev => 
        prev.map(w => 
          w.id === wallpaper.id ? { ...w, isApproved: true } : w
        )
      );
      
      // Store approved ID in local storage for persistence between refreshes
      try {
        const savedApprovals = localStorage.getItem('approvedWallpapers');
        const approvedIds = savedApprovals ? JSON.parse(savedApprovals) : [];
        if (!approvedIds.includes(wallpaper.id)) {
          approvedIds.push(wallpaper.id);
          localStorage.setItem('approvedWallpapers', JSON.stringify(approvedIds));
        }
      } catch (error) {
        console.error("Error saving approval to storage:", error);
      }
      
      toast({
        title: "WALLPAPER APPROVED",
        description: "The wallpaper has been successfully approved.",
      });
    } catch (error) {
      console.error("Error approving wallpaper:", error);
      toast({
        title: "APPROVAL FAILED",
        description: "There was an error approving the wallpaper.",
        variant: "destructive",
      });
    } finally {
      setApproving(prev => ({ ...prev, [wallpaper.id]: false }));
    }
  };

  // Filter wallpapers based on approval status
  const filteredWallpapers = wallpapers.filter(wallpaper => {
    if (showApproved === "pending") return !wallpaper.isApproved;
    if (showApproved === "approved") return wallpaper.isApproved;
    return true; // "all" case
  });

  const pendingCount = wallpapers.filter(w => !w.isApproved).length;
  const approvedCount = wallpapers.filter(w => w.isApproved).length;

  return (
    <div className="min-h-screen bg-darker-bg p-6 pt-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-cyber font-bold text-neon-orange terminal-text">
            WALLPAPER APPROVAL TERMINAL
          </h1>
          <p className="text-sm font-mono text-muted-foreground mt-1">
            REVIEW AND APPROVE NETWORK WALLPAPERS
          </p>
        </div>

        <Separator className="bg-border" />

        {/* Filter Tabs */}
        <Tabs value={showApproved} onValueChange={setShowApproved}>
          <div className="flex justify-between items-center mb-4">
            <TabsList className="bg-muted">
              <TabsTrigger value="pending" className="font-mono">
                PENDING ({pendingCount})
              </TabsTrigger>
              <TabsTrigger value="approved" className="font-mono">
                APPROVED ({approvedCount})
              </TabsTrigger>
              <TabsTrigger value="all" className="font-mono">
                ALL ({wallpapers.length})
              </TabsTrigger>
            </TabsList>
            
            <Button
              variant="outline"
              onClick={fetchWallpapers}
              disabled={loading}
              className="font-mono border-muted-foreground text-muted-foreground hover:border-neon-orange transition-colors"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              REFRESH
            </Button>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-md">
              <p className="font-mono text-sm">{error}</p>
              <Button
                variant="outline"
                onClick={fetchWallpapers}
                className="mt-2 font-mono border-destructive text-destructive hover:bg-destructive/10"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                RETRY
              </Button>
            </div>
          )}

          <TabsContent value="pending" className="mt-0">
            <WallpaperGrid 
              wallpapers={filteredWallpapers} 
              loading={loading} 
              approving={approving} 
              handleApprove={handleApprove} 
              fetchWallpapers={fetchWallpapers}
            />
          </TabsContent>
          
          <TabsContent value="approved" className="mt-0">
            <WallpaperGrid 
              wallpapers={filteredWallpapers} 
              loading={loading} 
              approving={approving} 
              handleApprove={handleApprove} 
              fetchWallpapers={fetchWallpapers}
              hideApproveButton
            />
          </TabsContent>
          
          <TabsContent value="all" className="mt-0">
            <WallpaperGrid 
              wallpapers={filteredWallpapers} 
              loading={loading} 
              approving={approving} 
              handleApprove={handleApprove} 
              fetchWallpapers={fetchWallpapers}
            />
          </TabsContent>
        </Tabs>

        {/* Status Indicators */}
        <div className="text-center space-y-2 mt-8">
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

// Extracted component for wallpaper grid to avoid repetition
const WallpaperGrid = ({ 
  wallpapers, 
  loading, 
  approving, 
  handleApprove, 
  fetchWallpapers,
  hideApproveButton = false
}: { 
  wallpapers: Wallpaper[], 
  loading: boolean, 
  approving: Record<string, boolean>, 
  handleApprove: (wallpaper: Wallpaper) => Promise<void>,
  fetchWallpapers: () => Promise<void>,
  hideApproveButton?: boolean
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="cyber-border bg-card">
            <CardContent className="p-0">
              <div className="aspect-video bg-muted animate-pulse"></div>
              <div className="p-4 space-y-2">
                <div className="h-5 bg-muted rounded animate-pulse"></div>
                <div className="h-8 bg-muted rounded animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (wallpapers.length === 0) {
    return (
      <div className="text-center py-12 border border-border rounded-md bg-card p-6">
        <div className="font-mono text-muted-foreground">
          NO WALLPAPERS FOUND
        </div>
        <Button
          variant="outline"
          onClick={fetchWallpapers}
          className="mt-4 font-mono border-neon-orange text-neon-orange transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          REFRESH
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wallpapers.map((wallpaper) => (
        <Card key={wallpaper.id} className="cyber-border bg-card overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-video bg-black">
              <img 
                src={wallpaper.imageUrl} 
                alt="Wallpaper" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/600x400?text=Image+Error";
                }}
              />
              {wallpaper.isApproved && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-terminal-green text-black font-mono">
                    <Check className="h-3 w-3 mr-1" />
                    APPROVED
                  </Badge>
                </div>
              )}
            </div>
            <div className="p-4 space-y-2">
              <div className="font-mono text-xs text-muted-foreground truncate">
                {wallpaper.author ? `By: ${wallpaper.author}` : 'Unknown author'}
              </div>
              <div className="flex gap-2">
                {!wallpaper.isApproved && !hideApproveButton && (
                  <Button
                    onClick={() => handleApprove(wallpaper)}
                    disabled={approving[wallpaper.id]}
                    className="w-full font-mono bg-terminal-green hover:bg-terminal-green/80 text-black transition-colors"
                  >
                    {approving[wallpaper.id] ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        PROCESSING
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        APPROVE
                      </>
                    )}
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => window.open(wallpaper.imageUrl, '_blank')}
                  className="font-mono border-muted-foreground text-muted-foreground hover:border-neon-orange hover:text-neon-orange transition-colors"
                >
                  VIEW FULL
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Wallpapers;