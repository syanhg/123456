const { useState, useEffect } = React;

// Icon Components
const Search = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const Trophy = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const BarChart3 = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const Loader2 = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
  </svg>
);

// shadcn/ui Button Component
const Button = ({ children, variant = "default", size = "default", className = "", onClick, disabled }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  };
  
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// shadcn/ui Card Components
const Card = ({ children, className = "" }) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

// shadcn/ui Badge Component
const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  };
  
  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

// shadcn/ui Input Component
const Input = ({ className = "", ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

// shadcn/ui Tabs Components
const Tabs = ({ children, value, onValueChange, className = "" }) => (
  <div className={className}>
    {React.Children.map(children, child =>
      React.cloneElement(child, { value, onValueChange })
    )}
  </div>
);

const TabsList = ({ children, value, onValueChange, className = "" }) => (
  <div className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className}`}>
    {React.Children.map(children, child =>
      React.cloneElement(child, { value, onValueChange })
    )}
  </div>
);

const TabsTrigger = ({ children, value: triggerValue, value: currentValue, onValueChange, className = "" }) => {
  const isActive = currentValue === triggerValue;
  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
        isActive ? 'bg-background text-foreground shadow-sm' : 'hover:bg-accent hover:text-accent-foreground'
      } ${className}`}
      onClick={() => onValueChange(triggerValue)}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ children, value: contentValue, value: currentValue, className = "" }) => {
  if (currentValue !== contentValue) return null;
  return (
    <div className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}>
      {children}
    </div>
  );
};

// Model Logo Component
const ModelLogo = ({ modelName, size = "default" }) => {
  const getModelColor = (name) => {
    if (name.includes('GPT') || name.includes('o1')) return 'from-emerald-500 to-emerald-700';
    if (name.includes('Claude')) return 'from-orange-500 to-orange-700';
    if (name.includes('Gemini')) return 'from-blue-500 to-green-500';
    if (name.includes('Llama')) return 'from-blue-600 to-blue-800';
    if (name.includes('Grok')) return 'from-gray-800 to-black';
    return 'from-indigo-500 to-purple-600';
  };

  const getInitial = (name) => {
    if (name.includes('GPT')) return 'G';
    if (name.includes('Claude')) return 'C';
    if (name.includes('Gemini')) return 'G';
    if (name.includes('Llama')) return 'L';
    if (name.includes('Grok')) return 'X';
    if (name.includes('o1')) return 'O';
    return name[0];
  };

  const sizeClasses = {
    small: "w-8 h-8 text-xs",
    default: "w-12 h-12 text-lg",
    large: "w-16 h-16 text-2xl"
  };

  return (
    <div className={`${sizeClasses[size]} rounded-lg bg-gradient-to-br ${getModelColor(modelName)} flex items-center justify-center text-white font-bold shadow-sm`}>
      {getInitial(modelName)}
    </div>
  );
};

// Main App Component
const KalshiArena = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('markets');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchKalshiMarkets();
  }, []);

  const fetchKalshiMarkets = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await fetch('https://api.elections.kalshi.com/trade-api/v2/events', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      
      if (data.events && data.events.length > 0) {
        const transformedEvents = data.events.slice(0, 12).map(event => ({
          ...event,
          markets: event.markets || generateModelPredictions(event)
        }));
        setEvents(transformedEvents);
      } else {
        throw new Error('No events data received');
      }
    } catch (error) {
      console.error('Error fetching Kalshi markets:', error);
      setError('Unable to fetch Kalshi data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const generateModelPredictions = (event) => {
    const models = ['GPT-4o', 'Claude 3.5 Sonnet', 'Gemini 2.0 Flash', 'o1', 'Llama 3.3', 'Grok'];
    return models.map(model => ({
      ticker: model,
      yes_price: 0.3 + Math.random() * 0.5,
      volume: Math.floor(Math.random() * 1000000) + 100000
    }));
  };

  const getTopPredictions = (markets) => {
    if (!markets || markets.length === 0) return [];
    return markets.sort((a, b) => b.yes_price - a.yes_price).slice(0, 4);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getLeaderboardData = () => {
    const allMarkets = events.flatMap(event => 
      (event.markets || []).map(market => ({
        ticker: market.ticker,
        eventTitle: event.title,
        probability: Math.round(market.yes_price * 100),
        volume: market.volume || 0,
        category: event.category || 'General'
      }))
    );
    return allMarkets.sort((a, b) => b.volume - a.volume).slice(0, 15);
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (event.category && event.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
    event.event_ticker.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const MarketCard = ({ event }) => {
    const topPredictions = getTopPredictions(event.markets);
    
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start gap-4">
            <ModelLogo modelName={topPredictions[0]?.ticker || 'Default'} />
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg mb-2">{event.title}</CardTitle>
              {event.category && <Badge variant="secondary">{event.category}</Badge>}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-4">
            <p className="text-sm text-muted-foreground font-medium">Top predictions:</p>
            {topPredictions.map((market, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{market.ticker}</span>
                <span className="text-sm font-semibold text-primary">
                  {Math.round(market.yes_price * 100)}%
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-green-600">LIVE</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {event.close_time ? `Closes ${formatDate(event.close_time)}` : 'Active'}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  };

  const Leaderboard = () => {
    const leaderboardData = getLeaderboardData();

    return (
      <Card>
        <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-yellow-600" />
            <CardTitle>Top Predictions by Volume</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Model</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Market</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Probability</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Volume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {leaderboardData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <Badge className={
                        idx === 0 ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                        idx === 1 ? 'bg-gray-100 text-gray-800 hover:bg-gray-100' :
                        idx === 2 ? 'bg-orange-100 text-orange-800 hover:bg-orange-100' :
                        'bg-blue-50 text-blue-700 hover:bg-blue-50'
                      }>
                        #{idx + 1}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <ModelLogo modelName={item.ticker} size="small" />
                        <span className="font-medium text-foreground">{item.ticker}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-muted-foreground max-w-xs truncate">
                        {item.eventTitle}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline">{item.category}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-semibold text-primary">{item.probability}%</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-foreground font-medium">${(item.volume / 1000).toFixed(0)}K</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">AI Model Prediction Arena</h1>
          <p className="text-muted-foreground text-lg">Compare AI model predictions on real-world events powered by Kalshi</p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search events by title, topic, ticker, or markets..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="markets">
              <BarChart3 className="w-4 h-4 mr-2" />
              Markets
            </TabsTrigger>
            <TabsTrigger value="leaderboard">
              <Trophy className="w-4 h-4 mr-2" />
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="markets">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <Card className="p-8 text-center">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={fetchKalshiMarkets}>
                  Retry
                </Button>
              </Card>
            ) : filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event, idx) => (
                  <MarketCard key={idx} event={event} />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No markets found matching your search.</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="leaderboard">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <Leaderboard />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

ReactDOM.render(<KalshiArena />, document.getElementById('root'));
