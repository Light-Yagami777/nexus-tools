
import React, { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Copy, RefreshCw } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const UuidGenerator = () => {
  const [uuids, setUuids] = useState<string[]>([]);
  const [version, setVersion] = useState<string>('v4');
  const [count, setCount] = useState<number>(5);

  const generateUUID = (version: string) => {
    if (version === 'v4') {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    } else {
      // Simple v1-like UUID (not a real v1 UUID, just for demonstration)
      const now = new Date().getTime();
      return 'xxxxxxxx-xxxx-1xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (now + Math.random() * 16) % 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
    }
  };

  const generateUUIDs = () => {
    const newUuids = [];
    for (let i = 0; i < count; i++) {
      newUuids.push(generateUUID(version));
    }
    setUuids(newUuids);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success('UUID copied to clipboard'))
      .catch(() => toast.error('Failed to copy'));
  };

  const copyAllToClipboard = () => {
    navigator.clipboard.writeText(uuids.join('\n'))
      .then(() => toast.success('All UUIDs copied to clipboard'))
      .catch(() => toast.error('Failed to copy'));
  };

  return (
    <ToolLayout title="UUID Generator" icon={<RefreshCw size={24} />}>
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium mb-2">UUID Version</h2>
            <RadioGroup value={version} onValueChange={setVersion} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="v4" id="v4" />
                <Label htmlFor="v4">Version 4 (Random)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="v1" id="v1" />
                <Label htmlFor="v1">Version 1 (Time-based)</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <h2 className="text-lg font-medium mb-2">Number of UUIDs</h2>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCount(Math.max(1, count - 1))}
              >
                -
              </Button>
              <span className="w-8 text-center">{count}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCount(Math.min(100, count + 1))}
              >
                +
              </Button>
            </div>
          </div>
          
          <Button onClick={generateUUIDs} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate UUIDs
          </Button>
          
          {uuids.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">Generated UUIDs</h2>
                <Button variant="outline" size="sm" onClick={copyAllToClipboard}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy All
                </Button>
              </div>
              
              <div className="space-y-2">
                {uuids.map((uuid, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <code className="font-mono text-sm">{uuid}</code>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(uuid)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </ToolLayout>
  );
};

export default UuidGenerator;
