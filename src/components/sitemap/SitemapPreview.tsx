
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SitemapPreviewProps {
  generatedSitemap: string;
}

const SitemapPreview: React.FC<SitemapPreviewProps> = ({ generatedSitemap }) => {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedSitemap);
    setIsCopied(true);
    
    toast({
      title: "Copied to Clipboard",
      description: "Sitemap XML has been copied to your clipboard.",
    });
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Generated Sitemap</h2>
        {generatedSitemap && (
          <Button size="sm" variant="outline" onClick={copyToClipboard}>
            <Copy className="h-4 w-4 mr-1" />
            {isCopied ? "Copied!" : "Copy XML"}
          </Button>
        )}
      </div>
      
      {generatedSitemap ? (
        <pre className="bg-muted p-4 rounded-md overflow-auto text-xs font-mono whitespace-pre-wrap min-h-[300px]">
          {generatedSitemap}
        </pre>
      ) : (
        <div className="bg-muted min-h-[300px] flex flex-col items-center justify-center rounded-md text-muted-foreground">
          <Globe className="h-12 w-12 mb-4 opacity-50" />
          <p>Configure your site settings and click "Generate Sitemap" to see the results</p>
        </div>
      )}
      
      <div className="mt-6 text-sm text-muted-foreground">
        <p className="mb-2 font-medium">How to use:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Generate the sitemap XML</li>
          <li>Copy the XML and save it as sitemap.xml</li>
          <li>Upload the file to your website's root directory</li>
          <li>Add <code>Sitemap: https://yourdomain.com/sitemap.xml</code> to your robots.txt file</li>
          <li>Submit the sitemap URL to search engines like Google and Bing</li>
        </ol>
      </div>
    </div>
  );
};

export default SitemapPreview;
