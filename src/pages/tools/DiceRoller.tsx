
import React, { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dices } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

type DieType = 4 | 6 | 8 | 10 | 12 | 20 | 100;

interface DiceRoll {
  dieType: DieType;
  results: number[];
  total: number;
  time: Date;
}

const DiceRoller = () => {
  const [dieType, setDieType] = useState<DieType>(6);
  const [numberOfDice, setNumberOfDice] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [currentRoll, setCurrentRoll] = useState<number[]>([]);
  const [rollHistory, setRollHistory] = useState<DiceRoll[]>([]);

  const handleDieTypeChange = (value: string) => {
    setDieType(parseInt(value) as DieType);
  };

  const handleNumberOfDiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) {
      setNumberOfDice(1);
    } else if (value > 10) {
      setNumberOfDice(10);
      toast.info("Maximum 10 dice allowed");
    } else {
      setNumberOfDice(value);
    }
  };

  const rollDice = () => {
    if (isRolling) return;

    setIsRolling(true);
    toast('Rolling dice...');

    // Simulate dice rolling animation
    let animationRolls = 0;
    const maxAnimationRolls = 10;
    const animationInterval = setInterval(() => {
      const randomRolls = Array.from({ length: numberOfDice }, () => 
        Math.floor(Math.random() * dieType) + 1
      );
      setCurrentRoll(randomRolls);
      
      animationRolls++;
      if (animationRolls >= maxAnimationRolls) {
        clearInterval(animationInterval);
        
        // Final roll
        const finalRolls = Array.from({ length: numberOfDice }, () => 
          Math.floor(Math.random() * dieType) + 1
        );
        const total = finalRolls.reduce((sum, val) => sum + val, 0);
        
        setCurrentRoll(finalRolls);
        setRollHistory(prev => [{
          dieType,
          results: finalRolls,
          total,
          time: new Date()
        }, ...prev.slice(0, 9)]);
        
        toast.success(`Rolled ${finalRolls.join(', ')} = ${total}`);
        setIsRolling(false);
      }
    }, 100);
  };

  const clearHistory = () => {
    setRollHistory([]);
    setCurrentRoll([]);
    toast('History cleared');
  };

  const getDieImage = (value: number, dieType: DieType) => {
    // Simple representation of dice faces
    return (
      <div 
        className="inline-flex items-center justify-center rounded-md bg-background border shadow-sm w-10 h-10 text-center text-lg font-bold"
      >
        {value}
      </div>
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <ToolLayout 
      title="Dice Roller" 
      description="Roll virtual dice for games and random decisions"
      icon={<Dices className="h-6 w-6" />}
    >
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="min-h-36 mb-8 flex items-center justify-center flex-wrap gap-4">
                    {currentRoll.length > 0 ? (
                      currentRoll.map((value, index) => (
                        <motion.div
                          key={index}
                          initial={{ rotateX: 0, rotateY: 0, rotateZ: 0 }}
                          animate={{ 
                            rotateX: isRolling ? [0, 360, 720, 1080] : 0,
                            rotateY: isRolling ? [0, 360, 720, 1080] : 0,
                            rotateZ: isRolling ? [0, 360, 720, 1080] : 0
                          }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        >
                          {getDieImage(value, dieType)}
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-muted-foreground">Roll the dice to get started</div>
                    )}
                  </div>

                  {currentRoll.length > 0 && (
                    <div className="mb-6 text-center">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-3xl font-bold">{currentRoll.reduce((sum, val) => sum + val, 0)}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md mb-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Die Type</label>
                      <Select defaultValue={dieType.toString()} onValueChange={handleDieTypeChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select die" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="4">D4</SelectItem>
                          <SelectItem value="6">D6</SelectItem>
                          <SelectItem value="8">D8</SelectItem>
                          <SelectItem value="10">D10</SelectItem>
                          <SelectItem value="12">D12</SelectItem>
                          <SelectItem value="20">D20</SelectItem>
                          <SelectItem value="100">D100</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Number of Dice</label>
                      <Input
                        type="number"
                        value={numberOfDice}
                        onChange={handleNumberOfDiceChange}
                        min={1}
                        max={10}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4 w-full max-w-md">
                    <Button 
                      onClick={rollDice}
                      disabled={isRolling}
                      className="w-full"
                      size="lg"
                    >
                      {isRolling ? 'Rolling...' : `Roll ${numberOfDice}d${dieType}`}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={clearHistory}
                      className="w-full"
                    >
                      Clear History
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium text-lg mb-2">Roll History</h3>
                {rollHistory.length > 0 ? (
                  <ul className="space-y-3">
                    {rollHistory.map((roll, index) => (
                      <li key={index} className="p-3 bg-muted/50 rounded-md">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{roll.numberOfDice}d{roll.dieType}</span>
                          <span className="text-muted-foreground text-xs">{formatTime(roll.time)}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 my-2">
                          {roll.results.map((value, i) => (
                            <div key={i} className="w-6 h-6 flex items-center justify-center rounded-sm bg-muted text-xs font-medium">
                              {value}
                            </div>
                          ))}
                        </div>
                        <div className="text-right font-medium">
                          = {roll.total}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-sm">No rolls yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default DiceRoller;
