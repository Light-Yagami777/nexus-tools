
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ToolLayout } from '@/components/ToolLayout';
import { Globe, Info, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

interface IpData {
  ip: string;
  hostname?: string;
  city?: string;
  region?: string;
  country?: string;
  loc?: string;
  org?: string;
  postal?: string;
  timezone?: string;
  readme?: string;
}

const IpAddressLookup = () => {
  const [ipInput, setIpInput] = useState('');
  const [ipToFetch, setIpToFetch] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const {
    data: ipData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['ipData', ipToFetch],
    queryFn: async () => {
      if (!ipToFetch) return null;
      
      try {
        const response = await fetch(`https://ipinfo.io/${ipToFetch}/json?token=94b65fa6c9eb35`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to fetch IP data');
        }
        return response.json() as Promise<IpData>;
      } catch (err) {
        console.error("Error fetching IP data:", err);
        throw new Error('Failed to fetch IP data');
      }
    },
    enabled: !!ipToFetch,
    retry: 1,
  });

  const validateInput = (input: string): boolean => {
    // Check if input is empty
    if (!input.trim()) {
      setValidationError("Please enter an IP address or domain");
      return false;
    }

    // Check if it's a domain name (contains at least one dot and no spaces)
    if (input.includes('.') && !input.includes(' ')) {
      setValidationError(null);
      return true;
    }

    // Check if it's a valid IPv4
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    if (ipv4Regex.test(input)) {
      const parts = input.split('.').map(part => parseInt(part, 10));
      const isValid = parts.every(part => part >= 0 && part <= 255);
      
      if (!isValid) {
        setValidationError("Invalid IP address format. IP values must be between 0-255.");
        return false;
      }
      
      setValidationError(null);
      return true;
    }

    // Check if it's a valid IPv6
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::$|^::1$|^([0-9a-fA-F]{1,4}::?){1,7}([0-9a-fA-F]{1,4})$/;
    if (ipv6Regex.test(input)) {
      setValidationError(null);
      return true;
    }

    setValidationError("Please enter a valid IP address or domain");
    return false;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateInput(ipInput.trim())) {
      setIpToFetch(ipInput.trim());
      refetch();
    } else {
      toast.error(validationError || "Invalid input");
    }
  };

  const handleMyIP = () => {
    setIpInput('');
    setIpToFetch('');
    setValidationError(null);
    refetch();
  };

  return (
    <ToolLayout title="IP Address Lookup" icon={<Globe size={24} />}>
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">IP Address Lookup</h2>
            <p className="text-muted-foreground">
              Look up details about an IP address or domain name
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="ip-input" className="block text-sm font-medium mb-1">
                Enter an IP Address or Domain
              </label>
              <div className="flex space-x-2">
                <Input
                  id="ip-input"
                  placeholder="e.g. 8.8.8.8 or example.com"
                  value={ipInput}
                  onChange={(e) => {
                    setIpInput(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  className={`flex-grow ${validationError ? 'border-red-500' : ''}`}
                />
                <Button 
                  type="submit" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Looking up...' : 'Lookup'}
                </Button>
              </div>
              {validationError && (
                <p className="text-sm text-red-500 mt-1">{validationError}</p>
              )}
            </div>

            <div className="flex justify-center">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleMyIP}
                disabled={isLoading}
              >
                What's my IP?
              </Button>
            </div>
          </form>

          {error && (
            <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800 rounded-md flex gap-2 text-sm">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <div>
                <p className="font-medium">Error looking up IP address</p>
                <p className="text-muted-foreground">
                  Please check the IP address or domain name and try again.
                </p>
              </div>
            </div>
          )}

          {ipData && (
            <div className="bg-muted p-5 rounded-md">
              <h3 className="text-lg font-semibold mb-4">IP Information</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">IP Address</p>
                  <p className="font-medium">{ipData.ip}</p>
                </div>
                
                {ipData.hostname && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Hostname</p>
                    <p className="font-medium">{ipData.hostname}</p>
                  </div>
                )}
                
                {ipData.city && ipData.region && ipData.country && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{ipData.city}, {ipData.region}, {ipData.country}</p>
                  </div>
                )}
                
                {ipData.org && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Organization</p>
                    <p className="font-medium">{ipData.org}</p>
                  </div>
                )}
                
                {ipData.timezone && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Timezone</p>
                    <p className="font-medium">{ipData.timezone}</p>
                  </div>
                )}
                
                {ipData.postal && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Postal</p>
                    <p className="font-medium">{ipData.postal}</p>
                  </div>
                )}
                
                {ipData.loc && (
                  <div className="col-span-1 sm:col-span-2 space-y-1">
                    <p className="text-sm text-muted-foreground">Coordinates</p>
                    <p className="font-medium">{ipData.loc}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t text-sm text-muted-foreground flex items-start gap-1">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>
                  This data is provided by ipinfo.io and may not be 100% accurate.
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </ToolLayout>
  );
};

export default IpAddressLookup;
