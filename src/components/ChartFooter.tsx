import React, { useState, useRef, useEffect } from 'react';
import { Code, BarChart2, Settings, Grid, Building, ChevronUp } from 'lucide-react';

// Define the props interface
interface ChartFooterProps {
  onItemClick: (component: string) => void;
  isDragging?: boolean;
  shouldBlurButtons?: boolean;
}

export default function ChartFooter({ onItemClick, isDragging = false, shouldBlurButtons = false }: ChartFooterProps) {
  const [expandedState, setExpandedState] = useState(false);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  
  useEffect(() => {
    if (shouldBlurButtons && buttonRefs.current) {
      buttonRefs.current.forEach(btn => btn && btn.blur());
    }
  }, [shouldBlurButtons]);

  // Define the new footer items as requested by the user
  const footerItems = [
    { 
      name: 'Broker', 
      icon: <Building size={18} className="group-hover:text-blue-400 transition-colors duration-300" />,
      description: "Connect to trading brokers",
      color: "blue"
    },
    { 
      name: 'Code Compiler', 
      icon: <Code size={18} className="group-hover:text-green-400 transition-colors duration-300" />,
      description: "Write and compile trading algorithms",
      color: "green"
    },
    { 
      name: 'Backtest', 
      icon: <BarChart2 size={18} className="group-hover:text-purple-400 transition-colors duration-300" />,
      description: "Test strategies on historical data",
      color: "purple"
    },
    { 
      name: 'Optimization', 
      icon: <Settings size={18} className="group-hover:text-amber-400 transition-colors duration-300" />,
      description: "Optimize trading parameters",
      color: "amber"
    },
    { 
      name: 'Footprint', 
      icon: <Grid size={18} className="group-hover:text-red-400 transition-colors duration-300" />,
      description: "Analyze market volume structure",
      color: "red"
    },
  ];

  // Get the color class based on the item's color
  const getGlowColor = (color: string) => {
    switch (color) {
      case 'blue': return 'group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]';
      case 'green': return 'group-hover:shadow-[0_0_15px_rgba(34,197,94,0.5)]';
      case 'purple': return 'group-hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]';
      case 'amber': return 'group-hover:shadow-[0_0_15px_rgba(251,191,36,0.5)]';
      case 'red': return 'group-hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]';
      default: return '';
    }
  };

  // Get the border color based on the item's color
  const getHoverBorderColor = (color: string) => {
    switch (color) {
      case 'blue': return 'group-hover:border-blue-500/30';
      case 'green': return 'group-hover:border-green-500/30';
      case 'purple': return 'group-hover:border-purple-500/30';
      case 'amber': return 'group-hover:border-amber-500/30';
      case 'red': return 'group-hover:border-red-500/30';
      default: return '';
    }
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
            className={`group relative flex items-center space-x-2 px-3 py-1.5 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-700 transition-all duration-200 text-sm font-medium transform backdrop-blur-sm border border-transparent`}
            title={item.description}
          >
            <div className="transition-transform duration-300">
              {/* Remove group-hover from icon */}
              {React.cloneElement(item.icon, { className: undefined })}
            </div>
            <span className="text-gray-300 transition-colors duration-300">{item.name}</span>
            {/* Remove hover underline effect */}
          </button>
        ))}
      </div>
      
      {/* Right side toggle button (for future expandability) */}
      <div className="absolute right-4">
        <button 
          onClick={() => setExpandedState(!expandedState)}
          className="text-gray-500 hover:text-gray-300 transition-colors duration-200 p-1 rounded-md hover:bg-gray-800/30"
          title="More options"
        >
          <ChevronUp size={14} className={`transform transition-transform duration-300 ${expandedState ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
} 