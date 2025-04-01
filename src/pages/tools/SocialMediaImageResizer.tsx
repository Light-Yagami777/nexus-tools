
import React, { useState, useRef } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { ImageIcon, Upload, Download, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { motion } from 'framer-motion';

// Define platform-specific sizes
const PLATFORM_SIZES = {
  instagram: [
    { name: "Post (Square)", width: 1080, height: 1080 },
    { name: "Post (Landscape)", width: 1080, height: 566 },
    { name: "Post (Portrait)", width: 1080, height: 1350 },
    { name: "Story", width: 1080, height: 1920 },
    { name: "Profile Picture", width: 320, height: 320 }
  ],
  facebook: [
    { name: "Post (Square)", width: 1200, height: 1200 },
    { name: "Post (Landscape)", width: 1200, height: 630 },
    { name: "Cover Photo", width: 851, height: 315 },
    { name: "Profile Picture", width: 170, height: 170 }
  ],
  twitter: [
    { name: "Post", width: 1200, height: 675 },
    { name: "Header", width: 1500, height: 500 },
    { name: "Profile Picture", width: 400, height: 400 }
  ],
  linkedin: [
    { name: "Post", width: 1200, height: 627 },
    { name: "Cover Photo", width: 1584, height: 396 },
    { name: "Profile Picture", width: 400, height: 400 }
  ]
};

type Platform = 'instagram' | 'facebook' | 'twitter' | 'linkedin';

const SocialMediaImageResizer = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('instagram');
  const [selectedSize, setSelectedSize] = useState<string>(PLATFORM_SIZES.instagram[0].name);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.match('image.*')) {
      toast.error('Please select an image file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img.src);
        // Automatically resize when image is loaded
        resizeImage(img);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const getCurrentSizeConfig = () => {
    const sizeConfig = PLATFORM_SIZES[selectedPlatform].find(size => size.name === selectedSize);
    return sizeConfig || PLATFORM_SIZES[selectedPlatform][0];
  };

  const resizeImage = (imgElement: HTMLImageElement | null = null) => {
    if (!originalImage && !imgElement) return;
    
    setIsResizing(true);
    
    try {
      const img = imgElement || new Image();
      if (!imgElement) {
        img.src = originalImage as string;
      }
      
      const sizeConfig = getCurrentSizeConfig();
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Set canvas dimensions
      canvas.width = sizeConfig.width;
      canvas.height = sizeConfig.height;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Calculate dimensions to maintain aspect ratio
      const imgRatio = img.width / img.height;
      const canvasRatio = canvas.width / canvas.height;
      
      let drawWidth, drawHeight, x, y;
      
      if (imgRatio > canvasRatio) {
        // Image is wider than canvas ratio
        drawHeight = canvas.height;
        drawWidth = drawHeight * imgRatio;
        x = (canvas.width - drawWidth) / 2;
        y = 0;
      } else {
        // Image is taller than canvas ratio
        drawWidth = canvas.width;
        drawHeight = drawWidth / imgRatio;
        x = 0;
        y = (canvas.height - drawHeight) / 2;
      }
      
      // Draw image centered
      ctx.drawImage(img, x, y, drawWidth, drawHeight);
      
      // Get data URL
      const dataUrl = canvas.toDataURL('image/png');
      setCroppedImage(dataUrl);
      
    } catch (error) {
      toast.error('Error resizing image');
      console.error(error);
    } finally {
      setIsResizing(false);
    }
  };

  const downloadImage = () => {
    if (!croppedImage) return;
    
    const link = document.createElement('a');
    link.href = croppedImage;
    link.download = `${selectedPlatform}-${selectedSize.replace(/\s+/g, '-').toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Image downloaded successfully');
  };

  const handlePlatformChange = (value: string) => {
    setSelectedPlatform(value as Platform);
    setSelectedSize(PLATFORM_SIZES[value as Platform][0].name);
    if (originalImage) {
      // Wait for state update
      setTimeout(() => {
        const img = new Image();
        img.onload = () => resizeImage(img);
        img.src = originalImage;
      }, 0);
    }
  };

  const handleSizeChange = (value: string) => {
    setSelectedSize(value);
    if (originalImage) {
      // Wait for state update
      setTimeout(() => {
        const img = new Image();
        img.onload = () => resizeImage(img);
        img.src = originalImage;
      }, 0);
    }
  };

  const resetImage = () => {
    setOriginalImage(null);
    setCroppedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <ToolLayout
      title="Social Media Image Resizer"
      description="Resize images for different social media platforms"
      icon={<ImageIcon className="h-6 w-6" />}
      extraPadding={true}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Social Media Image Resizer</h1>
          <p className="text-muted-foreground">
            Quickly resize your images for different social platforms
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-5">
          <Card className="md:col-span-2 p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle>Settings</CardTitle>
              <CardDescription>
                Select platform and upload your image
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
              <div>
                <Label htmlFor="platform">Platform</Label>
                <Select defaultValue={selectedPlatform} onValueChange={handlePlatformChange}>
                  <SelectTrigger id="platform" className="mt-2">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="size">Image Size</Label>
                <Select defaultValue={selectedSize} onValueChange={handleSizeChange}>
                  <SelectTrigger id="size" className="mt-2">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORM_SIZES[selectedPlatform].map((size) => (
                      <SelectItem key={size.name} value={size.name}>
                        {size.name} ({size.width}×{size.height})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-2">
                <div className="relative">
                  <Button variant="outline" className="w-full relative">
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </Button>
                </div>
              </div>
              
              {originalImage && (
                <div className="space-y-2">
                  <Button 
                    variant="secondary" 
                    onClick={() => resizeImage()} 
                    disabled={isResizing}
                    className="w-full"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Resize
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={resetImage}
                    className="w-full"
                  >
                    Clear
                  </Button>
                </div>
              )}
              
              {croppedImage && (
                <Button 
                  onClick={downloadImage}
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              )}
            </CardContent>
          </Card>
          
          <Card className="md:col-span-3 p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                {originalImage 
                  ? `${getCurrentSizeConfig().width}×${getCurrentSizeConfig().height} pixels`
                  : 'Upload an image to see the preview'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="resized" className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="resized">Resized</TabsTrigger>
                  <TabsTrigger value="original">Original</TabsTrigger>
                </TabsList>
                
                <TabsContent value="resized" className="mt-0">
                  <div className="bg-muted/30 rounded-md overflow-hidden flex items-center justify-center">
                    {croppedImage ? (
                      <div 
                        className="relative border border-border rounded-md overflow-hidden shadow-sm"
                        style={{ maxWidth: '100%', maxHeight: '400px' }}
                      >
                        <img 
                          src={croppedImage} 
                          alt="Resized" 
                          className="max-w-full max-h-[400px] object-contain"
                        />
                      </div>
                    ) : (
                      <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground">
                        {isResizing ? 'Resizing...' : 'Resized image will appear here'}
                      </div>
                    )}
                  </div>
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                </TabsContent>
                
                <TabsContent value="original" className="mt-0">
                  <div className="bg-muted/30 rounded-md overflow-hidden flex items-center justify-center">
                    {originalImage ? (
                      <div 
                        className="relative border border-border rounded-md overflow-hidden shadow-sm"
                        style={{ maxWidth: '100%', maxHeight: '400px' }}
                      >
                        <img 
                          src={originalImage} 
                          alt="Original" 
                          className="max-w-full max-h-[400px] object-contain"
                        />
                      </div>
                    ) : (
                      <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground">
                        Upload an image to see the original
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <Card className="p-6 mt-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle>Image Size Guide</CardTitle>
            <CardDescription>
              Recommended dimensions for popular social platforms
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Object.entries(PLATFORM_SIZES).map(([platform, sizes]) => (
                <div key={platform} className="space-y-2">
                  <h3 className="font-medium capitalize">{platform}</h3>
                  <ul className="space-y-1 text-sm">
                    {sizes.map((size) => (
                      <li key={size.name} className="flex justify-between">
                        <span>{size.name}</span>
                        <span className="text-muted-foreground">{size.width}×{size.height}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </ToolLayout>
  );
};

export default SocialMediaImageResizer;
