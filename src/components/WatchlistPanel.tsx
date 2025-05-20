import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Plus, Settings, Search, X, BookMarked } from 'lucide-react';
import './scrollbar.css';
import { ANIMATION_DURATION, ANIMATION_EASING } from '../utils/animation';

interface WatchlistPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

type WatchlistItem = {
  symbol: string;
  name: string;
  price: string;
  change: number;
  changePercent: number;
};

const WatchlistPanel: React.FC<WatchlistPanelProps> = ({ isOpen, onToggle }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([
    { symbol: 'GOLD', name: 'Gold Spot / U.S. Dollar', price: '3,233.50', change: 28.94, changePercent: 0.9 },
    { symbol: 'BTCUSD', name: 'Bitcoin / U.S. Dollar', price: '104,968', change: -1552, changePercent: -1.46 },
    { symbol: 'EURUSD', name: 'Euro / U.S. Dollar', price: '1.1235', change: 0.0074, changePercent: 0.66 },
    { symbol: 'GBPUSD', name: 'British Pound / U.S. Dollar', price: '1.3353', change: 0.00836, changePercent: 0.63 },
    { symbol: 'USDJPY', name: 'U.S. Dollar / Japanese Yen', price: '145.025', change: -0.596, changePercent: -0.41 },
    { symbol: 'ETHUSD', name: 'Ethereum / U.S. Dollar', price: '2,474.6', change: -25.0, changePercent: -1.00 },
    { symbol: 'XRPUSD', name: 'XRP / U.S. Dollar', price: '2.35047', change: -0.07844, changePercent: -3.23 },
    { symbol: 'LTCUSD', name: 'Litecoin / U.S. Dollar', price: '97.99', change: -3.03, changePercent: -3.00 },
  ]);
  
  const handleSymbolClick = (symbol: string) => {
    console.log(`Symbol clicked: ${symbol}`);
    // Here you would implement the logic to change the chart symbol
  };

  // Using TradingView-like approach with flex and fixed widths
  return (
    <div className="h-full flex flex-shrink-0">
      {/* Watchlist panel - uses width transition and is positioned as a flex item */}
      <div 
        className="h-full flex flex-col bg-black border-l border-[#282828] overflow-hidden"
        style={{ 
          width: isOpen ? '240px' : '0px',
          transitionProperty: 'width',
          transitionDuration: `${ANIMATION_DURATION}ms`,
          transitionTimingFunction: ANIMATION_EASING,
          willChange: 'width' // Hint to browser for smoother animations
        }}
        ref={panelRef}
      >
        {/* Header */}
        <div className="flex items-center h-10 border-b border-[#282828] px-2 min-w-[240px]">
          <div className="flex-1 text-sm font-medium text-gray-300 ml-1.5">Watchlist</div>
          <div className="flex">
            <button className="h-7 w-7 flex items-center justify-center rounded hover:bg-[#333] text-gray-400">
              <Plus size={15} />
            </button>
            <button className="h-7 w-7 flex items-center justify-center rounded hover:bg-[#333] text-gray-400">
              <Search size={15} />
            </button>
            <button className="h-7 w-7 flex items-center justify-center rounded hover:bg-[#333] text-gray-400">
              <Settings size={15} />
            </button>
          </div>
        </div>

        {/* List container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar min-w-[240px]">
          {/* Column Headers */}
          <div className="flex items-center text-xs font-medium text-gray-500 px-2 py-1.5 border-b border-[#282828] bg-black sticky top-0">
            <div className="flex-[0.4]">Symbol</div>
            <div className="flex-[0.3] text-right">Last</div>
            <div className="flex-[0.3] text-right">Chg%</div>
          </div>

          {/* Watchlist Items */}
          <div className="overflow-hidden">
            {watchlistItems.map((item) => (
              <div 
                key={item.symbol} 
                className="flex items-center px-2 py-1.5 hover:bg-[#181818] cursor-pointer border-b border-[#282828]"
                onClick={() => handleSymbolClick(item.symbol)}
              >
                <div className="flex-[0.4] text-sm font-medium text-gray-300 truncate">{item.symbol}</div>
                <div className="flex-[0.3] text-sm text-gray-300 text-right">{item.price}</div>
                <div className="flex-[0.3] text-sm text-white text-right">
                  {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Static right sidebar - always visible */}
      <div className="w-10 h-full flex flex-col bg-black border-l border-[#282828] z-20">
        {/* Toggle button in the header */}
        <div className="flex items-center justify-center h-10 border-b border-[#282828]">
          <button 
            onClick={onToggle}
            className="flex items-center justify-center h-8 w-8 mx-auto rounded-md hover:bg-[#333] text-gray-400"
          >
            <BookMarked size={16} className="text-gray-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WatchlistPanel; 