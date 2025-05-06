
import React, { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Download, FileImage, Trash2 } from "lucide-react";
import { toast } from "sonner";

const ImageConverter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<string>("png");
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Check if the file is an image
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      
      setSelectedFile(file);
      
      // Create a preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Reset conversion state
      setConvertedUrl(null);
    }
  };
  
  const handleConvert = async () => {
    if (!selectedFile) {
      toast.error("Please select an image to convert");
      return;
    }
    
    setIsConverting(true);
    
    try {
      // Create a canvas element to convert the image
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          toast.error("Canvas context not available");
          setIsConverting(false);
          return;
        }
        
        // Draw the image on the canvas
        ctx.drawImage(image, 0, 0);
        
        // Convert to the desired format
        let mimeType = "image/png";
        switch (outputFormat) {
          case "jpeg":
          case "jpg":
            mimeType = "image/jpeg";
            break;
          case "webp":
            mimeType = "image/webp";
            break;
          case "bmp":
            mimeType = "image/bmp";
            break;
          case "gif":
            mimeType = "image/gif";
            break;
        }
        
        try {
          // Get the data URL of the converted image
          const dataUrl = canvas.toDataURL(mimeType);
          setConvertedUrl(dataUrl);
          setIsConverting(false);
          toast.success(`Image converted to ${outputFormat.toUpperCase()}`);
        } catch (error) {
          console.error("Conversion error:", error);
          toast.error(`Failed to convert to ${outputFormat.toUpperCase()}. Format may not be supported.`);
          setIsConverting(false);
        }
      };
      
      image.onerror = () => {
        toast.error("Failed to load image");
        setIsConverting(false);
      };
      
      image.src = previewUrl!;
    } catch (error) {
      console.error("Conversion error:", error);
      toast.error("An error occurred while converting the image");
      setIsConverting(false);
    }
  };
  
  const handleDownload = () => {
    if (!convertedUrl) return;
    
    // Create a download link
    const link = document.createElement("a");
    link.href = convertedUrl;
    link.download = `converted.${outputFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Download started");
  };
  
  const clearSelection = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
    setSelectedFile(null);
    setPreviewUrl(null);
    setConvertedUrl(null);
    
    // Reset the file input
    const fileInput = document.getElementById("image-upload") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };
  
  return (
    <ToolLayout title="Image Converter" icon={<FileImage size={24} />}>
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <p className="text-muted-foreground mb-6">
              Convert images between different formats like PNG, JPEG, WEBP, and more.
            </p>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="image-upload" className="block mb-2">
                  Select Image to Convert
                </Label>
                <div className="relative">
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                    <Upload className="h-6 w-6" />
                    <span>Click or drop image file</span>
                  </Button>
                </div>
              </div>
              
              {previewUrl && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Original Image</Label>
                    <Button variant="ghost" size="sm" onClick={clearSelection}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Clear
                    </Button>
                  </div>
                  <div className="border rounded-md p-4 flex justify-center bg-muted/30">
                    <img
                      src={previewUrl}
                      alt="Selected"
                      className="max-h-64 object-contain"
                    />
                  </div>
                  
                  <div className="mt-4 flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <Label htmlFor="output-format" className="block mb-2">
                        Output Format
                      </Label>
                      <Select
                        value={outputFormat}
                        onValueChange={setOutputFormat}
                      >
                        <SelectTrigger id="output-format">
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="png">PNG</SelectItem>
                          <SelectItem value="jpeg">JPEG</SelectItem>
                          <SelectItem value="webp">WEBP</SelectItem>
                          <SelectItem value="bmp">BMP</SelectItem>
                          <SelectItem value="gif">GIF</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-end">
                      <Button 
                        onClick={handleConvert} 
                        disabled={isConverting || !previewUrl}
                        className="w-full md:w-auto"
                      >
                        {isConverting ? "Converting..." : "Convert Image"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {convertedUrl && (
                <div className="mt-6">
                  <Label className="block mb-2">Converted Image</Label>
                  <div className="border rounded-md p-4 flex justify-center bg-muted/30">
                    <img
                      src={convertedUrl}
                      alt="Converted"
                      className="max-h-64 object-contain"
                    />
                  </div>
                  
                  <div className="mt-4 flex justify-center">
                    <Button onClick={handleDownload} className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Download {outputFormat.toUpperCase()}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-muted p-4 rounded-md">
            <h3 className="font-medium mb-2">Supported Formats</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-1">PNG</h4>
                <p className="text-xs text-muted-foreground">
                  Supports transparency, best for graphics, logos, and images with text
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">JPEG</h4>
                <p className="text-xs text-muted-foreground">
                  Great for photographs and complex images, smaller file size, no transparency
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">WEBP</h4>
                <p className="text-xs text-muted-foreground">
                  Modern format with great compression and quality, supports transparency
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">BMP</h4>
                <p className="text-xs text-muted-foreground">
                  Uncompressed format, large file size but no quality loss
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </ToolLayout>
  );
};

export default ImageConverter;
