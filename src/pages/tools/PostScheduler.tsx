
import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

const PostScheduler = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("12:00");
  const [platform, setPlatform] = useState("instagram");
  const [audience, setAudience] = useState("general");
  const [bestTimes, setBestTimes] = useState<Record<string, { days: string[], times: string[] }>>({
    instagram: {
      days: ["Monday", "Wednesday", "Friday"],
      times: ["11:00 AM", "2:00 PM", "7:00 PM"]
    },
    twitter: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      times: ["8:00 AM", "12:00 PM", "5:00 PM"]
    },
    facebook: {
      days: ["Tuesday", "Wednesday", "Friday"],
      times: ["1:00 PM", "3:00 PM", "9:00 PM"]
    },
    linkedin: {
      days: ["Tuesday", "Wednesday", "Thursday"],
      times: ["9:00 AM", "12:00 PM", "5:00 PM"]
    }
  });

  // Update best times when platform or audience changes
  const updateRecommendations = () => {
    // This would normally call an API to get data
    // Simulating different recommendations based on platform and audience
    let updatedTimes;
    
    if (audience === "general") {
      updatedTimes = {
        instagram: {
          days: ["Monday", "Wednesday", "Friday"],
          times: ["11:00 AM", "2:00 PM", "7:00 PM"]
        },
        twitter: {
          days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          times: ["8:00 AM", "12:00 PM", "5:00 PM"]
        },
        facebook: {
          days: ["Tuesday", "Wednesday", "Friday"],
          times: ["1:00 PM", "3:00 PM", "9:00 PM"]
        },
        linkedin: {
          days: ["Tuesday", "Wednesday", "Thursday"],
          times: ["9:00 AM", "12:00 PM", "5:00 PM"]
        }
      };
    } else if (audience === "business") {
      updatedTimes = {
        instagram: {
          days: ["Monday", "Tuesday", "Thursday"],
          times: ["9:00 AM", "12:00 PM", "6:00 PM"]
        },
        twitter: {
          days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          times: ["8:00 AM", "11:00 AM", "3:00 PM"]
        },
        facebook: {
          days: ["Monday", "Wednesday", "Thursday"],
          times: ["10:00 AM", "1:00 PM", "4:00 PM"]
        },
        linkedin: {
          days: ["Tuesday", "Wednesday", "Thursday"],
          times: ["8:00 AM", "11:00 AM", "4:00 PM"]
        }
      };
    } else if (audience === "youth") {
      updatedTimes = {
        instagram: {
          days: ["Monday", "Wednesday", "Friday", "Saturday"],
          times: ["3:00 PM", "5:00 PM", "9:00 PM"]
        },
        twitter: {
          days: ["Monday", "Wednesday", "Friday", "Saturday"],
          times: ["2:00 PM", "4:00 PM", "8:00 PM"]
        },
        facebook: {
          days: ["Wednesday", "Friday", "Saturday"],
          times: ["2:00 PM", "7:00 PM", "10:00 PM"]
        },
        linkedin: {
          days: ["Monday", "Wednesday", "Friday"],
          times: ["12:00 PM", "3:00 PM", "6:00 PM"]
        }
      };
    }
    
    setBestTimes(updatedTimes);
  };

  const handlePlatformChange = (value: string) => {
    setPlatform(value);
    setTimeout(updateRecommendations, 100);
  };

  const handleAudienceChange = (value: string) => {
    setAudience(value);
    setTimeout(updateRecommendations, 100);
  };

  const handleSchedule = () => {
    if (!date) {
      toast({
        title: "Missing information",
        description: "Please select a date for your post.",
        variant: "destructive"
      });
      return;
    }
    
    const formattedDate = format(date, "EEEE, MMMM d, yyyy");
    
    toast({
      title: "Post scheduled!",
      description: `Your ${platform} post has been scheduled for ${formattedDate} at ${time}.`
    });
  };

  const getPlatformIcon = () => {
    switch (platform) {
      case "instagram":
        return <Instagram className="h-5 w-5" />;
      case "twitter":
        return <Twitter className="h-5 w-5" />;
      case "facebook":
        return <Facebook className="h-5 w-5" />;
      case "linkedin":
        return <Linkedin className="h-5 w-5" />;
      default:
        return <Instagram className="h-5 w-5" />;
    }
  };

  return (
    <ToolLayout
      title="Post Scheduler"
      description="Find the optimal times to post on social media based on audience activity patterns"
      icon={<Clock className="h-6 w-6" />}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="text-lg font-semibold">Schedule Your Post</h3>
              
              <div className="space-y-2">
                <label htmlFor="platform" className="text-sm font-medium">Platform</label>
                <Select value={platform} onValueChange={handlePlatformChange}>
                  <SelectTrigger id="platform" className="w-full">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="audience" className="text-sm font-medium">Target Audience</label>
                <Select value={audience} onValueChange={handleAudienceChange}>
                  <SelectTrigger id="audience" className="w-full">
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="business">Business Professionals</SelectItem>
                    <SelectItem value="youth">Youth (13-24)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="time" className="text-sm font-medium">Time</label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>
              
              <Button onClick={handleSchedule} className="w-full">
                {getPlatformIcon()}
                <span className="ml-2">Schedule Post</span>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Optimal Posting Times</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Best Days to Post</h4>
                  <div className="flex flex-wrap gap-2">
                    {bestTimes[platform]?.days.map((day) => (
                      <div 
                        key={day} 
                        className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Best Times to Post</h4>
                  <div className="flex flex-wrap gap-2">
                    {bestTimes[platform]?.times.map((time) => (
                      <div 
                        key={time} 
                        className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground">
                    These recommendations are based on aggregate data for your selected platform
                    and target audience. Your specific audience may have different activity patterns.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="instagram">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="instagram">Instagram</TabsTrigger>
            <TabsTrigger value="twitter">Twitter</TabsTrigger>
            <TabsTrigger value="facebook">Facebook</TabsTrigger>
            <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
          </TabsList>
          
          <TabsContent value="instagram" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-3">Instagram Posting Strategy</h3>
                <ul className="space-y-2 list-disc pl-5">
                  <li>Optimal posting frequency: 3-5 times per week</li>
                  <li>Best time to post: 11 AM - 1 PM and 7 PM - 9 PM</li>
                  <li>Weekdays tend to perform better than weekends</li>
                  <li>Use 5-15 relevant hashtags for best discoverability</li>
                  <li>Include a call to action in your captions</li>
                  <li>Stories should be posted throughout the day</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="twitter" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-3">Twitter Posting Strategy</h3>
                <ul className="space-y-2 list-disc pl-5">
                  <li>Optimal posting frequency: 3-5 times per day</li>
                  <li>Best time to post: 8 AM - 10 AM, 12 PM, and 5 PM - 6 PM</li>
                  <li>Weekdays generally perform better than weekends</li>
                  <li>Use 1-2 relevant hashtags for best engagement</li>
                  <li>Include images or videos to increase engagement</li>
                  <li>Keep tweets concise and engaging</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="facebook" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-3">Facebook Posting Strategy</h3>
                <ul className="space-y-2 list-disc pl-5">
                  <li>Optimal posting frequency: 1-2 times per day</li>
                  <li>Best time to post: 1 PM - 4 PM and 6 PM - 9 PM</li>
                  <li>Wednesday through Friday tend to perform best</li>
                  <li>Videos typically get the highest engagement</li>
                  <li>Keep posts conversational and ask questions</li>
                  <li>Limit hashtags to 1-2 per post</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="linkedin" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-3">LinkedIn Posting Strategy</h3>
                <ul className="space-y-2 list-disc pl-5">
                  <li>Optimal posting frequency: 2-5 times per week</li>
                  <li>Best time to post: 8 AM - 10 AM and 4 PM - 6 PM</li>
                  <li>Tuesday, Wednesday, and Thursday perform best</li>
                  <li>Focus on professional, industry-relevant content</li>
                  <li>Text-only posts often perform well on LinkedIn</li>
                  <li>Document posts (PDFs) can drive high engagement</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-3">About This Tool</h3>
            <p className="text-sm text-muted-foreground">
              This tool provides recommendations based on generalized social media usage patterns.
              For the most accurate results, combine these suggestions with your own analytics data
              to determine when your specific audience is most active and engaged.
            </p>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default PostScheduler;
