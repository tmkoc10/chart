import React, { useState, useRef, useEffect } from 'react';
import { X, Search, UserCircle, BarChart2, Activity, LineChart, TrendingUp, PieChart } from 'lucide-react';
import './scrollbar.css';

interface IndicatorsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// Sidebar categories
const sidebarCategories = [
  { name: 'Personal', icon: <UserCircle size={18} /> },
  { name: 'Technicals', icon: <BarChart2 size={18} /> },
  { name: 'Financials', icon: <PieChart size={18} /> },
  { name: 'Community', icon: <Activity size={18} /> },
];

// List of indicators exactly like TradingView
const indicators = [
  '24-hour Volume',
  'Accumulation/Distribution',
  'Advance Decline Line',
  'Advance Decline Ratio',
  'Advance/Decline Ratio (Bars)',
  'Arnaud Legoux Moving Average',
  'Aroon',
  'Auto Fib Extension',
  'Auto Fib Retracement',
  'Auto Pitchfork',
  'Auto Trendlines',
  'Average Day Range',
  'Average Directional Index',
  'Average True Range',
  'Awesome Oscillator',
  'Balance of Power',
  'BBTrend',
  'Bollinger Bands',
  'Bollinger Bands %b',
  'Bollinger BandWidth',
  'Bollinger Bars',
  'Bull Bear Power',
  'Chaikin Money Flow',
  'Chaikin Oscillator',
  'Chande Kroll Stop',
  'Chande Momentum Oscillator',
  'Chop Zone',
  'Choppiness Index',
  'Commodity Channel Index',
  'Connors RSI',
  'Coppock Curve',
  'Correlation Coefficient',
  'Cumulative Volume Delta',
];

const IndicatorsPanel: React.FC<IndicatorsPanelProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('Indicators');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSidebarCategory, setActiveSidebarCategory] = useState('Technicals');
  const panelRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside to close panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter indicators based on search term
  const filteredIndicators = indicators.filter(indicator => 
    indicator.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle indicator selection
  const handleSelectIndicator = (indicator: string) => {
    console.log(`Selected indicator: ${indicator}`);
    // Here you would implement the actual indicator functionality
    // onClose(); // Optionally close the panel after selection
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center">
      <div 
        ref={panelRef}
        className="bg-black border border-[#333] shadow-2xl w-full max-w-[900px] max-h-[600px] flex flex-col mt-8 rounded-md overflow-hidden backdrop-blur-sm"
        style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset' }}
      >
        {/* Panel Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#333] bg-gradient-to-r from-black to-[#111]">
          <h2 className="text-lg font-medium text-white tracking-wide">Indicators, metrics, and strategies</h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-[#222] text-gray-400 hover:text-white transition-colors duration-150"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4 border-b border-[#333]">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search indicators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#111] w-full pl-11 pr-4 py-3 rounded-md border border-[#333] focus:border-[#555] focus:outline-none text-white shadow-inner transition-all duration-200 focus:shadow-[0_0_0_1px_rgba(255,255,255,0.1)]"
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#333]">
          <div className="pl-[74px]">
            <div className="flex">
              <button
                className={`px-5 py-3 text-sm font-medium ${activeTab === 'Indicators' ? 'bg-[#222] text-white border-b-2 border-green-500' : 'text-gray-400 hover:text-gray-200 transition-colors duration-150'}`}
                onClick={() => setActiveTab('Indicators')}
              >
                Indicators
              </button>
              <button
                className={`px-5 py-3 text-sm font-medium ${activeTab === 'Strategies' ? 'bg-[#222] text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-200 transition-colors duration-150'}`}
                onClick={() => setActiveTab('Strategies')}
              >
                Strategies
              </button>
              <button
                className={`px-5 py-3 text-sm font-medium ${activeTab === 'Profiles' ? 'bg-[#222] text-white border-b-2 border-purple-500' : 'text-gray-400 hover:text-gray-200 transition-colors duration-150'}`}
                onClick={() => setActiveTab('Profiles')}
              >
                Profiles
              </button>
              <button
                className={`px-5 py-3 text-sm font-medium ${activeTab === 'Patterns' ? 'bg-[#222] text-white border-b-2 border-yellow-500' : 'text-gray-400 hover:text-gray-200 transition-colors duration-150'}`}
                onClick={() => setActiveTab('Patterns')}
              >
                Patterns
              </button>
            </div>
          </div>
        </div>

        {/* Panel Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar Categories */}
          <div className="w-[74px] border-r border-[#333] py-3 bg-black">
            <div className="flex flex-col space-y-2">
              {sidebarCategories.map((category) => (
                <button 
                  key={category.name}
                  onClick={() => setActiveSidebarCategory(category.name)}
                  className={`flex items-center justify-start px-2 py-3 ${activeSidebarCategory === category.name ? 'bg-gradient-to-r from-[#222] to-black text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-[#111] transition-colors duration-150'}`}
                >
                  <div className="flex flex-col items-center w-full text-xs">
                    <span className="mb-1">{category.icon}</span>
                    <span className="font-light">{category.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Indicators List */}
          <div className="flex-1 overflow-y-auto pb-2 bg-black custom-scrollbar">
            <h3 className="uppercase text-xs font-semibold text-gray-400 px-5 py-3 mt-1 border-b border-[#222] bg-gradient-to-r from-[#111] to-black">Script Name</h3>
            <div>
              {filteredIndicators.map((indicator, index) => {
                const isBeta = indicator === 'Auto Trendlines';
                return (
                  <div key={index} className="flex items-center">
                    <button
                      onClick={() => handleSelectIndicator(indicator)}
                      className="w-full text-left px-5 py-2.5 hover:bg-[#111] text-gray-300 hover:text-white flex items-center justify-between group transition-colors duration-150 border-b border-[#111]"
                    >
                      <span className="group-hover:translate-x-0.5 transition-transform duration-150">{indicator}</span>
                      {isBeta && (
                        <span className="text-xs px-1.5 py-0.5 bg-[#222] text-green-400 rounded ml-2 font-medium">BETA</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndicatorsPanel;
