
import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Image as LucideImageIcon, Upload, Download, Trash2, FileWarning } from "lucide-react";
import { motion } from "framer-motion";
import { showRewardedAd } from "@/utils/adUtils";

const WebpToPng = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState<string>("");
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    
    if (file) {
      if (file.type !== "image/webp") {
        setError("Please select a WebP image file");
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please select a WebP image file",
        });
        return;
      }
      
      setSelectedImage(file);
      setError(null);
      
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      setFilename(nameWithoutExt);
    }
  };

  const convertToPng = async () => {
    if (!selectedImage) {
      setError("Please select a WebP image to convert");
      toast({
        variant: "destructive",
        title: "No image selected",
        description: "Please select a WebP image to convert",
      });
      return;
    }
    
    setIsConverting(true);
    setError(null);
    
    // Show rewarded ad before conversion
    await showRewardedAd();
    
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        throw new Error("Unable to get canvas context");
      }
      
      const img = document.createElement("img");
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const pngUrl = canvas.toDataURL("image/png");
        setConvertedUrl(pngUrl);
        
        toast({
          title: "Conversion successful",
          description: "WebP image has been converted to PNG format",
        });
        
        setIsConverting(false);
      };
      
      img.onerror = () => {
        setError("Failed to load image");
        toast({
          variant: "destructive",
          title: "Conversion failed",
          description: "Failed to load the WebP image",
        });
        setIsConverting(false);
      };
      
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

  const downloadPng = async () => {
    if (!convertedUrl) return;
    
    // Show rewarded ad before download
    await showRewardedAd();
    
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
    <ToolLayout 
      title="WebP to PNG Converter"
      description="Convert WebP images to the widely supported PNG format. Preserve transparency and image quality."
      icon={<LucideImageIcon size={24} />}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-xl border bg-card">
                <h2 className="text-xl font-semibold mb-4">Upload WebP Image</h2>
                
                <div className="space-y-4">
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="image-upload">Select WebP Image</Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/webp"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground">Only WebP images are accepted</p>
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
              
              <div className="p-6 rounded-xl border bg-muted/30">
                <h3 className="text-lg font-medium mb-3">About WebP to PNG Conversion</h3>
                <p className="text-sm text-muted-foreground space-y-1 mb-3">
                  WebP is a modern image format developed by Google that provides superior compression compared to PNG and JPEG, but it's not universally supported by all browsers and image editors.
                </p>
                <p className="text-sm text-muted-foreground space-y-1">
                  Converting from WebP to PNG:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                  <li>Preserves transparency (if present in the original WebP)</li>
                  <li>Provides better compatibility across devices and applications</li>
                  <li>Ensures your images can be viewed and edited by any software</li>
                  <li>Results in lossless quality (no compression artifacts)</li>
                </ul>
              </div>
            </motion.div>

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
                    
                    <div className="bg-muted/40 p-3 rounded-md">
                      <p className="text-sm text-center">
                        <strong>Conversion Complete:</strong> Your WebP image has been successfully converted to PNG format with all image data preserved.
                      </p>
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
                      <p>No converted image yet</p>
                      <p className="text-sm mt-1">
                        Upload a WebP image and click "Convert to PNG" to see the result here
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </ToolLayout>
  );
};

export default WebpToPng;
