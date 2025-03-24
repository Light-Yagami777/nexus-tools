
import React, { useState } from "react";
import { motion } from "framer-motion";
import ToolLayout from "@/components/ToolLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

const XmlSitemapValidator = () => {
  const [sitemapUrl, setSitemapUrl] = useState("");
  const [xmlContent, setXmlContent] = useState("");
  const [validationResults, setValidationResults] = useState<{
    valid: boolean;
    errors: string[];
    warnings: string[];
    info: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const validateSitemapUrl = async () => {
    if (!sitemapUrl) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a sitemap URL",
      });
      return;
    }

    setLoading(true);
    setValidationResults(null);

    try {
      // In a real implementation, this would call an API to validate the sitemap
      // For this demo, we'll simulate validation with sample results
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // This is a placeholder for the actual validation logic
      const isValid = Math.random() > 0.3; // Simulate random validation result
      
      // Generate some sample feedback based on the URL
      const sampleErrors = isValid ? [] : ["XML is not well-formed", "Missing required urlset element"];
      const sampleWarnings = [
        "Some URLs may have duplicate priority values",
        "Consider adding lastmod dates to all URLs",
      ];
      const sampleInfo = [
        `Found ${Math.floor(Math.random() * 100) + 10} URLs in sitemap`,
        `Average priority value: ${(Math.random() * 0.5 + 0.5).toFixed(1)}`,
      ];

      setValidationResults({
        valid: isValid,
        errors: sampleErrors,
        warnings: sampleWarnings,
        info: sampleInfo,
      });

      toast({
        title: isValid ? "Validation successful" : "Validation failed",
        description: isValid
          ? "Your sitemap passed validation with some recommendations"
          : "Your sitemap has errors that need to be fixed",
        variant: isValid ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Error validating sitemap:", error);
      toast({
        variant: "destructive",
        title: "Validation failed",
        description: "Could not validate the sitemap. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const validateXmlContent = async () => {
    if (!xmlContent) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter XML content",
      });
      return;
    }

    setLoading(true);
    setValidationResults(null);

    try {
      // In a real implementation, this would validate the XML content
      // For this demo, we'll simulate validation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Basic check for XML structure
      const isValid = xmlContent.includes("<urlset") && xmlContent.includes("<url>") && !xmlContent.includes("INVALID_XML");
      
      const sampleErrors = isValid ? [] : ["XML is not well-formed", "Missing required elements"];
      const sampleWarnings = isValid 
        ? ["Some URLs may have duplicate priority values", "Consider adding lastmod dates to all URLs"]
        : ["The XML structure appears incomplete"];
      const sampleInfo = isValid
        ? [`Found approximately ${Math.floor(xmlContent.split("<url>").length - 1)} URLs in sitemap`]
        : ["No valid URLs detected"];

      setValidationResults({
        valid: isValid,
        errors: sampleErrors,
        warnings: sampleWarnings,
        info: sampleInfo,
      });

      toast({
        title: isValid ? "Validation successful" : "Validation failed",
        description: isValid
          ? "Your XML content passed validation with some recommendations"
          : "Your XML content has errors that need to be fixed",
        variant: isValid ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Error validating XML content:", error);
      toast({
        variant: "destructive",
        title: "Validation failed",
        description: "Could not validate the XML content. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const ResultSection = ({ title, items, type }: { title: string; items: string[]; type: "error" | "warning" | "info" }) => {
    if (items.length === 0) return null;
    
    const getIconClass = () => {
      switch (type) {
        case "error": return "text-red-500";
        case "warning": return "text-yellow-500";
        case "info": return "text-blue-500";
        default: return "";
      }
    };

    return (
      <div className="mb-4">
        <h3 className={cn("font-medium mb-2", getIconClass())}>{title}</h3>
        <ul className="list-disc pl-5 space-y-1">
          {items.map((item, i) => (
            <li key={i} className="text-sm">{item}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <ToolLayout title="XML Sitemap Validator">
      <Card className="p-6 mb-8">
        <div className="mb-6">
          <p className="text-lg mb-4">
            Validate your XML sitemaps for errors and compliance with search engine requirements. 
            Make sure your sitemap follows the correct format for optimal indexing.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Validate by URL</h2>
            <div className="flex gap-3">
              <Input
                value={sitemapUrl}
                onChange={(e) => setSitemapUrl(e.target.value)}
                placeholder="https://example.com/sitemap.xml"
                className="flex-1"
              />
              <Button 
                onClick={validateSitemapUrl} 
                disabled={loading || !sitemapUrl}
              >
                Validate URL
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-x-0 top-1/2 border-t border-border -z-10"></div>
            <div className="flex justify-center">
              <span className="bg-card px-2 text-muted-foreground">OR</span>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Validate XML Content</h2>
            <Textarea
              value={xmlContent}
              onChange={(e) => setXmlContent(e.target.value)}
              placeholder="Paste your XML sitemap content here..."
              className="h-[200px] mb-3 font-mono text-sm"
            />
            <Button 
              onClick={validateXmlContent} 
              disabled={loading || !xmlContent}
              className="w-full"
            >
              Validate XML Content
            </Button>
          </div>
        </div>
      </Card>

      {validationResults && (
        <Card className={cn(
          "p-6 mb-8 border-l-4",
          validationResults.valid ? "border-l-green-500" : "border-l-red-500"
        )}>
          <h2 className={cn(
            "text-xl font-semibold mb-4",
            validationResults.valid ? "text-green-600" : "text-red-600"
          )}>
            {validationResults.valid ? "Validation Successful" : "Validation Failed"}
          </h2>
          
          <ResultSection 
            title="Errors" 
            items={validationResults.errors} 
            type="error" 
          />
          
          <ResultSection 
            title="Warnings" 
            items={validationResults.warnings} 
            type="warning" 
          />
          
          <ResultSection 
            title="Information" 
            items={validationResults.info} 
            type="info" 
          />
          
          {validationResults.valid && validationResults.errors.length === 0 && (
            <div className="bg-green-50 p-4 rounded-md border border-green-200">
              <p className="text-green-700">
                Your sitemap looks good! Follow the recommendations above for better optimization.
              </p>
            </div>
          )}
        </Card>
      )}

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">XML Sitemap Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Follow the sitemap protocol at <a href="https://www.sitemaps.org/protocol.html" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">sitemaps.org</a></li>
          <li>Keep your sitemap under 50MB in size and 50,000 URLs</li>
          <li>Use the correct XML namespace declarations</li>
          <li>Include lastmod, changefreq, and priority tags for better crawling</li>
          <li>Ensure all URLs use the same protocol (http vs https)</li>
          <li>Submit your sitemap to Google Search Console and other search engines</li>
        </ul>
      </Card>
    </ToolLayout>
  );
};

export default XmlSitemapValidator;
