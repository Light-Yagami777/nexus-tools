
import React, { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

interface WhoisResponse {
  domainName?: string;
  creationDate?: string;
  expiryDate?: string;
  registrarName?: string;
  whoisServer?: string;
  nameServers?: string[];
  states?: string[];
}

const DomainAgeChecker = () => {
  const [domain, setDomain] = useState("");
  const [domainToCheck, setDomainToCheck] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['domainAge', domainToCheck],
    queryFn: async () => {
      if (!domainToCheck) return null;
      
      try {
        // Using WhoisXMLAPI
        const response = await fetch(`https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=at_D1HfDJxVntp09bzKBImlcM4ClQ5rD&domainName=${domainToCheck}&outputFormat=JSON`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch domain information');
        }
        
        const data = await response.json();
        
        // Check if we have an error response
        if (data.ErrorMessage) {
          throw new Error(data.ErrorMessage.msg || 'Failed to fetch domain information');
        }
        
        return data.WhoisRecord;
      } catch (error) {
        console.error("Error fetching domain data:", error);
        throw new Error('Failed to fetch domain data');
      }
    },
    enabled: !!domainToCheck,
    retry: 1,
    retryDelay: 1000,
  });

  // Basic domain validation
  const validateDomain = (domain: string): boolean => {
    if (!domain) {
      setValidationError("Please enter a domain name");
      return false;
    }

    // Remove http/https and www if present
    let cleanDomain = domain;
    if (cleanDomain.startsWith('http://')) cleanDomain = cleanDomain.substring(7);
    if (cleanDomain.startsWith('https://')) cleanDomain = cleanDomain.substring(8);
    if (cleanDomain.startsWith('www.')) cleanDomain = cleanDomain.substring(4);
    
    // Check for valid domain format
    const domainRegex = /^(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|localhost)$/;
    if (!domainRegex.test(cleanDomain)) {
      setValidationError("Please enter a valid domain name (e.g., example.com)");
      return false;
    }
    
    setValidationError(null);
    return true;
  };

  const handleCheck = () => {
    if (!validateDomain(domain)) {
      toast.error(validationError || "Invalid domain");
      return;
    }

    // Clean domain name (remove http/https and www if present)
    let cleanDomain = domain;
    if (cleanDomain.startsWith('http://')) cleanDomain = cleanDomain.substring(7);
    if (cleanDomain.startsWith('https://')) cleanDomain = cleanDomain.substring(8);
    if (cleanDomain.startsWith('www.')) cleanDomain = cleanDomain.substring(4);

    setDomainToCheck(cleanDomain);
    refetch();
  };
  
  // Function to calculate age from creation date
  const calculateAge = (creationDateStr: string) => {
    try {
      const creationDate = new Date(creationDateStr);
      const currentDate = new Date();
      
      let years = currentDate.getFullYear() - creationDate.getFullYear();
      let months = currentDate.getMonth() - creationDate.getMonth();
      let days = currentDate.getDate() - creationDate.getDate();
      
      if (days < 0) {
        months--;
        const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        days += lastMonth.getDate();
      }
      
      if (months < 0) {
        years--;
        months += 12;
      }
      
      return { years, months, days };
    } catch (e) {
      return { years: 0, months: 0, days: 0 };
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return "Unknown date";
    }
  };
  
  const getCreationDate = () => {
    if (data?.createdDate) {
      return data.createdDate;
    } else if (data?.registryData?.createdDate) {
      return data.registryData.createdDate;
    } else if (data?.createdDateNormalized) {
      return data.createdDateNormalized;
    }
    return "Unknown";
  };

  const creationDate = data ? getCreationDate() : null;
  const age = creationDate && creationDate !== "Unknown" ? calculateAge(creationDate) : null;

  return (
    <ToolLayout title="Domain Age Checker" icon={<Calendar size={24} />}>
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <p className="text-muted-foreground mb-4">
              Check the age of any domain name. Enter a domain name without http/https or www (e.g., example.com).
            </p>

            <div className="flex flex-col md:flex-row gap-2">
              <Input
                value={domain}
                onChange={(e) => {
                  setDomain(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                placeholder="Enter domain name (e.g., example.com)"
                className={`flex-grow ${validationError ? 'border-red-500' : ''}`}
              />
              <Button 
                onClick={handleCheck} 
                disabled={isLoading}
                className="whitespace-nowrap"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : "Check Domain Age"}
              </Button>
            </div>
            {validationError && (
              <p className="text-sm text-red-500 mt-1">{validationError}</p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-4 rounded-md text-sm">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Failed to check domain age</p>
                  <p className="text-muted-foreground mt-1">
                    {error instanceof Error ? error.message : 'Please check the domain and try again.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {data && creationDate && creationDate !== "Unknown" && (
            <div className="mt-6 border rounded-md p-6">
              <h3 className="text-lg font-medium mb-4">Domain Age Results</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Domain Name</p>
                  <p className="font-medium">{data.domainName}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Registrar</p>
                  <p className="font-medium">{data.registrarName || 'Unknown'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Registration Date</p>
                  <p className="font-medium">{formatDate(creationDate)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Domain Age</p>
                  <p className="font-medium">
                    {age ? `${age.years} years, ${age.months} months, ${age.days} days` : 'Unknown'}
                  </p>
                </div>
                
                {data.expiryDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Expiry Date</p>
                    <p className="font-medium">{formatDate(data.expiryDate)}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    </ToolLayout>
  );
};

export default DomainAgeChecker;
