
import React, { useState, useRef, useEffect } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Copy, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const SpeechToText = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [browserSupport, setBrowserSupport] = useState(true);
  const recognitionRef = useRef<any>(null);
  const lastTranscriptRef = useRef<string>('');

  useEffect(() => {
    // Check if browser supports speech recognition
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      setBrowserSupport(false);
      toast.error('Speech recognition is not supported in your browser. Try Chrome, Edge, or Safari.');
    }
  }, []);

  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'es-ES', name: 'Spanish' },
    { code: 'fr-FR', name: 'French' },
    { code: 'de-DE', name: 'German' },
    { code: 'it-IT', name: 'Italian' },
    { code: 'pt-BR', name: 'Portuguese (Brazil)' },
    { code: 'ru-RU', name: 'Russian' },
    { code: 'ja-JP', name: 'Japanese' },
    { code: 'ko-KR', name: 'Korean' },
    { code: 'zh-CN', name: 'Chinese (Simplified)' },
    { code: 'hi-IN', name: 'Hindi' },
  ];

  const startRecording = () => {
    try {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognitionAPI) {
        toast.error('Speech recognition is not supported in your browser');
        return;
      }

      // Cancel any existing recognition session first
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognitionAPI();
      // Set to false to prevent repetition
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage;
      // Reset the last transcript reference
      lastTranscriptRef.current = '';

      recognition.onstart = () => {
        setIsRecording(true);
        toast.success('Started listening...');
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript && finalTranscript !== lastTranscriptRef.current) {
          lastTranscriptRef.current = finalTranscript;
          setTranscription((prev) => prev + finalTranscript + ' ');
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast.error(`Error: ${event.error}`);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      console.error('Speech recognition error:', error);
      toast.error('Failed to start speech recognition');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      toast.success('Stopped recording');
    }
  };

  const copyToClipboard = () => {
    if (!transcription) {
      toast.error('No text to copy');
      return;
    }

    navigator.clipboard.writeText(transcription)
      .then(() => toast.success('Copied to clipboard'))
      .catch(() => toast.error('Failed to copy'));
  };

  const clearTranscription = () => {
    setTranscription('');
    toast.success('Transcription cleared');
  };

  return (
    <ToolLayout title="Speech to Text">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Convert Speech to Text</CardTitle>
            <CardDescription>
              Click the microphone button and start speaking to convert your speech into text
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Language</Label>
                <Select 
                  value={selectedLanguage} 
                  onValueChange={setSelectedLanguage}
                  disabled={isRecording}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  variant={isRecording ? "destructive" : "default"}
                  disabled={!browserSupport}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="mr-2 h-4 w-4" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="mr-2 h-4 w-4" />
                      Start Recording
                    </>
                  )}
                </Button>
              </div>

              {!browserSupport && (
                <div className="p-3 border border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800 rounded text-sm">
                  Your browser doesn't support speech recognition. Please try Chrome, Edge, or Safari.
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Transcription</Label>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      disabled={!transcription}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearTranscription}
                      disabled={!transcription}
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Clear
                    </Button>
                  </div>
                </div>
                <Textarea
                  value={transcription}
                  onChange={(e) => setTranscription(e.target.value)}
                  placeholder="Your speech will appear here..."
                  className="h-48"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tips for Better Recognition</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Speak clearly and at a moderate pace</li>
              <li>Minimize background noise</li>
              <li>Use a good quality microphone if possible</li>
              <li>Keep a consistent distance from the microphone</li>
              <li>Select the appropriate language for better accuracy</li>
              <li>Give your browser permission to access the microphone when prompted</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default SpeechToText;
