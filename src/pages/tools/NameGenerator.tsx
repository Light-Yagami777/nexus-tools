
import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { UsersRound, Copy, RefreshCw } from "lucide-react";

const NameGenerator = () => {
  const { toast } = useToast();
  const [nameType, setNameType] = useState<"person" | "business" | "fantasy">("person");
  const [gender, setGender] = useState<"any" | "male" | "female">("any");
  const [count, setCount] = useState<number>(5);
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);

  // Name databases for generation
  const maleFirstNames = [
    "James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles",
    "Christopher", "Daniel", "Matthew", "Anthony", "Mark", "Donald", "Steven", "Paul", "Andrew", "Joshua",
    "Kenneth", "Kevin", "Brian", "George", "Edward", "Ronald", "Timothy", "Jason", "Jeffrey", "Ryan",
    "Jacob", "Gary", "Nicholas", "Eric", "Jonathan", "Stephen", "Larry", "Justin", "Scott", "Brandon"
  ];
  
  const femaleFirstNames = [
    "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen",
    "Nancy", "Lisa", "Betty", "Margaret", "Sandra", "Ashley", "Kimberly", "Emily", "Donna", "Michelle",
    "Dorothy", "Carol", "Amanda", "Melissa", "Deborah", "Stephanie", "Rebecca", "Laura", "Sharon", "Cynthia",
    "Kathleen", "Amy", "Shirley", "Angela", "Helen", "Anna", "Brenda", "Pamela", "Nicole", "Emma"
  ];
  
  const lastNames = [
    "Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor",
    "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson",
    "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "Hernandez", "King",
    "Wright", "Lopez", "Hill", "Scott", "Green", "Adams", "Baker", "Gonzalez", "Nelson", "Carter"
  ];
  
  const businessPrefixes = [
    "Alpha", "Beta", "Global", "Meta", "Eco", "Tech", "Smart", "Bright", "Prime", "Core",
    "Peak", "Next", "Pure", "Fast", "Flex", "Blue", "Green", "Red", "Silver", "Gold"
  ];
  
  const businessSuffixes = [
    "Systems", "Solutions", "Technologies", "Industries", "Enterprises", "Group", "Partners", "Labs", 
    "Innovations", "Dynamics", "Connect", "Logic", "Edge", "Wave", "Forge", "Hub", "Works", 
    "Services", "Boost", "Vision"
  ];
  
  const businessTypes = [
    "Inc.", "LLC", "Co.", "Ltd.", "Corp.", "Group", "& Sons", "Associates", "Partners", "International"
  ];
  
  const fantasyFirstNames = [
    "Zephyr", "Aria", "Orion", "Luna", "Nova", "Caspian", "Elara", "Atlas", "Lyra", "Phoenix",
    "Sage", "Terra", "Kai", "Aurelia", "Cyrus", "Seraphina", "Draven", "Isolde", "Thorne", "Elysia",
    "Rune", "Freya", "Jericho", "Calista", "Storm", "Ember", "Griffin", "Selene", "Onyx", "Willow"
  ];
  
  const fantasyLastNames = [
    "Shadowblade", "Starweaver", "Frostwind", "Nightshade", "Emberfall", "Moonshadow", "Thunderstrike", 
    "Lightbringer", "Darkwater", "Fireheart", "Ironwood", "Silverleaf", "Stormchaser", "Winterborn",
    "Blackthorn", "Dawnbreaker", "Skyrider", "Ravenclaw", "Goldsong", "Windrider"
  ];

  const generatePersonName = (genderPref: "any" | "male" | "female"): string => {
    let firstName = "";
    
    if (genderPref === "male" || (genderPref === "any" && Math.random() > 0.5)) {
      firstName = maleFirstNames[Math.floor(Math.random() * maleFirstNames.length)];
    } else {
      firstName = femaleFirstNames[Math.floor(Math.random() * femaleFirstNames.length)];
    }
    
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${firstName} ${lastName}`;
  };

  const generateBusinessName = (): string => {
    const prefix = businessPrefixes[Math.floor(Math.random() * businessPrefixes.length)];
    const suffix = businessSuffixes[Math.floor(Math.random() * businessSuffixes.length)];
    const type = Math.random() > 0.4 ? ` ${businessTypes[Math.floor(Math.random() * businessTypes.length)]}` : "";
    return `${prefix} ${suffix}${type}`;
  };

  const generateFantasyName = (): string => {
    const firstName = fantasyFirstNames[Math.floor(Math.random() * fantasyFirstNames.length)];
    const lastName = Math.random() > 0.2 ? ` ${fantasyLastNames[Math.floor(Math.random() * fantasyLastNames.length)]}` : "";
    return `${firstName}${lastName}`;
  };

  const generateNames = () => {
    const names: string[] = [];
    
    for (let i = 0; i < count; i++) {
      switch (nameType) {
        case "person":
          names.push(generatePersonName(gender));
          break;
        case "business":
          names.push(generateBusinessName());
          break;
        case "fantasy":
          names.push(generateFantasyName());
          break;
      }
    }
    
    setGeneratedNames(names);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `"${text}" has been copied to your clipboard.`
    });
  };

  const copyAllToClipboard = () => {
    if (generatedNames.length === 0) return;
    
    navigator.clipboard.writeText(generatedNames.join('\n'));
    toast({
      title: "All names copied",
      description: `${generatedNames.length} names have been copied to your clipboard.`
    });
  };

  return (
    <ToolLayout
      title="Name Generator"
      description="Generate random names for people, businesses, characters, and more"
      icon={<UsersRound className="h-6 w-6" />}
    >
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label className="text-base">Name Type</Label>
                <RadioGroup
                  value={nameType}
                  onValueChange={(value: "person" | "business" | "fantasy") => setNameType(value)}
                  className="flex flex-col sm:flex-row mt-2 gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="person" id="person" />
                    <Label htmlFor="person">Person</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="business" id="business" />
                    <Label htmlFor="business">Business</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fantasy" id="fantasy" />
                    <Label htmlFor="fantasy">Fantasy Character</Label>
                  </div>
                </RadioGroup>
              </div>

              {nameType === "person" && (
                <div>
                  <Label className="text-base">Gender</Label>
                  <RadioGroup
                    value={gender}
                    onValueChange={(value: "any" | "male" | "female") => setGender(value)}
                    className="flex flex-col sm:flex-row mt-2 gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="any" id="any" />
                      <Label htmlFor="any">Any</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 items-end">
                <div className="space-y-2">
                  <Label htmlFor="count">Number of names</Label>
                  <Input
                    id="count"
                    type="number"
                    min="1"
                    max="50"
                    value={count}
                    onChange={(e) => setCount(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="max-w-[150px]"
                  />
                </div>
                <div>
                  <Button onClick={generateNames} className="w-full sm:w-auto">
                    <RefreshCw className="mr-2 h-4 w-4" /> Generate Names
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {generatedNames.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Generated Names</h3>
                <Button variant="outline" onClick={copyAllToClipboard} className="text-sm">
                  <Copy className="mr-2 h-4 w-4" /> Copy All
                </Button>
              </div>
              <ScrollArea className="h-[300px] rounded-md border">
                <div className="p-4 space-y-2">
                  {generatedNames.map((name, index) => (
                    <div key={index} className="flex justify-between items-center p-2 hover:bg-muted rounded-md">
                      <span className="text-sm sm:text-base">{name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(name)}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copy</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-3">Name Generator Tips</h3>
            <ul className="space-y-2 list-disc pl-5">
              <li>Person names are great for character development, user accounts, or test data</li>
              <li>Business names can be used for startups, fictional companies, or project names</li>
              <li>Fantasy names are perfect for creative writing, gaming characters, or usernames</li>
              <li>Generate multiple names at once to find the perfect fit for your needs</li>
              <li>Feel free to mix and match first and last names for more variety</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default NameGenerator;
