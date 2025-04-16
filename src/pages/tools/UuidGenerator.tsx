
import React, { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Key, Copy, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider"; 
import { toast } from "sonner";

const UuidGenerator = () => {
  const [uuids, setUuids] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isUppercase, setIsUppercase] = useState(false);
  const [isHyphenated, setIsHyphenated] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("v4");

  const generateV4UUID = () => {
    // Implementation of RFC4122 version 4 compliant UUID generation
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const generateUUID = (version = "v4") => {
    // Currently only supporting v4, but structure allows for future expansion
    const uuid = generateV4UUID();
    
    // Format according to preferences
    let formattedUuid = uuid;
    
    if (!isHyphenated) {
      formattedUuid = formattedUuid.replace(/-/g, '');
    }
    
    if (isUppercase) {
      formattedUuid = formattedUuid.toUpperCase();
    }
    
    return formattedUuid;
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    
    try {
      const generatedUuids = Array.from({ length: quantity }, () => generateUUID(activeTab));
      setUuids(generatedUuids);
      toast.success(`Generated ${quantity} UUID${quantity > 1 ? 's' : ''}`);
    } catch (error) {
      console.error('Error generating UUIDs:', error);
      toast.error('Failed to generate UUIDs');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (index: number) => {
    if (index >= 0 && index < uuids.length) {
      navigator.clipboard.writeText(uuids[index])
        .then(() => toast.success('UUID copied to clipboard'))
        .catch(() => toast.error('Failed to copy UUID'));
    }
  };

  const copyAllToClipboard = () => {
    if (uuids.length === 0) {
      toast.error('No UUIDs to copy');
      return;
    }

    navigator.clipboard.writeText(uuids.join('\n'))
      .then(() => toast.success('All UUIDs copied to clipboard'))
      .catch(() => toast.error('Failed to copy UUIDs'));
  };

  return (
    <ToolLayout 
      title="UUID Generator" 
      description="Generate UUIDs/GUIDs for your projects"
      icon={<Key className="h-6 w-6" />}
    >
      <Card>
        <CardHeader>
          <CardTitle>UUID Generator</CardTitle>
          <CardDescription>
            Generate universally unique identifiers (UUIDs/GUIDs)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="v4" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
              <TabsTrigger value="v4">UUID v4 (Random)</TabsTrigger>
              <TabsTrigger value="v1" disabled>UUID v1 (Coming Soon)</TabsTrigger>
              <TabsTrigger value="custom" disabled>Custom Format (Coming Soon)</TabsTrigger>
            </TabsList>
            <TabsContent value="v4" className="mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Quantity: {quantity}</Label>
                  <Slider
                    value={[quantity]}
                    min={1}
                    max={100}
                    step={1}
                    onValueChange={(value) => setQuantity(value[0])}
                  />
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="uppercase"
                      checked={isUppercase}
                      onCheckedChange={setIsUppercase}
                    />
                    <Label htmlFor="uppercase">Uppercase</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="hyphenated"
                      checked={isHyphenated}
                      onCheckedChange={setIsHyphenated}
                    />
                    <Label htmlFor="hyphenated">Include Hyphens</Label>
                  </div>
                </div>

                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating}
                  className="flex items-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>Generate UUID{quantity > 1 ? 's' : ''}</>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {uuids.length > 0 && (
            <div className="mt-6 border rounded-md p-4 bg-secondary">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Generated UUIDs</h3>
                <Button variant="ghost" size="sm" onClick={copyAllToClipboard}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy All
                </Button>
              </div>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {uuids.map((uuid, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-background rounded border">
                    <code className="font-mono text-xs sm:text-sm break-all overflow-hidden max-w-[calc(100%-40px)]">{uuid}</code>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(index)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
};

export default UuidGenerator;
