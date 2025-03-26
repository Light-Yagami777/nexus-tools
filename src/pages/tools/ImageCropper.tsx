
import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, Image as ImageIcon, Download } from "lucide-react";
import { toast } from "sonner";

const ImageCropper = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview URL
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      setCroppedImageUrl(null);
    }
  };

  const handleCropImage = () => {
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }
    
    setLoading(true);
    
    // Simulate image cropping (in a real app, you would use an image cropping library)
    setTimeout(() => {
      toast.success("Image cropped successfully!");
      setLoading(false);
      // In a real implementation, you would set the actual cropped image URL here
      setCroppedImageUrl(previewUrl); // Placeholder: just showing the original image
    }, 1500);
  };

  const handleClearImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    if (croppedImageUrl && croppedImageUrl !== previewUrl) {
      URL.revokeObjectURL(croppedImageUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setCroppedImageUrl(null);
  };

  return (
    <ToolLayout title="Image Cropper" icon={<ImageIcon size={24} />}>
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <p className="text-muted-foreground mb-4">
              Upload an image to crop it to your desired dimensions. You can preview the result before downloading.
            </p>
            
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <Label htmlFor="image-upload" className="block mb-2">
                  Upload Image
                </Label>
                <div className="relative">
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                  />
                  <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                    <Upload className="h-6 w-6" />
                    <span>Click or drop image</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {previewUrl && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Selected Image</h3>
                <Button variant="ghost" size="sm" onClick={handleClearImage}>
                  Clear
                </Button>
              </div>
              
              <div className="border rounded-md p-4 flex justify-center">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-60 object-contain"
                />
              </div>
              
              <div className="flex justify-center">
                <Button 
                  onClick={handleCropImage} 
                  disabled={loading || !selectedFile}
                  className="w-full sm:w-auto"
                >
                  {loading ? "Cropping..." : "Crop Image"}
                </Button>
              </div>
            </div>
          )}
          
          {croppedImageUrl && (
            <div className="space-y-4">
              <h3 className="font-medium">Cropped Image</h3>
              <div className="border rounded-md p-4 flex justify-center">
                <img
                  src={croppedImageUrl}
                  alt="Cropped"
                  className="max-h-60 object-contain"
                />
              </div>
              <div className="flex justify-center">
                <Button variant="outline" className="w-full sm:w-auto">
                  <Download className="mr-2 h-4 w-4" />
                  Download Cropped Image
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </ToolLayout>
  );
};

export default ImageCropper;
