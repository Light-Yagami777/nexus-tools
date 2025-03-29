
import React, { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Youtube, Download, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const YouTubeThumbnailDownloader: React.FC = () => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [resolution, setResolution] = useState('maxresdefault');
  const [error, setError] = useState('');
  const { toast } = useToast();

  const extractVideoId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : false;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYoutubeUrl(e.target.value);
    setError('');
    setVideoId('');
  };

  const handleSubmit = () => {
    if (!youtubeUrl) {
      setError('Please enter a YouTube URL');
      return;
    }

    const id = extractVideoId(youtubeUrl);
    if (!id) {
      setError('Invalid YouTube URL. Please enter a valid YouTube video URL');
      return;
    }

    setVideoId(id);
    setError('');
    
    toast({
      title: "Thumbnail extracted",
      description: "Choose a resolution and download the thumbnail"
    });
  };

  const handleDownload = () => {
    if (!videoId) return;
    
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/${resolution}.jpg`;
    const link = document.createElement('a');
    link.href = thumbnailUrl;
    link.download = `youtube-thumbnail-${videoId}-${resolution}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download started",
      description: "Your thumbnail is being downloaded"
    });
  };

  return (
    <ToolLayout title="YouTube Thumbnail Downloader">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Youtube className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">YouTube Thumbnail Downloader</h2>
        </div>
        
        <p className="text-muted-foreground mb-6">
          Download thumbnails from YouTube videos in different resolutions.
        </p>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="youtube-url">YouTube Video URL</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                id="youtube-url"
                value={youtubeUrl}
                onChange={handleInputChange}
                placeholder="https://www.youtube.com/watch?v=..."
                className="flex-grow"
              />
              <Button onClick={handleSubmit} className="whitespace-nowrap">
                Get Thumbnail
              </Button>
            </div>
            {error && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                {error}
              </div>
            )}
          </div>
          
          {videoId && (
            <>
              <div className="space-y-3">
                <Label>Thumbnail Resolution</Label>
                <RadioGroup 
                  value={resolution} 
                  onValueChange={setResolution}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="maxresdefault" id="maxres" />
                    <Label htmlFor="maxres">Maximum Resolution</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sddefault" id="sd" />
                    <Label htmlFor="sd">Standard Definition</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hqdefault" id="hq" />
                    <Label htmlFor="hq">High Quality</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mqdefault" id="mq" />
                    <Label htmlFor="mq">Medium Quality</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium mb-2">Preview:</h3>
                <div className="aspect-video bg-muted rounded-md overflow-hidden">
                  <img 
                    src={`https://img.youtube.com/vi/${videoId}/${resolution}.jpg`} 
                    alt="YouTube Thumbnail Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://img.youtube.com/vi/default.jpg";
                    }}
                  />
                </div>
              </div>
              
              <Button onClick={handleDownload} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Thumbnail
              </Button>
            </>
          )}
        </div>
      </Card>
    </ToolLayout>
  );
};

export default YouTubeThumbnailDownloader;
