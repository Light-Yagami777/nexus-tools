
import React, { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Type } from "lucide-react";
import { toast } from "sonner";

const LoremIpsumGenerator = () => {
  const [paragraphs, setParagraphs] = useState<number>(3);
  const [wordsPerParagraph, setWordsPerParagraph] = useState<number>(50);
  const [format, setFormat] = useState<string>("plain");
  const [result, setResult] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const generateLoremIpsum = () => {
    // Basic lorem ipsum text to start with
    const loremIpsumStart = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ";
    const words = [
      "a", "ac", "accumsan", "ad", "adipiscing", "aenean", "aliquam", "aliquet", "amet", "ante", 
      "aptent", "arcu", "at", "auctor", "augue", "bibendum", "blandit", "congue", "consectetur", 
      "consequat", "convallis", "cras", "cubilia", "cum", "curabitur", "curae", "cursus", "dapibus", 
      "diam", "dictum", "dictumst", "dignissim", "dis", "dolor", "donec", "dui", "duis", "egestas", 
      "eget", "eleifend", "elementum", "elit", "enim", "erat", "eros", "est", "et", "etiam", "eu", 
      "euismod", "facilisi", "facilisis", "fames", "faucibus", "felis", "fermentum", "feugiat", 
      "fringilla", "fusce", "gravida", "habitant", "habitasse", "hac", "hendrerit", "himenaeos", 
      "iaculis", "id", "imperdiet", "in", "inceptos", "integer", "interdum", "ipsum", "justo", 
      "lacinia", "lacus", "laoreet", "lectus", "leo", "libero", "ligula", "litora", "lobortis", 
      "lorem", "luctus", "maecenas", "magna", "magnis", "malesuada", "massa", "mattis", "mauris", 
      "metus", "mi", "molestie", "mollis", "montes", "morbi", "mus", "nam", "nascetur", "natoque", 
      "nec", "neque", "netus", "nibh", "nisi", "nisl", "non", "nostra", "nulla", "nullam", "nunc", 
      "odio", "orci", "ornare", "parturient", "pellentesque", "penatibus", "per", "pharetra", 
      "phasellus", "placerat", "platea", "porta", "porttitor", "posuere", "potenti", "praesent", 
      "pretium", "primis", "proin", "pulvinar", "purus", "quam", "quis", "quisque", "rhoncus", 
      "ridiculus", "risus", "rutrum", "sagittis", "sapien", "scelerisque", "sed", "sem", "semper", 
      "senectus", "sit", "sociis", "sociosqu", "sodales", "sollicitudin", "suscipit", "suspendisse", 
      "taciti", "tellus", "tempor", "tempus", "tincidunt", "torquent", "tortor", "tristique", 
      "turpis", "ullamcorper", "ultrices", "ultricies", "urna", "ut", "varius", "vehicula", "vel", 
      "velit", "venenatis", "vestibulum", "vitae", "vivamus", "viverra", "volutpat", "vulputate"
    ];

    // Generate random text
    let resultText = "";
    
    for (let i = 0; i < paragraphs; i++) {
      let paragraph = i === 0 ? loremIpsumStart : "";
      
      // Add random words to reach desired words per paragraph
      const remainingWords = wordsPerParagraph - (i === 0 ? loremIpsumStart.split(" ").length : 0);
      
      for (let j = 0; j < remainingWords; j++) {
        const randomWord = words[Math.floor(Math.random() * words.length)];
        paragraph += randomWord;
        
        // Add comma or period occasionally
        if (j < remainingWords - 1) {
          if (Math.random() < 0.1) {
            paragraph += ", ";
          } else {
            paragraph += " ";
          }
        } else {
          paragraph += ".";
        }
      }
      
      // Format the paragraph according to the selected format
      if (format === "html") {
        resultText += `<p>${paragraph}</p>${i < paragraphs - 1 ? "\n\n" : ""}`;
      } else {
        resultText += `${paragraph}${i < paragraphs - 1 ? "\n\n" : ""}`;
      }
    }
    
    setResult(resultText);
    toast.success("Lorem ipsum text generated successfully!");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result)
      .then(() => {
        setCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      });
  };

  return (
    <ToolLayout 
      title="Lorem Ipsum Generator" 
      description="Generate Lorem Ipsum placeholder text for your designs and layouts"
      icon={<Type className="h-6 w-6" />}
    >
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="paragraphs" className="block text-sm font-medium mb-1">
                  Number of Paragraphs: {paragraphs}
                </label>
                <Slider
                  id="paragraphs"
                  min={1}
                  max={10}
                  step={1}
                  value={[paragraphs]}
                  onValueChange={(value) => setParagraphs(value[0])}
                  className="max-w-md"
                />
              </div>
              
              <div>
                <label htmlFor="words" className="block text-sm font-medium mb-1">
                  Words Per Paragraph: {wordsPerParagraph}
                </label>
                <Slider
                  id="words"
                  min={10}
                  max={100}
                  step={5}
                  value={[wordsPerParagraph]}
                  onValueChange={(value) => setWordsPerParagraph(value[0])}
                  className="max-w-md"
                />
              </div>
              
              <div className="max-w-md">
                <label htmlFor="format" className="block text-sm font-medium mb-1">
                  Format
                </label>
                <Select value={format} onValueChange={(value) => setFormat(value)}>
                  <SelectTrigger id="format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plain">Plain Text</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex space-x-2">
                <Button onClick={generateLoremIpsum}>Generate Text</Button>
                <Button 
                  variant="outline" 
                  onClick={copyToClipboard} 
                  disabled={!result}
                >
                  {copied ? "Copied!" : "Copy to Clipboard"}
                </Button>
              </div>
            </div>
            
            {result && (
              <div>
                <label htmlFor="result" className="block text-sm font-medium mb-2">
                  Generated Lorem Ipsum:
                </label>
                <div 
                  id="result"
                  className="p-4 bg-muted rounded-md whitespace-pre-wrap h-[300px] overflow-y-auto border"
                >
                  {result}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default LoremIpsumGenerator;
