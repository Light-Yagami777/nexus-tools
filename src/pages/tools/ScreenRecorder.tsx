
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import ToolLayout from "@/components/ToolLayout";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const ScreenRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const completeBlob = new Blob(chunks, { type: "video/webm" });
        setRecordedChunks(chunks);
        const url = URL.createObjectURL(completeBlob);
        setRecordingUrl(url);
        toast({
          title: "Recording completed",
          description: "Your screen recording has been created successfully.",
        });
      };

      recorder.start();
      setRecording(true);
      toast({
        title: "Recording started",
        description: "Your screen is now being recorded.",
      });
    } catch (error) {
      console.error("Error starting screen recording:", error);
      toast({
        variant: "destructive",
        title: "Recording failed",
        description: "Could not start screen recording. Please try again.",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);

      // Stop all tracks in the stream
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    }
  };

  const downloadRecording = () => {
    if (recordedChunks.length === 0 || !recordingUrl) return;

    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";
    a.href = url;
    a.download = `screen-recording-${new Date().toISOString()}.webm`;
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <ToolLayout title="Screen Recorder">
      <Card className="p-6 mb-8">
        <div className="mb-6">
          <p className="text-lg mb-4">
            Record your screen directly in your browser. You can choose to record your entire screen, a specific application window, or a browser tab.
          </p>
          <div className="flex gap-4 mb-6">
            {!recording ? (
              <Button onClick={startRecording}>Start Recording</Button>
            ) : (
              <Button variant="destructive" onClick={stopRecording}>
                Stop Recording
              </Button>
            )}
            {recordingUrl && (
              <Button variant="secondary" onClick={downloadRecording}>
                Download Recording
              </Button>
            )}
          </div>
        </div>

        <div className="video-container w-full">
          {recordingUrl ? (
            <video
              ref={videoRef}
              src={recordingUrl}
              controls
              className="w-full max-h-[500px] bg-black rounded-lg"
            />
          ) : (
            <div className="relative flex items-center justify-center w-full h-[300px] bg-muted rounded-lg border">
              <p className="text-muted-foreground">
                {recording
                  ? "Recording in progress..."
                  : "Click 'Start Recording' to begin"}
              </p>
              {recording && (
                <div className="absolute top-4 right-4 flex items-center">
                  <div className="animate-pulse w-3 h-3 rounded-full bg-red-500 mr-2" />
                  <span className="text-sm text-red-500">REC</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Tips for screen recording:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Grant permission when prompted to share your screen</li>
            <li>Select the tab, window, or entire screen you want to record</li>
            <li>You can also choose to include audio from your microphone</li>
            <li>Click 'Stop Recording' when you're done</li>
            <li>Download your recording to save it to your device</li>
          </ul>
        </div>
      </Card>
    </ToolLayout>
  );
};

export default ScreenRecorder;
