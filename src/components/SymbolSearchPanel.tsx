'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
        >
          <motion.div
            ref={panelRef}
            initial={{ y: 32, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 32, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="w-full max-w-4xl bg-black rounded-2xl shadow-2xl border border-[#232323] flex flex-col overflow-hidden"
            style={{ height: '90vh', boxShadow: '0 8px 32px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04) inset' }}
          >
            {/* Header with Search Input */}
            <div className="px-8 py-5 border-b border-[#232323] flex-shrink-0 bg-gradient-to-r from-black to-[#111]">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <motion.input
                  type="text"
                  placeholder="Search symbols, e.g. AAPL"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-3 pl-12 pr-12 bg-[#101010] border border-[#232323] rounded-lg focus:outline-none text-white placeholder-gray-500 text-base shadow-inner transition-all duration-200"
                  style={{ boxShadow: 'inset 0 1.5px 6px #181818' }}
                  autoFocus
                  whileFocus={{ boxShadow: '0 0 0 2px #fff, inset 0 1.5px 6px #181818' }}
                  transition={{ duration: 0.18 }}
                />
                <button
                  onClick={onClose}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-2 rounded-lg hover:bg-[#181818] transition-colors duration-150 focus:outline-none"
                  tabIndex={-1}
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            {/* Tabs */}
            <div className="flex border-b border-[#232323] px-2 bg-black flex-shrink-0">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`flex-1 text-center px-4 py-3 text-xs font-semibold tracking-wide whitespace-nowrap relative transition-all duration-150
                    ${activeCategory === category
                      ? 'text-white' : 'text-gray-400 hover:text-white/80'}
                  `}
                  style={{ letterSpacing: '0.04em' }}
                >
                  <span>{category.toUpperCase()}</span>
                  {activeCategory === category && (
                    <motion.div
                      layoutId="tab-underline"
                      className="absolute left-6 right-6 -bottom-1 h-[2.5px] rounded-full bg-white"
                      style={{ opacity: 0.95 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
            {/* Symbol List */}
            <div className="overflow-y-auto bg-black flex-grow custom-scrollbar">
              {filteredSymbols.length > 0 ? filteredSymbols.map((symbol) => (
                <motion.div
                  key={symbol.id}
                  whileHover={{ scale: 1.018, boxShadow: '0 2px 16px 0 #1118' }}
                  className="px-6 py-4 hover:bg-[#111] cursor-pointer border-b border-[#181818] last:border-b-0 flex justify-between items-center transition-all duration-150 group"
                  onClick={() => handleSymbolClick(symbol.name)}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                >
                  <div className="flex items-center min-w-0">
                    {/* Black/white badge */}
                    <div className="w-9 h-9 rounded-full border border-white/15 bg-gradient-to-br from-[#181818] to-[#232323] flex items-center justify-center mr-5 text-base font-bold text-white/90 shadow-inner group-hover:shadow-lg transition-all duration-150 select-none">
                      {symbol.name[0].toUpperCase()}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-base text-white leading-tight truncate max-w-[120px]">{symbol.name}</span>
                      <span className="text-xs text-gray-400 truncate max-w-[180px] font-normal mt-0.5">{symbol.description}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end min-w-[80px] ml-4">
                    <span className="text-xs text-gray-300 font-medium tracking-wider leading-tight">{symbol.type.toUpperCase()}</span>
                    <span className="text-xs text-gray-500 font-normal leading-tight">{symbol.exchange}</span>
                  </div>
                </motion.div>
              )) : (
                <div className="p-10 text-center text-gray-500 flex flex-col items-center justify-center h-full">
                  <Search className="mb-4 text-gray-600" size={36} />
                  <p>No symbols found for "{searchTerm}"{activeCategory !== 'All' ? ` in ${activeCategory}` : ''}.</p>
                  <p className="text-sm text-gray-600 mt-2">Try a different search term or category.</p>
                </div>
              )}
            </div>
            {/* Footer */}
            <div className="py-3 px-8 border-t border-[#232323] bg-gradient-to-r from-[#111] to-black flex-shrink-0">
              <div className="w-full flex items-center justify-center">
                <span className="text-xs text-gray-500 text-center tracking-wide" style={{ fontSize: '12px', letterSpacing: '0.02em' }}>
                  Tip: Simply start typing on the chart to pull up this search box.
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SymbolSearchPanel; 