
import React, { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CircleDollarSign, RefreshCw, RotateCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CoinFlip: React.FC = () => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [flipCount, setFlipCount] = useState(0);
  const [stats, setStats] = useState({ heads: 0, tails: 0 });

  const flipCoin = () => {
    if (isFlipping) return;
    
    setIsFlipping(true);
    const newFlipCount = flipCount + 1;
    setFlipCount(newFlipCount);
    
    // Wait a bit for animation effect
    setTimeout(() => {
      const outcome = Math.random() < 0.5 ? 'heads' : 'tails';
      setResult(outcome);
      
      setStats(prevStats => ({
        heads: prevStats.heads + (outcome === 'heads' ? 1 : 0),
        tails: prevStats.tails + (outcome === 'tails' ? 1 : 0)
      }));
      
      setIsFlipping(false);
    }, 1000);
  };

  const resetStats = () => {
    setStats({ heads: 0, tails: 0 });
    setFlipCount(0);
    setResult(null);
  };

  const getHeadsPercentage = () => {
    if (flipCount === 0) return 0;
    return (stats.heads / flipCount) * 100;
  };

  const getTailsPercentage = () => {
    if (flipCount === 0) return 0;
    return (stats.tails / flipCount) * 100;
  };

  return (
    <ToolLayout title="Coin Flip">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <CircleDollarSign className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Coin Flip</h2>
        </div>
        
        <p className="text-muted-foreground mb-6">
          Flip a virtual coin for making quick decisions with randomized outcomes.
        </p>
        
        <div className="flex flex-col items-center justify-center">
          <div className="mb-10 relative h-40 w-40 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {isFlipping ? (
                <motion.div
                  key="flipping"
                  initial={{ rotateX: 0 }}
                  animate={{ rotateX: 1440 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="h-32 w-32 rounded-full bg-yellow-400 border-4 border-yellow-500 shadow-lg flex items-center justify-center">
                    <RotateCw className="h-12 w-12 text-yellow-700" />
                  </div>
                </motion.div>
              ) : result ? (
                <motion.div
                  key={result}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="h-32 w-32 rounded-full bg-yellow-400 border-4 border-yellow-500 shadow-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-yellow-800">
                      {result === 'heads' ? 'H' : 'T'}
                    </span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="initial"
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="h-32 w-32 rounded-full bg-yellow-400 border-4 border-yellow-500 shadow-lg flex items-center justify-center">
                    <CircleDollarSign className="h-12 w-12 text-yellow-700" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 text-center"
            >
              <h3 className="text-2xl font-bold mb-1">
                {result === 'heads' ? 'Heads!' : 'Tails!'}
              </h3>
              <p className="text-muted-foreground">
                {result === 'heads' 
                  ? 'The coin landed on heads'
                  : 'The coin landed on tails'}
              </p>
            </motion.div>
          )}
          
          <div className="flex gap-4">
            <Button onClick={flipCoin} disabled={isFlipping} size="lg">
              {isFlipping ? 'Flipping...' : 'Flip Coin'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={resetStats} 
              disabled={isFlipping || flipCount === 0}
              size="lg"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
          
          {flipCount > 0 && (
            <div className="mt-12 w-full max-w-md">
              <h3 className="text-lg font-medium mb-3">Statistics:</h3>
              
              <div className="grid grid-cols-2 gap-4 text-center mb-4">
                <div className="p-3 rounded-md bg-muted">
                  <div className="text-2xl font-bold">{stats.heads}</div>
                  <div className="text-sm text-muted-foreground">Heads</div>
                </div>
                
                <div className="p-3 rounded-md bg-muted">
                  <div className="text-2xl font-bold">{stats.tails}</div>
                  <div className="text-sm text-muted-foreground">Tails</div>
                </div>
              </div>
              
              <div className="mb-2 flex justify-between text-sm">
                <span>Heads: {getHeadsPercentage().toFixed(1)}%</span>
                <span>Tails: {getTailsPercentage().toFixed(1)}%</span>
              </div>
              
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${getHeadsPercentage()}%` }}
                ></div>
              </div>
              
              <p className="text-center text-sm text-muted-foreground mt-4">
                Total flips: {flipCount}
              </p>
            </div>
          )}
        </div>
      </Card>
    </ToolLayout>
  );
};

export default CoinFlip;
