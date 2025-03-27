
import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Code } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface HighlightedMatch {
  start: number;
  end: number;
  match: string;
}

interface RegexFlags {
  global: boolean;
  ignoreCase: boolean;
  multiline: boolean;
  dotAll: boolean;
  unicode: boolean;
  sticky: boolean;
}

const RegexTester = () => {
  const [regexPattern, setRegexPattern] = useState<string>("");
  const [testString, setTestString] = useState<string>("");
  const [matches, setMatches] = useState<RegExpMatchArray | null>(null);
  const [highlightedMatches, setHighlightedMatches] = useState<HighlightedMatch[]>([]);
  const [flags, setFlags] = useState<RegexFlags>({
    global: true,
    ignoreCase: false,
    multiline: false,
    dotAll: false,
    unicode: false,
    sticky: false,
  });
  const [isValidRegex, setIsValidRegex] = useState<boolean>(true);
  const [replaceWith, setReplaceWith] = useState<string>("");
  const [replaceResult, setReplaceResult] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("test");
  const [regexDescription, setRegexDescription] = useState<string>("");
  const [matchDetails, setMatchDetails] = useState<any[]>([]);

  useEffect(() => {
    if (regexPattern && testString) {
      testRegex();
    } else {
      setHighlightedMatches([]);
      setMatches(null);
      setMatchDetails([]);
    }
  }, [regexPattern, testString, flags]);

  useEffect(() => {
    if (activeTab === "replace" && regexPattern && testString) {
      handleReplace();
    }
  }, [activeTab, regexPattern, testString, replaceWith, flags]);

  const getFlags = (): string => {
    let flagString = "";
    if (flags.global) flagString += "g";
    if (flags.ignoreCase) flagString += "i";
    if (flags.multiline) flagString += "m";
    if (flags.dotAll) flagString += "s";
    if (flags.unicode) flagString += "u";
    if (flags.sticky) flagString += "y";
    return flagString;
  };

  const toggleFlag = (flag: keyof RegexFlags) => {
    setFlags(prev => ({
      ...prev,
      [flag]: !prev[flag]
    }));
  };

  const testRegex = () => {
    if (!regexPattern.trim()) {
      toast.error("Please enter a regular expression");
      return;
    }

    if (!testString) {
      setHighlightedMatches([]);
      setMatches(null);
      setMatchDetails([]);
      return;
    }

    try {
      const regex = new RegExp(regexPattern, getFlags());
      setIsValidRegex(true);

      // Create match highlights for displaying in the text
      const highlightedMatches: HighlightedMatch[] = [];
      const details: any[] = [];
      let match;
      let matchCount = 0;

      if (flags.global) {
        while ((match = regex.exec(testString)) !== null) {
          matchCount++;
          highlightedMatches.push({
            start: match.index,
            end: match.index + match[0].length,
            match: match[0]
          });

          const groups: Record<string, string> = {};
          // Add named capture groups if any
          if (match.groups) {
            Object.keys(match.groups).forEach(key => {
              groups[key] = match.groups![key];
            });
          }

          details.push({
            index: match.index,
            match: match[0],
            groups: Object.keys(groups).length > 0 ? groups : null,
            captures: match.slice(1)
          });

          // Prevent infinite loops with zero-length matches
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
        
        setMatches({ length: matchCount } as RegExpMatchArray);
      } else {
        match = regex.exec(testString);
        
        if (match) {
          matchCount = 1;
          highlightedMatches.push({
            start: match.index,
            end: match.index + match[0].length,
            match: match[0]
          });

          const groups: Record<string, string> = {};
          // Add named capture groups if any
          if (match.groups) {
            Object.keys(match.groups).forEach(key => {
              groups[key] = match.groups![key];
            });
          }

          details.push({
            index: match.index,
            match: match[0],
            groups: Object.keys(groups).length > 0 ? groups : null,
            captures: match.slice(1)
          });
        }
        
        setMatches(match);
      }

      setHighlightedMatches(highlightedMatches);
      setMatchDetails(details);

      // Update regex description
      try {
        setRegexDescription(getRegexDescription(regexPattern));
      } catch (e) {
        setRegexDescription("Could not generate description for this regex.");
      }
    } catch (error) {
      setIsValidRegex(false);
      toast.error("Invalid regular expression");
      console.error(error);
    }
  };

  const handleReplace = () => {
    if (!regexPattern.trim()) {
      toast.error("Please enter a regular expression");
      return;
    }

    try {
      const regex = new RegExp(regexPattern, getFlags());
      setIsValidRegex(true);
      
      const result = testString.replace(regex, replaceWith);
      setReplaceResult(result);
    } catch (error) {
      setIsValidRegex(false);
      toast.error("Invalid regular expression");
      console.error(error);
    }
  };

  const getRegexDescription = (pattern: string): string => {
    // A simple function to describe common regex patterns
    // In a real application, this would be more comprehensive
    if (pattern === "\\d+") return "Matches one or more digits";
    if (pattern === "\\w+") return "Matches one or more word characters";
    if (pattern === "[A-Za-z]+") return "Matches one or more alphabetic characters";
    if (pattern === "^\\s+|\\s+$") return "Matches leading or trailing whitespace";
    if (pattern === "\\b\\w+\\b") return "Matches whole words";
    if (pattern === "\\d{3}-\\d{3}-\\d{4}") return "Matches a phone number pattern (XXX-XXX-XXXX)";
    if (pattern === "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b") return "Matches an email address";
    
    // For more complex patterns, generate a more general description
    let desc = "Matches ";
    if (pattern.startsWith("^")) desc += "at the beginning of the string ";
    if (pattern.endsWith("$")) desc += "at the end of the string ";
    if (pattern.includes("+")) desc += "one or more of the preceding character ";
    if (pattern.includes("*")) desc += "zero or more of the preceding character ";
    if (pattern.includes("?")) desc += "zero or one of the preceding character ";
    if (pattern.includes(".")) desc += "any character ";
    if (pattern.includes("\\d")) desc += "digits ";
    if (pattern.includes("\\w")) desc += "word characters ";
    if (pattern.includes("\\s")) desc += "whitespace ";
    
    return desc.trim() || "Custom regular expression pattern";
  };

  const highlightMatches = () => {
    if (!testString || highlightedMatches.length === 0) {
      return <span>{testString}</span>;
    }

    const result = [];
    let lastIndex = 0;

    highlightedMatches.forEach((match, index) => {
      // Add text before match
      if (match.start > lastIndex) {
        result.push(
          <span key={`text-${index}`}>
            {testString.substring(lastIndex, match.start)}
          </span>
        );
      }

      // Add highlighted match
      result.push(
        <span 
          key={`match-${index}`} 
          className="bg-yellow-200 dark:bg-yellow-800"
        >
          {match.match}
        </span>
      );

      lastIndex = match.end;
    });

    // Add text after last match
    if (lastIndex < testString.length) {
      result.push(
        <span key="text-last">
          {testString.substring(lastIndex)}
        </span>
      );
    }

    return result;
  };

  const commonPatterns = [
    { name: "Email", pattern: "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b" },
    { name: "URL", pattern: "https?:\\/\\/[\\w\\d\\-._~:\\/?#[\\]@!$&'()*+,;=]+" },
    { name: "Phone (US)", pattern: "\\(\\d{3}\\)\\s?\\d{3}-\\d{4}|\\d{3}-\\d{3}-\\d{4}" },
    { name: "Date (MM/DD/YYYY)", pattern: "\\b(0?[1-9]|1[0-2])\\/(0?[1-9]|[12]\\d|3[01])\\/\\d{4}\\b" },
    { name: "IP Address", pattern: "\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b" },
    { name: "Digits Only", pattern: "^\\d+$" },
    { name: "Letters Only", pattern: "^[A-Za-z]+$" },
    { name: "Alphanumeric", pattern: "^[A-Za-z0-9]+$" },
  ];

  return (
    <ToolLayout title="Regex Tester">
      <Card className="p-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="regex-pattern">Regular Expression</Label>
              <div className="flex">
                <div className="bg-muted flex items-center px-3 rounded-l-md border border-r-0 border-input">
                  /
                </div>
                <Input 
                  id="regex-pattern"
                  placeholder="Enter regex pattern..."
                  value={regexPattern}
                  onChange={(e) => setRegexPattern(e.target.value)}
                  className={`rounded-none ${!isValidRegex ? 'border-red-500' : ''}`}
                />
                <div className="bg-muted flex items-center px-3 rounded-r-md border border-l-0 border-input">
                  /{getFlags()}
                </div>
              </div>
              {!isValidRegex && (
                <p className="text-sm text-red-500">Invalid regular expression</p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="flag-g" 
                  checked={flags.global}
                  onCheckedChange={() => toggleFlag('global')}
                />
                <Label htmlFor="flag-g">Global (g)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="flag-i" 
                  checked={flags.ignoreCase}
                  onCheckedChange={() => toggleFlag('ignoreCase')}
                />
                <Label htmlFor="flag-i">Case insensitive (i)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="flag-m" 
                  checked={flags.multiline}
                  onCheckedChange={() => toggleFlag('multiline')}
                />
                <Label htmlFor="flag-m">Multiline (m)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="flag-s" 
                  checked={flags.dotAll}
                  onCheckedChange={() => toggleFlag('dotAll')}
                />
                <Label htmlFor="flag-s">Dot all (s)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="flag-u" 
                  checked={flags.unicode}
                  onCheckedChange={() => toggleFlag('unicode')}
                />
                <Label htmlFor="flag-u">Unicode (u)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="flag-y" 
                  checked={flags.sticky}
                  onCheckedChange={() => toggleFlag('sticky')}
                />
                <Label htmlFor="flag-y">Sticky (y)</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="test-string">Test String</Label>
              <Textarea 
                id="test-string"
                placeholder="Enter text to test against the regular expression..."
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                className="font-mono h-32"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={testRegex}>Test Regex</Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setRegexPattern("");
                  setTestString("");
                  setHighlightedMatches([]);
                  setMatches(null);
                  setMatchDetails([]);
                }}
              >
                Clear
              </Button>
            </div>
          </div>

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="test">Test</TabsTrigger>
              <TabsTrigger value="replace">Replace</TabsTrigger>
              <TabsTrigger value="cheatsheet">Cheatsheet</TabsTrigger>
            </TabsList>
            
            <TabsContent value="test" className="space-y-4 mt-4">
              <div className="space-y-4">
                {regexPattern && (
                  <div className="p-4 rounded-lg bg-muted space-y-2">
                    <h3 className="font-semibold">Regex Description</h3>
                    <p>{regexDescription}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Match Results</Label>
                    {matches && (
                      <Badge variant="outline">
                        {matches.length} match{matches.length !== 1 ? 'es' : ''}
                      </Badge>
                    )}
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 min-h-32 whitespace-pre-wrap font-mono text-sm">
                    {highlightMatches()}
                  </div>
                </div>

                {matchDetails.length > 0 && (
                  <div className="space-y-2">
                    <Label>Match Details</Label>
                    <div className="space-y-2">
                      {matchDetails.map((detail, i) => (
                        <div key={i} className="p-3 rounded-lg bg-muted/30 border border-border">
                          <div className="flex flex-wrap gap-x-4 gap-y-2 mb-2">
                            <span className="text-sm">Match #{i+1}</span>
                            <span className="text-sm">Index: {detail.index}</span>
                            <span className="text-sm">Length: {detail.match.length}</span>
                          </div>
                          <div className="font-mono bg-background p-2 rounded text-sm mb-2">
                            {detail.match}
                          </div>
                          {detail.captures.length > 0 && (
                            <div className="mt-2">
                              <h4 className="text-sm font-medium mb-1">Capture Groups:</h4>
                              <div className="grid grid-cols-2 gap-2">
                                {detail.captures.map((capture: string, j: number) => (
                                  <div key={j} className="text-sm">
                                    <span className="text-muted-foreground">Group {j+1}: </span>
                                    <span className="font-mono">{capture}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {detail.groups && (
                            <div className="mt-2">
                              <h4 className="text-sm font-medium mb-1">Named Groups:</h4>
                              <div className="grid grid-cols-2 gap-2">
                                {Object.entries(detail.groups).map(([name, value]: [string, any]) => (
                                  <div key={name} className="text-sm">
                                    <span className="text-muted-foreground">{name}: </span>
                                    <span className="font-mono">{value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="replace" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="replace-with">Replace With</Label>
                  <Input 
                    id="replace-with"
                    placeholder="Enter replacement text..."
                    value={replaceWith}
                    onChange={(e) => setReplaceWith(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Use $1, $2, etc. to reference captured groups, or $&amp; to reference the matched text.
                  </p>
                </div>

                <Button onClick={handleReplace}>Replace</Button>

                <div className="space-y-2">
                  <Label>Result</Label>
                  <div className="p-4 rounded-lg bg-muted/50 min-h-32 whitespace-pre-wrap font-mono text-sm">
                    {replaceResult}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="cheatsheet" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Common Patterns</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {commonPatterns.map((pattern) => (
                      <Button 
                        key={pattern.name}
                        variant="outline"
                        className="justify-start h-auto py-2"
                        onClick={() => {
                          setRegexPattern(pattern.pattern);
                          setActiveTab("test");
                        }}
                      >
                        <div className="text-left">
                          <div className="font-medium">{pattern.name}</div>
                          <div className="text-xs font-mono text-muted-foreground truncate max-w-64">
                            {pattern.pattern}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Character Classes</h3>
                    <div className="space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-x-2">
                        <div className="font-mono">\d</div>
                        <div>Matches any digit</div>
                      </div>
                      <div className="grid grid-cols-2 gap-x-2">
                        <div className="font-mono">\w</div>
                        <div>Matches any word character</div>
                      </div>
                      <div className="grid grid-cols-2 gap-x-2">
                        <div className="font-mono">\s</div>
                        <div>Matches any whitespace</div>
                      </div>
                      <div className="grid grid-cols-2 gap-x-2">
                        <div className="font-mono">[abc]</div>
                        <div>Matches a, b, or c</div>
                      </div>
                      <div className="grid grid-cols-2 gap-x-2">
                        <div className="font-mono">[^abc]</div>
                        <div>Matches anything except a, b, or c</div>
                      </div>
                      <div className="grid grid-cols-2 gap-x-2">
                        <div className="font-mono">[a-z]</div>
                        <div>Matches any character a through z</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Quantifiers</h3>
                    <div className="space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-x-2">
                        <div className="font-mono">*</div>
                        <div>0 or more</div>
                      </div>
                      <div className="grid grid-cols-2 gap-x-2">
                        <div className="font-mono">+</div>
                        <div>1 or more</div>
                      </div>
                      <div className="grid grid-cols-2 gap-x-2">
                        <div className="font-mono">?</div>
                        <div>0 or 1</div>
                      </div>
                      <div className="grid grid-cols-2 gap-x-2">
                        <div className="font-mono">{"{3}"}</div>
                        <div>Exactly 3 times</div>
                      </div>
                      <div className="grid grid-cols-2 gap-x-2">
                        <div className="font-mono">{"{3,}"}</div>
                        <div>3 or more times</div>
                      </div>
                      <div className="grid grid-cols-2 gap-x-2">
                        <div className="font-mono">{"{1,3}"}</div>
                        <div>Between 1 and 3 times</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Anchors & Boundaries</h3>
                    <div className="space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-x-2">
                        <div className="font-mono">^</div>
                        <div>Start of string</div>
                      </div>
                      <div className="grid grid-cols-2 gap-x-2">
                        <div className="font-mono">$</div>
                        <div>End of string</div>
                      </div>
                      <div className="grid grid-cols-2 gap-x-2">
                        <div className="font-mono">\b</div>
                        <div>Word boundary</div>
                      </div>
                      <div className="grid grid-cols-2 gap-x-2">
                        <div className="font-mono">\B</div>
                        <div>Not a word boundary</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Groups & Alternation</h3>
                    <div className="space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-x-2">
                        <div className="font-mono">(abc)</div>
                        <div>Capture group</div>
                      </div>
                      <div className="grid grid-cols-2 gap-x-2">
                        <div className="font-mono">(?:abc)</div>
                        <div>Non-capturing group</div>
                      </div>
                      <div className="grid grid-cols-2 gap-x-2">
                        <div className="font-mono">(?&lt;name&gt;abc)</div>
                        <div>Named capture group</div>
                      </div>
                      <div className="grid grid-cols-2 gap-x-2">
                        <div className="font-mono">a|b</div>
                        <div>Match a or b</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </ToolLayout>
  );
};

export default RegexTester;
