
import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Instagram } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const InstagramFontGenerator = () => {
  const { toast } = useToast();
  const [inputText, setInputText] = useState("Type your text here...");

  // Font styles definitions
  const fontStyles = [
    {
      name: "𝓢𝓬𝓻𝓲𝓹𝓽",
      transform: (text: string) => {
        const normal = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        const script = "𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃";
        return transform(text, normal, script);
      }
    },
    {
      name: "𝔊𝔬𝔱𝔥𝔦𝔠",
      transform: (text: string) => {
        const normal = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        const gothic = "𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷";
        return transform(text, normal, gothic);
      }
    },
    {
      name: "𝔹𝕠𝕝𝕕",
      transform: (text: string) => {
        const normal = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        const bold = "𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫";
        return transform(text, normal, bold);
      }
    },
    {
      name: "B̲u̲n̲d̲e̲r̲l̲i̲n̲e̲d̲",
      transform: (text: string) => {
        return text.split("").map(char => char + "\u0332").join("");
      }
    },
    {
      name: "S̷t̷r̷i̷k̷e̷t̷h̷r̷o̷u̷g̷h̷",
      transform: (text: string) => {
        return text.split("").map(char => char + "\u0337").join("");
      }
    },
    {
      name: "🄱🅄🄱🄱🄻🄴🅂",
      transform: (text: string) => {
        const normal = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        const bubbles = "🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉";
        return transform(text, normal, bubbles);
      }
    },
    {
      name: "Sᴍᴀʟʟ Cᴀᴘs",
      transform: (text: string) => {
        const normal = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        const smallCaps = "ABCDEFGHIJKLMNOPQRSTUVWXYZᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ";
        return transform(text, normal, smallCaps);
      }
    },
    {
      name: "M̶i̶x̶e̶d̶ S̷t̷y̷l̷e̷",
      transform: (text: string) => {
        return text.split("").map((char, i) => {
          if (i % 2 === 0) return char + "\u0336";
          return char + "\u0337";
        }).join("");
      }
    },
  ];

  // Helper function to transform text
  const transform = (text: string, from: string, to: string) => {
    return text.split("").map(char => {
      const index = from.indexOf(char);
      return index !== -1 ? to[index] : char;
    }).join("");
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Fancy text has been copied to your clipboard."
    });
  };

  return (
    <ToolLayout
      title="Instagram Font Generator"
      description="Create fancy text for Instagram bios and captions that stand out from the crowd"
      icon={<Instagram className="h-6 w-6" />}
    >
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <label htmlFor="inputText" className="text-sm font-medium">Enter Your Text</label>
              <Textarea
                id="inputText"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your text here..."
                rows={3}
                className="resize-none w-full"
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Generated Fonts</h3>
          <ScrollArea className="h-[400px] rounded-md border p-4">
            <div className="space-y-4">
              {fontStyles.map((style, index) => (
                <div key={index} className="p-3 border rounded-md bg-card">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div className="break-all pr-2 max-w-full">{style.transform(inputText)}</div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleCopy(style.transform(inputText))}
                      className="ml-auto shrink-0"
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-3">Tips for Instagram Fonts</h3>
            <ul className="space-y-2 list-disc pl-5">
              <li>Use special fonts sparingly to maintain readability</li>
              <li>Mix regular text with fancy text for better impact</li>
              <li>Some special characters may not display properly on all devices</li>
              <li>Instagram bio has a 150 character limit, so keep it concise</li>
              <li>Test your text on different devices before posting</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default InstagramFontGenerator;
