
import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, FileText, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";

const ScreenshotToPdf = () => {
  const [screenshots, setScreenshots] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [pdfTitle, setPdfTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfGenerated, setPdfGenerated] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles = selectedFiles.filter(file => 
        file.type === 'image/png' || 
        file.type === 'image/jpeg' || 
        file.type === 'image/jpg'
      );
      
      if (validFiles.length !== selectedFiles.length) {
        toast.warning("Some files were ignored. Only PNG and JPEG images are supported.");
      }
      
      setScreenshots(prevImages => [...prevImages, ...validFiles]);
      
      // Create preview URLs
      const newUrls = validFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prevUrls => [...prevUrls, ...newUrls]);
    }
  };

  const handleRemoveScreenshot = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setScreenshots(screenshots.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setScreenshots([]);
    setPreviewUrls([]);
    setPdfGenerated(false);
  };

  const handleGeneratePdf = () => {
    if (screenshots.length === 0) {
      toast.error("Please upload at least one screenshot");
      return;
    }
    
    setLoading(true);
    
    // Simulate PDF generation
    setTimeout(() => {
      toast.success("PDF generated successfully!");
      setLoading(false);
      setPdfGenerated(true);
    }, 2000);
  };

  return (
    <ToolLayout title="Screenshot to PDF">
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <p className="text-muted-foreground mb-4">
              Convert your screenshots to a PDF document. Upload multiple images and arrange them in order.
            </p>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="pdf-title" className="block mb-2">
                  PDF Title (optional)
                </Label>
                <Input
                  id="pdf-title"
                  value={pdfTitle}
                  onChange={(e) => setPdfTitle(e.target.value)}
                  placeholder="Enter a title for your PDF"
                />
              </div>
              
              <div>
                <Label htmlFor="screenshot-upload" className="block mb-2">
                  Upload Screenshots (PNG or JPEG)
                </Label>
                <div className="relative">
                  <input
                    id="screenshot-upload"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleFileChange}
                    multiple
                    className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                  />
                  <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                    <Upload className="h-6 w-6" />
                    <span>Click or drop screenshots</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {previewUrls.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Screenshots ({previewUrls.length})</h3>
                <Button variant="ghost" size="sm" onClick={handleClearAll}>
                  Clear All
                </Button>
              </div>
              
              <div className="space-y-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="flex items-center border rounded-md p-2">
                    <div className="h-16 w-16 mr-4 flex-shrink-0">
                      <img
                        src={url}
                        alt={`Screenshot ${index + 1}`}
                        className="h-full w-full object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="text-sm font-medium">
                        Page {index + 1}: {screenshots[index].name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round(screenshots[index].size / 1024)} KB
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveScreenshot(index)}
                      className="flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center mt-6">
                <Button 
                  onClick={handleGeneratePdf} 
                  disabled={loading || screenshots.length === 0} 
                  className="w-full sm:w-auto"
                >
                  {loading ? (
                    "Generating PDF..."
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Generate PDF
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
          
          {pdfGenerated && (
            <div className="space-y-4 mt-6">
              <div className="text-center p-6 border border-dashed rounded-md">
                <FileText className="h-12 w-12 mx-auto mb-2 text-primary" />
                <h3 className="font-medium text-lg">
                  {pdfTitle || "Screenshots"}.pdf
                </h3>
                <p className="text-sm text-muted-foreground">
                  PDF generated successfully
                </p>
              </div>
              <div className="flex justify-center">
                <Button className="w-full sm:w-auto">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </ToolLayout>
  );
};

export default ScreenshotToPdf;
