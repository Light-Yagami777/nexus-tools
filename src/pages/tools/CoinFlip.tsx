
import React, { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Coins } from 'lucide-react';
import { toast } from 'sonner';

const CoinFlip = () => {
  const [flipping, setFlipping] = useState(false);
  const [coinSide, setCoinSide] = useState<'heads' | 'tails' | null>(null);
  const [flipHistory, setFlipHistory] = useState<Array<{ side: string; time: Date }>>([]);
  const [headsCount, setHeadsCount] = useState(0);
  const [tailsCount, setTailsCount] = useState(0);

  const flipCoin = () => {
    if (flipping) return;
    
    setFlipping(true);
    toast('Flipping coin...');
    
    // Random result after animation
    setTimeout(() => {
      const result = Math.random() > 0.5 ? 'heads' : 'tails';
      setCoinSide(result);
      setFlipHistory(prev => [{ side: result, time: new Date() }, ...prev.slice(0, 9)]);
      
      if (result === 'heads') {
        setHeadsCount(prev => prev + 1);
      } else {
        setTailsCount(prev => prev + 1);
      }
      
      toast.success(`Coin landed on ${result.toUpperCase()}!`);
      setFlipping(false);
    }, 1500);
  };

  const resetStats = () => {
    setCoinSide(null);
    setFlipHistory([]);
    setHeadsCount(0);
    setTailsCount(0);
    toast('Statistics reset');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <ToolLayout 
      title="Coin Flip" 
      description="Flip a virtual coin for making decisions"
      icon={<Coins className="h-6 w-6" />}
    >
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="h-48 w-48 relative mb-8 flex items-center justify-center">
                    {coinSide === null ? (
                      <motion.div 
                        className="w-32 h-32 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500 flex items-center justify-center text-xl font-bold shadow-lg"
                      >
                        Flip me!
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ rotateX: 0 }}
                        animate={{ 
                          rotateX: flipping ? [0, 1800] : 0,
                          rotateY: flipping ? [0, 1800] : 0
                        }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={`w-32 h-32 rounded-full ${
                          coinSide === 'heads' 
                            ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' 
                            : 'bg-gradient-to-r from-yellow-300 to-yellow-500'
                        } flex items-center justify-center text-2xl font-bold shadow-lg`}
                      >
                        {coinSide === 'heads' ? 'H' : 'T'}
                      </motion.div>
                    )}
                  </div>
                  
                  <div className="space-y-4 w-full max-w-xs">
                    <Button 
                      onClick={flipCoin} 
                      disabled={flipping}
                      className="w-full"
                      size="lg"
                    >
                      {flipping ? 'Flipping...' : 'Flip Coin'}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={resetStats}
                      className="w-full"
                    >
                      Reset Stats
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium text-lg mb-4">Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted rounded-md">
                    <p className="text-sm text-muted-foreground">Heads</p>
                    <p className="text-2xl font-bold">{headsCount}</p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-md">
                    <p className="text-sm text-muted-foreground">Tails</p>
                    <p className="text-2xl font-bold">{tailsCount}</p>
                  </div>
                  <div className="col-span-2 text-center p-3 bg-muted rounded-md">
                    <p className="text-sm text-muted-foreground">Total Flips</p>
                    <p className="text-2xl font-bold">{headsCount + tailsCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium text-lg mb-2">Recent Flips</h3>
                {flipHistory.length > 0 ? (
                  <ul className="space-y-2 text-sm">
                    {flipHistory.map((flip, index) => (
                      <li key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                        <span className="font-medium">{flip.side.toUpperCase()}</span>
                        <span className="text-muted-foreground text-xs">{formatTime(flip.time)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-sm">No flips yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default CoinFlip;
