
import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Instagram, Facebook, Twitter, Linkedin } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const platforms = [
  { 
    id: "instagram", 
    name: "Instagram", 
    icon: <Instagram className="h-4 w-4" />,
    color: "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"
  },
  { 
    id: "facebook", 
    name: "Facebook", 
    icon: <Facebook className="h-4 w-4" />,
    color: "bg-blue-600"
  },
  { 
    id: "twitter", 
    name: "Twitter", 
    icon: <Twitter className="h-4 w-4" />,
    color: "bg-sky-500"
  },
  { 
    id: "linkedin", 
    name: "LinkedIn", 
    icon: <Linkedin className="h-4 w-4" />,
    color: "bg-blue-700"
  },
];

const audiences = [
  { id: "general", name: "General" },
  { id: "business", name: "Business" },
  { id: "creators", name: "Creators" },
  { id: "tech", name: "Tech" },
  { id: "health", name: "Health & Wellness" },
];

const bestTimes = {
  instagram: {
    days: ["Monday", "Wednesday", "Thursday"],
    times: ["11:00 AM", "2:00 PM", "7:00 PM"]
  },
  facebook: {
    days: ["Tuesday", "Wednesday", "Friday"],
    times: ["9:00 AM", "1:00 PM", "3:00 PM"]
  },
  twitter: {
    days: ["Monday", "Wednesday", "Friday"],
    times: ["8:00 AM", "12:00 PM", "5:00 PM"]
  },
  linkedin: {
    days: ["Tuesday", "Wednesday", "Thursday"],
    times: ["8:00 AM", "10:00 AM", "2:00 PM"]
  }
};

const PostScheduler = () => {
  const [platform, setPlatform] = useState("instagram");
  const [audience, setAudience] = useState("general");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("12:00");
  const [content, setContent] = useState("");
  
  const handleSchedulePost = () => {
    if (!platform || !date || !time || !content) {
      toast.error("Please fill all required fields");
      return;
    }
    
    toast.success("Post scheduled successfully!");
    console.log({
      platform,
      audience,
      date,
      time,
      content
    });
  };
  
  const selectedPlatform = platforms.find(p => p.id === platform);
  
  return (
    <ToolLayout
      title="Post Scheduler"
      description="Schedule social media posts for optimal engagement times"
      icon={<CalendarIcon className="h-6 w-6" />}
    >
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-4">Schedule Your Post</h2>
            
            <div className="space-y-4">
              <div>
                <Label>Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map(platform => (
                      <SelectItem key={platform.id} value={platform.id}>
                        <div className="flex items-center">
                          {platform.icon}
                          <span className="ml-2">{platform.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Target Audience</Label>
                <Select value={audience} onValueChange={setAudience}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {audiences.map(audience => (
                      <SelectItem key={audience.id} value={audience.id}>
                        {audience.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal overflow-hidden"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="truncate">
                          {date ? format(date, "PP") : "Pick a date"}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <Label>Time</Label>
                  <Select value={time} onValueChange={setTime}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"].map(t => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label>Content</Label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your post content here..."
                  rows={4}
                />
              </div>
              
              <Button 
                className="w-full"
                onClick={handleSchedulePost}
              >
                {selectedPlatform?.icon && (
                  <div className="mr-2">{selectedPlatform.icon}</div>
                )}
                Schedule Post
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-4">Optimal Posting Times</h2>
            
            {platform && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Best Days to Post</h3>
                  <div className="flex flex-wrap gap-2">
                    {bestTimes[platform as keyof typeof bestTimes].days.map(day => (
                      <div key={day} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                        {day}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Best Times to Post</h3>
                  <div className="flex flex-wrap gap-2">
                    {bestTimes[platform as keyof typeof bestTimes].times.map(time => (
                      <div key={time} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                        {time}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm">
                    <span className="font-semibold">Pro Tip:</span> Posts on {selectedPlatform?.name} get the most engagement when 
                    published {bestTimes[platform as keyof typeof bestTimes].days[0]} to {bestTimes[platform as keyof typeof bestTimes].days[1]} 
                    around {bestTimes[platform as keyof typeof bestTimes].times[0]}.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default PostScheduler;
