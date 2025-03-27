
import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Code } from "lucide-react";

const Base64 = () => {
  const [textInput, setTextInput] = useState<string>("");
  const [textOutput, setTextOutput] = useState<string>("");
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [fileOutput, setFileOutput] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("encode");
  const [dataTab, setDataTab] = useState<string>("text");

  const handleTextEncode = () => {
    if (!textInput.trim()) {
      toast.error("Please enter some text to encode");
      return;
    }

    try {
      const encoded = btoa(textInput);
      setTextOutput(encoded);
      toast.success("Text successfully encoded to Base64");
    } catch (error) {
      toast.error("Error encoding to Base64");
      console.error(error);
    }
  };

  const handleTextDecode = () => {
    if (!textInput.trim()) {
      toast.error("Please enter some Base64 to decode");
      return;
    }

    try {
      const decoded = atob(textInput);
      setTextOutput(decoded);
      toast.success("Base64 successfully decoded to text");
    } catch (error) {
      toast.error("Error decoding Base64. Input might not be valid Base64.");
      console.error(error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFileInput(file);
      setFileType(file.type);

      // For preview if it's an image
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl("");
      }
    }
  };

  const handleFileEncode = () => {
    if (!fileInput) {
      toast.error("Please select a file to encode");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        // Get the base64 part of the data URL
        const base64 = (e.target.result as string).split(',')[1];
        setFileOutput(base64);
        toast.success("File successfully encoded to Base64");
      }
    };
    reader.onerror = () => {
      toast.error("Error reading file");
    };
    reader.readAsDataURL(fileInput);
  };

  const handleFileDecode = () => {
    if (!textInput.trim()) {
      toast.error("Please enter a Base64 string to decode");
      return;
    }

    try {
      // Add the required data URL prefix based on the file type
      const prefix = fileType ? `data:${fileType};base64,` : "data:application/octet-stream;base64,";
      const dataUrl = prefix + textInput;
      
      // Create a link to download the file
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = "decoded-file";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Base64 decoded to file and download started");
    } catch (error) {
      toast.error("Error decoding Base64 to file");
      console.error(error);
    }
  };

  const handleCopy = () => {
    const textToCopy = dataTab === "text" ? textOutput : fileOutput;
    
    if (!textToCopy) {
      toast.error("Nothing to copy");
      return;
    }
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      toast.success("Copied to clipboard");
    }).catch(() => {
      toast.error("Failed to copy");
    });
  };

  const handleClear = () => {
    setTextInput("");
    setTextOutput("");
    setFileInput(null);
    setFileOutput("");
    setPreviewUrl("");
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    handleClear();
  };

  const handleDataTabChange = (value: string) => {
    setDataTab(value);
    handleClear();
  };

  return (
    <ToolLayout title="Base64 Encoder/Decoder">
      <Card className="p-6">
        <div className="space-y-6">
          <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="encode">Encode</TabsTrigger>
              <TabsTrigger value="decode">Decode</TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              <Tabs defaultValue={dataTab} onValueChange={handleDataTabChange}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text">Text</TabsTrigger>
                  <TabsTrigger value="file">File</TabsTrigger>
                </TabsList>
                
                <TabsContent value="text" className="mt-4 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="text-input">
                      {activeTab === "encode" ? "Text to Encode" : "Base64 to Decode"}
                    </Label>
                    <Textarea 
                      id="text-input"
                      placeholder={activeTab === "encode" 
                        ? "Enter the text you want to encode to Base64..." 
                        : "Enter the Base64 string you want to decode..."}
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      className="font-mono h-36"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button 
                      onClick={activeTab === "encode" ? handleTextEncode : handleTextDecode}
                    >
                      {activeTab === "encode" ? "Encode to Base64" : "Decode from Base64"}
                    </Button>
                    <Button variant="outline" onClick={handleClear}>
                      Clear
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="text-output">
                        {activeTab === "encode" ? "Base64 Result" : "Decoded Text"}
                      </Label>
                      <Button variant="ghost" size="sm" onClick={handleCopy}>
                        Copy to clipboard
                      </Button>
                    </div>
                    <Textarea 
                      id="text-output"
                      value={textOutput}
                      readOnly
                      className="font-mono h-36"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="file" className="mt-4 space-y-6">
                  {activeTab === "encode" ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="file-input">File to Encode</Label>
                        <Input
                          id="file-input"
                          type="file"
                          onChange={handleFileSelect}
                          className="cursor-pointer"
                        />
                      </div>
                      
                      {previewUrl && (
                        <div className="mt-4">
                          <Label>File Preview</Label>
                          <div className="mt-2 border rounded-md p-2 flex justify-center">
                            <img 
                              src={previewUrl} 
                              alt="Selected file preview" 
                              className="max-h-40 object-contain"
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2">
                        <Button onClick={handleFileEncode}>
                          Encode to Base64
                        </Button>
                        <Button variant="outline" onClick={handleClear}>
                          Clear
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="file-output">Base64 Result</Label>
                          <Button variant="ghost" size="sm" onClick={handleCopy}>
                            Copy to clipboard
                          </Button>
                        </div>
                        <Textarea 
                          id="file-output"
                          value={fileOutput}
                          readOnly
                          className="font-mono h-36"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="file-type">File MIME Type (Optional)</Label>
                        <Input
                          id="file-type"
                          type="text"
                          placeholder="e.g., image/png, application/pdf"
                          value={fileType}
                          onChange={(e) => setFileType(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Specify the file type for proper decoding (e.g., image/png, application/pdf)
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="base64-input">Base64 to Decode to File</Label>
                        <Textarea 
                          id="base64-input"
                          placeholder="Enter the Base64 string you want to decode to a file..."
                          value={textInput}
                          onChange={(e) => setTextInput(e.target.value)}
                          className="font-mono h-36"
                        />
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Button onClick={handleFileDecode}>
                          Decode and Download File
                        </Button>
                        <Button variant="outline" onClick={handleClear}>
                          Clear
                        </Button>
                      </div>
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </Tabs>
        </div>
      </Card>
    </ToolLayout>
  );
};

export default Base64;
