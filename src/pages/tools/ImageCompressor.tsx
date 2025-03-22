
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { Image as LucideImageIcon, Upload, Download, Trash2, FileWarning, Info } from "lucide-react";

const ImageCompressor = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState<string>("");
  const [quality, setQuality] = useState<number>(80);
  const [outputFormat, setOutputFormat] = useState<"original" | "jpeg" | "png" | "webp">("original");
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [originalDimensions, setOriginalDimensions] = useState<{width: number, height: number} | null>(null);
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

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
      setOriginalSize(file.size);
      
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Get original dimensions and set default output format
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({
          width: img.width,
          height: img.height
        });
      };
      img.src = objectUrl;
      
      // Set output format based on file type
      if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
        setOutputFormat('jpeg');
      } else if (file.type === 'image/png') {
        setOutputFormat('png');
      } else if (file.type === 'image/webp') {
        setOutputFormat('webp');
      } else {
        setOutputFormat('original');
      }
      
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      setFilename(nameWithoutExt);
    }
  };

  const compressImage = () => {
    if (!selectedImage) {
      setError("Please select an image to compress");
      toast({
        variant: "destructive",
        title: "No image selected",
        description: "Please select an image to compress",
      });
      return;
    }
    
    setIsCompressing(true);
    setError(null);
    
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        throw new Error("Unable to get canvas context");
      }
      
      const img = document.createElement("img");
      
      img.onload = () => {
        // Set canvas dimensions
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the image
        ctx.drawImage(img, 0, 0);
        
        // Determine output format
        let format = 'image/jpeg';
        let ext = 'jpg';
        
        if (outputFormat === 'original') {
          // Use the original format based on the file type
          if (selectedImage.type === 'image/png') {
            format = 'image/png';
            ext = 'png';
          } else if (selectedImage.type === 'image/webp') {
            format = 'image/webp';
            ext = 'webp';
          } else {
            format = 'image/jpeg';
            ext = 'jpg';
          }
        } else {
          format = `image/${outputFormat}`;
          ext = outputFormat;
        }
        
        // If output format is PNG or WebP, we don't need a background
        // If JPEG, ensure white background (no transparency)
        if (format === 'image/jpeg') {
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');
          tempCanvas.width = canvas.width;
          tempCanvas.height = canvas.height;
          
          if (tempCtx) {
            tempCtx.fillStyle = '#FFFFFF';
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            tempCtx.drawImage(canvas, 0, 0);
            canvas.width = tempCanvas.width;
            canvas.height = tempCanvas.height;
            ctx.drawImage(tempCanvas, 0, 0);
          }
        }
        
        // Convert to the selected output format with the chosen quality
        const compressedDataUrl = canvas.toDataURL(format, quality / 100);
        setCompressedUrl(compressedDataUrl);
        
        // Calculate compressed size
        fetch(compressedDataUrl)
          .then(res => res.blob())
          .then(blob => {
            setCompressedSize(blob.size);
          });
        
        toast({
          title: "Compression successful",
          description: "Image has been compressed",
        });
        
        setIsCompressing(false);
      };
      
      img.onerror = () => {
        setError("Failed to load image");
        toast({
          variant: "destructive",
          title: "Compression failed",
          description: "Failed to load the image",
        });
        setIsCompressing(false);
      };
      
      img.src = URL.createObjectURL(selectedImage);
    } catch (err) {
      console.error("Error compressing image:", err);
      setError("Failed to compress image");
      toast({
        variant: "destructive",
        title: "Compression failed",
        description: "An error occurred while compressing the image",
      });
      setIsCompressing(false);
    }
  };

  const downloadImage = () => {
    if (!compressedUrl) return;
    
    // Determine file extension based on output format
    let ext = 'jpg';
    if (outputFormat === 'png') ext = 'png';
    else if (outputFormat === 'webp') ext = 'webp';
    else if (outputFormat === 'original') {
      if (selectedImage?.type === 'image/png') ext = 'png';
      else if (selectedImage?.type === 'image/webp') ext = 'webp';
    }
    
    const link = document.createElement("a");
    link.href = compressedUrl;
    link.download = `${filename || "compressed"}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download started",
      description: "Your compressed image is being downloaded",
    });
  };

  const reset = () => {
    setSelectedImage(null);
    setCompressedUrl(null);
    setPreviewUrl(null);
    setFilename("");
    setError(null);
    setQuality(80);
    setOutputFormat("original");
    setOriginalSize(0);
    setCompressedSize(0);
    setOriginalDimensions(null);
    
    toast({
      title: "Reset complete",
      description: "All data has been cleared",
    });
  };

  const getCompressionRatio = () => {
    if (originalSize === 0 || compressedSize === 0) return 0;
    return Math.round((1 - (compressedSize / originalSize)) * 100);
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
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">Image Compressor</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Reduce image file size without losing quality. Perfect for websites, emails, and saving storage space.
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
                <h2 className="text-xl font-semibold mb-4">Upload & Compress</h2>
                
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
                          Original size: {originalDimensions.width} × {originalDimensions.height} pixels, {formatBytes(originalSize)}
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
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="quality">Quality: {quality}%</Label>
                        </div>
                        <Slider
                          id="quality"
                          min={1}
                          max={100}
                          step={1}
                          value={[quality]}
                          onValueChange={(value) => setQuality(value[0])}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Small file size</span>
                          <span>High quality</span>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <Label className="mb-2 block">Output Format</Label>
                        <RadioGroup 
                          value={outputFormat}
                          onValueChange={(value) => setOutputFormat(value as "original" | "jpeg" | "png" | "webp")}
                          className="flex flex-wrap gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="original" id="original" />
                            <Label htmlFor="original">Original</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="jpeg" id="jpeg" />
                            <Label htmlFor="jpeg">JPEG</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="png" id="png" />
                            <Label htmlFor="png">PNG</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="webp" id="webp" />
                            <Label htmlFor="webp">WebP</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <Button 
                        onClick={compressImage} 
                        className="w-full"
                        disabled={isCompressing || !selectedImage}
                      >
                        {isCompressing ? "Compressing..." : "Compress Image"}
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={reset}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Reset
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
                <h2 className="text-xl font-semibold mb-4">Compressed Image</h2>
                
                {compressedUrl ? (
                  <div className="space-y-4">
                    <div className="rounded-md overflow-hidden border bg-background/50 p-2">
                      <img
                        src={compressedUrl}
                        alt="Compressed"
                        className="max-w-full h-auto max-h-[300px] mx-auto"
                      />
                    </div>
                    
                    <div className="bg-muted/50 rounded-md p-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Original:</span>
                        <span className="text-sm font-medium">{formatBytes(originalSize)}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Compressed:</span>
                        <span className="text-sm font-medium">{formatBytes(compressedSize)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Reduction:</span>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          {getCompressionRatio()}%
                        </span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <Button 
                      onClick={downloadImage}
                      className="w-full"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Compressed Image
                    </Button>
                    
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                ) : (
                  <div className="border rounded-md border-dashed h-[300px] flex items-center justify-center">
                    <div className="text-center text-muted-foreground p-4">
                      <Upload className="h-8 w-8 mx-auto mb-2" />
                      <p>No compressed image yet</p>
                      <p className="text-sm mt-1">
                        Upload an image and click "Compress Image" to see the result here
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4 rounded-xl border bg-muted/30">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium mb-1">How does compression work?</p>
                    <p className="text-muted-foreground">
                      This tool reduces image file size by optimizing the image data and applying compression algorithms.
                      Lower quality settings result in smaller files but may introduce some visual artifacts.
                      Different output formats have different compression characteristics:
                    </p>
                    <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1 ml-1">
                      <li>JPEG: Best for photos, doesn't support transparency</li>
                      <li>PNG: Better for graphics with transparency, larger files</li>
                      <li>WebP: Modern format with good compression and quality</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ImageCompressor;
