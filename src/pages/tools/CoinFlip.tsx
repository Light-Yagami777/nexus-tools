
import React, { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Dices } from 'lucide-react';

const CoinFlip = () => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [flipHistory, setFlipHistory] = useState<Array<'heads' | 'tails'>>([]);
  const [flipStats, setFlipStats] = useState({ heads: 0, tails: 0 });

  const flipCoin = () => {
    setIsFlipping(true);
    
    // Simulate coin flip with animation
    setTimeout(() => {
      const newResult = Math.random() > 0.5 ? 'heads' : 'tails';
      setResult(newResult);
      setIsFlipping(false);
      
      // Update history and stats
      const newHistory = [...flipHistory, newResult];
      setFlipHistory(newHistory);
      
      setFlipStats({
        heads: newHistory.filter(r => r === 'heads').length,
        tails: newHistory.filter(r => r === 'tails').length
      });
    }, 1000);
  };

  const resetStats = () => {
    setFlipHistory([]);
    setFlipStats({ heads: 0, tails: 0 });
    setResult(null);
  };

  return (
    <ToolLayout title="Coin Flip" icon={<Dices size={24} />}>
      <div className="flex flex-col items-center space-y-8">
        <Card className="p-8 w-full max-w-md mx-auto">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative w-48 h-48 flex items-center justify-center">
              {result || isFlipping ? (
                <motion.div
                  className={`w-32 h-32 rounded-full flex items-center justify-center text-center 
                              ${result === 'heads' ? 'bg-yellow-500' : 'bg-gray-400'}`}
                  initial={{ rotateX: 0 }}
                  animate={isFlipping 
                    ? { rotateX: [0, 1080], scale: [1, 0.8, 1] } 
                    : { rotateX: 0 }}
                  transition={{ duration: isFlipping ? 1 : 0.3 }}
                >
                  <span className="text-2xl font-bold text-white">
                    {isFlipping ? '?' : result === 'heads' ? 'H' : 'T'}
                  </span>
                </motion.div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 
                             flex items-center justify-center text-2xl font-bold text-white">
                  ?
                </div>
              )}
            </div>
            
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-1">
                {!result 
                  ? "Flip the coin!" 
                  : `Result: ${result.charAt(0).toUpperCase() + result.slice(1)}`}
              </h2>
              <p className="text-muted-foreground">
                {!result 
                  ? "Click the button below to get heads or tails" 
                  : isFlipping 
                    ? "Flipping..." 
                    : `You got ${result}!`}
              </p>
            </div>
            
            <Button 
              size="lg" 
              onClick={flipCoin} 
              disabled={isFlipping} 
              className="w-full"
            >
              {isFlipping ? "Flipping..." : "Flip Coin"}
            </Button>
          </div>
        </Card>
        
        {flipHistory.length > 0 && (
          <Card className="p-6 w-full max-w-md mx-auto">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Statistics</h3>
                <Button variant="outline" size="sm" onClick={resetStats}>
                  Reset
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted p-4 rounded-md text-center">
                  <div className="text-2xl font-bold">{flipStats.heads}</div>
                  <div className="text-sm text-muted-foreground">Heads</div>
                  <div className="text-sm text-muted-foreground">
                    ({flipHistory.length > 0 
                      ? Math.round((flipStats.heads / flipHistory.length) * 100) 
                      : 0}%)
                  </div>
                </div>
                
                <div className="bg-muted p-4 rounded-md text-center">
                  <div className="text-2xl font-bold">{flipStats.tails}</div>
                  <div className="text-sm text-muted-foreground">Tails</div>
                  <div className="text-sm text-muted-foreground">
                    ({flipHistory.length > 0 
                      ? Math.round((flipStats.tails / flipHistory.length) * 100) 
                      : 0}%)
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Last 10 flips</h3>
                <div className="flex flex-wrap gap-1">
                  {flipHistory.slice(-10).map((flip, index) => (
                    <div 
                      key={index} 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold
                                 ${flip === 'heads' ? 'bg-yellow-500' : 'bg-gray-500'}`}
                    >
                      {flip === 'heads' ? 'H' : 'T'}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
};

export default CoinFlip;
