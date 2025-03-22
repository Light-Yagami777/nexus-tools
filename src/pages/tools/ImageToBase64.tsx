import { useState } from "react";
import { motion } from "framer-motion";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { Image as LucideImageIcon, Upload, Download, Trash2, FileWarning, Code, Copy, Check } from "lucide-react";

type Base64Format = "dataURL" | "base64Only";

const ImageToBase64 = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [base64String, setBase64String] = useState<string>("");
  const [format, setFormat] = useState<Base64Format>("dataURL");
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

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
      
      // Automatically convert when file is selected
      convertToBase64(file);
    }
  };

  const convertToBase64 = (file: File = selectedImage!) => {
    if (!file) {
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
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const result = event.target?.result as string;
        
        if (format === "base64Only") {
          // Remove the data URL prefix to get only the base64 string
          const base64Only = result.split(',')[1];
          setBase64String(base64Only);
        } else {
          // Keep the full data URL
          setBase64String(result);
        }
        
        toast({
          title: "Conversion successful",
          description: "Image has been converted to Base64",
        });
        
        setIsConverting(false);
      };
      
      reader.onerror = () => {
        setError("Failed to read file");
        toast({
          variant: "destructive",
          title: "Conversion failed",
          description: "Failed to read the image file",
        });
        setIsConverting(false);
      };
      
      reader.readAsDataURL(file);
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

  const handleFormatChange = (value: string) => {
    setFormat(value as Base64Format);
    
    // Re-convert with the new format if an image is selected
    if (selectedImage) {
      convertToBase64();
    }
  };

  const copyToClipboard = () => {
    if (!base64String) return;
    
    navigator.clipboard.writeText(base64String);
    setIsCopied(true);
    
    toast({
      title: "Copied to clipboard",
      description: "Base64 string has been copied to clipboard",
    });
    
    setTimeout(() => setIsCopied(false), 2000);
  };

  const downloadAsText = () => {
    if (!base64String) return;
    
    const blob = new Blob([base64String], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `image_base64.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Your Base64 string is being downloaded as a text file",
    });
  };

  const reset = () => {
    setSelectedImage(null);
    setBase64String("");
    setPreviewUrl(null);
    setError(null);
    setFormat("dataURL");
    
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
                <Code className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">Image to Base64 Converter</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Convert your images to Base64 encoded strings for embedding directly in HTML, CSS, or JSON.
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
                  
                  <div className="pt-2">
                    <Label className="mb-2 block">Base64 Format</Label>
                    <RadioGroup 
                      value={format}
                      onValueChange={handleFormatChange}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dataURL" id="dataURL" />
                        <Label htmlFor="dataURL" className="cursor-pointer">Data URL</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="base64Only" id="base64Only" />
                        <Label htmlFor="base64Only" className="cursor-pointer">Base64 Only</Label>
                      </div>
                    </RadioGroup>
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
                  
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={reset}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                  
                  {error && (
                    <div className="bg-destructive/15 text-destructive rounded-md p-3 flex items-center text-sm mt-4">
                      <FileWarning className="h-4 w-4 mr-2" />
                      {error}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6 rounded-xl border bg-muted/30">
                <h3 className="text-lg font-medium mb-3">About Base64 Encoding</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Base64 encoding is used to represent binary data in an ASCII string format. For images, it allows you to:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mb-3">
                  <li>Embed images directly in HTML using <code className="bg-muted p-1 rounded text-xs">{'<img src="data:image/...">'}</code></li>
                  <li>Include images in CSS with <code className="bg-muted p-1 rounded text-xs">background-image: url(data:image/...);</code></li>
                  <li>Store images in JSON or databases without binary data</li>
                  <li>Send images in API requests without multipart forms</li>
                </ul>
                <p className="text-sm text-muted-foreground">
                  <strong>Format options:</strong>
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li><strong>Data URL:</strong> Includes the MIME type prefix (e.g., <code className="bg-muted p-1 rounded text-xs">data:image/png;base64,...</code>)</li>
                  <li><strong>Base64 Only:</strong> The raw Base64 encoded string without the prefix</li>
                </ul>
              </div>
            </motion.div>

            {/* Output Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-xl border bg-card">
                <h2 className="text-xl font-semibold mb-4">Base64 Result</h2>
                
                {base64String ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <Label>Base64 String</Label>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={copyToClipboard}
                        >
                          {isCopied ? (
                            <>
                              <Check className="h-3.5 w-3.5 mr-1" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5 mr-1" />
                              Copy
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={downloadAsText}
                        >
                          <Download className="h-3.5 w-3.5 mr-1" />
                          Save
                        </Button>
                      </div>
                    </div>
                    <Textarea
                      value={base64String}
                      readOnly
                      className="font-mono text-xs h-[350px] resize-none"
                    />
                    
                    {format === "dataURL" && (
                      <div className="pt-4">
                        <p className="text-sm font-medium mb-2">Preview from Base64:</p>
                        <div className="rounded-md overflow-hidden border bg-background/50 p-2">
                          <img
                            src={base64String}
                            alt="Base64 Preview"
                            className="max-w-full h-auto max-h-[150px] mx-auto"
                          />
                        </div>
                      </div>
                    )}
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">How to use this Base64 string:</h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="font-medium mb-1">HTML:</p>
                          <code className="bg-muted p-2 text-xs block rounded overflow-x-auto">
                            {format === "dataURL" 
                              ? `<img src="${base64String.substring(0, 50)}..." alt="Image" />`
                              : `<img src="data:image/jpeg;base64,${base64String.substring(0, 50)}..." alt="Image" />`
                            }
                          </code>
                        </div>
                        <div>
                          <p className="font-medium mb-1">CSS:</p>
                          <code className="bg-muted p-2 text-xs block rounded overflow-x-auto">
                            {format === "dataURL" 
                              ? `.element { background-image: url(${base64String.substring(0, 50)}...); }`
                              : `.element { background-image: url(data:image/jpeg;base64,${base64String.substring(0, 50)}...); }`
                            }
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border rounded-md border-dashed h-[350px] flex items-center justify-center">
                    <div className="text-center text-muted-foreground p-4">
                      <Upload className="h-8 w-8 mx-auto mb-2" />
                      <p>No Base64 data yet</p>
                      <p className="text-sm mt-1">
                        Upload an image to generate the Base64 string
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

export default ImageToBase64;
