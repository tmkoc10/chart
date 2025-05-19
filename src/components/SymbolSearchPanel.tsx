'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Search } from 'lucide-react';
import './scrollbar.css';

interface SymbolSearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
  // Add a prop to update the symbol in the header
  onSymbolSelect: (symbol: string) => void; 
}

const categories = ['All', 'Stocks', 'Funds', 'Futures', 'Forex', 'Crypto', 'Indices', 'Bonds', 'Economy'];

// Placeholder data for search results - we'll replace this later
const dummySymbols = [
  { id: 1, name: 'AAPL', description: 'Apple Inc.', type: 'Stock', exchange: 'NASDAQ' },
  { id: 2, name: 'MSFT', description: 'Microsoft Corp.', type: 'Stock', exchange: 'NASDAQ' },
  { id: 3, name: 'GOOGL', description: 'Alphabet Inc. (Class A)', type: 'Stock', exchange: 'NASDAQ' },
  { id: 4, name: 'BTCUSD', description: 'Bitcoin / US Dollar', type: 'Crypto', exchange: 'Various' },
  { id: 5, name: 'EURUSD', description: 'Euro / US Dollar', type: 'Forex', exchange: 'FX' },
  { id: 6, name: 'ESZ2023', description: 'E-mini S&P 500 Futures', type: 'Futures', exchange: 'CME' },
  { id: 7, name: 'US10Y', description: 'US 10 Year Treasury Note', type: 'Bond', exchange: 'CBOT' },
  { id: 8, name: 'SPX', description: 'S&P 500 Index', type: 'Index', exchange: 'CBOE' },
];

const SymbolSearchPanel: React.FC<SymbolSearchPanelProps> = ({ isOpen, onClose, onSymbolSelect }) => {
  if (!isOpen) return null;

  const panelRef = useRef<HTMLDivElement>(null); // Ref for the panel itself
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Effect to handle clicks outside the panel
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

  // Filter symbols based on searchTerm and activeCategory (basic example)
  const filteredSymbols = dummySymbols.filter(symbol => 
    symbol.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (activeCategory === 'All' || symbol.type === activeCategory)
  );

  const handleSymbolClick = (symbolName: string) => {
    onSymbolSelect(symbolName); // Update the symbol in the header
    onClose(); // Close the panel
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div 
        ref={panelRef} 
        className="w-full max-w-4xl bg-black rounded-md shadow-2xl border border-[#333] flex flex-col overflow-hidden" 
        style={{
          height: '90vh',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset'
        }}
      >
        {/* Header with Search Input - Placed above tabs like TradingView */}
        <div className="px-6 py-4 border-b border-[#333] flex-shrink-0 bg-gradient-to-r from-black to-[#111]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                placeholder="Search symbols, e.g. AAPL"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 pl-11 pr-10 bg-[#111] border border-[#333] rounded-md focus:outline-none focus:border-[#555] text-white placeholder-gray-500 text-sm shadow-inner transition-all duration-200 focus:shadow-[0_0_0_1px_rgba(255,255,255,0.1)]"
                autoFocus
              />
               <button 
                 onClick={onClose} 
                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white p-1.5 rounded-md hover:bg-[#222] transition-colors duration-150"
               >
                <X size={18} />
              </button>
            </div>
        </div>

        {/* Category Tabs */}
        <div className="flex border-b border-[#333] px-2 bg-black flex-shrink-0">
          {categories.map((category, index) => {
            // Different accent colors for different categories
            const borderColors = [
              'border-blue-500',   // All
              'border-green-500',  // Stocks
              'border-purple-500', // Funds
              'border-yellow-500', // Futures
              'border-red-500',    // Forex
              'border-orange-500', // Crypto
              'border-teal-500',   // Indices
              'border-pink-500',   // Bonds
              'border-indigo-500'  // Economy
            ];
            return (
              <button 
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex-1 text-center px-4 py-3 text-xs font-medium whitespace-nowrap 
                            ${activeCategory === category 
                              ? `bg-[#222] text-white border-b-2 ${borderColors[index]}` 
                              : 'text-gray-400 hover:text-gray-200 transition-colors duration-150'}
                            focus:outline-none`}
              >
                {category.toUpperCase()}
              </button>
            );
          })}
        </div>

        {/* Search Results Area (Scrollable) */}
        <div className="overflow-y-auto bg-black flex-grow custom-scrollbar">
          {filteredSymbols.length > 0 ? filteredSymbols.map((symbol) => (
            <div 
              key={symbol.id} 
              className="p-4 hover:bg-[#111] cursor-pointer border-b border-[#111] last:border-b-0 flex justify-between items-center transition-colors duration-150 mx-2 group"
              onClick={() => handleSymbolClick(symbol.name)}
            >
              <div className="flex items-center">
                {/* Symbol Icon/Letter with improved styling */}
                <div className={`w-8 h-8 rounded-md flex items-center justify-center mr-4 text-xs font-semibold 
                                ${symbol.type === 'Stock' ? 'bg-gradient-to-br from-green-800 to-green-900' : 
                                  symbol.type === 'Crypto' ? 'bg-gradient-to-br from-yellow-600 to-yellow-800' : 
                                  symbol.type === 'Forex' ? 'bg-gradient-to-br from-blue-800 to-blue-900' : 
                                  symbol.type === 'Futures' ? 'bg-gradient-to-br from-purple-800 to-purple-900' : 
                                  symbol.type === 'Index' ? 'bg-gradient-to-br from-red-800 to-red-900' : 
                                  symbol.type === 'Bond' ? 'bg-gradient-to-br from-indigo-800 to-indigo-900' : 
                                  'bg-gradient-to-br from-gray-700 to-gray-900'} 
                                text-white shadow-inner transition-transform duration-150 group-hover:scale-110`}>
                  {symbol.name[0].toUpperCase()}
                </div>
                <div className="group-hover:translate-x-0.5 transition-transform duration-150">
                  <p className="font-semibold text-sm text-white">{symbol.name}</p>
                  <p className="text-xs text-gray-400 truncate max-w-xs">{symbol.description}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-300 block font-medium">{symbol.type.toUpperCase()}</span>
                <span className="text-xs text-gray-500 block">{symbol.exchange}</span>
              </div>
            </div>
          )) : (
            <div className="p-10 text-center text-gray-500 flex flex-col items-center justify-center h-full">
              <Search className="mb-4 text-gray-600" size={36} />
              <p>
                No symbols found for "{searchTerm}"{activeCategory !== 'All' ? ` in ${activeCategory}` : ''}.
              </p>
              <p className="text-sm text-gray-600 mt-2">Try a different search term or category.</p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="py-3 px-6 border-t border-[#333] bg-gradient-to-r from-[#111] to-black flex-shrink-0">
          <p className="text-xs text-gray-400 text-center">
            Tip: Simply start typing on the chart to pull up this search box.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SymbolSearchPanel; 