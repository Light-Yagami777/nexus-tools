
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Image as LucideImageIcon, Upload, Download, Trash2, FileWarning } from "lucide-react";

const ImageToPng = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState<string>("");
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (convertedUrl && canvasRef.current) {
      const img = new Image();
      img.onload = () => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          canvasRef.current.width = img.width;
          canvasRef.current.height = img.height;
          ctx.drawImage(img, 0, 0);
        }
      };
      img.src = convertedUrl;
    }
  }, [convertedUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    
    if (file) {
      // Check if file is an image
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
      
      // Create a preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Set default filename (original name without extension)
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      setFilename(nameWithoutExt);
    }
  };

  const convertToPng = () => {
    if (!selectedImage) {
      setError("Please select an image to convert");
      toast({
        variant: "destructive",
        title: "No image selected",
        description: "Please select an image to convert",
      });
      return;
    }
    
    setIsConverting(true);
    setError(null);
    
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        throw new Error("Unable to get canvas context");
      }
      
      // Create an image element to load the selected file
      const img = document.createElement("img");
      
      img.onload = () => {
        // Set canvas dimensions to match the image
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the image onto the canvas
        ctx.drawImage(img, 0, 0);
        
        // Convert canvas to PNG data URL
        const pngUrl = canvas.toDataURL("image/png");
        setConvertedUrl(pngUrl);
        
        toast({
          title: "Conversion successful",
          description: "Image has been converted to PNG format",
        });
        
        setIsConverting(false);
      };
      
      img.onerror = () => {
        setError("Failed to load image");
        toast({
          variant: "destructive",
          title: "Conversion failed",
          description: "Failed to load the image",
        });
        setIsConverting(false);
      };
      
      // Load the image from the file
      img.src = URL.createObjectURL(selectedImage);
    } catch (err) {
      console.error("Error converting image:", err);
      setError("Failed to convert image");
      toast({
        variant: "destructive",
        title: "Conversion failed",
        description: "An error occurred while converting the image",
      });
      setIsConverting(false);
    }
  };

  const downloadPng = () => {
    if (!convertedUrl) return;
    
    const link = document.createElement("a");
    link.href = convertedUrl;
    link.download = `${filename || "converted"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download started",
      description: "Your PNG image is being downloaded",
    });
  };

  const copyToClipboard = async () => {
    if (!convertedUrl) return;
    
    try {
      const response = await fetch(convertedUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      
      setIsCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Image has been copied to clipboard",
      });
      
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy image:", err);
      toast({
        variant: "destructive",
        title: "Copy failed",
        description: "Failed to copy image to clipboard",
      });
    }
  };

  const reset = () => {
    setSelectedImage(null);
    setConvertedUrl(null);
    setPreviewUrl(null);
    setFilename("");
    setError(null);
    
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
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">Image to PNG Converter</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Convert your images to PNG format with this free online tool. Maintain transparency and quality without any watermarks.
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
                <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
                
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
                    </div>
                  )}
                  
                  {selectedImage && (
                    <div className="mt-4 space-y-4">
                      <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="filename">Filename</Label>
                        <div className="flex">
                          <Input
                            id="filename"
                            value={filename}
                            onChange={(e) => setFilename(e.target.value)}
                            className="rounded-r-none"
                          />
                          <div className="flex items-center px-3 border border-l-0 rounded-r-md bg-muted text-muted-foreground text-sm">
                            .png
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={convertToPng} 
                        className="w-full"
                        disabled={isConverting || !selectedImage}
                      >
                        {isConverting ? "Converting..." : "Convert to PNG"}
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
                <h2 className="text-xl font-semibold mb-4">Converted PNG</h2>
                
                {convertedUrl ? (
                  <div className="space-y-4">
                    <div className="rounded-md overflow-hidden border bg-background/50 p-2">
                      <img
                        src={convertedUrl}
                        alt="Converted PNG"
                        className="max-w-full h-auto max-h-[300px] mx-auto"
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        onClick={downloadPng}
                        className="flex-1"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download PNG
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        onClick={copyToClipboard}
                        className="flex-1"
                      >
                        {isCopied ? "Copied!" : "Copy to Clipboard"}
                      </Button>
                    </div>
                    
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                ) : (
                  <div className="border rounded-md border-dashed h-[300px] flex items-center justify-center">
                    <div className="text-center text-muted-foreground p-4">
                      <Upload className="h-8 w-8 mx-auto mb-2" />
                      <p>No image converted yet</p>
                      <p className="text-sm mt-1">
                        Upload an image and click "Convert to PNG" to see the result here
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

export default ImageToPng;
