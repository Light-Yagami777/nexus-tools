
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import ToolLayout from "@/components/ToolLayout";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Video, MonitorSmartphone, StopCircle, Download } from "lucide-react";

const ScreenRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startRecording = async () => {
    try {
      // Reset state if there was a previous recording
      setRecordedChunks([]);
      setRecordingUrl(null);
      
      const displayMediaOptions = {
        video: {
          cursor: "always",
          displaySurface: "monitor"
        },
        audio: true
      };
      
      // @ts-ignore - TypeScript doesn't recognize some newer options
      const stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true; // Avoid feedback loop
        videoRef.current.play().catch(e => console.error("Error playing video:", e));
      }

      const recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9" });
      setMediaRecorder(recorder);

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
          setRecordedChunks(prev => [...prev, e.data]);
        }
      };

      recorder.onstop = () => {
        if (chunks.length === 0) return;
        
        const completeBlob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(completeBlob);
        setRecordingUrl(url);
        
        if (videoRef.current) {
          videoRef.current.srcObject = null;
          videoRef.current.src = url;
          videoRef.current.muted = false;
        }
        
        toast.success("Recording completed successfully");
      };

      // Set a data available interval (e.g., every 1 second)
      recorder.start(1000);
      setRecording(true);
      toast.success("Recording started", {
        description: "Share your screen when prompted"
      });
    } catch (error) {
      console.error("Error starting screen recording:", error);
      toast.error("Failed to start recording", { 
        description: "Please make sure you grant screen sharing permissions" 
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
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
    if (recordedChunks.length === 0 || !recordingUrl) {
      toast.error("No recording available to download");
      return;
    }

    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";
    a.href = url;
    a.download = `screen-recording-${new Date().toISOString()}.webm`;
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
    
    toast.success("Download started");
  };

  return (
    <ToolLayout title="Screen Recorder" icon={<Video size={24} />}>
      <Card className="p-6 mb-8">
        <div className="mb-6">
          <p className="text-lg mb-4">
            Record your screen directly in your browser. You can choose to record your entire screen, a specific application window, or a browser tab.
          </p>
          <div className="flex gap-4 mb-6">
            {!recording ? (
              <Button onClick={startRecording} className="flex items-center gap-2">
                <MonitorSmartphone size={18} />
                Start Recording
              </Button>
            ) : (
              <Button variant="destructive" onClick={stopRecording} className="flex items-center gap-2">
                <StopCircle size={18} />
                Stop Recording
              </Button>
            )}
            {recordingUrl && (
              <Button variant="secondary" onClick={downloadRecording} className="flex items-center gap-2">
                <Download size={18} />
                Download Recording
              </Button>
            )}
          </div>
        </div>

        <div className="video-container w-full">
          {recordingUrl || recording ? (
            <video
              ref={videoRef}
              controls={!!recordingUrl}
              className="w-full max-h-[500px] bg-black rounded-lg"
            />
          ) : (
            <div className="relative flex items-center justify-center w-full h-[300px] bg-muted rounded-lg border">
              <p className="text-muted-foreground">
                Click 'Start Recording' to begin
              </p>
            </div>
          )}
          {recording && !recordingUrl && (
            <div className="absolute top-4 right-4 flex items-center">
              <div className="animate-pulse w-3 h-3 rounded-full bg-red-500 mr-2" />
              <span className="text-sm text-red-500">REC</span>
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
