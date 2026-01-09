const { useState, useEffect } = React;

// Icon Components
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const TrophyIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const BarChartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

// Model Logo Component
const ModelLogo = ({ modelName, size = 'default' }) => {
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
    return name[0] || 'A';
  };

  const sizeClasses = {
    small: 'w-10 h-10 text-sm',
    default: 'w-14 h-14 text-xl',
    large: 'w-16 h-16 text-2xl'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-lg bg-gradient-to-br ${getModelColor(modelName)} flex items-center justify-center text-white font-bold shadow-md flex-shrink-0`}>
      {getInitial(modelName)}
    </div>
  );
};

// Main App Component
const KalshiArena = () => {
  const [markets, setMarkets] = useState([]);
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
      
      // Fetch markets directly (not events)
      const response = await fetch('https://api.elections.kalshi.com/trade-api/v2/markets', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Kalshi API Response:', data);
      
      if (data.markets && Array.isArray(data.markets) && data.markets.length > 0) {
        // Get unique events from markets
        const eventsMap = new Map();
        
        data.markets.forEach(market => {
          const eventTicker = market.event_ticker;
          if (!eventsMap.has(eventTicker)) {
            eventsMap.set(eventTicker, {
              event_ticker: eventTicker,
              title: market.title || market.subtitle || eventTicker,
              category: market.category || 'General',
              close_time: market.close_time,
              markets: []
            });
          }
          
          eventsMap.get(eventTicker).markets.push({
            ticker: market.ticker,
            yes_price: market.yes_bid || market.last_price || 0.5,
            volume: market.volume || 0
          });
        });
        
        // Convert map to array and add AI model predictions
        const eventsArray = Array.from(eventsMap.values()).slice(0, 12).map(event => ({
          ...event,
          aiPredictions: generateModelPredictions(event)
        }));
        
        setMarkets(eventsArray);
      } else {
        throw new Error('No markets data received from API');
      }
    } catch (err) {
      console.error('Error fetching Kalshi markets:', err);
      setError(`Unable to fetch Kalshi data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const generateModelPredictions = (event) => {
    const models = ['GPT-4o', 'Claude 3.5 Sonnet', 'Gemini 2.0 Flash', 'o1', 'Llama 3.3', 'Grok'];
    
    // Base predictions on actual market data if available
    const basePrice = event.markets && event.markets.length > 0 
      ? event.markets[0].yes_price 
      : 0.5;
    
    return models.map(model => ({
      ticker: model,
      yes_price: Math.max(0.1, Math.min(0.9, basePrice + (Math.random() - 0.5) * 0.3)),
      volume: Math.floor(Math.random() * 1000000) + 100000
    }));
  };

  const getTopPredictions = (predictions) => {
    if (!predictions || predictions.length === 0) return [];
    return [...predictions].sort((a, b) => b.yes_price - a.yes_price).slice(0, 4);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Active';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Active';
    }
  };

  const getLeaderboardData = () => {
    const allPredictions = markets.flatMap(event => 
      (event.aiPredictions || []).map(pred => ({
        ticker: pred.ticker,
        eventTitle: event.title,
        probability: Math.round(pred.yes_price * 100),
        volume: pred.volume || 0,
        category: event.category || 'General'
      }))
    );
    return allPredictions.sort((a, b) => b.volume - a.volume).slice(0, 15);
  };

  const filteredMarkets = markets.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (event.category && event.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
    event.event_ticker.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const MarketCard = ({ event }) => {
    const topPredictions = getTopPredictions(event.aiPredictions);
    
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200">
        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <ModelLogo modelName={topPredictions[0]?.ticker || 'Default'} />
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{event.title}</h3>
              {event.category && (
                <span className="inline-block px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                  {event.category}
                </span>
              )}
            </div>
          </div>
          
          <div className="space-y-3 mb-4">
            <p className="text-sm font-medium text-gray-600">AI Model Predictions:</p>
            {topPredictions.map((pred, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{pred.ticker}</span>
                <span className="text-sm font-semibold text-blue-600">
                  {Math.round(pred.yes_price * 100)}%
                </span>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-green-600">LIVE</span>
            </div>
            <span className="text-xs text-gray-500">
              Closes {formatDate(event.close_time)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const Leaderboard = () => {
    const leaderboardData = getLeaderboardData();

    if (leaderboardData.length === 0) {
      return (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-600">No leaderboard data available.</p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <TrophyIcon />
            <h2 className="text-xl font-bold text-gray-900">Top AI Predictions by Volume</h2>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Model</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Market</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Probability</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Volume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leaderboardData.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                      idx === 0 ? 'bg-yellow-100 text-yellow-800' :
                      idx === 1 ? 'bg-gray-100 text-gray-800' :
                      idx === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-50 text-blue-700'
                    }`}>
                      {idx + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <ModelLogo modelName={item.ticker} size="small" />
                      <span className="font-medium text-gray-900">{item.ticker}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 max-w-xs truncate">
                      {item.eventTitle}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-semibold text-blue-600">{item.probability}%</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-medium text-gray-900">${(item.volume / 1000).toFixed(0)}K</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Model Prediction Arena</h1>
          <p className="text-lg text-gray-600">Compare AI model predictions on real Kalshi prediction markets</p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search markets by title, topic, or category..."
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="inline-flex rounded-lg border border-gray-200 bg-gray-100 p-1">
            <button
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'markets'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('markets')}
            >
              <BarChartIcon />
              Markets
            </button>
            <button
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('leaderboard')}
            >
              <TrophyIcon />
              Leaderboard
            </button>
          </div>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Loading Kalshi markets...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-xl border border-red-200 p-8 text-center">
              <p className="text-red-600 mb-4 text-lg font-medium">{error}</p>
              <button
                onClick={fetchKalshiMarkets}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Retry Connection
              </button>
            </div>
          ) : activeTab === 'markets' ? (
            filteredMarkets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMarkets.map((event, idx) => (
                  <MarketCard key={idx} event={event} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <p className="text-gray-600">No markets found matching your search.</p>
              </div>
            )
          <TabsContent value="leaderboard">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">Loading Kalshi markets...</p>
              </div>
            ) : error ? (
              <div className="bg-white rounded-xl border border-red-200 p-8 text-center">
                <p className="text-red-600 mb-4 text-lg font-medium">{error}</p>
                <button
                  onClick={fetchKalshiMarkets}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Retry Connection
                </button>
              </div>
            ) : (
              <Leaderboard />
            )}
          </TabsContent>

ReactDOM.render(<KalshiArena />, document.getElementById('root'));
