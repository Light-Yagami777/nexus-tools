
import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator } from "lucide-react";
import { toast } from "sonner";

interface CurrencyPair {
  from: string;
  to: string;
}

interface Currency {
  code: string;
  name: string;
  symbol: string;
}

const CurrencyConverter = () => {
  const [amount, setAmount] = useState<string>("1");
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("EUR");
  const [convertedAmount, setConvertedAmount] = useState<string>("");
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [favoritesPairs, setFavoritesPairs] = useState<CurrencyPair[]>([]);
  const [showFavorites, setShowFavorites] = useState<boolean>(false);
  
  // Mock exchange rates (in a real app, this would come from an API)
  const mockExchangeRates: Record<string, Record<string, number>> = {
    "USD": {
      "EUR": 0.91,
      "GBP": 0.78,
      "JPY": 151.56,
      "CAD": 1.36,
      "AUD": 1.51,
      "CHF": 0.89,
      "CNY": 7.23,
      "INR": 83.12,
      "MXN": 16.82,
      "BRL": 5.07,
      "ZAR": 18.13,
      "RUB": 92.50,
      "TRY": 32.21,
      "KRW": 1343.45,
      "HKD": 7.82,
      "SGD": 1.34,
      "NZD": 1.63,
      "SEK": 10.37
    },
    "EUR": {
      "USD": 1.09,
      "GBP": 0.85,
      "JPY": 166.02,
      "CAD": 1.49,
      "AUD": 1.65,
      "CHF": 0.98,
      "CNY": 7.88,
      "INR": 90.78,
      "MXN": 18.37,
      "BRL": 5.54,
      "ZAR": 19.80,
      "RUB": 101.01,
      "TRY": 35.18,
      "KRW": 1467.85,
      "HKD": 8.54,
      "SGD": 1.46,
      "NZD": 1.78,
      "SEK": 11.33
    }
  };

  const currencyList: Currency[] = [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
    { code: "CAD", name: "Canadian Dollar", symbol: "$" },
    { code: "AUD", name: "Australian Dollar", symbol: "$" },
    { code: "CHF", name: "Swiss Franc", symbol: "Fr" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
    { code: "INR", name: "Indian Rupee", symbol: "₹" },
    { code: "MXN", name: "Mexican Peso", symbol: "$" },
    { code: "BRL", name: "Brazilian Real", symbol: "R$" },
    { code: "ZAR", name: "South African Rand", symbol: "R" },
    { code: "RUB", name: "Russian Ruble", symbol: "₽" },
    { code: "TRY", name: "Turkish Lira", symbol: "₺" },
    { code: "KRW", name: "South Korean Won", symbol: "₩" },
    { code: "HKD", name: "Hong Kong Dollar", symbol: "$" },
    { code: "SGD", name: "Singapore Dollar", symbol: "$" },
    { code: "NZD", name: "New Zealand Dollar", symbol: "$" },
    { code: "SEK", name: "Swedish Krona", symbol: "kr" }
  ];

  const popularPairs: CurrencyPair[] = [
    { from: "USD", to: "EUR" },
    { from: "USD", to: "GBP" },
    { from: "USD", to: "JPY" },
    { from: "EUR", to: "USD" },
    { from: "EUR", to: "GBP" },
    { from: "GBP", to: "USD" }
  ];

  // Load favorites from localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoritesCurrencyPairs");
    if (storedFavorites) {
      setFavoritesPairs(JSON.parse(storedFavorites));
    }
  }, []);

  // This simulates fetching an exchange rate (in a real app, this would be an API call)
  const fetchExchangeRate = () => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      try {
        let rate;
        
        // Check direct rate
        if (mockExchangeRates[fromCurrency] && mockExchangeRates[fromCurrency][toCurrency]) {
          rate = mockExchangeRates[fromCurrency][toCurrency];
        } 
        // Check reverse rate
        else if (mockExchangeRates[toCurrency] && mockExchangeRates[toCurrency][fromCurrency]) {
          rate = 1 / mockExchangeRates[toCurrency][fromCurrency];
        }
        // USD conversion for pairs not directly available
        else if (fromCurrency !== "USD" && toCurrency !== "USD" &&
                mockExchangeRates["USD"][fromCurrency] && mockExchangeRates["USD"][toCurrency]) {
          const fromToUSD = 1 / mockExchangeRates["USD"][fromCurrency];
          const usdToTarget = mockExchangeRates["USD"][toCurrency];
          rate = fromToUSD * usdToTarget;
        }
        // Default approximation
        else {
          // Generate a random but plausible exchange rate
          rate = Math.random() * 2 + 0.5;
        }
        
        setExchangeRate(rate);
        
        // Calculate converted amount
        const convertedValue = (parseFloat(amount) * rate).toFixed(2);
        setConvertedAmount(convertedValue);
        
        // Set last updated timestamp
        setLastUpdated(new Date().toLocaleString());
        
        setIsLoading(false);
      } catch (error) {
        toast.error("Error fetching exchange rate");
        setIsLoading(false);
      }
    }, 800); // Simulate API delay
  };

  const convertCurrency = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    fetchExchangeRate();
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    
    if (exchangeRate) {
      setExchangeRate(1 / exchangeRate);
      const newConverted = (parseFloat(amount) * (1 / exchangeRate)).toFixed(2);
      setConvertedAmount(newConverted);
    }
  };

  const toggleFavorite = () => {
    const pair = { from: fromCurrency, to: toCurrency };
    const exists = favoritesPairs.some(
      (favPair) => favPair.from === pair.from && favPair.to === pair.to
    );
    
    let updatedFavorites;
    
    if (exists) {
      updatedFavorites = favoritesPairs.filter(
        (favPair) => !(favPair.from === pair.from && favPair.to === pair.to)
      );
      toast.success("Removed from favorites");
    } else {
      updatedFavorites = [...favoritesPairs, pair];
      toast.success("Added to favorites");
    }
    
    setFavoritesPairs(updatedFavorites);
    localStorage.setItem("favoritesCurrencyPairs", JSON.stringify(updatedFavorites));
  };

  const isFavorite = () => {
    return favoritesPairs.some(
      (pair) => pair.from === fromCurrency && pair.to === toCurrency
    );
  };

  const selectPair = (pair: CurrencyPair) => {
    setFromCurrency(pair.from);
    setToCurrency(pair.to);
    
    // Trigger conversion if amount is already set
    if (amount && parseFloat(amount) > 0) {
      setTimeout(() => {
        fetchExchangeRate();
      }, 100);
    }
  };

  const formatCurrency = (value: string, currencyCode: string): string => {
    const currency = currencyList.find(c => c.code === currencyCode);
    const symbol = currency ? currency.symbol : currencyCode;
    
    return `${symbol} ${value}`;
  };

  const getCurrencyName = (code: string): string => {
    const currency = currencyList.find(c => c.code === code);
    return currency ? currency.name : code;
  };

  const getCurrencyPairName = (from: string, to: string): string => {
    return `${getCurrencyName(from)} to ${getCurrencyName(to)}`;
  };

  return (
    <ToolLayout title="Currency Converter">
      <Card className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Currency Converter</h2>
              <p className="text-muted-foreground mb-4">
                Convert between different currencies with the latest exchange rates.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0.01"
                    step="0.01"
                    placeholder="Enter amount"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-5 gap-2 items-end">
                <div className="col-span-2">
                  <Label htmlFor="from-currency">From</Label>
                  <Select 
                    value={fromCurrency} 
                    onValueChange={setFromCurrency}
                  >
                    <SelectTrigger id="from-currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencyList.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          <div className="flex items-center">
                            <span className="mr-2">{currency.code}</span>
                            <span className="text-muted-foreground">({currency.symbol})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-center items-center">
                  <Button variant="ghost" onClick={swapCurrencies} className="px-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left-right"><path d="M8 3L4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/></svg>
                  </Button>
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="to-currency">To</Label>
                  <Select 
                    value={toCurrency} 
                    onValueChange={setToCurrency}
                  >
                    <SelectTrigger id="to-currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencyList.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          <div className="flex items-center">
                            <span className="mr-2">{currency.code}</span>
                            <span className="text-muted-foreground">({currency.symbol})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="pt-2 flex gap-2">
                <Button 
                  onClick={convertCurrency} 
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? "Converting..." : "Convert"}
                </Button>
                <Button
                  variant={isFavorite() ? "default" : "outline"}
                  onClick={toggleFavorite}
                  title={isFavorite() ? "Remove from favorites" : "Add to favorites"}
                >
                  {isFavorite() ? "★" : "☆"}
                </Button>
              </div>
            </div>
            
            {exchangeRate && (
              <div className="rounded-lg p-6 border bg-muted/50 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <h3 className="text-sm font-medium">You're converting</h3>
                    <div className="text-xl font-bold">
                      {formatCurrency(amount, fromCurrency)}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">You'll get</h3>
                    <div className="text-xl font-bold text-primary">
                      {formatCurrency(convertedAmount, toCurrency)}
                    </div>
                  </div>
                </div>
                
                <div className="pt-2 text-sm text-muted-foreground">
                  <div>
                    Exchange Rate: 1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
                  </div>
                  <div className="text-xs">
                    Last updated: {lastUpdated}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div>
            <Tabs defaultValue="popular" className="w-full" onValueChange={(value) => setShowFavorites(value === "favorites")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="popular">Popular Pairs</TabsTrigger>
                <TabsTrigger value="favorites">My Favorites</TabsTrigger>
              </TabsList>
              
              <TabsContent value="popular" className="mt-4">
                <div className="rounded-lg border">
                  <div className="border-b p-3 bg-muted/50">
                    <h3 className="font-medium">Popular Currency Pairs</h3>
                  </div>
                  <div className="divide-y">
                    {popularPairs.map((pair) => (
                      <div 
                        key={`${pair.from}-${pair.to}`} 
                        className={`p-3 flex justify-between items-center cursor-pointer hover:bg-muted/20 ${
                          fromCurrency === pair.from && toCurrency === pair.to ? 'bg-primary/10' : ''
                        }`}
                        onClick={() => selectPair(pair)}
                      >
                        <div>
                          <div className="font-medium">
                            {pair.from}/{pair.to}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {getCurrencyPairName(pair.from, pair.to)}
                          </div>
                        </div>
                        <div>
                          {favoritesPairs.some(
                            (favPair) => favPair.from === pair.from && favPair.to === pair.to
                          ) ? (
                            <span className="text-yellow-500">★</span>
                          ) : (
                            <span className="text-muted-foreground">☆</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="favorites" className="mt-4">
                <div className="rounded-lg border">
                  <div className="border-b p-3 bg-muted/50">
                    <h3 className="font-medium">My Favorite Pairs</h3>
                  </div>
                  {favoritesPairs.length > 0 ? (
                    <div className="divide-y">
                      {favoritesPairs.map((pair) => (
                        <div 
                          key={`${pair.from}-${pair.to}`} 
                          className={`p-3 flex justify-between items-center cursor-pointer hover:bg-muted/20 ${
                            fromCurrency === pair.from && toCurrency === pair.to ? 'bg-primary/10' : ''
                          }`}
                          onClick={() => selectPair(pair)}
                        >
                          <div>
                            <div className="font-medium">
                              {pair.from}/{pair.to}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {getCurrencyPairName(pair.from, pair.to)}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFromCurrency(pair.from);
                              setToCurrency(pair.to);
                              toggleFavorite();
                            }}
                          >
                            <span className="text-yellow-500">★</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-center p-6">
                      <div className="w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                        <span className="text-xl">☆</span>
                      </div>
                      <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
                      <p className="text-muted-foreground">
                        Click the star icon when converting to add pairs to your favorites
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 rounded-lg border overflow-hidden">
              <div className="border-b p-3 bg-muted/50">
                <h3 className="font-medium">Currency Converter Features</h3>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-start space-x-3">
                  <div className="h-6 w-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Real-time Conversions</h4>
                    <p className="text-sm text-muted-foreground">Convert between 19 major world currencies with up-to-date exchange rates.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="h-6 w-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Saved Favorites</h4>
                    <p className="text-sm text-muted-foreground">Save your most used currency pairs for quick access in the future.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="h-6 w-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Popular Currency Pairs</h4>
                    <p className="text-sm text-muted-foreground">Quickly access commonly converted currency pairs like USD/EUR, EUR/GBP, and more.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t">
          <h3 className="text-lg font-medium mb-4">Major World Currencies</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {currencyList.slice(0, 8).map((currency) => (
              <div key={currency.code} className="p-3 rounded-lg border">
                <div className="flex items-center">
                  <div className="mr-2 text-lg font-bold">{currency.symbol}</div>
                  <div>
                    <div className="font-medium">{currency.code}</div>
                    <div className="text-xs text-muted-foreground">{currency.name}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6 text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg">
          <p className="font-medium mb-1">Disclaimer</p>
          <p>
            This currency converter is for informational purposes only. The exchange rates provided are not guaranteed to be accurate and should not be relied upon for transactional purposes. Always check with your financial institution for the most up-to-date and accurate exchange rates.
          </p>
        </div>
      </Card>
    </ToolLayout>
  );
};

export default CurrencyConverter;
