
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { Image as LucideImageIcon, Upload, Download, Trash2, FileWarning, Lock, Unlock } from "lucide-react";

const ImageResizer = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState<string>("");
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [originalDimensions, setOriginalDimensions] = useState<{width: number, height: number} | null>(null);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState<boolean>(true);
  const [outputFormat, setOutputFormat] = useState<"png" | "jpeg" | "webp">("png");
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please select an image file",
        });
        return;
      }
      
      setSelectedImage(file);
      setError(null);
      
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Get original dimensions
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({
          width: img.width,
          height: img.height
        });
        setWidth(img.width);
        setHeight(img.height);
      };
      img.src = objectUrl;
      
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      setFilename(nameWithoutExt);
    }
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value);
    setWidth(newWidth);
    
    if (maintainAspectRatio && originalDimensions) {
      const ratio = originalDimensions.height / originalDimensions.width;
      setHeight(Math.round(newWidth * ratio));
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value);
    setHeight(newHeight);
    
    if (maintainAspectRatio && originalDimensions) {
      const ratio = originalDimensions.width / originalDimensions.height;
      setWidth(Math.round(newHeight * ratio));
    }
  };

  const resetDimensions = () => {
    if (originalDimensions) {
      setWidth(originalDimensions.width);
      setHeight(originalDimensions.height);
    }
  };

  const resizeImage = () => {
    if (!selectedImage) {
      setError("Please select an image to resize");
      toast({
        variant: "destructive",
        title: "No image selected",
        description: "Please select an image to resize",
      });
      return;
    }
    
    setIsResizing(true);
    setError(null);
    
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        throw new Error("Unable to get canvas context");
      }
      
      const img = document.createElement("img");
      
      img.onload = () => {
        // Set canvas dimensions to the specified sizes
        canvas.width = width;
        canvas.height = height;
        
        // If PNG or WebP, support transparency; if JPEG, fill with white background
        if (outputFormat === "jpeg") {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        // Draw the image with the new dimensions
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to the selected output format
        const resizedUrl = canvas.toDataURL(`image/${outputFormat}`, 0.9);
        setResizedUrl(resizedUrl);
        
        toast({
          title: "Resize successful",
          description: `Image has been resized to ${width}×${height}`,
        });
        
        setIsResizing(false);
      };
      
      img.onerror = () => {
        setError("Failed to load image");
        toast({
          variant: "destructive",
          title: "Resize failed",
          description: "Failed to load the image",
        });
        setIsResizing(false);
      };
      
      img.src = URL.createObjectURL(selectedImage);
    } catch (err) {
      console.error("Error resizing image:", err);
      setError("Failed to resize image");
      toast({
        variant: "destructive",
        title: "Resize failed",
        description: "An error occurred while resizing the image",
      });
      setIsResizing(false);
    }
  };

  const downloadImage = () => {
    if (!resizedUrl) return;
    
    const link = document.createElement("a");
    link.href = resizedUrl;
    link.download = `${filename || "resized"}.${outputFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download started",
      description: "Your resized image is being downloaded",
    });
  };

  const reset = () => {
    setSelectedImage(null);
    setResizedUrl(null);
    setPreviewUrl(null);
    setFilename("");
    setError(null);
    setOriginalDimensions(null);
    setWidth(800);
    setHeight(600);
    setMaintainAspectRatio(true);
    setOutputFormat("png");
    
    toast({
      title: "Reset complete",
      description: "All data has been cleared",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <header className="text-center mb-12">
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                <LucideImageIcon className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">Image Resizer</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Resize your images to exact dimensions while maintaining quality. Perfect for social media, websites, or print.
              </p>
            </header>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-xl border bg-card">
                <h2 className="text-xl font-semibold mb-4">Upload & Resize</h2>
                
                <div className="space-y-4">
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="image-upload">Select Image</Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                  </div>
                  
                  {previewUrl && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Preview:</p>
                      <div className="rounded-md overflow-hidden border bg-background/50 p-2">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="max-w-full h-auto max-h-[300px] mx-auto"
                        />
                      </div>
                      {originalDimensions && (
                        <p className="text-sm text-muted-foreground mt-2 text-center">
                          Original size: {originalDimensions.width} × {originalDimensions.height} pixels
                        </p>
                      )}
                    </div>
                  )}
                  
                  {selectedImage && (
                    <div className="mt-4 space-y-4">
                      <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="filename">Filename</Label>
                        <Input
                          id="filename"
                          value={filename}
                          onChange={(e) => setFilename(e.target.value)}
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2 py-2">
                        <Switch
                          id="aspect-ratio"
                          checked={maintainAspectRatio}
                          onCheckedChange={setMaintainAspectRatio}
                        />
                        <Label htmlFor="aspect-ratio" className="cursor-pointer">
                          <div className="flex items-center">
                            {maintainAspectRatio ? <Lock className="h-3.5 w-3.5 mr-1.5" /> : <Unlock className="h-3.5 w-3.5 mr-1.5" />}
                            Maintain aspect ratio
                          </div>
                        </Label>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="width">Width (px)</Label>
                          <Input
                            id="width"
                            type="number"
                            min="1"
                            max="10000"
                            value={width}
                            onChange={handleWidthChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="height">Height (px)</Label>
                          <Input
                            id="height"
                            type="number"
                            min="1"
                            max="10000"
                            value={height}
                            onChange={handleHeightChange}
                          />
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <Label className="mb-2 block">Output Format</Label>
                        <RadioGroup 
                          defaultValue="png" 
                          value={outputFormat}
                          onValueChange={(value) => setOutputFormat(value as "png" | "jpeg" | "webp")}
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="png" id="png" />
                            <Label htmlFor="png">PNG</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="jpeg" id="jpeg" />
                            <Label htmlFor="jpeg">JPEG</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="webp" id="webp" />
                            <Label htmlFor="webp">WebP</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button 
                          onClick={resizeImage} 
                          className="flex-1"
                          disabled={isResizing || !selectedImage}
                        >
                          {isResizing ? "Resizing..." : "Resize Image"}
                        </Button>
                        
                        <Button
                          variant="outline"
                          onClick={resetDimensions}
                          disabled={!originalDimensions}
                          className="flex-1"
                        >
                          Original Size
                        </Button>
                      </div>
                      
                      <Button
                        variant="outline"
                        onClick={reset}
                        className="w-full"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Reset All
                      </Button>
                    </div>
                  )}
                  
                  {error && (
                    <div className="bg-destructive/15 text-destructive rounded-md p-3 flex items-center text-sm mt-4">
                      <FileWarning className="h-4 w-4 mr-2" />
                      {error}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Output Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-xl border bg-card h-full">
                <h2 className="text-xl font-semibold mb-4">Resized Image</h2>
                
                {resizedUrl ? (
                  <div className="space-y-4">
                    <div className="rounded-md overflow-hidden border bg-background/50 p-2">
                      <img
                        src={resizedUrl}
                        alt="Resized Image"
                        className="max-w-full h-auto max-h-[300px] mx-auto"
                      />
                    </div>
                    
                    <p className="text-sm text-center text-muted-foreground">
                      New size: {width} × {height} pixels
                    </p>
                    
                    <Separator />
                    
                    <Button 
                      onClick={downloadImage}
                      className="w-full"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Resized Image
                    </Button>
                    
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                ) : (
                  <div className="border rounded-md border-dashed h-[300px] flex items-center justify-center">
                    <div className="text-center text-muted-foreground p-4">
                      <Upload className="h-8 w-8 mx-auto mb-2" />
                      <p>No resized image yet</p>
                      <p className="text-sm mt-1">
                        Upload an image, set dimensions, and click "Resize Image" to see the result here
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ImageResizer;
