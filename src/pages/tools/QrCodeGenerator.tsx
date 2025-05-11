
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { QrCode, Download, Copy, Check, RefreshCw, Share2 } from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import QRCode from "qrcode";

const QrCodeGenerator = () => {
  const [input, setInput] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState("M");
  const [color, setColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [size, setSize] = useState(200);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const errorCorrectionOptions = [
    { value: "L", label: "Low (7%)" },
    { value: "M", label: "Medium (15%)" },
    { value: "Q", label: "Quartile (25%)" },
    { value: "H", label: "High (30%)" }
  ];

  const generateQRCode = async () => {
    if (!input.trim()) {
      toast({
        title: "Input required",
        description: "Please enter text or URL to generate a QR code",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const options = {
        errorCorrectionLevel: errorCorrectionLevel as "L" | "M" | "Q" | "H",
        margin: 1,
        width: size,
        color: {
          dark: color,
          light: backgroundColor
        }
      };

      const dataUrl = await QRCode.toDataURL(input.trim(), options);
      setQrUrl(dataUrl);

      // Also render to canvas for better quality download
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, input.trim(), options);
      }

      toast({
        title: "QR Code generated",
        description: "Your QR code has been generated successfully!",
      });
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast({
        title: "Generation failed",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrUrl) return;
    
    // Use canvas for better quality
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = 'qrcode.png';
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
      
      toast({
        title: "QR Code downloaded",
        description: "Your QR code has been downloaded as PNG",
      });
    }
  };

  const copyQRCode = async () => {
    if (!qrUrl) return;
    
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

  const shareQRCode = async () => {
    if (!qrUrl || !navigator.share) return;
    
    try {
      // Convert data URL to blob
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const file = new File([blob], 'qrcode.png', { type: 'image/png' });
      
      await navigator.share({
        title: 'QR Code',
        text: 'Check out this QR code I generated',
        files: [file]
      });
      
      toast({
        title: "Shared successfully",
        description: "QR code has been shared",
      });
    } catch (error) {
      console.error("Error sharing QR code:", error);
      if (error instanceof Error && error.name !== 'AbortError') {
        toast({
          title: "Share failed",
          description: "Failed to share QR code. Your browser may not support this feature.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <ToolLayout
      title="QR Code Generator"
      description="Create QR codes for URLs, text or contact information."
      icon={<QrCode className="h-6 w-6" />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6 p-6 rounded-xl border bg-card"
        >
          <div className="space-y-2">
            <label htmlFor="qr-input" className="block text-sm font-medium">
              Text or URL
            </label>
            <Textarea
              id="qr-input"
              placeholder="Enter text or URL for your QR code"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Error Correction
              </label>
              <Select 
                value={errorCorrectionLevel} 
                onValueChange={setErrorCorrectionLevel}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {errorCorrectionOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Size ({size}px)
              </label>
              <Slider
                value={[size]}
                min={100}
                max={500}
                step={10}
                onValueChange={(value) => setSize(value[0])}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="qr-color" className="block text-sm font-medium">
                QR Color
              </label>
              <div className="flex items-center space-x-2">
                <div 
                  className="h-10 w-10 rounded border"
                  style={{ backgroundColor: color }}
                />
                <Input
                  id="qr-color"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-10 w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="qr-bg-color" className="block text-sm font-medium">
                Background Color
              </label>
              <div className="flex items-center space-x-2">
                <div 
                  className="h-10 w-10 rounded border"
                  style={{ backgroundColor: backgroundColor }}
                />
                <Input
                  id="qr-bg-color"
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="h-10 w-full"
                />
              </div>
            </div>
          </div>

          <Button 
            onClick={generateQRCode} 
            className="w-full"
            disabled={isGenerating || !input.trim()}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <QrCode className="mr-2 h-4 w-4" />
                Generate QR Code
              </>
            )}
          </Button>
        </motion.div>

        {/* Output Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="p-6 rounded-xl border bg-card flex flex-col items-center justify-center"
        >
          {qrUrl ? (
            <>
              <div className="relative mb-6 p-4 bg-white rounded-lg shadow-sm border">
                <img 
                  src={qrUrl} 
                  alt="Generated QR Code" 
                  className="mx-auto block max-w-full"
                  style={{ width: size, height: size }}
                />
                {/* Hidden canvas for download */}
                <canvas 
                  ref={canvasRef} 
                  className="hidden"
                  width={size}
                  height={size}
                />
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
                <Button 
                  variant="outline" 
                  onClick={downloadQRCode}
                  className="flex-1"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={copyQRCode}
                  className="flex-1"
                >
                  {isCopied ? (
                    <>
                      <Check className="mr-2 h-4 w-4 text-green-600" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
                
                {navigator.share && (
                  <Button 
                    variant="outline" 
                    onClick={shareQRCode}
                    className="flex-1"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="text-center p-8">
              <div className="inline-block p-6 bg-muted rounded-full mb-4">
                <QrCode className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No QR Code Generated Yet</h3>
              <p className="text-muted-foreground">
                Enter text or a URL and click the Generate button to create your QR code.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-12 p-6 rounded-xl border bg-secondary/30"
      >
        <h2 className="text-xl font-semibold mb-4">Tips for QR Codes</h2>
        <ul className="space-y-2 list-disc pl-5">
          <li>Higher error correction makes your QR code more reliable if damaged but increases complexity.</li>
          <li>Ensure good contrast between QR code and background colors for better scanning.</li>
          <li>Test your QR code with different devices before printing or publishing.</li>
          <li>Keep URLs short to reduce QR code complexity and improve scan reliability.</li>
          <li>For business cards or marketing materials, consider adding your logo to the center of the QR code.</li>
        </ul>
      </motion.div>
    </ToolLayout>
  );
};

export default QrCodeGenerator;
