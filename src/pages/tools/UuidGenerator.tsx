
import React, { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Key, Copy, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const UuidGenerator = () => {
  const [uuids, setUuids] = useState<string[]>([]);
  const [version, setVersion] = useState<string>("v4");
  const [quantity, setQuantity] = useState<number>(5);
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [hyphens, setHyphens] = useState<boolean>(true);
  const [braces, setBraces] = useState<boolean>(false);

  // Simple function to generate UUIDv4
  const generateUUIDv4 = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, 
            v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // Generate RFC4122 timestamp-based UUIDv1 (simplified version)
  const generateUUIDv1 = (): string => {
    const timeNow = new Date().getTime();
    const time = timeNow * 10000 + 122192928000000000; // Add offset to get UUID v1 time
    const timeStr = time.toString(16).padStart(16, '0');
    const clockSeq = Math.floor(Math.random() * 16384).toString(16).padStart(4, '0');
    const nodeId = Array.from({length: 6}, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('');
    
    // Format: time_low-time_mid-time_high_and_version-clock_seq-node
    return `${timeStr.slice(0, 8)}-${timeStr.slice(8, 12)}-1${timeStr.slice(13, 16)}-${clockSeq.slice(0, 2)}${clockSeq.slice(2, 4)}-${nodeId}`;
  };

  const formatUUID = (uuid: string): string => {
    let formatted = uuid;
    
    if (!hyphens) {
      formatted = formatted.replace(/-/g, '');
    }
    
    if (uppercase) {
      formatted = formatted.toUpperCase();
    }
    
    if (braces) {
      formatted = `{${formatted}}`;
    }
    
    return formatted;
  };

  const generateUUIDs = () => {
    const generatedUUIDs = [];
    
    for (let i = 0; i < quantity; i++) {
      let uuid = version === "v4" ? generateUUIDv4() : generateUUIDv1();
      uuid = formatUUID(uuid);
      generatedUUIDs.push(uuid);
    }
    
    setUuids(generatedUUIDs);
    toast.success(`Generated ${quantity} UUIDs`);
  };

  const copyUUID = (uuid: string) => {
    navigator.clipboard.writeText(uuid).then(() => {
      toast.success("UUID copied to clipboard");
    }).catch(() => {
      toast.error("Failed to copy UUID");
    });
  };

  const copyAllUUIDs = () => {
    const allUUIDs = uuids.join('\n');
    navigator.clipboard.writeText(allUUIDs).then(() => {
      toast.success(`${uuids.length} UUIDs copied to clipboard`);
    }).catch(() => {
      toast.error("Failed to copy UUIDs");
    });
  };

  // Generate initial UUIDs on component mount
  useEffect(() => {
    generateUUIDs();
  }, []);

  return (
    <ToolLayout 
      title="UUID Generator" 
      description="Generate UUIDs/GUIDs for your applications and databases"
      icon={<Key className="h-6 w-6" />}
      extraPadding={true}
    >
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>UUID Generator</CardTitle>
          <CardDescription>Configure and generate UUIDs/GUIDs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>UUID Version</Label>
              <RadioGroup 
                value={version} 
                onValueChange={setVersion}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="v4" id="v4" />
                  <Label htmlFor="v4">Version 4 (Random)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="v1" id="v1" />
                  <Label htmlFor="v1">Version 1 (Timestamp-based)</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <div className="flex items-center space-x-4 mt-1">
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max="100"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">Max: 100</span>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Format Options</Label>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="uppercase" className="cursor-pointer">Uppercase</Label>
                  <Switch
                    id="uppercase"
                    checked={uppercase}
                    onCheckedChange={setUppercase}
                  />
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="hyphens" className="cursor-pointer">Include Hyphens</Label>
                  <Switch
                    id="hyphens"
                    checked={hyphens}
                    onCheckedChange={setHyphens}
                  />
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="braces" className="cursor-pointer">Include Braces</Label>
                  <Switch
                    id="braces"
                    checked={braces}
                    onCheckedChange={setBraces}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={generateUUIDs}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate {quantity > 1 ? `${quantity} UUIDs` : 'UUID'}
              </Button>
              
              {uuids.length > 0 && (
                <Button variant="outline" onClick={copyAllUUIDs}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy All UUIDs
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {uuids.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated UUIDs</CardTitle>
            <CardDescription>Click on any UUID to copy it to clipboard</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {uuids.map((uuid, index) => (
                <div 
                  key={index}
                  className="flex items-center p-2 border rounded-md group hover:bg-accent"
                >
                  <code className="text-sm font-mono flex-1">{uuid}</code>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyUUID(uuid)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </ToolLayout>
  );
};

export default UuidGenerator;
