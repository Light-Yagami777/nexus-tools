
import React, { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dice1, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DiceRoll {
  id: number;
  sides: number;
  value: number;
  timestamp: number;
}

const diceTypes = [4, 6, 8, 10, 12, 20, 100];

const DiceRoller: React.FC = () => {
  const [numDice, setNumDice] = useState(1);
  const [diceSides, setDiceSides] = useState(6);
  const [isRolling, setIsRolling] = useState(false);
  const [rolls, setRolls] = useState<DiceRoll[]>([]);
  const [rollHistory, setRollHistory] = useState<{total: number, dice: DiceRoll[]}[]>([]);

  const handleNumDiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setNumDice(Math.min(Math.max(value, 1), 10)); // Limit between 1 and 10
  };

  const handleDiceSidesChange = (value: string) => {
    setDiceSides(parseInt(value));
  };

  const rollDice = () => {
    if (isRolling) return;
    
    setIsRolling(true);
    
    // Generate new rolls
    const newRolls: DiceRoll[] = [];
    for (let i = 0; i < numDice; i++) {
      newRolls.push({
        id: Date.now() + i,
        sides: diceSides,
        value: Math.floor(Math.random() * diceSides) + 1,
        timestamp: Date.now()
      });
    }
    
    // Add to history
    setTimeout(() => {
      setRolls(newRolls);
      setRollHistory(prev => [
        { total: newRolls.reduce((sum, roll) => sum + roll.value, 0), dice: [...newRolls] },
        ...prev.slice(0, 9) // Keep last 10 rolls
      ]);
      setIsRolling(false);
    }, 800);
  };

  const clearHistory = () => {
    setRollHistory([]);
    setRolls([]);
  };

  // Render a single die for the current roll
  const renderDie = (roll: DiceRoll) => {
    const getDieStyle = () => {
      switch (roll.sides) {
        case 4: return 'clip-path: polygon(50% 0%, 0% 100%, 100% 100%)';
        case 8: return 'clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
        case 10: return 'clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)';
        case 12: return 'clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
        case 20: return 'clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
        case 100: return 'rounded-full';
        default: return 'rounded-lg'; // d6
      }
    };

    return (
      <motion.div
        key={roll.id}
        initial={{ rotateY: 0, scale: 0.5, opacity: 0 }}
        animate={{ rotateY: 360, scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-16 h-16 flex items-center justify-center bg-primary/20 border-2 border-primary/30 shadow-lg m-2"
        style={{ [getDieStyle()]: '' }}
      >
        <span className="text-xl font-bold">{roll.value}</span>
      </motion.div>
    );
  };

  return (
    <ToolLayout title="Dice Roller">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Dice1 className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Dice Roller</h2>
        </div>
        
        <p className="text-muted-foreground mb-6">
          Roll virtual dice with customizable number of sides and dice count.
        </p>
        
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="num-dice">Number of Dice (1-10)</Label>
              <Input
                id="num-dice"
                type="number"
                min="1"
                max="10"
                value={numDice}
                onChange={handleNumDiceChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dice-sides">Dice Type</Label>
              <Select
                value={diceSides.toString()}
                onValueChange={handleDiceSidesChange}
              >
                <SelectTrigger id="dice-sides">
                  <SelectValue placeholder="Select dice type" />
                </SelectTrigger>
                <SelectContent>
                  {diceTypes.map(sides => (
                    <SelectItem key={sides} value={sides.toString()}>
                      d{sides}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button
              onClick={rollDice}
              disabled={isRolling}
              size="lg"
              className="px-8"
            >
              {isRolling ? 'Rolling...' : 'Roll Dice'}
            </Button>
          </div>
          
          {/* Current Roll */}
          <div className="min-h-32">
            <h3 className="text-lg font-medium mb-3">Current Roll:</h3>
            
            <AnimatePresence>
              {rolls.length > 0 && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex flex-wrap justify-center mb-4">
                    {rolls.map(roll => renderDie(roll))}
                  </div>
                  
                  <div className="text-center">
                    <p className="text-xl font-bold">
                      Total: {rolls.reduce((sum, roll) => sum + roll.value, 0)}
                    </p>
                    {rolls.length > 1 && (
                      <p className="text-sm text-muted-foreground">
                        ({rolls.map(r => r.value).join(' + ')})
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Roll History */}
          {rollHistory.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium">Roll History:</h3>
                <Button variant="ghost" size="sm" onClick={clearHistory}>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </div>
              
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {rollHistory.map((historyItem, index) => (
                  <div 
                    key={index} 
                    className="p-3 rounded-md bg-muted flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2">
                        {historyItem.dice.length}d{historyItem.dice[0]?.sides}:
                      </span>
                      <span className="text-sm">
                        {historyItem.dice.map(d => d.value).join(', ')}
                      </span>
                    </div>
                    <span className="font-bold">{historyItem.total}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </ToolLayout>
  );
};

export default DiceRoller;
