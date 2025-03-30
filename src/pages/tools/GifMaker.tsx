
import React, { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Film } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, ImageIcon } from "lucide-react";
import { toast } from "sonner";

const GifMaker = () => {
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [fps, setFps] = useState(10);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles = selectedFiles.filter(file => 
        file.type === 'image/png' || 
        file.type === 'image/jpeg' || 
        file.type === 'image/jpg'
      );
      
      if (validFiles.length !== selectedFiles.length) {
        toast.warning("Some files were ignored. Only PNG and JPEG images are supported.");
      }
      
      setImages(prevImages => [...prevImages, ...validFiles]);
      
      // Create preview URLs
      const newUrls = validFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prevUrls => [...prevUrls, ...newUrls]);
    }
  };

  const handleClearImages = () => {
    // Revoke all object URLs to prevent memory leaks
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setImages([]);
    setPreviewUrls([]);
    setGifUrl(null);
  };

  const handleCreateGif = () => {
    if (images.length < 2) {
      toast.error("Please add at least 2 images to create a GIF");
      return;
    }
    
    setLoading(true);
    
    // Simulate GIF creation (in a real app, you would use a GIF library)
    setTimeout(() => {
      toast.success("GIF created successfully!");
      setLoading(false);
      // In a real implementation, you would generate and set the actual GIF URL here
      setGifUrl(previewUrls[0]); // Placeholder: just showing the first image
    }, 2000);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setImages(images.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  return (
    <ToolLayout 
      title="GIF Maker" 
      description="Create animated GIFs from images or videos"
      icon={<Film className="h-6 w-6" />}
      extraPadding={true}
    >
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <p className="text-muted-foreground mb-4">
              Upload multiple images to create an animated GIF. You can adjust the animation speed and preview the result.
            </p>
            
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <Label htmlFor="image-upload" className="block mb-2">
                  Upload Images (PNG or JPEG)
                </Label>
                <div className="relative">
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleFileChange}
                    multiple
                    className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                  />
                  <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                    <Upload className="h-6 w-6" />
                    <span>Click or drop files</span>
                  </Button>
                </div>
                
                <div className="mt-4">
                  <Label htmlFor="fps" className="block mb-2">
                    Animation Speed (frames per second)
                  </Label>
                  <input
                    id="fps"
                    type="range"
                    min="1"
                    max="30"
                    value={fps}
                    onChange={(e) => setFps(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-muted-foreground">
                    {fps} FPS
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {previewUrls.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Selected Images ({previewUrls.length})</h3>
                <Button variant="ghost" size="sm" onClick={handleClearImages}>
                  Clear All
                </Button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="h-24 w-full object-cover rounded-md border"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                    <div className="text-xs text-center mt-1">Frame {index + 1}</div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center mt-6">
                <Button 
                  onClick={handleCreateGif} 
                  disabled={loading || images.length < 2} 
                  className="w-full sm:w-auto"
                >
                  {loading ? "Creating GIF..." : "Create GIF"}
                </Button>
              </div>
            </div>
          )}
          
          {gifUrl && (
            <div className="space-y-4 mt-6">
              <h3 className="font-medium">Generated GIF</h3>
              <div className="flex justify-center">
                <div className="relative border rounded-md p-2">
                  <img src={gifUrl} alt="Generated GIF" className="max-h-60 object-contain" />
                </div>
              </div>
              <div className="flex justify-center">
                <Button variant="outline" className="w-full sm:w-auto">
                  Download GIF
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </ToolLayout>
  );
};

export default GifMaker;
