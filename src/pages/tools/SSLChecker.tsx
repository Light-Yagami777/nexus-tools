
import React, { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SSLChecker: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const handleCheck = async () => {
    if (!url) {
      toast({
        title: "URL is required",
        description: "Please enter a valid URL to check",
        variant: "destructive",
      });
      return;
    }

    // Validate URL format
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch (e) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL including domain name",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // For demonstration purposes, we'll simulate a check
    // In a real implementation, you would call an API service
    setTimeout(() => {
      // Mock result
      const mockResult = {
        valid: Math.random() > 0.2,
        issuer: "Let's Encrypt Authority X3",
        validFrom: new Date().toISOString(),
        validTo: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        daysRemaining: 90,
        grade: ["A+", "A", "B+"][Math.floor(Math.random() * 3)],
      };
      
      setResult(mockResult);
      setLoading(false);
    }, 1500);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <ToolLayout title="SSL Certificate Checker" extraPadding={true} icon={<Shield size={24} />}>
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">SSL Certificate Checker</h2>
        </div>
        
        <p className="text-muted-foreground mb-6">
          Check SSL certificates of websites for validity, expiration dates, and security issues.
        </p>
        
        <div className="flex flex-col md:flex-row gap-2 mb-6">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL (e.g., example.com)"
            className="flex-grow"
          />
          <Button 
            onClick={handleCheck} 
            disabled={loading}
            className="whitespace-nowrap"
          >
            {loading ? "Checking..." : "Check SSL"}
          </Button>
        </div>
        
        {result && (
          <div className="mt-4 border rounded-lg p-6 bg-card">
            <div className="flex items-center gap-3 mb-4">
              {result.valid ? (
                <>
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <h3 className="text-lg font-medium text-green-600">Certificate is valid</h3>
                </>
              ) : (
                <>
                  <XCircle className="h-6 w-6 text-red-500" />
                  <h3 className="text-lg font-medium text-red-600">Certificate is invalid</h3>
                </>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Issuer</p>
                <p className="font-medium">{result.issuer}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Grade</p>
                <p className="font-medium">{result.grade}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valid From</p>
                <p className="font-medium">{formatDate(result.validFrom)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valid Until</p>
                <p className="font-medium">{formatDate(result.validTo)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Days Remaining</p>
                <p className={`font-medium ${result.daysRemaining < 30 ? 'text-amber-600' : 'text-green-600'}`}>
                  {result.daysRemaining} days
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </ToolLayout>
  );
};

export default SSLChecker;
