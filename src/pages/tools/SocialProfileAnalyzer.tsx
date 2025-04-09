
import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip } from "recharts";
import { UsersRound, TrendingUp, BarChart2 } from "lucide-react";

interface AnalysisResult {
  engagement: number;
  consistency: number;
  visualContent: number;
  hashtags: number;
  timing: number;
  audience: number;
  overall: number;
  recommendations: string[];
}

const SocialProfileAnalyzer = () => {
  const [username, setUsername] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [result, setResult] = useState<AnalysisResult>({
    engagement: 0,
    consistency: 0,
    visualContent: 0,
    hashtags: 0,
    timing: 0,
    audience: 0,
    overall: 0,
    recommendations: [],
  });

  // Mock analysis function
  const analyzeProfile = () => {
    setLoading(true);
    
    // In a real app, this would call an API
    setTimeout(() => {
      // Generate random scores for demo
      const engagement = Math.floor(Math.random() * 40) + 60;
      const consistency = Math.floor(Math.random() * 30) + 50;
      const visualContent = Math.floor(Math.random() * 30) + 60;
      const hashtags = Math.floor(Math.random() * 50) + 30;
      const timing = Math.floor(Math.random() * 40) + 40;
      const audience = Math.floor(Math.random() * 30) + 60;
      
      const overall = Math.floor(
        (engagement + consistency + visualContent + hashtags + timing + audience) / 6
      );
      
      // Generate recommendations based on the lowest scores
      const recommendations = [];
      if (engagement < 70) 
        recommendations.push("Increase engagement by responding to comments more quickly");
      if (consistency < 70) 
        recommendations.push("Post more consistently, aim for 3-5 posts per week");
      if (visualContent < 70) 
        recommendations.push("Improve visual content quality with better lighting and composition");
      if (hashtags < 70) 
        recommendations.push("Use more relevant and trending hashtags (7-15 per post)");
      if (timing < 70) 
        recommendations.push("Optimize posting times based on when your audience is most active");
      if (audience < 70) 
        recommendations.push("Engage more with your target audience's content");
      
      if (recommendations.length === 0)
        recommendations.push("Your profile is performing well! Keep up the good work!");
      
      setResult({
        engagement,
        consistency,
        visualContent,
        hashtags,
        timing,
        audience,
        overall,
        recommendations
      });
      
      setLoading(false);
      setAnalyzed(true);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username) {
      analyzeProfile();
    }
  };

  const chartData = [
    { name: "Engagement", value: result.engagement },
    { name: "Consistency", value: result.consistency },
    { name: "Visual", value: result.visualContent },
    { name: "Hashtags", value: result.hashtags },
    { name: "Timing", value: result.timing },
    { name: "Audience", value: result.audience }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <ToolLayout
      title="Social Profile Analyzer"
      description="Analyze social media profiles for engagement metrics and optimization opportunities"
      icon={<UsersRound className="h-6 w-6" />}
    >
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="platform" className="text-sm font-medium">Platform</label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger id="platform">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium">Username</label>
                  <div className="flex gap-2">
                    <Input 
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={`Enter ${platform} username`}
                    />
                    <Button type="submit" disabled={loading || !username}>
                      {loading ? "Analyzing..." : "Analyze"}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {analyzed && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6 flex flex-col items-center justify-center h-full">
                  <div className="text-sm text-muted-foreground mb-2">Overall Score</div>
                  <div className={`text-5xl font-bold mb-2 ${getScoreColor(result.overall)}`}>
                    {result.overall}
                  </div>
                  <div className="text-center text-sm">
                    {result.overall >= 80 ? (
                      "Excellent profile performance!"
                    ) : result.overall >= 60 ? (
                      "Good profile with room for improvement"
                    ) : (
                      "Profile needs significant optimization"
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-1 md:col-span-2">
                <CardContent className="pt-6 h-[300px]">
                  <h3 className="text-lg font-semibold mb-4">Score Breakdown</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis domain={[0, 100]} fontSize={12} />
                      <RechartsTooltip
                        formatter={(value: number) => [`${value}/100`, 'Score']}
                      />
                      <Bar 
                        dataKey="value" 
                        fill="hsl(var(--primary))" 
                        radius={[4, 4, 0, 0]} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="recommendations">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="recommendations">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Recommendations
                </TabsTrigger>
                <TabsTrigger value="metrics">
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Detailed Metrics
                </TabsTrigger>
                <TabsTrigger value="benchmark">
                  <UsersRound className="mr-2 h-4 w-4" />
                  Industry Benchmark
                </TabsTrigger>
              </TabsList>
              <TabsContent value="recommendations" className="mt-4 space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-3">Optimization Recommendations</h3>
                    <ul className="space-y-2">
                      {result.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs">
                            {index + 1}
                          </span>
                          <span>{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="metrics" className="mt-4 space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Performance Metrics</h3>
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-sm">Engagement Rate</span>
                              <span className={`text-sm font-medium ${getScoreColor(result.engagement)}`}>
                                {result.engagement}/100
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-gray-200">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${result.engagement}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-sm">Posting Consistency</span>
                              <span className={`text-sm font-medium ${getScoreColor(result.consistency)}`}>
                                {result.consistency}/100
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-gray-200">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${result.consistency}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-sm">Visual Content Quality</span>
                              <span className={`text-sm font-medium ${getScoreColor(result.visualContent)}`}>
                                {result.visualContent}/100
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-gray-200">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${result.visualContent}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Strategy Metrics</h3>
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-sm">Hashtag Strategy</span>
                              <span className={`text-sm font-medium ${getScoreColor(result.hashtags)}`}>
                                {result.hashtags}/100
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-gray-200">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${result.hashtags}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-sm">Posting Timing</span>
                              <span className={`text-sm font-medium ${getScoreColor(result.timing)}`}>
                                {result.timing}/100
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-gray-200">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${result.timing}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-sm">Audience Engagement</span>
                              <span className={`text-sm font-medium ${getScoreColor(result.audience)}`}>
                                {result.audience}/100
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-gray-200">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${result.audience}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="benchmark" className="mt-4 space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-3">Industry Benchmark Comparison</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Compare your profile metrics with industry averages for {platform}.
                    </p>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Engagement Rate</span>
                          <span className="font-medium">{result.engagement}% vs. 4.7% avg</span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-200 relative">
                          <div
                            className="absolute h-full rounded-full bg-primary"
                            style={{ width: `${result.engagement}%` }}
                          ></div>
                          <div
                            className="absolute h-full w-1 bg-black"
                            style={{ left: '4.7%' }}
                          ></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Posting Frequency</span>
                          <span className="font-medium">
                            {Math.floor(result.consistency / 10)} posts/week vs. 5 avg
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-200 relative">
                          <div
                            className="absolute h-full rounded-full bg-primary"
                            style={{ width: `${result.consistency}%` }}
                          ></div>
                          <div
                            className="absolute h-full w-1 bg-black"
                            style={{ left: '50%' }}
                          ></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Follower Growth</span>
                          <span className="font-medium">
                            {Math.floor(result.overall / 20)}% vs. 2.8% avg
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-200 relative">
                          <div
                            className="absolute h-full rounded-full bg-primary"
                            style={{ width: `${result.overall}%` }}
                          ></div>
                          <div
                            className="absolute h-full w-1 bg-black"
                            style={{ left: '28%' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-3">About This Tool</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This is a demonstration tool that simulates social media profile analysis. 
              In a real implementation, this would connect to social media APIs to retrieve 
              actual metrics and provide data-driven recommendations.
            </p>
            <p className="text-sm text-muted-foreground">
              For privacy and demonstration purposes, this tool generates random metrics 
              and recommendations based on best practices in social media marketing.
            </p>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default SocialProfileAnalyzer;
