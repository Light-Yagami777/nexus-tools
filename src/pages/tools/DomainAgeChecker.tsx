
import React, { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { toast } from "sonner";

const DomainAgeChecker = () => {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCheck = () => {
    if (!domain) {
      toast.error("Please enter a domain name");
      return;
    }

    // Basic domain validation
    const domainRegex = /^(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|localhost)$/;
    if (!domainRegex.test(domain)) {
      toast.error("Please enter a valid domain name");
      return;
    }

    setLoading(true);

    // In a real application, this would call an API to get domain age information
    // For demonstration, we'll create mock data after a short delay
    setTimeout(() => {
      // Generate a random past date (1-15 years ago)
      const currentDate = new Date();
      const years = Math.floor(Math.random() * 15) + 1;
      const registerDate = new Date(
        currentDate.getFullYear() - years,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1
      );
      
      // Calculate age in years, months and days
      const yearDiff = currentDate.getFullYear() - registerDate.getFullYear();
      const monthDiff = currentDate.getMonth() - registerDate.getMonth();
      const dayDiff = currentDate.getDate() - registerDate.getDate();
      
      let ageYears = yearDiff;
      let ageMonths = monthDiff;
      let ageDays = dayDiff;
      
      if (dayDiff < 0) {
        ageMonths -= 1;
        const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0);
        ageDays += lastMonth.getDate();
      }
      
      if (ageMonths < 0) {
        ageYears -= 1;
        ageMonths += 12;
      }

      setResult({
        domain,
        registrationDate: registerDate.toISOString(),
        ageYears,
        ageMonths,
        ageDays,
        registrar: ["GoDaddy", "Namecheap", "Google Domains", "NameSilo", "Cloudflare"][Math.floor(Math.random() * 5)],
      });

      setLoading(false);
    }, 1500);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
                onChange={(e) => setDomain(e.target.value)}
                placeholder="Enter domain name (e.g., example.com)"
                className="flex-grow"
              />
              <Button 
                onClick={handleCheck} 
                disabled={loading}
                className="whitespace-nowrap"
              >
                {loading ? "Checking..." : "Check Domain Age"}
              </Button>
            </div>
          </div>

          {result && (
            <div className="mt-6 border rounded-md p-6">
              <h3 className="text-lg font-medium mb-4">Domain Age Results</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Domain Name</p>
                  <p className="font-medium">{result.domain}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Registrar</p>
                  <p className="font-medium">{result.registrar}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Registration Date</p>
                  <p className="font-medium">{formatDate(result.registrationDate)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Domain Age</p>
                  <p className="font-medium">
                    {result.ageYears} years, {result.ageMonths} months, {result.ageDays} days
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </ToolLayout>
  );
};

export default DomainAgeChecker;
