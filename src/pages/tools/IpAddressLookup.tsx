
import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Search, MapPin, Globe, Info, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const IpAddressLookup = () => {
  const [ipAddress, setIpAddress] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // IP validation regex
  const isValidIpv4 = (ip: string) => {
    const pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return pattern.test(ip);
  };

  // Domain name validation
  const isValidDomain = (domain: string) => {
    try {
      // Simple check for at least one dot and no spaces
      return domain.includes('.') && !domain.includes(' ');
    } catch (e) {
      return false;
    }
  };

  const handleLookup = async () => {
    // Reset results when starting a new lookup
    setResults(null);
    
    if (!ipAddress) {
      toast({
        variant: "destructive",
        title: "Input Required",
        description: "Please enter an IP address or domain name.",
      });
      return;
    }

    // Validate input (either valid IP or domain name)
    if (!isValidIpv4(ipAddress) && !isValidDomain(ipAddress)) {
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Please enter a valid IP address (e.g., 8.8.8.8) or domain name (e.g., example.com).",
      });
      return;
    }

    try {
      setIsSearching(true);
      
      // Simulate lookup with a delay
      setTimeout(() => {
        // Generate realistic mock data
        const cityNames = ["New York", "London", "Tokyo", "Sydney", "Berlin", "Paris", "Mumbai", "Singapore"];
        const countryNames = ["United States", "United Kingdom", "Japan", "Australia", "Germany", "France", "India", "Singapore"];
        const isps = ["Google LLC", "Amazon Web Services", "Microsoft Corporation", "Cloudflare, Inc.", "DigitalOcean, LLC"];
        
        const index = ipAddress.charCodeAt(0) % cityNames.length;
        const ispIndex = (ipAddress.charCodeAt(1) || 65) % isps.length;
        
        // Mock latitude and longitude based on the first characters of the IP
        const latitude = (((ipAddress.charCodeAt(0) || 65) % 180) - 90).toFixed(6);
        const longitude = (((ipAddress.charCodeAt(1) || 65) % 360) - 180).toFixed(6);
        
        // Mock results
        const mockResults = {
          ip: isValidIpv4(ipAddress) ? ipAddress : "192.168.1." + (ipAddress.charCodeAt(0) % 255),
          hostname: isValidDomain(ipAddress) ? ipAddress : `server-${ipAddress.replace(/\./g, "-")}.example.net`,
          city: cityNames[index],
          region: "Region " + String.fromCharCode(65 + index),
          country: countryNames[index],
          loc: `${latitude},${longitude}`,
          org: isps[ispIndex],
          postal: `${10000 + (ipAddress.charCodeAt(0) || 65) % 90000}`,
          timezone: "UTC" + (index % 2 === 0 ? "+" : "-") + (index % 12),
        };
        
        setResults(mockResults);
        setIsSearching(false);
        
        toast({
          title: "Lookup Complete",
          description: "IP address information retrieved successfully.",
        });
      }, 1500);
    } catch (error) {
      setIsSearching(false);
      toast({
        variant: "destructive",
        title: "Lookup Failed",
        description: "An error occurred while looking up the IP address.",
      });
    }
  };

  return (
    <ToolLayout
      title="IP Address Lookup"
      description="Look up information about an IP address or domain name, including location, ISP, and more."
      icon={<Search size={24} />}
      extraPadding
    >
      <div className="space-y-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="mr-2 flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Enter IP Address or Domain</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="8.8.8.8 or example.com"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleLookup} 
              disabled={isSearching}
              className="whitespace-nowrap"
            >
              {isSearching ? "Looking up..." : "Lookup"}
            </Button>
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Enter an IP address (e.g., 8.8.8.8) or a domain name (e.g., google.com)</p>
          </div>
        </Card>

        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <Card className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2 space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">IP Information</h2>
                    <dl className="space-y-3">
                      <div className="grid grid-cols-3 gap-1">
                        <dt className="text-muted-foreground">IP Address</dt>
                        <dd className="col-span-2 font-medium">{results.ip}</dd>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <dt className="text-muted-foreground">Hostname</dt>
                        <dd className="col-span-2 font-medium">{results.hostname}</dd>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <dt className="text-muted-foreground">Organization</dt>
                        <dd className="col-span-2 font-medium">{results.org}</dd>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <dt className="text-muted-foreground">Timezone</dt>
                        <dd className="col-span-2 font-medium">{results.timezone}</dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold mb-4">Location</h2>
                    <dl className="space-y-3">
                      <div className="grid grid-cols-3 gap-1">
                        <dt className="text-muted-foreground">City</dt>
                        <dd className="col-span-2 font-medium">{results.city}</dd>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <dt className="text-muted-foreground">Region</dt>
                        <dd className="col-span-2 font-medium">{results.region}</dd>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <dt className="text-muted-foreground">Country</dt>
                        <dd className="col-span-2 font-medium">{results.country}</dd>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <dt className="text-muted-foreground">Postal Code</dt>
                        <dd className="col-span-2 font-medium">{results.postal}</dd>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <dt className="text-muted-foreground">Coordinates</dt>
                        <dd className="col-span-2 font-medium">{results.loc}</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <div className="w-full md:w-1/2 h-96 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center p-4">
                    <MapPin className="h-12 w-12 mx-auto mb-4 text-primary/60" />
                    <p className="text-muted-foreground">
                      Map data visualization would be displayed here in a production environment. 
                    </p>
                    <p className="text-xs mt-2 text-muted-foreground">
                      Coordinates: {results.loc}
                    </p>
                    <Button variant="outline" size="sm" className="mt-4" asChild>
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${results.loc}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        View on Map <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-muted/30">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-medium mb-2">What can you do with this information?</h3>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>Troubleshoot network issues</li>
                    <li>Verify your own public IP address</li>
                    <li>Check if a domain is resolving to the expected IP</li>
                    <li>Identify the geographic location of web services</li>
                    <li>Help with network security analysis</li>
                  </ul>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Note: This tool provides information for educational purposes. In a production environment, 
                    this would connect to actual IP geolocation services.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        <Card className="p-6">
          <div className="flex items-start gap-3">
            <Globe className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-xl font-semibold mb-2">About IP Address Lookups</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>An IP (Internet Protocol) address is a unique identifier assigned to every device connected to a computer network. IP lookups can provide various details about the address, including:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Geographical location (country, region, city)</li>
                  <li>Internet Service Provider (ISP)</li>
                  <li>Organization</li>
                  <li>Hostname</li>
                  <li>Timezone</li>
                </ul>
                <p className="mt-2">This information can be useful for network troubleshooting, security analysis, and geolocation services.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default IpAddressLookup;
