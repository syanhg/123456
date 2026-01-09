const { useState, useEffect } = React;

// Icon Components
const Search = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const Trophy = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const BarChart3 = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

// Model Logo Components
const ModelLogo = ({ modelName }) => {
  const logos = {
    'GPT-4': 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
    'GPT-4o': 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
    'Claude 3.5 Sonnet': 'https://www.anthropic.com/images/icons/apple-touch-icon.png',
    'Claude 3 Opus': 'https://www.anthropic.com/images/icons/apple-touch-icon.png',
    'Gemini Pro': 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg',
    'Gemini 2.0 Flash': 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg',
    'Llama 3.1': 'https://ai.meta.com/static-resource/meta-symbol',
    'Llama 3.3': 'https://ai.meta.com/static-resource/meta-symbol',
    'o1': 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
    'o1-mini': 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
    'Grok': 'https://abs.twimg.com/favicons/twitter.3.ico',
    'Default': null
  };

  const getModelProvider = (name) => {
    if (name.includes('GPT') || name.includes('o1')) return 'OpenAI';
    if (name.includes('Claude')) return 'Anthropic';
    if (name.includes('Gemini')) return 'Google';
    if (name.includes('Llama')) return 'Meta';
    if (name.includes('Grok')) return 'xAI';
    return 'AI Model';
  };

  const getModelColor = (name) => {
    if (name.includes('GPT') || name.includes('o1')) return 'linear-gradient(135deg, #10a37f 0%, #1a7f64 100%)';
    if (name.includes('Claude')) return 'linear-gradient(135deg, #d97757 0%, #cc5533 100%)';
    if (name.includes('Gemini')) return 'linear-gradient(135deg, #4285f4 0%, #0f9d58 100%)';
    if (name.includes('Llama')) return 'linear-gradient(135deg, #0668e1 0%, #0552b5 100%)';
    if (name.includes('Grok')) return 'linear-gradient(135deg, #000000 0%, #333333 100%)';
    return 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)';
  };

  const logoUrl = logos[modelName] || logos['Default'];
  const provider = getModelProvider(modelName);
  const bgColor = getModelColor(modelName);

  return (
    <div 
      className="model-icon" 
      style={{ 
        background: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.875rem',
        fontWeight: '600',
        color: '#ffffff'
      }}
    >
      {logoUrl ? (
        <img src={logoUrl} alt={modelName} style={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain' }} />
      ) : (
        <span>{provider[0]}</span>
      )}
    </div>
  );
};

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
        // Transform Kalshi events to include AI model predictions
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
    // Generate predictions with actual model names
    const models = [
      'GPT-4o',
      'Claude 3.5 Sonnet',
      'Gemini 2.0 Flash',
      'o1',
      'Llama 3.3',
      'Grok'
    ];

    return models.map(model => ({
      ticker: model,
      yes_price: 0.3 + Math.random() * 0.5,
      volume: Math.floor(Math.random() * 1000000) + 100000
    }));
  };

  const getTopPredictions = (markets) => {
    if (!markets || markets.length === 0) return [];
    return markets
      .sort((a, b) => b.yes_price - a.yes_price)
      .slice(0, 4);
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
    
    return allMarkets
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 15);
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (event.category && event.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
    event.event_ticker.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const MarketCard = ({ event }) => {
    const topPredictions = getTopPredictions(event.markets);
    
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border card">
        <div className="flex items-start gap-4 mb-4">
          <ModelLogo modelName={topPredictions[0]?.ticker || 'Default'} />
          <div style={{ flex: 1 }}>
            <h3 className="font-semibold text-gray-900 text-lg mb-1">{event.title}</h3>
            {event.category && <span className="badge">{event.category}</span>}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-3">Top predictions:</p>
          {topPredictions.map((market, idx) => (
            <div key={idx} className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">{market.ticker}</span>
              </div>
              <span className="text-sm font-semibold text-blue-600">
                {Math.round(market.yes_price * 100)}%
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs font-medium text-green-600">LIVE</span>
          </div>
          <span className="text-xs text-gray-500">
            {event.close_time ? `Closes ${formatDate(event.close_time)}` : 'Active'}
          </span>
        </div>
      </div>
    );
  };

  const Leaderboard = () => {
    const leaderboardData = getLeaderboardData();

    return (
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b bg-gradient-yellow">
          <div className="flex items-center gap-3">
            <Trophy />
            <h2 className="text-xl font-bold text-gray-900">Top Predictions by Volume</h2>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Model</th>
                <th>Market</th>
                <th>Category</th>
                <th className="text-right">Probability</th>
                <th className="text-right">Volume</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((item, idx) => (
                <tr key={idx}>
                  <td>
                    <div className={`rank-badge ${
                      idx === 0 ? 'rank-1' :
                      idx === 1 ? 'rank-2' :
                      idx === 2 ? 'rank-3' :
                      'rank-other'
                    }`}>
                      {idx + 1}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div style={{ width: '32px', height: '32px', flexShrink: 0 }}>
                        <ModelLogo modelName={item.ticker} />
                      </div>
                      <span className="font-medium text-gray-900">{item.ticker}</span>
                    </div>
                  </td>
                  <td>
                    <div className="text-xs text-gray-500" style={{ maxWidth: '200px' }}>
                      {item.eventTitle}
                    </div>
                  </td>
                  <td>
                    <span className="badge" style={{ backgroundColor: '#dbeafe', color: '#2563eb' }}>
                      {item.category}
                    </span>
                  </td>
                  <td className="text-right">
                    <span className="font-semibold text-blue-600">{item.probability}%</span>
                  </td>
                  <td className="text-right">
                    <span className="text-gray-700">${(item.volume / 1000).toFixed(0)}K</span>
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
    <div className="min-h-screen" style={{ background: '#f9fafb' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Model Prediction Arena</h1>
          <p className="text-gray-600">Compare AI model predictions on real-world events powered by Kalshi</p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform text-gray-400">
              <Search />
            </div>
            <input
              type="text"
              placeholder="Search events by title, topic, ticker, or markets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-6 flex gap-4 border-b">
          <button
            onClick={() => setActiveTab('markets')}
            className={`tab-button ${activeTab === 'markets' ? 'active' : ''}`}
          >
            <div className="flex items-center gap-2">
              <BarChart3 />
              <span>Markets</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`tab-button ${activeTab === 'leaderboard' ? 'active' : ''}`}
          >
            <div className="flex items-center gap-2">
              <Trophy />
              <span>Leaderboard</span>
            </div>
          </button>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl p-8 shadow-sm border text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchKalshiMarkets}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : activeTab === 'markets' ? (
          filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event, idx) => (
                <MarketCard key={idx} event={event} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 shadow-sm border text-center">
              <p className="text-gray-600">No markets found matching your search.</p>
            </div>
          )
        ) : (
          <Leaderboard />
        )}
      </div>
    </div>
  );
};

ReactDOM.render(<KalshiArena />, document.getElementById('root'));
