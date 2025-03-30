
import React, { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Image, Upload, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const SocialMediaImageResizer = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [platform, setPlatform] = useState<string>("facebook");
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const platformSizes = {
    facebook: { width: 1200, height: 630, label: "Facebook Post (1200×630)" },
    instagram: { width: 1080, height: 1080, label: "Instagram Post (1080×1080)" },
    twitter: { width: 1200, height: 675, label: "Twitter Post (1200×675)" },
    linkedin: { width: 1200, height: 627, label: "LinkedIn Post (1200×627)" },
    pinterest: { width: 1000, height: 1500, label: "Pinterest Pin (1000×1500)" },
    youtube: { width: 1280, height: 720, label: "YouTube Thumbnail (1280×720)" },
    facebook_profile: { width: 170, height: 170, label: "Facebook Profile (170×170)" },
    twitter_profile: { width: 400, height: 400, label: "Twitter Profile (400×400)" },
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setOutputUrl(null);
    }
  };

  const handleResize = async () => {
    if (!selectedFile || !platform) return;
    
    setIsProcessing(true);
    
    try {
      const { width, height } = platformSizes[platform as keyof typeof platformSizes];
      
      // Create a new image from the file
      const img = new Image();
      img.src = URL.createObjectURL(selectedFile);
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      
      // Create a canvas with the target dimensions
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Draw image to canvas with correct sizing
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        
        // Calculate dimensions to maintain aspect ratio
        const scale = Math.max(width / img.width, height / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const x = (width - scaledWidth) / 2;
        const y = (height - scaledHeight) / 2;
        
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
        
        // Get the resized image as URL
        const resizedUrl = canvas.toDataURL('image/jpeg', 0.9);
        setOutputUrl(resizedUrl);
        toast.success('Image resized successfully!');
      }
    } catch (error) {
      toast.error('Failed to resize image');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!outputUrl) return;
    
    const link = document.createElement('a');
    link.href = outputUrl;
    link.download = `${platform}_${selectedFile?.name || 'image.jpg'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Image downloaded');
  };

  return (
    <ToolLayout 
      title="Social Media Image Resizer" 
      description="Resize images for different social media platforms"
      icon={<Image className="h-6 w-6" />}
      extraPadding={true}
    >
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upload Image</CardTitle>
          <CardDescription>Select an image to resize for social media</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4">
              <Label htmlFor="image-input">Select Image</Label>
              <input
                id="image-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button 
                variant="outline" 
                onClick={() => document.getElementById('image-input')?.click()}
                className="h-32 border-dashed border-2 flex flex-col items-center justify-center gap-2"
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {selectedFile ? selectedFile.name : 'Click to select an image'}
                </span>
              </Button>
            </div>

            <div className="grid gap-4">
              <Label htmlFor="platform">Select Platform</Label>
              <Select
                value={platform}
                onValueChange={setPlatform}
              >
                <SelectTrigger id="platform">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(platformSizes).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleResize} 
              disabled={!selectedFile || isProcessing}
              className="w-full"
            >
              {isProcessing ? 'Processing...' : 'Resize Image'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {previewUrl && (
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Original Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-[300px] w-full border rounded-md overflow-hidden">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="object-contain h-full w-full"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Resized Image
                {outputUrl && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleDownload}
                    className="ml-2"
                  >
                    <Check className="h-4 w-4 mr-1" /> Download
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-[300px] w-full border rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                {outputUrl ? (
                  <img 
                    src={outputUrl} 
                    alt="Resized" 
                    className="object-contain h-full w-full"
                  />
                ) : (
                  <p className="text-muted-foreground text-sm">Click "Resize Image" to see the result</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>About Image Resizing for Social Media</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p className="mb-4">
            Using correctly sized images for social media platforms is crucial for making your content look professional and engaging. 
            Each platform has different recommended dimensions for optimal display across various devices.
          </p>
          <p>
            This tool helps you quickly resize your images to the recommended dimensions for each platform, 
            ensuring your visuals look great when shared on social media.
          </p>
        </CardContent>
      </Card>
    </ToolLayout>
  );
};

export default SocialMediaImageResizer;
