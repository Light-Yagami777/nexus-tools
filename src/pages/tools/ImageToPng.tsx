
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Image, Upload, Download, Trash2, FileWarning } from "lucide-react";

const ImageToPng = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [imageName, setImageName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    
    if (file) {
      // Reset previous conversion
      setConvertedUrl(null);
      
      // Check if file is an image
      if (!file.type.startsWith("image/")) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please select an image file.",
        });
        return;
      }
      
      // Create a preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setSelectedImage(file);
      setImageName(file.name.replace(/\.[^/.]+$/, "")); // Remove extension
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setConvertedUrl(null);
    setImageName("");
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const convertToPng = () => {
    if (!selectedImage || !previewUrl) return;
    
    setIsConverting(true);
    
    // Create an image element to use for the canvas
    const img = new Image();
    img.onload = () => {
      // Create a canvas to draw the image
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the image on the canvas
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        
        // Convert canvas to PNG data URL
        try {
          const pngUrl = canvas.toDataURL("image/png");
          setConvertedUrl(pngUrl);
          toast({
            title: "Conversion successful",
            description: "Your image has been converted to PNG format.",
          });
        } catch (error) {
          console.error("Error converting to PNG:", error);
          toast({
            variant: "destructive",
            title: "Conversion failed",
            description: "Failed to convert image to PNG. Please try again.",
          });
        }
      }
      
      setIsConverting(false);
    };
    
    img.onerror = () => {
      toast({
        variant: "destructive",
        title: "Image loading failed",
        description: "Failed to load the selected image. Please try another file.",
      });
      setIsConverting(false);
    };
    
    img.src = previewUrl;
  };

  const downloadImage = () => {
    if (!convertedUrl) return;
    
    // Use canvas for better quality
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `${imageName || "image"}.png`;
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
      
      toast({
        title: "Download started",
        description: "Your PNG image is being downloaded.",
      });
    }
  };

  const copyQRCode = async () => {
    if (!convertedUrl) return;
    
    try {
      if (canvasRef.current) {
        canvasRef.current.toBlob(async (blob) => {
          if (blob) {
            // Create a ClipboardItem
            const item = new ClipboardItem({ 'image/png': blob });
            await navigator.clipboard.write([item]);
            
            setIsCopied(true);
            toast({
              title: "Copied to clipboard",
              description: "QR code image copied to clipboard",
            });
            
            setTimeout(() => setIsCopied(false), 2000);
          }
        });
      }
    } catch (error) {
      console.error("Error copying QR code:", error);
      toast({
        title: "Copy failed",
        description: "Failed to copy QR code. Your browser may not support this feature.",
        variant: "destructive",
      });
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      // Check if file is an image
      if (!file.type.startsWith("image/")) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please select an image file.",
        });
        return;
      }
      
      // Create a preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setSelectedImage(file);
      setConvertedUrl(null);
      setImageName(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCopied, setIsCopied] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <header className="text-center mb-12">
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                <Image className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">Image to PNG Converter</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Convert images from any format to PNG. Preserve transparency and quality with our free online converter.
              </p>
            </header>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-card rounded-xl border p-6">
                <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
                
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center ${
                    previewUrl ? "border-primary/30" : "border-muted hover:border-muted-foreground/50"
                  } transition-colors duration-200`}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {previewUrl ? (
                    <div className="space-y-4">
                      <div className="relative max-h-52 overflow-hidden rounded-md mx-auto">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="object-contain mx-auto max-h-48"
                        />
                      </div>
                      <div className="text-sm truncate max-w-full">
                        {selectedImage?.name}
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={clearImage}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="mx-auto h-20 w-20 text-muted-foreground">
                        <Upload className="h-12 w-12 mx-auto mb-2" />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <Label
                          htmlFor="image-upload"
                          className="mx-auto text-center cursor-pointer text-base font-medium hover:text-primary transition-colors"
                        >
                          Click to upload
                        </Label>
                        <p>or drag and drop</p>
                        <p className="text-xs mt-1">
                          JPEG, JPG, WebP, GIF, BMP or any image format
                        </p>
                      </div>
                      <Input
                        id="image-upload"
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                  )}
                </div>
                
                {previewUrl && !convertedUrl && (
                  <div className="mt-4">
                    <Button
                      onClick={convertToPng}
                      className="w-full"
                      disabled={isConverting}
                    >
                      {isConverting ? "Converting..." : "Convert to PNG"}
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="bg-card rounded-xl border p-6">
                <h2 className="text-xl font-semibold mb-4">About PNG Format</h2>
                <p className="text-muted-foreground mb-4">
                  PNG (Portable Network Graphics) is a raster-graphics file format that supports lossless data compression. 
                  Unlike JPEG, PNG supports transparency and is ideal for images with sharp edges and solid colors.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="font-medium">Advantages:</p>
                    <ul className="list-disc pl-5 text-muted-foreground">
                      <li>Lossless compression</li>
                      <li>Transparency support</li>
                      <li>Better for text & graphics</li>
                    </ul>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">Best for:</p>
                    <ul className="list-disc pl-5 text-muted-foreground">
                      <li>Logos and icons</li>
                      <li>Screenshots</li>
                      <li>Images with transparency</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Result Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-card rounded-xl border p-6 flex flex-col h-full">
                <h2 className="text-xl font-semibold mb-4">Converted Image</h2>
                
                {convertedUrl ? (
                  <div className="space-y-6 flex-grow flex flex-col">
                    <div className="flex-grow relative border rounded-lg p-4 flex items-center justify-center bg-background/50">
                      <img
                        src={convertedUrl}
                        alt="Converted PNG"
                        className="max-h-64 max-w-full object-contain"
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="filename">Filename:</Label>
                        <div className="flex-grow">
                          <Input
                            id="filename"
                            value={imageName}
                            onChange={(e) => setImageName(e.target.value)}
                            className="flex-grow"
                          />
                        </div>
                        <span className="text-muted-foreground text-sm">.png</span>
                      </div>
                      
                      <Button onClick={downloadImage} className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Download PNG Image
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
                    <div className="bg-muted/30 rounded-full p-6 mb-4">
                      <FileWarning className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No Converted Image Yet</h3>
                    <p className="text-muted-foreground max-w-md">
                      {previewUrl 
                        ? "Press the Convert button to generate your PNG image" 
                        : "Upload an image to convert it to PNG format"}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="bg-card rounded-xl border p-6">
                <h2 className="text-xl font-semibold mb-4">How It Works</h2>
                <ol className="space-y-3 text-muted-foreground list-decimal pl-5">
                  <li>Upload any image file from your device</li>
                  <li>Our tool converts the image to PNG format while preserving quality</li>
                  <li>Download the converted PNG image to your device</li>
                </ol>
                <Separator className="my-4" />
                <div className="text-sm text-muted-foreground">
                  <p className="mb-2 font-medium">Privacy Note:</p>
                  <p>Your images are processed entirely in your browser and are never uploaded to any server.</p>
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

export default ImageToPng;
