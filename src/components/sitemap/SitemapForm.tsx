
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { FileText, RefreshCw } from 'lucide-react';

interface SitemapFormProps {
  baseUrl: string;
  setBaseUrl: (url: string) => void;
  frequency: string;
  setFrequency: (frequency: string) => void;
  priority: string;
  setPriority: (priority: string) => void;
  includeLastmod: boolean;
  setIncludeLastmod: (include: boolean) => void;
  urls: string[];
  setUrls: (urls: string[]) => void;
  generateSitemap: () => void;
  resetForm: () => void;
}

const SitemapForm: React.FC<SitemapFormProps> = ({
  baseUrl,
  setBaseUrl,
  frequency,
  setFrequency,
  priority,
  setPriority,
  includeLastmod,
  setIncludeLastmod,
  urls,
  setUrls,
  generateSitemap,
  resetForm,
}) => {
  const [newUrl, setNewUrl] = useState('');
  const { toast } = useToast();

  const addUrl = () => {
    if (newUrl.trim()) {
      setUrls([...urls, newUrl.trim()]);
      setNewUrl('');
    }
  };

  const removeUrl = (index: number) => {
    const newUrls = [...urls];
    newUrls.splice(index, 1);
    setUrls(newUrls);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addUrl();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="baseUrl" className="block mb-2">
          Base URL <span className="text-red-500">*</span>
        </Label>
        <Input
          id="baseUrl"
          placeholder="https://example.com"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          className="mb-2"
        />
        <p className="text-xs text-muted-foreground">
          Enter the base URL of your website (e.g., https://example.com)
        </p>
      </div>
      
      <div>
        <Label htmlFor="frequency" className="block mb-2">
          Change Frequency
        </Label>
        <select
          id="frequency"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="always">always</option>
          <option value="hourly">hourly</option>
          <option value="daily">daily</option>
          <option value="weekly">weekly</option>
          <option value="monthly">monthly</option>
          <option value="yearly">yearly</option>
          <option value="never">never</option>
        </select>
      </div>
      
      <div>
        <Label htmlFor="priority" className="block mb-2">
          Priority
        </Label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="1.0">1.0 (Highest)</option>
          <option value="0.9">0.9</option>
          <option value="0.8">0.8</option>
          <option value="0.7">0.7</option>
          <option value="0.6">0.6</option>
          <option value="0.5">0.5</option>
          <option value="0.4">0.4</option>
          <option value="0.3">0.3</option>
          <option value="0.2">0.2</option>
          <option value="0.1">0.1</option>
          <option value="0.0">0.0 (Lowest)</option>
        </select>
      </div>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="lastmod" className="cursor-pointer">
          Include Last Modified Date
        </Label>
        <Switch
          id="lastmod"
          checked={includeLastmod}
          onCheckedChange={setIncludeLastmod}
        />
      </div>
      
      <div className="pt-4 border-t">
        <Label htmlFor="newUrl" className="block mb-2">
          Add URLs <span className="text-red-500">*</span>
        </Label>
        <div className="flex space-x-2 mb-2">
          <Input
            id="newUrl"
            placeholder="/page, /about, /contact, etc."
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button type="button" onClick={addUrl}>Add</Button>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Enter relative paths or full URLs. Press Enter to add quickly.
        </p>
        
        {urls.length > 0 && (
          <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
            <h3 className="text-sm font-medium mb-2">Added URLs:</h3>
            <ul className="text-sm space-y-1">
              {urls.map((url, index) => (
                <li key={index} className="flex justify-between items-center py-1 px-2 hover:bg-muted/50 rounded">
                  <span className="truncate">{url}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeUrl(index)}
                    className="h-6 w-6 p-0"
                  >
                    ×
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-8 flex space-x-4">
        <Button onClick={generateSitemap} className="flex-1">
          <FileText className="h-4 w-4 mr-1" />
          Generate Sitemap
        </Button>
        <Button variant="outline" onClick={resetForm}>
          <RefreshCw className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>
    </div>
  );
};

export default SitemapForm;
