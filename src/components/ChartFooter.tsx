import React, { useState, useRef, useEffect } from 'react';
import { Code, BarChart2, Settings, Grid, Building, ChevronUp } from 'lucide-react';
import { cn } from '../lib/utils';

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
      icon: <Building size={16} />,
      description: "Connect to trading brokers",
    },
    { 
      name: 'Code Compiler', 
      icon: <Code size={16} />,
      description: "Write and compile trading algorithms",
    },
    { 
      name: 'Backtest', 
      icon: <BarChart2 size={16} />,
      description: "Test strategies on historical data",
    },
    { 
      name: 'Optimization', 
      icon: <Settings size={16} />,
      description: "Optimize trading parameters",
    },
    { 
      name: 'Footprint', 
      icon: <Grid size={16} />,
      description: "Analyze market volume structure",
    },
  ];

  return (
    <div className="bg-black border-t border-gray-800 px-4 py-0.5 flex items-center h-9 shadow-md relative">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(10,10,10,0.2)] pointer-events-none"></div>
      
      {/* Main tools - Left aligned */}
      <div
        className="flex items-center space-x-2 z-10 pl-2"
        style={isDragging ? { pointerEvents: 'none', userSelect: 'none' } : {}}
      >
        {footerItems.map((item, index) => {
          const isActive = item.name === activeItem;
          
          return (
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
              className={cn(
                "group relative flex items-center space-x-2 px-3 py-1.5 rounded focus:outline-none transition-all duration-200 text-sm font-medium",
                isActive 
                  ? "bg-[#0a0a0a] text-white border-b-2 border-white" 
                  : "text-gray-400 hover:text-gray-200 border-b-2 border-transparent hover:border-gray-800"
              )}
              title={item.description}
            >
              <div className="transition-all duration-300">
                {React.cloneElement(item.icon, { 
                  className: isActive ? "text-white" : "text-gray-400 group-hover:text-gray-300" 
                })}
              </div>
              <span className={cn(
                "text-sm transition-colors duration-200",
                isActive ? "text-white" : "text-gray-400 group-hover:text-gray-300"
              )}>
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
      
      {/* Right side toggle button */}
      <div className="absolute right-4 flex items-center">
        <span className="text-xs text-gray-500 mr-2 hidden sm:inline-block">Toggle panels</span>
        <button 
          onClick={() => setExpandedState(!expandedState)}
          className="text-gray-500 hover:text-white transition-colors duration-200 p-1 rounded hover:bg-[#1a1a1a]"
          title="More options"
        >
          <ChevronUp size={14} className={`transform transition-transform duration-300 ${expandedState ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
} 