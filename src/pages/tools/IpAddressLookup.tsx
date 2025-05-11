
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

  const {
    data: ipData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['ipData', ipToFetch],
    queryFn: async () => {
      if (!ipToFetch) return null;
      const response = await fetch(`https://ipinfo.io/${ipToFetch}/json?token=94b65fa6c9eb35`);
      if (!response.ok) {
        throw new Error('Failed to fetch IP data');
      }
      return response.json() as Promise<IpData>;
    },
    enabled: !!ipToFetch,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ipInput.trim()) {
      toast.error('Please enter an IP address or domain');
      return;
    }
    setIpToFetch(ipInput.trim());
    refetch();
  };

  const handleMyIP = () => {
    setIpInput('');
    setIpToFetch('');
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
                  onChange={(e) => setIpInput(e.target.value)}
                  className="flex-grow"
                />
                <Button 
                  type="submit" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Looking up...' : 'Lookup'}
                </Button>
              </div>
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
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{ipData.city}, {ipData.region}, {ipData.country}</p>
                </div>
                
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
