
import React, { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';
import { Dice1 } from 'lucide-react';

const DiceRoller = () => {
  const [numberOfDice, setNumberOfDice] = useState(1);
  const [sides, setSides] = useState(6);
  const [results, setResults] = useState<number[]>([]);
  const [rolling, setRolling] = useState(false);
  const [rollHistory, setRollHistory] = useState<{rolls: number[], total: number}[]>([]);

  const rollDice = () => {
    setRolling(true);
    
    setTimeout(() => {
      const newRolls = Array.from({ length: numberOfDice }, () => 
        Math.floor(Math.random() * sides) + 1
      );
      
      setResults(newRolls);
      setRollHistory(prev => [
        { rolls: newRolls, total: newRolls.reduce((sum, val) => sum + val, 0) },
        ...prev.slice(0, 9)
      ]);
      setRolling(false);
    }, 800);
  };

  const calculateTotal = () => {
    return results.reduce((sum, val) => sum + val, 0);
  };

  // Generate dice face based on number
  const renderDiceFace = (value: number) => {
    // Simple representation for any number of sides
    return (
      <div className="w-16 h-16 bg-white rounded-lg border-2 border-gray-300 shadow-md 
                     flex items-center justify-center text-black font-bold text-xl">
        {value}
      </div>
    );
  };

  return (
    <ToolLayout title="Dice Roller" icon={<Dice1 size={24} />}>
      <div className="space-y-8">
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <Label>Number of Dice: {numberOfDice}</Label>
              <Slider 
                value={[numberOfDice]} 
                min={1} 
                max={10} 
                step={1} 
                onValueChange={([value]) => setNumberOfDice(value)} 
                className="my-2" 
              />
            </div>
            
            <div>
              <Label htmlFor="sides">Number of Sides</Label>
              <div className="flex space-x-2 items-center">
                <Input 
                  id="sides" 
                  type="number" 
                  min={2} 
                  max={100} 
                  value={sides} 
                  onChange={(e) => setSides(parseInt(e.target.value) || 6)} 
                />
                <div className="flex space-x-1">
                  {[6, 8, 10, 12, 20].map(s => (
                    <Button 
                      key={s} 
                      variant={sides === s ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => setSides(s)}
                    >
                      d{s}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            <Button 
              onClick={rollDice} 
              disabled={rolling} 
              className="w-full"
            >
              {rolling ? "Rolling..." : `Roll ${numberOfDice}d${sides}`}
            </Button>
          </div>
        </Card>
        
        {results.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Results</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {`${numberOfDice}d${sides} roll:`}
                </div>
                <div className="text-xl font-bold">
                  Total: {calculateTotal()}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center my-4">
                {results.map((result, index) => (
                  <motion.div
                    key={index}
                    initial={{ rotateX: 0, scale: 0.8 }}
                    animate={{ rotateX: rolling ? [0, 720] : 0, scale: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    {renderDiceFace(result)}
                  </motion.div>
                ))}
              </div>
              
              {rollHistory.length > 1 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">History</h3>
                  <div className="max-h-40 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Roll</th>
                          <th className="text-right py-2">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rollHistory.slice(1).map((roll, index) => (
                          <tr key={index} className="border-b last:border-0">
                            <td className="py-2">{roll.rolls.join(', ')}</td>
                            <td className="text-right py-2 font-medium">{roll.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
};

export default DiceRoller;
