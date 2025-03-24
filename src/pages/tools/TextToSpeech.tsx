
import React, { useState, useRef } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, StopCircle } from 'lucide-react';
import { toast } from 'sonner';

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voice, setVoice] = useState('');
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  React.useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setVoice(availableVoices[0].name);
      }
    };

    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (utteranceRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = () => {
    if (!text.trim()) {
      toast.error('Please enter some text to speak');
      return;
    }

    if (utteranceRef.current) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voices.find(v => v.name === voice) || null;
    utterance.pitch = pitch;
    utterance.rate = rate;
    utterance.volume = volume;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      toast.error('An error occurred while speaking');
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const pauseOrResume = () => {
    if (isPaused) {
      speechSynthesis.resume();
      setIsPaused(false);
    } else {
      speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const stop = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  return (
    <ToolLayout title="Text to Speech">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Convert Text to Speech</CardTitle>
            <CardDescription>
              Enter text to convert it into natural-sounding speech
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Text</Label>
                <Textarea
                  placeholder="Enter text to convert to speech..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="h-32"
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Voice</Label>
                  <Select value={voice} onValueChange={setVoice}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a voice" />
                    </SelectTrigger>
                    <SelectContent>
                      {voices.map((v) => (
                        <SelectItem key={v.name} value={v.name}>
                          {v.name} ({v.lang})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Pitch ({pitch})</Label>
                  <Slider
                    value={[pitch]}
                    onValueChange={([value]) => setPitch(value)}
                    min={0.1}
                    max={2}
                    step={0.1}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Rate ({rate})</Label>
                  <Slider
                    value={[rate]}
                    onValueChange={([value]) => setRate(value)}
                    min={0.1}
                    max={2}
                    step={0.1}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Volume ({volume})</Label>
                  <Slider
                    value={[volume]}
                    onValueChange={([value]) => setVolume(value)}
                    min={0}
                    max={1}
                    step={0.1}
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                {!isSpeaking ? (
                  <Button onClick={speak}>
                    <Play className="mr-2 h-4 w-4" />
                    Speak
                  </Button>
                ) : (
                  <>
                    <Button onClick={pauseOrResume}>
                      {isPaused ? (
                        <Play className="mr-2 h-4 w-4" />
                      ) : (
                        <Pause className="mr-2 h-4 w-4" />
                      )}
                      {isPaused ? 'Resume' : 'Pause'}
                    </Button>
                    <Button variant="destructive" onClick={stop}>
                      <StopCircle className="mr-2 h-4 w-4" />
                      Stop
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default TextToSpeech;
