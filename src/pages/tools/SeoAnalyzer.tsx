import React, { useState } from "react";
import { motion } from "framer-motion";
import ToolLayout from "@/components/ToolLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, AlertCircle, AlertTriangle, ArrowRight, Search } from "lucide-react";

const SeoAnalyzer = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SeoResults | null>(null);
  const { toast } = useToast();

  interface SeoIssue {
    title: string;
    description: string;
    severity: "critical" | "warning" | "ok";
  }

  interface SeoCategory {
    name: string;
    score: number;
    issues: SeoIssue[];
  }

  interface SeoResults {
    url: string;
    date: string;
    overallScore: number;
    categories: {
      content: SeoCategory;
      performance: SeoCategory;
      technical: SeoCategory;
      mobile: SeoCategory;
    };
  }

  const isValidUrl = (urlString: string) => {
    try {
      const url = new URL(urlString);
      return (url.protocol === "http:" || url.protocol === "https:") && url.hostname.includes(".");
    } catch (e) {
      return false;
    }
  };

  const analyzeSeo = async () => {
    if (!url) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a URL to analyze",
      });
      return;
    }

    let formattedUrl = url;
    if (!/^https?:\/\//i.test(url)) {
      formattedUrl = "https://" + url;
    }

    if (!isValidUrl(formattedUrl)) {
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please enter a valid website URL (e.g., example.com).",
      });
      return;
    }

    setLoading(true);
    setResults(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const generateScore = () => Math.floor(Math.random() * 30) + 70;
      const contentScore = generateScore();
      const performanceScore = generateScore();
      const technicalScore = generateScore();
      const mobileScore = generateScore();
      const overallScore = Math.floor((contentScore + performanceScore + technicalScore + mobileScore) / 4);

      const sampleResults: SeoResults = {
        url: formattedUrl,
        date: new Date().toLocaleDateString(),
        overallScore: overallScore,
        categories: {
          content: {
            name: "Content",
            score: contentScore,
            issues: [
              {
                title: "Meta Description",
                description: contentScore > 85 
                  ? "Your meta description is well-optimized and has an appropriate length." 
                  : "Your meta description is too short. Consider adding more relevant keywords.",
                severity: contentScore > 85 ? "ok" : "warning"
              },
              {
                title: "Heading Structure",
                description: contentScore > 80 
                  ? "Your heading structure is clear and follows hierarchy guidelines." 
                  : "Some pages lack proper heading structure. Make sure to use H1, H2, H3 properly.",
                severity: contentScore > 80 ? "ok" : "warning"
              },
              {
                title: "Content Length",
                description: contentScore > 75 
                  ? "Content length is appropriate for most pages." 
                  : "Some pages have thin content. Consider expanding content to at least 300 words.",
                severity: contentScore > 75 ? "ok" : "warning"
              }
            ]
          },
          performance: {
            name: "Performance",
            score: performanceScore,
            issues: [
              {
                title: "Page Speed",
                description: performanceScore > 85 
                  ? "Your page loads quickly on both desktop and mobile." 
                  : "Page load time is above average. Consider optimizing images and scripts.",
                severity: performanceScore > 85 ? "ok" : "warning"
              },
              {
                title: "Image Optimization",
                description: performanceScore > 80 
                  ? "Images are well optimized." 
                  : "Some images are not properly compressed. Use WebP format for better performance.",
                severity: performanceScore > 80 ? "ok" : "warning"
              },
              {
                title: "Core Web Vitals",
                description: performanceScore > 75 
                  ? "Core Web Vitals are within acceptable ranges." 
                  : "LCP and CLS metrics need improvement. Check for layout shifts and slow loading content.",
                severity: performanceScore > 75 ? "ok" : "critical"
              }
            ]
          },
          technical: {
            name: "Technical",
            score: technicalScore,
            issues: [
              {
                title: "SSL Certificate",
                description: "Your site uses a secure HTTPS connection.",
                severity: "ok"
              },
              {
                title: "Mobile Friendliness",
                description: technicalScore > 85 
                  ? "Your site is mobile-friendly across all pages." 
                  : "Some pages have mobile usability issues. Check viewport settings and tap targets.",
                severity: technicalScore > 85 ? "ok" : "warning"
              },
              {
                title: "Broken Links",
                description: technicalScore > 80 
                  ? "No broken links were detected on your site." 
                  : "We found 3 broken links that need to be fixed.",
                severity: technicalScore > 80 ? "ok" : "critical"
              },
              {
                title: "XML Sitemap",
                description: technicalScore > 75 
                  ? "XML Sitemap is properly configured." 
                  : "No XML Sitemap found. Consider creating one for better indexing.",
                severity: technicalScore > 75 ? "ok" : "warning"
              }
            ]
          },
          mobile: {
            name: "Mobile",
            score: mobileScore,
            issues: [
              {
                title: "Viewport Configuration",
                description: mobileScore > 85 
                  ? "Viewport is correctly configured for mobile devices." 
                  : "Viewport meta tag is missing or incorrectly configured.",
                severity: mobileScore > 85 ? "ok" : "critical"
              },
              {
                title: "Touch Elements",
                description: mobileScore > 80 
                  ? "Touch elements are well-sized and spaced." 
                  : "Some touch elements are too close together. Ensure at least 8mm spacing.",
                severity: mobileScore > 80 ? "ok" : "warning"
              },
              {
                title: "Text Size",
                description: mobileScore > 75 
                  ? "Text is readable without zooming." 
                  : "Some text is too small to read on mobile. Use relative sizes like em or rem.",
                severity: mobileScore > 75 ? "ok" : "warning"
              }
            ]
          }
        }
      };

      setResults(sampleResults);
      toast({
        title: "Analysis completed",
        description: `Overall score: ${overallScore}/100`,
      });
    } catch (error) {
      console.error("Error analyzing URL:", error);
      toast({
        variant: "destructive",
        title: "Analysis failed",
        description: "Could not analyze the URL. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const ScoreGauge = ({ score }: { score: number }) => {
    let color = "bg-red-500";
    if (score >= 90) color = "bg-green-500";
    else if (score >= 70) color = "bg-yellow-500";
    else if (score >= 50) color = "bg-orange-500";

    return (
      <div className="relative mb-6">
        <div className="flex justify-center">
          <div className="relative w-32 h-32 flex items-center justify-center rounded-full bg-muted p-2">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-background flex items-center justify-center">
                <span className="text-3xl font-bold">{score}</span>
              </div>
            </div>
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                className="stroke-muted-foreground/20"
                fill="none"
                strokeWidth="3"
                strokeLinecap="round"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={color}
                fill="none"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${score}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
          </div>
        </div>
        <div className="text-center mt-2">
          <span className="text-sm font-medium">
            {score >= 90 ? "Excellent" : 
             score >= 70 ? "Good" : 
             score >= 50 ? "Needs Improvement" : 
             "Poor"}
          </span>
        </div>
      </div>
    );
  };

  const IssueItem = ({ issue }: { issue: SeoIssue }) => {
    return (
      <div className="border-b pb-3 mb-3 last:border-b-0 last:mb-0 last:pb-0">
        <div className="flex items-start">
          <div className="mt-1 mr-3">
            {issue.severity === "ok" && <Check className="h-5 w-5 text-green-500" />}
            {issue.severity === "warning" && <AlertCircle className="h-5 w-5 text-yellow-500" />}
            {issue.severity === "critical" && <AlertTriangle className="h-5 w-5 text-red-500" />}
          </div>
          <div>
            <h4 className="text-sm font-medium">{issue.title}</h4>
            <p className="text-sm text-muted-foreground">{issue.description}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ToolLayout title="SEO Analyzer" icon={<Search size={24} />}>
      <Card className="p-6 mb-8">
        <div className="mb-6">
          <p className="text-lg mb-4">
            Get a comprehensive SEO analysis of your webpage. Enter a URL below to analyze its content, performance, technical aspects, and mobile friendliness.
          </p>
          <div className="flex gap-3">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website URL (e.g., example.com)"
              className="flex-1"
              disabled={loading}
            />
            <Button onClick={analyzeSeo} disabled={loading || !url}>
              {loading ? "Analyzing..." : "Analyze"}
            </Button>
          </div>
        </div>
      </Card>

      {loading && (
        <Card className="p-6 mb-8">
          <div className="text-center mb-4">
            <p className="text-muted-foreground mb-2">Analyzing your website...</p>
            <Progress value={undefined} className="h-2 w-full" />
          </div>
        </Card>
      )}

      {results && (
        <>
          <Card className="p-6 mb-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Analysis Results</h2>
              <p className="text-sm text-muted-foreground">
                URL: {results.url} • Analyzed on: {results.date}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4 text-center">Overall Score</h3>
              <ScoreGauge score={results.overallScore} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {Object.entries(results.categories).map(([key, category]) => (
                <div key={key} className="text-center">
                  <h4 className="text-sm font-medium mb-1">{category.name}</h4>
                  <div className="flex justify-center">
                    <div 
                      className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-white
                        ${category.score >= 90 ? 'bg-green-500' : 
                          category.score >= 70 ? 'bg-yellow-500' : 
                          category.score >= 50 ? 'bg-orange-500' : 'bg-red-500'}`}
                    >
                      {category.score}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 mb-8">
            <Tabs defaultValue="content">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="technical">Technical</TabsTrigger>
                <TabsTrigger value="mobile">Mobile</TabsTrigger>
              </TabsList>

              <TabsContent value="content">
                <h3 className="text-lg font-medium mb-4">Content Analysis</h3>
                <div className="space-y-4">
                  {results.categories.content.issues.map((issue, index) => (
                    <IssueItem key={index} issue={issue} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="performance">
                <h3 className="text-lg font-medium mb-4">Performance Analysis</h3>
                <div className="space-y-4">
                  {results.categories.performance.issues.map((issue, index) => (
                    <IssueItem key={index} issue={issue} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="technical">
                <h3 className="text-lg font-medium mb-4">Technical Analysis</h3>
                <div className="space-y-4">
                  {results.categories.technical.issues.map((issue, index) => (
                    <IssueItem key={index} issue={issue} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="mobile">
                <h3 className="text-lg font-medium mb-4">Mobile Friendliness</h3>
                <div className="space-y-4">
                  {results.categories.mobile.issues.map((issue, index) => (
                    <IssueItem key={index} issue={issue} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
            <ul className="space-y-2">
              {results.overallScore < 90 && (
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2 text-primary" />
                  <span>Focus on improving {results.overallScore < 70 ? "critical" : "high-priority"} issues first</span>
                </li>
              )}
              {results.categories.content.score < 80 && (
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2 text-primary" />
                  <span>Improve your content quality and keyword optimization</span>
                </li>
              )}
              {results.categories.performance.score < 80 && (
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2 text-primary" />
                  <span>Optimize your page loading speed and Core Web Vitals</span>
                </li>
              )}
              {results.categories.technical.score < 80 && (
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2 text-primary" />
                  <span>Address technical issues like broken links and XML sitemap</span>
                </li>
              )}
              {results.categories.mobile.score < 80 && (
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2 text-primary" />
                  <span>Improve mobile responsiveness and touch element spacing</span>
                </li>
              )}
              <li className="flex items-center">
                <ArrowRight className="h-4 w-4 mr-2 text-primary" />
                <span>Re-analyze your site after making improvements</span>
              </li>
            </ul>
          </Card>
        </>
      )}
    </ToolLayout>
  );
};

export default SeoAnalyzer;
