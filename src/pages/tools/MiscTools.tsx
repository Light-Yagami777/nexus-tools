
import React, { useState, useRef, useEffect } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Dice, Timer, Edit, Video, Image, Clock, FileText, Plus, Minus, Trash, Copy, Play, Pause, RotateCcw } from 'lucide-react';

type MiscToolType = 
  | 'randomNumber' 
  | 'uuidGenerator' 
  | 'coinFlip' 
  | 'diceRoller' 
  | 'nameGenerator' 
  | 'loremIpsum' 
  | 'pomodoro' 
  | 'notes' 
  | 'memeGenerator';

const MiscTools = () => {
  const [activeType, setActiveType] = useState<MiscToolType>('randomNumber');
  
  // Random Number Generator states
  const [minValue, setMinValue] = useState<string>("1");
  const [maxValue, setMaxValue] = useState<string>("100");
  const [randomNumber, setRandomNumber] = useState<number | null>(null);
  const [uniqueNumbers, setUniqueNumbers] = useState<boolean>(false);
  const [randomCount, setRandomCount] = useState<string>("1");
  const [randomNumbers, setRandomNumbers] = useState<number[]>([]);
  
  // UUID Generator states
  const [uuidVersion, setUuidVersion] = useState<string>("4");
  const [generatedUuid, setGeneratedUuid] = useState<string>("");
  const [uuidCount, setUuidCount] = useState<string>("1");
  const [uuids, setUuids] = useState<string[]>([]);
  
  // Coin Flip states
  const [coinResult, setCoinResult] = useState<string | null>(null);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  
  // Dice Roller states
  const [diceCount, setDiceCount] = useState<string>("1");
  const [diceSides, setDiceSides] = useState<string>("6");
  const [diceResults, setDiceResults] = useState<number[]>([]);
  const [diceTotal, setDiceTotal] = useState<number | null>(null);
  
  // Name Generator states
  const [nameType, setNameType] = useState<string>("person");
  const [generatedName, setGeneratedName] = useState<string>("");
  
  // Lorem Ipsum Generator states
  const [paragraphCount, setParagraphCount] = useState<string>("3");
  const [sentenceCount, setSentenceCount] = useState<string>("5");
  const [loremText, setLoremText] = useState<string>("");
  const [startWithLorem, setStartWithLorem] = useState<boolean>(true);
  
  // Pomodoro Timer states
  const [workMinutes, setWorkMinutes] = useState<number>(25);
  const [breakMinutes, setBreakMinutes] = useState<number>(5);
  const [isWorking, setIsWorking] = useState<boolean>(true);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [completedPomodoros, setCompletedPomodoros] = useState<number>(0);
  const intervalRef = useRef<number | null>(null);
  
  // Quick Notes states
  const [notes, setNotes] = useState<{id: string, text: string, date: Date}[]>([]);
  const [currentNote, setCurrentNote] = useState<string>("");
  
  // Handle Random Number Generation
  const generateRandomNumber = () => {
    const min = parseInt(minValue, 10);
    const max = parseInt(maxValue, 10);
    const count = parseInt(randomCount, 10);
    
    if (isNaN(min) || isNaN(max) || isNaN(count)) {
      toast.error("Please enter valid numbers");
      return;
    }
    
    if (min >= max) {
      toast.error("Minimum value must be less than maximum value");
      return;
    }
    
    if (count < 1) {
      toast.error("Count must be at least 1");
      return;
    }
    
    if (uniqueNumbers && (max - min + 1) < count) {
      toast.error(`Cannot generate ${count} unique numbers in the range ${min}-${max}`);
      return;
    }
    
    if (count === 1) {
      const number = Math.floor(Math.random() * (max - min + 1)) + min;
      setRandomNumber(number);
      setRandomNumbers([]);
    } else {
      let numbers: number[] = [];
      
      if (uniqueNumbers) {
        // Generate unique numbers
        const allNumbers = Array.from({length: max - min + 1}, (_, i) => min + i);
        // Shuffle the array
        for (let i = allNumbers.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [allNumbers[i], allNumbers[j]] = [allNumbers[j], allNumbers[i]];
        }
        numbers = allNumbers.slice(0, count);
      } else {
        // Generate non-unique numbers
        for (let i = 0; i < count; i++) {
          const number = Math.floor(Math.random() * (max - min + 1)) + min;
          numbers.push(number);
        }
      }
      
      setRandomNumber(null);
      setRandomNumbers(numbers);
    }
    
    toast.success("Random number(s) generated");
  };
  
  // Handle UUID Generation
  const generateUuid = () => {
    const count = parseInt(uuidCount, 10);
    
    if (isNaN(count) || count < 1) {
      toast.error("Count must be at least 1");
      return;
    }
    
    // Simple UUID v4 generation (for demonstration)
    const generateUuidV4 = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };
    
    if (count === 1) {
      const uuid = generateUuidV4();
      setGeneratedUuid(uuid);
      setUuids([]);
    } else {
      const newUuids = [];
      for (let i = 0; i < count; i++) {
        newUuids.push(generateUuidV4());
      }
      setGeneratedUuid("");
      setUuids(newUuids);
    }
    
    toast.success("UUID(s) generated");
  };
  
  // Handle Coin Flip
  const flipCoin = () => {
    if (isFlipping) return;
    
    setIsFlipping(true);
    setCoinResult(null);
    
    // Simulate coin flip animation
    setTimeout(() => {
      const result = Math.random() < 0.5 ? "Heads" : "Tails";
      setCoinResult(result);
      setIsFlipping(false);
    }, 1000);
  };
  
  // Handle Dice Roll
  const rollDice = () => {
    const count = parseInt(diceCount, 10);
    const sides = parseInt(diceSides, 10);
    
    if (isNaN(count) || isNaN(sides) || count < 1 || sides < 2) {
      toast.error("Please enter valid numbers");
      return;
    }
    
    const results = [];
    let total = 0;
    
    for (let i = 0; i < count; i++) {
      const roll = Math.floor(Math.random() * sides) + 1;
      results.push(roll);
      total += roll;
    }
    
    setDiceResults(results);
    setDiceTotal(total);
    toast.success(`Rolled ${count}d${sides}`);
  };
  
  // Handle Name Generation
  const generateName = () => {
    // Sample names for demonstration
    const firstNames = ["James", "John", "Robert", "Michael", "William", "David", "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth"];
    const lastNames = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor"];
    const companyPrefixes = ["Tech", "Global", "Advanced", "Digital", "Smart", "Innovative", "Future", "Eco", "Meta", "Cyber"];
    const companySuffixes = ["Systems", "Solutions", "Technologies", "Innovations", "Group", "Inc", "Corp", "Labs", "Works", "Dynamics"];
    const productTypes = ["Pro", "Ultra", "Max", "Elite", "Premium", "Lite", "Mini", "Plus", "Extreme", "Smart"];
    const productCategories = ["Phone", "Tablet", "Laptop", "Camera", "Speaker", "Watch", "Headphones", "Monitor", "Keyboard", "Mouse"];
    
    let name = "";
    
    if (nameType === "person") {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      name = `${firstName} ${lastName}`;
    } else if (nameType === "company") {
      const prefix = companyPrefixes[Math.floor(Math.random() * companyPrefixes.length)];
      const suffix = companySuffixes[Math.floor(Math.random() * companySuffixes.length)];
      name = `${prefix}${suffix}`;
    } else if (nameType === "product") {
      const type = productTypes[Math.floor(Math.random() * productTypes.length)];
      const category = productCategories[Math.floor(Math.random() * productCategories.length)];
      name = `${type}${category}`;
    }
    
    setGeneratedName(name);
    toast.success("Name generated");
  };
  
  // Handle Lorem Ipsum Generation
  const generateLoremIpsum = () => {
    const paragraphs = parseInt(paragraphCount, 10);
    const sentences = parseInt(sentenceCount, 10);
    
    if (isNaN(paragraphs) || isNaN(sentences) || paragraphs < 1 || sentences < 1) {
      toast.error("Please enter valid numbers");
      return;
    }
    
    // Sample lorem ipsum words for demonstration
    const words = [
      "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
      "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
      "magna", "aliqua", "ut", "enim", "ad", "minim", "veniam", "quis", "nostrud",
      "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea", "commodo",
      "consequat", "duis", "aute", "irure", "dolor", "in", "reprehenderit", "in",
      "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla",
      "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident",
      "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id",
      "est", "laborum"
    ];
    
    // Generate paragraphs
    let result = "";
    for (let p = 0; p < paragraphs; p++) {
      let paragraph = "";
      
      // First sentence might start with "Lorem ipsum dolor sit amet"
      if (p === 0 && startWithLorem) {
        paragraph += "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ";
      } else {
        paragraph += generateSentence(words);
      }
      
      // Generate the rest of the sentences
      const sentencesToGenerate = p === 0 && startWithLorem ? sentences - 1 : sentences;
      for (let s = 0; s < sentencesToGenerate; s++) {
        paragraph += generateSentence(words);
      }
      
      result += paragraph + (p < paragraphs - 1 ? "\n\n" : "");
    }
    
    setLoremText(result);
    toast.success("Lorem ipsum text generated");
  };
  
  // Helper function to generate a random sentence
  const generateSentence = (words: string[]) => {
    const length = Math.floor(Math.random() * 10) + 5; // 5-15 words per sentence
    let sentence = "";
    
    for (let i = 0; i < length; i++) {
      const word = words[Math.floor(Math.random() * words.length)];
      sentence += (i === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word);
      sentence += (i < length - 1 ? " " : ". ");
    }
    
    return sentence;
  };
  
  // Handle Pomodoro Timer
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Timer finished
            const audio = new Audio();
            audio.src = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBhxQos/STAwKBS9Rn9neMgUDAyFBitrpbRkFBRkxYPH/kDEGBg8dN5j8/3ofAQEPDzCT/f9wFQEBEA4Iimlga4L0/3ABAAAAAAknmuH50UwEAAAABRAssP//zToEAAAAAyGI+P/YXRR79vFoKQIOLpHvzptPLCgXBQIKMH7PonxPQkU1EwIBAmPL7JdPPDU4GAwAAXbK4o7//+q6t7DZ//8zXQAAAAAANIXn//9TFwAAAAAAAWj//20FAAAAAAAA//9jAAAA//8gon4ZLwAAAAAAAAAAECQnIhcJAAAAAAAAAAAABg0RGCIoKhoGAAAAAAAA///59vDqUD0AAAAAAAAAAADx5fHcSToAAAAAAAAAAABy8sRT/v//7B8AAAAAAAAAQPE8//3/wToAAAAAAAAAAABGC///40UAAAAAAAAAAAAAXSP//2IAAAAAAAAAAAAAAAAAAAAAAP//";
            audio.load();
            audio.play().catch(e => console.error("Error playing sound", e));
            
            // Switch between work and break
            if (isWorking) {
              setCompletedPomodoros(prev => prev + 1);
              setIsWorking(false);
              setTimeLeft(breakMinutes * 60);
              toast.success("Time for a break!");
            } else {
              setIsWorking(true);
              setTimeLeft(workMinutes * 60);
              toast.success("Back to work!");
            }
            return prev;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isWorking, workMinutes, breakMinutes]);
  
  const startStopTimer = () => {
    setIsRunning(!isRunning);
  };
  
  const resetTimer = () => {
    setIsRunning(false);
    setIsWorking(true);
    setTimeLeft(workMinutes * 60);
    setCompletedPomodoros(0);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle Notes
  const addNote = () => {
    if (!currentNote.trim()) {
      toast.error("Note cannot be empty");
      return;
    }
    
    const newNote = {
      id: Date.now().toString(),
      text: currentNote,
      date: new Date()
    };
    
    setNotes(prev => [newNote, ...prev]);
    setCurrentNote("");
    toast.success("Note added");
    
    // Save to localStorage
    const savedNotes = JSON.parse(localStorage.getItem('quickNotes') || '[]');
    localStorage.setItem('quickNotes', JSON.stringify([newNote, ...savedNotes]));
  };
  
  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    toast.success("Note deleted");
    
    // Update localStorage
    const savedNotes = JSON.parse(localStorage.getItem('quickNotes') || '[]');
    localStorage.setItem('quickNotes', JSON.stringify(savedNotes.filter((note: any) => note.id !== id)));
  };
  
  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('quickNotes') || '[]');
    setNotes(savedNotes.map((note: any) => ({
      ...note,
      date: new Date(note.date)
    })));
  }, []);
  
  // Get the current tool configuration
  const getToolConfig = () => {
    switch (activeType) {
      case 'randomNumber':
        return {
          title: "Random Number Generator",
          description: "Generate random numbers within a specified range with options for uniqueness and distribution.",
          icon: <Dice size={24} />
        };
      case 'uuidGenerator':
        return {
          title: "UUID Generator",
          description: "Generate UUIDs/GUIDs in various formats for database and application use.",
          icon: <Dice size={24} />
        };
      case 'coinFlip':
        return {
          title: "Coin Flip",
          description: "Flip a virtual coin for making decisions with randomized outcomes.",
          icon: <Dice size={24} />
        };
      case 'diceRoller':
        return {
          title: "Dice Roller",
          description: "Roll virtual dice with customizable number of sides and dice count.",
          icon: <Dice size={24} />
        };
      case 'nameGenerator':
        return {
          title: "Name Generator",
          description: "Generate random names for characters, businesses, products, and more.",
          icon: <FileText size={24} />
        };
      case 'loremIpsum':
        return {
          title: "Lorem Ipsum Generator",
          description: "Generate placeholder text in various formats and lengths for design mockups.",
          icon: <FileText size={24} />
        };
      case 'pomodoro':
        return {
          title: "Pomodoro Timer",
          description: "Boost productivity with the Pomodoro technique. Customize work and break intervals.",
          icon: <Timer size={24} />
        };
      case 'notes':
        return {
          title: "Quick Notes",
          description: "Take quick notes in your browser with auto-save and organization features.",
          icon: <Edit size={24} />
        };
      case 'memeGenerator':
        return {
          title: "Meme Generator",
          description: "Create custom memes with popular templates or upload your own images.",
          icon: <Image size={24} />
        };
      default:
        return {
          title: "Miscellaneous Tools",
          description: "A collection of useful tools for everyday tasks.",
          icon: <Dice size={24} />
        };
    }
  };
  
  const toolConfig = getToolConfig();
  
  // Render tool-specific content
  const renderToolContent = () => {
    switch (activeType) {
      case 'randomNumber':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min-value">Minimum Value</Label>
                <Input
                  id="min-value"
                  type="number"
                  value={minValue}
                  onChange={(e) => setMinValue(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-value">Maximum Value</Label>
                <Input
                  id="max-value"
                  type="number"
                  value={maxValue}
                  onChange={(e) => setMaxValue(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="random-count">Count</Label>
                <Input
                  id="random-count"
                  type="number"
                  value={randomCount}
                  onChange={(e) => setRandomCount(e.target.value)}
                  min="1"
                  max="100"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="unique"
                checked={uniqueNumbers}
                onCheckedChange={setUniqueNumbers}
              />
              <Label htmlFor="unique">Generate unique numbers</Label>
            </div>
            
            <Button onClick={generateRandomNumber} className="w-full">
              Generate Random Number
            </Button>
            
            {randomNumber !== null && (
              <div className="p-4 bg-muted rounded-lg text-center">
                <h3 className="text-xl font-bold">{randomNumber}</h3>
              </div>
            )}
            
            {randomNumbers.length > 0 && (
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-bold mb-2">Generated Numbers:</h3>
                <div className="flex flex-wrap gap-2">
                  {randomNumbers.map((num, index) => (
                    <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-md text-sm">
                      {num}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
        
      case 'uuidGenerator':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="uuid-version">UUID Version</Label>
                <select
                  id="uuid-version"
                  value={uuidVersion}
                  onChange={(e) => setUuidVersion(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="4">Version 4 (Random)</option>
                  <option value="1" disabled>Version 1 (Time-based)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="uuid-count">Count</Label>
                <Input
                  id="uuid-count"
                  type="number"
                  value={uuidCount}
                  onChange={(e) => setUuidCount(e.target.value)}
                  min="1"
                  max="100"
                />
              </div>
            </div>
            
            <Button onClick={generateUuid} className="w-full">
              Generate UUID
            </Button>
            
            {generatedUuid && (
              <div className="p-4 bg-muted rounded-lg flex justify-between items-center">
                <div className="font-mono text-sm overflow-auto">{generatedUuid}</div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    navigator.clipboard.writeText(generatedUuid);
                    toast.success("UUID copied to clipboard");
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            {uuids.length > 0 && (
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-bold mb-2">Generated UUIDs:</h3>
                <div className="space-y-2">
                  {uuids.map((uuid, index) => (
                    <div key={index} className="flex justify-between items-center font-mono text-sm">
                      <div className="overflow-auto">{uuid}</div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          navigator.clipboard.writeText(uuid);
                          toast.success("UUID copied to clipboard");
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
        
      case 'coinFlip':
        return (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div 
                className={`w-32 h-32 rounded-full flex items-center justify-center text-2xl font-bold bg-primary text-primary-foreground ${isFlipping ? 'animate-spin' : ''}`}
              >
                {coinResult ? coinResult : "?"}
              </div>
            </div>
            
            <Button onClick={flipCoin} className="w-full" disabled={isFlipping}>
              {isFlipping ? "Flipping..." : "Flip Coin"}
            </Button>
            
            {coinResult && (
              <div className="p-4 bg-muted rounded-lg text-center">
                <h3 className="text-xl font-bold">Result: {coinResult}</h3>
              </div>
            )}
          </div>
        );
        
      case 'diceRoller':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dice-count">Number of Dice</Label>
                <Input
                  id="dice-count"
                  type="number"
                  value={diceCount}
                  onChange={(e) => setDiceCount(e.target.value)}
                  min="1"
                  max="20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dice-sides">Number of Sides</Label>
                <Input
                  id="dice-sides"
                  type="number"
                  value={diceSides}
                  onChange={(e) => setDiceSides(e.target.value)}
                  min="2"
                />
              </div>
            </div>
            
            <Button onClick={rollDice} className="w-full">
              Roll Dice
            </Button>
            
            {diceResults.length > 0 && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex flex-wrap gap-2 mb-4">
                  {diceResults.map((result, index) => (
                    <div 
                      key={index} 
                      className="w-12 h-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold"
                    >
                      {result}
                    </div>
                  ))}
                </div>
                <div className="text-center text-lg font-bold">
                  Total: {diceTotal}
                </div>
              </div>
            )}
          </div>
        );
        
      case 'nameGenerator':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Name Type</Label>
              <div className="flex gap-2">
                <Button 
                  variant={nameType === "person" ? "default" : "outline"}
                  onClick={() => setNameType("person")}
                  className="flex-1"
                >
                  Person
                </Button>
                <Button 
                  variant={nameType === "company" ? "default" : "outline"}
                  onClick={() => setNameType("company")}
                  className="flex-1"
                >
                  Company
                </Button>
                <Button 
                  variant={nameType === "product" ? "default" : "outline"}
                  onClick={() => setNameType("product")}
                  className="flex-1"
                >
                  Product
                </Button>
              </div>
            </div>
            
            <Button onClick={generateName} className="w-full">
              Generate Name
            </Button>
            
            {generatedName && (
              <div className="p-4 bg-muted rounded-lg text-center">
                <h3 className="text-xl font-bold">{generatedName}</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedName);
                    toast.success("Name copied to clipboard");
                  }}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
            )}
          </div>
        );
        
      case 'loremIpsum':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paragraph-count">Number of Paragraphs</Label>
                <Input
                  id="paragraph-count"
                  type="number"
                  value={paragraphCount}
                  onChange={(e) => setParagraphCount(e.target.value)}
                  min="1"
                  max="10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sentence-count">Sentences per Paragraph</Label>
                <Input
                  id="sentence-count"
                  type="number"
                  value={sentenceCount}
                  onChange={(e) => setSentenceCount(e.target.value)}
                  min="1"
                  max="20"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="start-with-lorem"
                checked={startWithLorem}
                onCheckedChange={setStartWithLorem}
              />
              <Label htmlFor="start-with-lorem">Start with "Lorem ipsum dolor sit amet"</Label>
            </div>
            
            <Button onClick={generateLoremIpsum} className="w-full">
              Generate Lorem Ipsum
            </Button>
            
            {loremText && (
              <div className="space-y-4">
                <Textarea
                  value={loremText}
                  readOnly
                  className="min-h-[200px]"
                />
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    navigator.clipboard.writeText(loremText);
                    toast.success("Text copied to clipboard");
                  }}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Text
                </Button>
              </div>
            )}
          </div>
        );
        
      case 'pomodoro':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">{isWorking ? "Work Time" : "Break Time"}</h3>
              <div className="text-6xl font-bold mb-4">{formatTime(timeLeft)}</div>
              <div className="flex justify-center gap-4">
                <Button onClick={startStopTimer}>
                  {isRunning ? <Pause className="mr-2" /> : <Play className="mr-2" />}
                  {isRunning ? "Pause" : "Start"}
                </Button>
                <Button variant="outline" onClick={resetTimer}>
                  <RotateCcw className="mr-2" />
                  Reset
                </Button>
              </div>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Settings</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="work-minutes">Work Duration: {workMinutes} minutes</Label>
                  </div>
                  <Slider
                    id="work-minutes"
                    min={5}
                    max={60}
                    step={5}
                    value={[workMinutes]}
                    onValueChange={(value) => {
                      setWorkMinutes(value[0]);
                      if (isWorking && !isRunning) {
                        setTimeLeft(value[0] * 60);
                      }
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="break-minutes">Break Duration: {breakMinutes} minutes</Label>
                  </div>
                  <Slider
                    id="break-minutes"
                    min={1}
                    max={30}
                    step={1}
                    value={[breakMinutes]}
                    onValueChange={(value) => {
                      setBreakMinutes(value[0]);
                      if (!isWorking && !isRunning) {
                        setTimeLeft(value[0] * 60);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center">
                <span>Completed Pomodoros:</span>
                <span className="text-lg font-bold">{completedPomodoros}</span>
              </div>
            </div>
          </div>
        );
        
      case 'notes':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="new-note">New Note</Label>
              <Textarea
                id="new-note"
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                placeholder="Type your note here..."
                className="min-h-[100px]"
              />
              <Button onClick={addNote} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Your Notes</h3>
              {notes.length === 0 ? (
                <div className="p-4 bg-muted rounded-lg text-center text-muted-foreground">
                  No notes yet. Add one above!
                </div>
              ) : (
                <div className="space-y-4">
                  {notes.map(note => (
                    <Card key={note.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="text-sm text-muted-foreground mb-2">
                          {note.date.toLocaleString()}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => deleteNote(note.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="whitespace-pre-wrap">{note.text}</div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
        
      default:
        return (
          <div className="p-8 text-center">
            <h3 className="text-xl font-medium mb-4">Coming Soon</h3>
            <p className="text-muted-foreground">
              This feature is still under development. Please check back later!
            </p>
          </div>
        );
    }
  };

  return (
    <ToolLayout title={toolConfig.title} description={toolConfig.description} icon={toolConfig.icon}>
      <Card className="p-6">
        <Tabs 
          defaultValue="randomNumber" 
          value={activeType}
          onValueChange={(value) => setActiveType(value as MiscToolType)} 
          className="w-full mb-6"
        >
          <TabsList className="grid grid-cols-3 gap-1 mb-4">
            <TabsTrigger value="randomNumber">Random Number</TabsTrigger>
            <TabsTrigger value="uuidGenerator">UUID Generator</TabsTrigger>
            <TabsTrigger value="coinFlip">Coin Flip</TabsTrigger>
            <TabsTrigger value="diceRoller">Dice Roller</TabsTrigger>
            <TabsTrigger value="nameGenerator">Name Generator</TabsTrigger>
            <TabsTrigger value="loremIpsum">Lorem Ipsum</TabsTrigger>
            <TabsTrigger value="pomodoro">Pomodoro Timer</TabsTrigger>
            <TabsTrigger value="notes">Quick Notes</TabsTrigger>
            <TabsTrigger value="memeGenerator">Meme Generator</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid md:grid-cols-1 gap-6">
          {renderToolContent()}
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="font-medium mb-2">About {toolConfig.title}</h3>
          <p className="text-sm text-muted-foreground">
            {toolConfig.description} This tool helps with quick tasks and daily activities.
          </p>
        </div>
      </Card>
    </ToolLayout>
  );
};

export default MiscTools;
