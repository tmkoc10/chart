import React, { useState, useRef, useEffect } from 'react';
import { Code, BarChart2, Settings, Grid, Building, ChevronUp } from 'lucide-react';

// Define the props interface
interface ChartFooterProps {
  onItemClick: (component: string) => void;
  isDragging?: boolean;
  shouldBlurButtons?: boolean;
  activeItem?: string; // New prop for active button
}

export default function ChartFooter({ onItemClick, isDragging = false, shouldBlurButtons = false, activeItem = 'Broker' }: ChartFooterProps) {
  const [expandedState, setExpandedState] = useState(false);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  
  useEffect(() => {
    if (shouldBlurButtons && buttonRefs.current) {
      buttonRefs.current.forEach(btn => btn && btn.blur());
    }
  }, [shouldBlurButtons]);

  // Define the new footer items without colored hover effects
  const footerItems = [
    { 
      name: 'Broker', 
      icon: <Building size={18} />,
      description: "Connect to trading brokers",
    },
    { 
      name: 'Code Compiler', 
      icon: <Code size={18} />,
      description: "Write and compile trading algorithms",
    },
    { 
      name: 'Backtest', 
      icon: <BarChart2 size={18} />,
      description: "Test strategies on historical data",
    },
    { 
      name: 'Optimization', 
      icon: <Settings size={18} />,
      description: "Optimize trading parameters",
    },
    { 
      name: 'Footprint', 
      icon: <Grid size={18} />,
      description: "Analyze market volume structure",
    },
  ];

  // Get active button styles - changed to use black
  const getActiveStyles = (name: string) => {
    if (name === activeItem) {
      // Use black color for active state
      return 'bg-black border-gray-800 text-white';
    }
    return '';
  };

  return (
    <div className="bg-gradient-to-r from-[#0a0a12] via-[#111119] to-[#0a0a12] border-t border-gray-800 px-4 py-0.5 flex items-center h-9 shadow-[0_-4px_10px_rgba(0,0,0,0.3)] relative">
      {/* Professional gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(0,0,0,0.4)] pointer-events-none"></div>
      
      {/* Main tools - Left aligned */}
      <div
        className="flex items-center space-x-6 z-10 pl-2"
        style={isDragging ? { pointerEvents: 'none', userSelect: 'none' } : {}}
      >
        {footerItems.map((item, index) => (
          <button
            key={index}
            onClick={() => onItemClick(item.name)}
            ref={el => { buttonRefs.current[index] = el || null; }}
            tabIndex={isDragging || shouldBlurButtons ? -1 : 0}
            onMouseUp={e => {
              if (isDragging || shouldBlurButtons) {
                e.currentTarget.blur();
              }
            }}
            className={`group relative flex items-center space-x-2 px-3 py-1.5 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-700 transition-all duration-200 text-sm font-medium transform backdrop-blur-sm border ${item.name === activeItem ? '' : 'border-transparent hover:bg-gray-900/50 hover:border-gray-800'} ${getActiveStyles(item.name)}`}
            title={item.description}
          >
            <div className="transition-transform duration-300">
              {React.cloneElement(item.icon, { 
                className: item.name === activeItem 
                  ? `text-white` 
                  : `text-gray-300` 
              })}
            </div>
            <span className={item.name === activeItem ? "text-white" : "text-gray-300"}>{item.name}</span>
          </button>
        ))}
      </div>
      
      {/* Right side toggle button (for future expandability) */}
      <div className="absolute right-4">
        <button 
          onClick={() => setExpandedState(!expandedState)}
          className="text-gray-500 hover:text-gray-300 transition-colors duration-200 p-1 rounded-md hover:bg-gray-900/50"
          title="More options"
        >
          <ChevronUp size={14} className={`transform transition-transform duration-300 ${expandedState ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
} 