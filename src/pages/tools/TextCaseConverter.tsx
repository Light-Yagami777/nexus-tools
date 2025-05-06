
import React, { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextCursor } from "lucide-react";
import { toast } from "sonner";

const TextCaseConverter = () => {
  const [text, setText] = useState("");
  const [convertedText, setConvertedText] = useState("");
  const [activeTab, setActiveTab] = useState("uppercase");

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleConvert = () => {
    if (!text.trim()) {
      toast.error("Please enter some text to convert");
      return;
    }

    let result = "";
    switch (activeTab) {
      case "uppercase":
        result = text.toUpperCase();
        break;
      case "lowercase":
        result = text.toLowerCase();
        break;
      case "capitalize":
        result = text
          .toLowerCase()
          .split(" ")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        break;
      case "sentence":
        result = text
          .toLowerCase()
          .replace(/(^\s*\w|[.!?]\s*\w)/g, match => match.toUpperCase());
        break;
      case "alternate":
        result = text
          .split("")
          .map((char, index) => index % 2 === 0 ? char.toUpperCase() : char.toLowerCase())
          .join("");
        break;
      case "inverse":
        result = text
          .split("")
          .map(char => {
            if (char === char.toUpperCase()) {
              return char.toLowerCase();
            }
            return char.toUpperCase();
          })
          .join("");
        break;
      default:
        result = text;
    }

    setConvertedText(result);
    toast.success("Text converted successfully");
  };

  const handleCopyToClipboard = () => {
    if (!convertedText) {
      toast.error("No converted text to copy");
      return;
    }

    navigator.clipboard.writeText(convertedText)
      .then(() => toast.success("Copied to clipboard"))
      .catch(() => toast.error("Failed to copy text"));
  };

  const handleClear = () => {
    setText("");
    setConvertedText("");
    toast.info("Text cleared");
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (text) handleConvert();
  };

  return (
    <ToolLayout title="Text Case Converter" icon={<TextCursor size={24} />}>
      <Card className="p-6">
        <div className="space-y-6">
          <Tabs defaultValue="uppercase" onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-3 md:grid-cols-6">
              <TabsTrigger value="uppercase">UPPERCASE</TabsTrigger>
              <TabsTrigger value="lowercase">lowercase</TabsTrigger>
              <TabsTrigger value="capitalize">Capitalize</TabsTrigger>
              <TabsTrigger value="sentence">Sentence case</TabsTrigger>
              <TabsTrigger value="alternate">AlTeRnAtE</TabsTrigger>
              <TabsTrigger value="inverse">InVeRsE</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="input-text" className="block text-sm font-medium">
                    Input Text
                  </label>
                  <Textarea
                    id="input-text"
                    placeholder="Enter your text here..."
                    value={text}
                    onChange={handleTextChange}
                    className="min-h-[150px]"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button onClick={handleConvert}>Convert Text</Button>
                  <Button variant="outline" onClick={handleClear}>Clear</Button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="output-text" className="block text-sm font-medium">
                      Converted Text
                    </label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyToClipboard}
                      disabled={!convertedText}
                    >
                      Copy to clipboard
                    </Button>
                  </div>
                  <Textarea
                    id="output-text"
                    value={convertedText}
                    readOnly
                    className="min-h-[150px]"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </ToolLayout>
  );
};

export default TextCaseConverter;
