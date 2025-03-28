
import React, { useState, useEffect, useRef } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';

const PomoTimer = () => {
  const [active, setActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [currentMode, setCurrentMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [cycles, setCycles] = useState(0);
  const [settings, setSettings] = useState({
    focusTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    longBreakInterval: 4,
    autoStartBreaks: true,
    autoStartPomodoros: false,
  });
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('/notification.mp3'); // You'll need to add this sound file
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (active) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current!);
            handleTimerComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [active]);

  const handleTimerComplete = () => {
    audioRef.current?.play().catch(err => console.error("Could not play notification sound:", err));
    
    if (currentMode === 'focus') {
      const newCycles = cycles + 1;
      setCycles(newCycles);
      
      toast.success("Focus session completed! Time for a break.");
      
      if (newCycles % settings.longBreakInterval === 0) {
        setCurrentMode('longBreak');
        setTimeLeft(settings.longBreakTime * 60);
        if (settings.autoStartBreaks) setActive(true);
        else setActive(false);
      } else {
        setCurrentMode('shortBreak');
        setTimeLeft(settings.shortBreakTime * 60);
        if (settings.autoStartBreaks) setActive(true);
        else setActive(false);
      }
    } else {
      toast.success("Break completed! Time to focus.");
      setCurrentMode('focus');
      setTimeLeft(settings.focusTime * 60);
      if (settings.autoStartPomodoros) setActive(true);
      else setActive(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleModeChange = (mode: 'focus' | 'shortBreak' | 'longBreak') => {
    setActive(false);
    setCurrentMode(mode);
    
    if (mode === 'focus') {
      setTimeLeft(settings.focusTime * 60);
    } else if (mode === 'shortBreak') {
      setTimeLeft(settings.shortBreakTime * 60);
    } else {
      setTimeLeft(settings.longBreakTime * 60);
    }
  };

  const handleSettingChange = (key: keyof typeof settings, value: number | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Update current timer if relevant setting changed
    if (key === 'focusTime' && currentMode === 'focus') {
      setTimeLeft(value as number * 60);
    } else if (key === 'shortBreakTime' && currentMode === 'shortBreak') {
      setTimeLeft(value as number * 60);
    } else if (key === 'longBreakTime' && currentMode === 'longBreak') {
      setTimeLeft(value as number * 60);
    }
  };

  const resetTimer = () => {
    setActive(false);
    if (currentMode === 'focus') {
      setTimeLeft(settings.focusTime * 60);
    } else if (currentMode === 'shortBreak') {
      setTimeLeft(settings.shortBreakTime * 60);
    } else {
      setTimeLeft(settings.longBreakTime * 60);
    }
  };

  return (
    <ToolLayout title="Pomodoro Timer" icon={<Timer size={24} />}>
      <div className="max-w-xl mx-auto space-y-6">
        <Card className="p-6">
          <div className="flex justify-center mb-6">
            <TabsList>
              <TabsTrigger 
                value="focus" 
                onClick={() => handleModeChange('focus')}
                className={currentMode === 'focus' ? 'bg-primary text-primary-foreground' : ''}
              >
                Focus
              </TabsTrigger>
              <TabsTrigger 
                value="shortBreak" 
                onClick={() => handleModeChange('shortBreak')}
                className={currentMode === 'shortBreak' ? 'bg-emerald-600 text-white' : ''}
              >
                Short Break
              </TabsTrigger>
              <TabsTrigger 
                value="longBreak" 
                onClick={() => handleModeChange('longBreak')}
                className={currentMode === 'longBreak' ? 'bg-blue-600 text-white' : ''}
              >
                Long Break
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="text-center">
            <div 
              className={`text-8xl font-bold tabular-nums my-8 ${
                currentMode === 'focus' 
                  ? 'text-primary' 
                  : currentMode === 'shortBreak' 
                    ? 'text-emerald-600' 
                    : 'text-blue-600'
              }`}
            >
              {formatTime(timeLeft)}
            </div>
            
            <div className="text-sm text-muted-foreground mb-6">
              {currentMode === 'focus' 
                ? `Focusing...` 
                : currentMode === 'shortBreak' 
                  ? 'Short break' 
                  : 'Long break'}
              {cycles > 0 && ` • Cycle ${Math.ceil(cycles / settings.longBreakInterval)} (${cycles} pomodoros completed)`}
            </div>
            
            <div className="flex justify-center space-x-4">
              <Button 
                size="lg" 
                onClick={() => setActive(!active)}
                className={`w-32 ${
                  currentMode === 'focus' 
                    ? '' 
                    : currentMode === 'shortBreak' 
                      ? 'bg-emerald-600 hover:bg-emerald-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {active 
                  ? <><Pause className="mr-2 h-4 w-4" /> Pause</> 
                  : <><Play className="mr-2 h-4 w-4" /> Start</>}
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={resetTimer}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Timer Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="focusTime">Focus Time (minutes)</Label>
              <Input
                id="focusTime"
                type="number"
                min="1"
                max="60"
                value={settings.focusTime}
                onChange={(e) => handleSettingChange('focusTime', parseInt(e.target.value) || 25)}
              />
            </div>
            
            <div>
              <Label htmlFor="shortBreakTime">Short Break (minutes)</Label>
              <Input
                id="shortBreakTime"
                type="number"
                min="1"
                max="30"
                value={settings.shortBreakTime}
                onChange={(e) => handleSettingChange('shortBreakTime', parseInt(e.target.value) || 5)}
              />
            </div>
            
            <div>
              <Label htmlFor="longBreakTime">Long Break (minutes)</Label>
              <Input
                id="longBreakTime"
                type="number"
                min="1"
                max="60"
                value={settings.longBreakTime}
                onChange={(e) => handleSettingChange('longBreakTime', parseInt(e.target.value) || 15)}
              />
            </div>
            
            <div>
              <Label htmlFor="longBreakInterval">Long Break After (pomodoros)</Label>
              <Input
                id="longBreakInterval"
                type="number"
                min="1"
                max="10"
                value={settings.longBreakInterval}
                onChange={(e) => handleSettingChange('longBreakInterval', parseInt(e.target.value) || 4)}
              />
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoStartBreaks"
                checked={settings.autoStartBreaks}
                onChange={(e) => handleSettingChange('autoStartBreaks', e.target.checked)}
                className="mr-2"
              />
              <Label htmlFor="autoStartBreaks">Auto-start breaks</Label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoStartPomodoros"
                checked={settings.autoStartPomodoros}
                onChange={(e) => handleSettingChange('autoStartPomodoros', e.target.checked)}
                className="mr-2"
              />
              <Label htmlFor="autoStartPomodoros">Auto-start pomodoros</Label>
            </div>
          </div>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default PomoTimer;
