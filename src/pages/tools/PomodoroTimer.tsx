
import React, { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Timer, Play, Pause, RefreshCw, Bell, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const PomodoroTimer = () => {
  // Timer modes
  const modes = {
    pomodoro: { label: "Focus", minutes: 25, color: "bg-red-500" },
    shortBreak: { label: "Short Break", minutes: 5, color: "bg-blue-500" },
    longBreak: { label: "Long Break", minutes: 15, color: "bg-green-500" },
  };
  
  // State
  const [mode, setMode] = useState<'pomodoro' | 'shortBreak' | 'longBreak'>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(modes[mode].minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [customMinutes, setCustomMinutes] = useState({
    pomodoro: modes.pomodoro.minutes,
    shortBreak: modes.shortBreak.minutes,
    longBreak: modes.longBreak.minutes,
  });
  const [autoStartBreaks, setAutoStartBreaks] = useState(true);
  const [autoStartPomodoros, setAutoStartPomodoros] = useState(false);
  const [showNotifications, setShowNotifications] = useState(true);
  
  // Calculate time values
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  // Calculate progress
  const totalTime = modes[mode].minutes * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  
  // Set timer duration when mode changes
  useEffect(() => {
    setTimeLeft(customMinutes[mode] * 60);
    setIsRunning(false);
    
    // Set document title
    document.title = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} - ${modes[mode].label}`;
    
    return () => {
      document.title = 'Pomodoro Timer'; // Reset title when unmounting
    };
  }, [mode, customMinutes]);
  
  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Timer completed
      const completedMode = mode;
      
      // Play notification sound
      const audio = new Audio('/notification.mp3');
      if (showNotifications) {
        audio.play().catch(error => console.error('Error playing sound:', error));
        toast.success(`${modes[completedMode].label} completed!`);
      }
      
      // Handle pomodoro completion
      if (completedMode === 'pomodoro') {
        const newCount = pomodoroCount + 1;
        setPomodoroCount(newCount);
        
        // After 4 pomodoros, suggest a long break
        if (newCount % 4 === 0) {
          setMode('longBreak');
          if (autoStartBreaks) {
            setIsRunning(true);
          } else {
            setIsRunning(false);
          }
        } else {
          setMode('shortBreak');
          if (autoStartBreaks) {
            setIsRunning(true);
          } else {
            setIsRunning(false);
          }
        }
      } else {
        // Break completed, start next pomodoro
        setMode('pomodoro');
        if (autoStartPomodoros) {
          setIsRunning(true);
        } else {
          setIsRunning(false);
        }
      }
    }
    
    // Update document title
    document.title = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} - ${modes[mode].label}`;
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode, pomodoroCount, autoStartBreaks, autoStartPomodoros, showNotifications]);
  
  const startTimer = () => {
    setIsRunning(true);
  };
  
  const pauseTimer = () => {
    setIsRunning(false);
  };
  
  const resetTimer = () => {
    setTimeLeft(customMinutes[mode] * 60);
    setIsRunning(false);
  };
  
  const skipToNext = () => {
    if (mode === 'pomodoro') {
      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);
      
      if (newCount % 4 === 0) {
        setMode('longBreak');
      } else {
        setMode('shortBreak');
      }
    } else {
      setMode('pomodoro');
    }
  };
  
  const handleModeTimeChange = (newMode: 'pomodoro' | 'shortBreak' | 'longBreak', value: number) => {
    setCustomMinutes({
      ...customMinutes,
      [newMode]: value
    });
    
    if (mode === newMode) {
      setTimeLeft(value * 60);
    }
  };
  
  return (
    <ToolLayout 
      title="Pomodoro Timer" 
      description="Boost productivity with the Pomodoro technique. Customize work and break intervals."
      icon={<Timer className="h-6 w-6" />}
    >
      <Tabs defaultValue="timer" className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-6">
          <TabsTrigger value="timer">Timer</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="timer">
          <Card className="max-w-md mx-auto">
            <CardHeader className={`text-center ${modes[mode].color} text-white rounded-t-lg`}>
              <CardTitle className="text-2xl">{modes[mode].label}</CardTitle>
              <CardDescription className="text-white/90">
                {mode === 'pomodoro' ? 'Focus on your task' : 'Take a break'}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 pb-8">
              <div className="text-center mb-6">
                <div className="text-6xl font-bold mb-6">
                  {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                </div>
                
                <Progress value={progress} className="h-2 mb-8" />
                
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMode('pomodoro')}
                    className={`${mode === 'pomodoro' ? 'bg-primary text-primary-foreground' : ''}`}
                  >
                    Focus
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMode('shortBreak')}
                    className={`${mode === 'shortBreak' ? 'bg-primary text-primary-foreground' : ''}`}
                  >
                    Short Break
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMode('longBreak')}
                    className={`${mode === 'longBreak' ? 'bg-primary text-primary-foreground' : ''}`}
                  >
                    Long Break
                  </Button>
                </div>
                
                <div className="flex flex-wrap justify-center gap-2">
                  {!isRunning ? (
                    <Button onClick={startTimer}>
                      <Play className="h-4 w-4 mr-1" /> Start
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={pauseTimer}>
                      <Pause className="h-4 w-4 mr-1" /> Pause
                    </Button>
                  )}
                  
                  <Button variant="outline" onClick={resetTimer}>
                    <RefreshCw className="h-4 w-4 mr-1" /> Reset
                  </Button>
                  
                  <Button variant="secondary" onClick={skipToNext}>
                    Skip
                  </Button>
                </div>
              </div>
              
              <div className="text-center text-sm text-muted-foreground">
                <p>Pomodoros completed: {pomodoroCount}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Timer Settings</CardTitle>
              <CardDescription>
                Customize your pomodoro timer settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Time (minutes)</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>Focus: {customMinutes.pomodoro} min</Label>
                    <Slider
                      value={[customMinutes.pomodoro]}
                      min={1}
                      max={60}
                      step={1}
                      onValueChange={(value) => handleModeTimeChange('pomodoro', value[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Short Break: {customMinutes.shortBreak} min</Label>
                    <Slider
                      value={[customMinutes.shortBreak]}
                      min={1}
                      max={30}
                      step={1}
                      onValueChange={(value) => handleModeTimeChange('shortBreak', value[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Long Break: {customMinutes.longBreak} min</Label>
                    <Slider
                      value={[customMinutes.longBreak]}
                      min={5}
                      max={60}
                      step={1}
                      onValueChange={(value) => handleModeTimeChange('longBreak', value[0])}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Auto Start</h3>
                
                <div className="space-y-4 md:space-y-2">
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <RadioGroup defaultValue={autoStartBreaks ? "yes" : "no"} onValueChange={(val) => setAutoStartBreaks(val === "yes")} className="flex flex-col md:flex-row gap-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="auto-breaks-yes" />
                        <Label htmlFor="auto-breaks-yes">Auto-start breaks</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="auto-breaks-no" />
                        <Label htmlFor="auto-breaks-no">Don't auto-start breaks</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                
                <div className="space-y-4 md:space-y-2">
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <RadioGroup defaultValue={autoStartPomodoros ? "yes" : "no"} onValueChange={(val) => setAutoStartPomodoros(val === "yes")} className="flex flex-col md:flex-row gap-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="auto-pomodoros-yes" />
                        <Label htmlFor="auto-pomodoros-yes">Auto-start pomodoros</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="auto-pomodoros-no" />
                        <Label htmlFor="auto-pomodoros-no">Don't auto-start pomodoros</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notifications</h3>
                
                <div className="space-y-4 md:space-y-2">
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <RadioGroup defaultValue={showNotifications ? "yes" : "no"} onValueChange={(val) => setShowNotifications(val === "yes")} className="flex flex-col md:flex-row gap-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="notifications-yes" />
                        <Label htmlFor="notifications-yes">Show notifications</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="notifications-no" />
                        <Label htmlFor="notifications-no">Don't show notifications</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                
                <Button variant="secondary" size="sm" onClick={() => {
                  const audio = new Audio('/notification.mp3');
                  audio.play().catch(error => console.error('Error playing sound:', error));
                  toast.success('Test notification');
                }}>
                  <Bell className="h-4 w-4 mr-2" />
                  Test Sound
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
};

export default PomodoroTimer;
