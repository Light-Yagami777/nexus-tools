
import React, { useState, useRef } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Film, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, ImageIcon } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

const GifMaker = () => {
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [fps, setFps] = useState(10);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      
      if (validFiles.length === 0) {
        toast.error("Please upload valid image files (PNG or JPEG).");
        return;
      }
      
      setImages(prevImages => [...prevImages, ...validFiles]);
      
      // Create preview URLs
      const newUrls = validFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prevUrls => [...prevUrls, ...newUrls]);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      toast.success(`Added ${validFiles.length} image${validFiles.length !== 1 ? 's' : ''}`);
    }
  };

  const handleClearImages = () => {
    // Revoke all object URLs to prevent memory leaks
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setImages([]);
    setPreviewUrls([]);
    setGifUrl(null);
    toast.info("All images cleared");
  };

  const handleCreateGif = () => {
    if (images.length < 2) {
      toast.error("Please add at least 2 images to create a GIF");
      return;
    }
    
    setLoading(true);
    
    // Simulate GIF creation (in a real app, you would use a GIF library)
    setTimeout(() => {
      toast.success("GIF created successfully! (This is a simulation - in a real app, the images would be converted to an actual GIF)");
      setLoading(false);
      // In a real implementation, you would generate and set the actual GIF URL here
      setGifUrl(previewUrls[0]); // Placeholder: just showing the first image
    }, 2000);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    
    setImages(prevImages => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });
    
    setPreviewUrls(prevUrls => {
      const newUrls = [...prevUrls];
      newUrls.splice(index, 1);
      return newUrls;
    });
    
    toast.info("Image removed");
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      const validFiles = droppedFiles.filter(file => 
        file.type === 'image/png' || 
        file.type === 'image/jpeg' || 
        file.type === 'image/jpg'
      );
      
      if (validFiles.length !== droppedFiles.length) {
        toast.warning("Some files were ignored. Only PNG and JPEG images are supported.");
      }
      
      if (validFiles.length === 0) {
        toast.error("Please drop valid image files (PNG or JPEG).");
        return;
      }
      
      setImages(prevImages => [...prevImages, ...validFiles]);
      
      // Create preview URLs
      const newUrls = validFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prevUrls => [...prevUrls, ...newUrls]);
      
      toast.success(`Added ${validFiles.length} image${validFiles.length !== 1 ? 's' : ''}`);
    }
  };

  return (
    <ToolLayout 
      title="GIF Maker" 
      description="Create animated GIFs from images"
      icon={<Film className="h-6 w-6" />}
      extraPadding={true}
    >
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <div className="flex items-center mb-2">
              <h2 className="text-xl font-semibold">GIF Maker</h2>
              <div className="ml-2 text-muted-foreground">
                <Info className="h-4 w-4" />
              </div>
            </div>
            <p className="text-muted-foreground mb-4">
              Upload multiple images to create an animated GIF. You can adjust the animation speed and preview the result.
            </p>
            
            <div 
              className="border-2 border-dashed rounded-md p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileChange}
                multiple
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center gap-2">
                <Upload className="h-10 w-10 text-muted-foreground" />
                <h3 className="font-medium">Click or drop images here</h3>
                <p className="text-sm text-muted-foreground">
                  Supports PNG and JPEG images
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <Label className="mb-2 block">Animation Speed: {fps} FPS</Label>
              <div className="flex items-center gap-4">
                <span className="text-sm">Slow</span>
                <Slider
                  value={[fps]}
                  min={1}
                  max={30}
                  step={1}
                  onValueChange={(value) => setFps(value[0])}
                  className="flex-1"
                />
                <span className="text-sm">Fast</span>
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
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="h-24 w-full object-cover rounded-md border"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
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
              <h3 className="font-medium">Generated GIF Preview</h3>
              <div className="flex justify-center">
                <div className="relative border rounded-md p-2">
                  <img src={gifUrl} alt="Generated GIF" className="max-h-60 object-contain" />
                  <div className="absolute top-0 right-0 bg-background/70 px-2 py-1 text-xs">
                    Preview only (not a real GIF)
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <Button variant="outline" className="w-full sm:w-auto">
                  Download GIF (Simulated)
                </Button>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Note: This is a simulation. In a complete implementation, this would create and download a real GIF.
              </p>
            </div>
          )}
        </div>
      </Card>
    </ToolLayout>
  );
};

export default GifMaker;
