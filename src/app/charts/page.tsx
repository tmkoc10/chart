'use client'

import { createChart, LineSeries, AreaSeries, CandlestickSeries, BarSeries, BaselineSeries, HistogramSeries, LineData, CandlestickData, Time, LineSeriesPartialOptions } from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';
import { LogOut, Search, User, Settings, Plus, ChevronDown, CandlestickChart, BarChart, LineChart, Activity, TrendingUp, BarChart2, ChevronRight, LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SymbolSearchPanel from '@/components/SymbolSearchPanel';
import ChartSettingsPanel from '@/components/ChartSettingsPanel';
import IndicatorsPanel from '@/components/IndicatorsPanel';
import WatchlistPanel from '@/components/WatchlistPanel';
import ChartFooter from '@/components/ChartFooter';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ANIMATION_DURATION } from '@/utils/animation';
import { toast } from 'sonner';

export default function ChartsPage() {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(false);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [isIndicatorsPanelOpen, setIsIndicatorsPanelOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false); // Default to closed
  const [currentSymbol, setCurrentSymbol] = useState("GOLD");
  const [selectedTimeframe, setSelectedTimeframe] = useState("1D");
  const [isTimeframeDropdownOpen, setIsTimeframeDropdownOpen] = useState(false);
  const [chartType, setChartType] = useState("Candles");
  const [isChartTypeDropdownOpen, setIsChartTypeDropdownOpen] = useState(false);
  
  // New state for footer panel notification
  const [footerNotification, setFooterNotification] = useState<string | null>(null);

  // Add state for draggable footer panel height
  const [footerPanelHeight, setFooterPanelHeight] = useState(0); // 0 = collapsed
  const [isDraggingFooter, setIsDraggingFooter] = useState(false);
  const [shouldBlurFooterButtons, setShouldBlurFooterButtons] = useState(false);
  const chartPanelRef = useRef<HTMLDivElement | null>(null);
  const MIN_FOOTER_HEIGHT = 48; // Minimum height for the expanded/collapsed footer panel

  const timeframeDropdownRef = useRef<HTMLDivElement>(null); // Ref for the timeframe dropdown
  const chartTypeDropdownRef = useRef<HTMLDivElement>(null); // Ref for the chart type dropdown

  const timeframeCategories = [
    {
      name: "TICKS",
      options: ["1 tick", "10 ticks", "100 ticks", "1000 ticks"],
    },
    {
      name: "SECONDS",
      options: ["1 second", "5 seconds", "10 seconds", "15 seconds", "30 seconds", "45 seconds"],
    },
    {
      name: "MINUTES",
      options: ["1 minute", "2 minutes", "3 minutes", "5 minutes", "10 minutes", "15 minutes", "30 minutes", "45 minutes"],
    },
    {
      name: "HOURS",
      options: ["1 hour", "2 hours", "3 hours", "4 hours"],
    },
    {
      name: "DAYS",
      options: ["1 day", "1W", "1M"], // Assuming 1W and 1M were previously here and intended for longer frames
    },
    // Add other categories like WEEKS, MONTHS as needed
  ];

  // Define the default state for categories (only MINUTES open)
  const getDefaultCategoryStates = () => {
    const defaultStates: { [key: string]: boolean } = {};
    timeframeCategories.forEach(category => {
      defaultStates[category.name] = category.name === "MINUTES";
    });
    return defaultStates;
  };

  const [openCategories, setOpenCategories] = useState<{ [key: string]: boolean }>(getDefaultCategoryStates());

  const handleLogout = () => {
    router.push('/');
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;
    
    // Chart configuration
    const chart = createChart(chartContainerRef.current, { 
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
          background: { color: '#000000' },
          textColor: '#D1D4DC',
          attributionLogo: false,
      },
      grid: {
          vertLines: {
              color: '#363A45',
          },
          horzLines: {
              color: '#363A45',
          },
      },
      handleScroll: {
        pressedMouseMove: true,
        horzTouchDrag: false,
      },
      timeScale: {
        borderVisible: false,
        // Adjust right offset based on watchlist state - this creates space between price scale and right edge
        rightOffset: isWatchlistOpen ? 20 : 12,
      },
      rightPriceScale: {
        borderVisible: false,
        visible: true,
        entireTextOnly: true,
        borderColor: '#363A45',
        // Adjust margin to ensure price scale is not cut off
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      leftPriceScale: {
        borderVisible: false,
      }
    });

    // Add series to chart
    const lineSeriesOptions: LineSeriesPartialOptions = {
      color: 'rgba(34, 197, 94, 1)',
      lineWidth: 2,
    };
    const lineSeries = chart.addSeries(LineSeries, lineSeriesOptions);
    
    // Set data
    const data: LineData<Time>[] = [
      { time: '2019-04-11', value: 80.01 },
      { time: '2019-04-12', value: 96.63 },
      { time: '2019-04-13', value: 76.64 },
      { time: '2019-04-14', value: 81.89 },
      { time: '2019-04-15', value: 74.43 },
      { time: '2019-04-16', value: 80.01 },
      { time: '2019-04-17', value: 96.63 },
      { time: '2019-04-18', value: 76.64 },
      { time: '2019-04-19', value: 81.89 },
      { time: '2019-04-20', value: 74.43 },
    ];
    lineSeries.setData(data);
    chart.timeScale().fitContent();

    // Handle window resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        // Apply resize immediately to ensure synchronization with the panel animation
        chart.resize(
          chartContainerRef.current.clientWidth,
          chartContainerRef.current.clientHeight
        );
        // Ensure the chart content is properly fitted
        chart.timeScale().fitContent();
      }
    };

    // Update spacing when watchlist is toggled
    const updateChartMargins = () => {
      // Performance optimization: Only resize once after a short delay
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      
      resizeTimeoutRef.current = setTimeout(() => {
        // Key fix: Update rightOffset to ensure proper spacing for both collapsed and expanded states
        chart.applyOptions({
          timeScale: {
            rightOffset: isWatchlistOpen ? 20 : 12,
          },
        });
        
        handleResize();
        resizeTimeoutRef.current = null;
      }, ANIMATION_DURATION); // Match exactly the watchlist animation duration
    };
    
    // Initial call to update margins
    updateChartMargins();
    
    // Set event listener
    window.addEventListener('resize', handleResize);
    
    // Effect for watchlist state
    // This ensures the chart resizes correctly when watchlist state changes
    updateChartMargins();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      chart.remove();
    };
  }, [isWatchlistOpen]); // Re-run when watchlist state changes

  useEffect(() => {
    router.prefetch('/');
  }, [router]);

  // Effect to handle clicks outside the timeframe dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (timeframeDropdownRef.current && !timeframeDropdownRef.current.contains(event.target as Node)) {
        setIsTimeframeDropdownOpen(false);
      }
      if (chartTypeDropdownRef.current && !chartTypeDropdownRef.current.contains(event.target as Node)) {
        setIsChartTypeDropdownOpen(false);
      }
    };

    if (isTimeframeDropdownOpen || isChartTypeDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isTimeframeDropdownOpen, isChartTypeDropdownOpen]);

  const toggleSearchPanel = () => {
    setIsSearchPanelOpen(!isSearchPanelOpen);
  };

  const toggleSettingsPanel = () => {
    setIsSettingsPanelOpen(!isSettingsPanelOpen);
  };

  const toggleIndicatorsPanel = () => {
    setIsIndicatorsPanelOpen(!isIndicatorsPanelOpen);
  };

  const toggleTimeframeDropdown = () => {
    const willBeOpen = !isTimeframeDropdownOpen;
    setIsTimeframeDropdownOpen(willBeOpen);
    if (willBeOpen) {
      // If opening the dropdown, reset categories to default (only MINUTES open)
      setOpenCategories(getDefaultCategoryStates());
      // Close other dropdowns
      setIsChartTypeDropdownOpen(false);
    }
  };

  const toggleChartTypeDropdown = () => {
    const willBeOpen = !isChartTypeDropdownOpen;
    setIsChartTypeDropdownOpen(willBeOpen);
    if (willBeOpen) {
      // Close other dropdowns
      setIsTimeframeDropdownOpen(false);
      setIsIndicatorsPanelOpen(false);
    }
  };

  const toggleCategory = (categoryName: string) => {
    setOpenCategories(prevState => ({
      ...prevState,
      [categoryName]: !prevState[categoryName]
    }));
  };

  const handleTimeframeSelect = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
    setIsTimeframeDropdownOpen(false);
  };

  const handleChartTypeSelect = (type: string) => {
    setChartType(type);
    setIsChartTypeDropdownOpen(false);
    // You would implement actual chart type change logic here
  };

  const handleSymbolSelect = (symbol: string) => {
    setCurrentSymbol(symbol);
    // Potentially, you might want to trigger a chart update here with the new symbol
  };

  const toggleWatchlist = () => {
    setIsWatchlistOpen(!isWatchlistOpen);
  };

  // Handle footer button clicks
  const handleFooterButtonClick = (component: string) => {
    // Provide custom messages for each component
    let message = "";
    switch (component) {
      case "Broker":
        message = "Broker connection module will be available soon!";
        break;
      case "Code Compiler":
        message = "Code Compiler for trading algorithms will be available soon!";
        break;
      case "Backtest":
        message = "Strategy Backtesting feature will be available soon!";
        break;
      case "Optimization":
        message = "Parameter Optimization feature will be available soon!";
        break;
      case "Footprint":
        message = "Market Footprint analysis will be available soon!";
        break;
      default:
        message = `${component} will be available soon!`;
    }

    setFooterNotification(message);
    
    // Clear notification after 3 seconds
    setTimeout(() => {
      setFooterNotification(null);
    }, 3000);
  };

  // Mouse event handlers for dragging
  useEffect(() => {
    if (!isDraggingFooter) return;
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate new height from bottom of window
      const windowHeight = window.innerHeight;
      const newHeight = windowHeight - e.clientY;
      setFooterPanelHeight(Math.max(MIN_FOOTER_HEIGHT, newHeight));
    };
    const handleMouseUp = () => {
      setIsDraggingFooter(false);
      // If collapsed to minimum, trigger blur for footer buttons
      setTimeout(() => {
        setShouldBlurFooterButtons(true);
      }, 0);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingFooter]);

  // Reset shouldBlurFooterButtons after one render
  useEffect(() => {
    if (shouldBlurFooterButtons) {
      setShouldBlurFooterButtons(false);
    }
  }, [shouldBlurFooterButtons]);

  return (
    <div className="flex flex-col w-full h-screen max-h-screen"> {/* Outermost container, full viewport height */}
      {/* Header Divider */}
      <div style={{width: '100%', height: '3px', background: '#363A45', borderRadius: '2px'}} />
      {/* Professional and elegant header */}
      <header className="w-full px-4 py-0.5 h-9 bg-black">
        <div className="flex items-center space-x-2"> 
          {/* Profile icon - replacing the dashboard icon */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-gray-900 focus:ring-1 focus:ring-gray-700 rounded-md h-8 w-8"
            title="Profile"
          >
            <User className="h-4 w-4 text-gray-100" />
          </Button>
          {/* Visual Separator */}
          <div style={{height: '24px', width: '3px', background: '#363A45', borderRadius: '2px'}}></div>
          {/* Symbol search button - improved styling */}
          <Button 
            onClick={toggleSearchPanel} 
            variant="ghost"
            className="flex items-center space-x-2 px-3 rounded-md hover:bg-gray-900 focus:ring-1 focus:ring-gray-700 h-8"
          >
            <Search className="h-4 w-4 text-gray-400" />
            <span className="font-medium text-gray-100">{currentSymbol}</span>
          </Button>
          
          {/* Plus Icon Button - improved styling */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-gray-900 focus:ring-1 focus:ring-gray-700 rounded-md h-8 w-8"
          >
            <Plus className="h-4 w-4 text-gray-400" />
          </Button>
          
          {/* Visual Separator */}
          <div style={{height: '24px', width: '3px', background: '#363A45', borderRadius: '2px'}}></div>
          
          {/* Timeframe Dropdown - improved styling */}
          <div ref={timeframeDropdownRef} className="relative">
            <Button
              onClick={toggleTimeframeDropdown}
              variant="ghost"
              className={cn(
                "flex items-center space-x-1.5 px-3 rounded-md h-8",
                "hover:bg-gray-900 focus:ring-1 focus:ring-gray-700",
                isTimeframeDropdownOpen && "bg-gray-900"
              )}
            >
              <span className="font-medium text-gray-100">{selectedTimeframe}</span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </Button>
            {isTimeframeDropdownOpen && (
              <div className="absolute mt-1 w-48 bg-black border border-gray-800 rounded-md shadow-lg z-10 py-1 animate-in fade-in-50 slide-in-from-top-5">
                <button
                  onClick={() => console.log("Add custom interval clicked")}
                  className="block w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-900 font-medium border-b border-gray-800"
                >
                  Add custom interval...
                </button>
                {timeframeCategories.map((category) => (
                  <div key={category.name} className="py-1">
                    <button 
                      onClick={() => toggleCategory(category.name)}
                      className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-gray-200 focus:outline-none"
                    >
                      <span className="uppercase tracking-wider">
                        {category.name}
                      </span>
                      {openCategories[category.name] ? 
                        <ChevronDown className="h-3.5 w-3.5" /> : 
                        <ChevronRight className="h-3.5 w-3.5" />
                      }
                    </button>
                    {openCategories[category.name] && category.options.map((tf) => (
                      <button
                        key={tf}
                        onClick={() => handleTimeframeSelect(tf)}
                        className="block w-full pl-6 pr-3 py-1.5 text-left text-sm text-gray-300 hover:bg-gray-800 transition-colors"
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Visual Separator */}
          <div style={{height: '24px', width: '3px', background: '#363A45', borderRadius: '2px'}}></div>
          
          {/* Chart Type Dropdown - improved styling */}
          <div ref={chartTypeDropdownRef} className="relative">
            <Button
              onClick={toggleChartTypeDropdown}
              variant="ghost"
              className={cn(
                "flex items-center space-x-1.5 px-3 rounded-md h-8",
                "hover:bg-gray-900 focus:ring-1 focus:ring-gray-700",
                isChartTypeDropdownOpen && "bg-gray-900"
              )}
            >
              {chartType === "Candles" && <CandlestickChart className="h-4 w-4 text-gray-300" />}
              {chartType === "Bars" && <BarChart className="h-4 w-4 text-gray-300" />}
              {chartType === "Line" && <LineChart className="h-4 w-4 text-gray-300" />}
              {chartType === "Area" && <Activity className="h-4 w-4 text-gray-300" />}
              {chartType === "Baseline" && <TrendingUp className="h-4 w-4 text-gray-300" />}
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </Button>
            {isChartTypeDropdownOpen && (
              <div className="absolute mt-1 w-56 bg-black border border-gray-800 rounded-md shadow-lg z-10 py-1 animate-in fade-in-50 slide-in-from-top-5">
                <button
                  onClick={() => handleChartTypeSelect("Bars")}
                  className="w-full flex items-center px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-900 transition-colors"
                >
                  <BarChart className="h-4 w-4 mr-2 text-gray-400" />
                  <span>Bars</span>
                </button>
                <button
                  onClick={() => handleChartTypeSelect("Candles")}
                  className="w-full flex items-center px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-900 transition-colors"
                >
                  <CandlestickChart className="h-4 w-4 mr-2 text-gray-400" />
                  <span>Candles</span>
                </button>
                <button
                  onClick={() => handleChartTypeSelect("Hollow Candles")}
                  className="w-full flex items-center px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-900 transition-colors"
                >
                  <CandlestickChart className="h-4 w-4 mr-2 text-gray-400" />
                  <span>Hollow Candles</span>
                </button>
                <button
                  onClick={() => handleChartTypeSelect("Line")}
                  className="w-full flex items-center px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-900 transition-colors"
                >
                  <LineChart className="h-4 w-4 mr-2 text-gray-400" />
                  <span>Line</span>
                </button>
                <button
                  onClick={() => handleChartTypeSelect("Area")}
                  className="w-full flex items-center px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-900 transition-colors"
                >
                  <Activity className="h-4 w-4 mr-2 text-gray-400" />
                  <span>Area</span>
                </button>
                <button
                  onClick={() => handleChartTypeSelect("Baseline")}
                  className="w-full flex items-center px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-900 transition-colors"
                >
                  <TrendingUp className="h-4 w-4 mr-2 text-gray-400" />
                  <span>Baseline</span>
                </button>
                <div className="border-t border-gray-800 my-1"></div>
                <button
                  onClick={() => handleChartTypeSelect("Heikin Ashi")}
                  className="w-full flex items-center px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-900 transition-colors"
                >
                  <CandlestickChart className="h-4 w-4 mr-2 text-gray-400" />
                  <span>Heikin Ashi</span>
                </button>
                <button
                  onClick={() => handleChartTypeSelect("Renko")}
                  className="w-full flex items-center px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-900 transition-colors"
                >
                  <BarChart className="h-4 w-4 mr-2 text-gray-400" />
                  <span>Renko</span>
                </button>
                <button
                  onClick={() => handleChartTypeSelect("Line Break")}
                  className="w-full flex items-center px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-900 transition-colors"
                >
                  <LineChart className="h-4 w-4 mr-2 text-gray-400" />
                  <span>Line Break</span>
                </button>
                <button
                  onClick={() => handleChartTypeSelect("Kagi")}
                  className="w-full flex items-center px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-900 transition-colors"
                >
                  <Activity className="h-4 w-4 mr-2 text-gray-400" />
                  <span>Kagi</span>
                </button>
                <button
                  onClick={() => handleChartTypeSelect("Point & Figure")}
                  className="w-full flex items-center px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-900 transition-colors"
                >
                  <BarChart className="h-4 w-4 mr-2 text-gray-400" />
                  <span>Point & Figure</span>
                </button>
                <button
                  onClick={() => handleChartTypeSelect("Range")}
                  className="w-full flex items-center px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-900 transition-colors"
                >
                  <Activity className="h-4 w-4 mr-2 text-gray-400" />
                  <span>Range</span>
                </button>
              </div>
            )}
          </div>
          
          {/* Visual Separator */}
          <div style={{height: '24px', width: '3px', background: '#363A45', borderRadius: '2px'}}></div>
          
          {/* Indicators Button - improved styling */}
          <Button
            onClick={toggleIndicatorsPanel}
            variant="ghost"
            className="flex items-center space-x-1.5 px-3 rounded-md hover:bg-gray-900 focus:ring-1 focus:ring-gray-700 h-8"
          >
            <BarChart2 className="h-4 w-4 text-gray-300" />
            <span className="font-medium text-gray-100">Indicators</span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </Button>
        </div>

        {/* Center area - can be used for status or notifications */}
        <div className="flex-1 flex justify-center">
          {/* Optional: App name or status can go here */}
        </div>

        {/* Right side - User and settings */}
        <div className="flex items-center space-x-2 absolute right-4 top-1.5">
          <Button 
            onClick={toggleSettingsPanel}
            variant="ghost" 
            size="icon" 
            className="hover:bg-gray-900 focus:ring-1 focus:ring-gray-700 rounded-md h-8 w-8"
            title="Settings"
          >
            <Settings className="h-4 w-4 text-gray-300" />
          </Button>
          <Button 
            onClick={handleLogout} 
            variant="ghost" 
            size="icon" 
            className="hover:bg-gray-900 focus:ring-1 focus:ring-gray-700 rounded-md h-8 w-8"
            title="Logout"
          >
            <LogOut className="h-4 w-4 text-gray-300" />
          </Button>
        </div>
      </header>

      {/* The rest of the UI remains the same */}
      <div className="w-full h-[3px] bg-[#363A45] flex-shrink-0" /> {/* Thick separator line */}

      {/* Flex container for sidebar and main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Vertical Divider */}
        <div style={{height: '100%', width: '3px', background: '#363A45', borderRadius: '2px', flexShrink: 0}} />
        <aside className="w-10 bg-background p-1 flex-shrink-0 overflow-y-auto">
          {/* Sidebar content can go here. It will be very narrow. */}
        </aside>
        {/* Vertical Divider 1 */}
        <div style={{height: '100%', width: '3px', background: '#363A45', borderRadius: '2px', flexShrink: 0}} />

        {/* Main content area */}
        <div className="flex flex-col flex-1 overflow-hidden relative">
          {/* Chart area, shrinks as footer panel expands */}
          <main
            className="flex-1 pt-0 overflow-hidden relative"
            style={footerPanelHeight > 0 ? { height: `calc(100% - ${footerPanelHeight}px)` } : {}}
          >
            <div ref={chartContainerRef} className="absolute top-0 left-0 right-0 bottom-0 w-full m-0 p-0" style={{height: 'auto'}} />
            
            {/* Enhanced notification overlay */}
            {footerNotification && (
              <div className="absolute bottom-14 left-1/2 transform -translate-x-1/2 bg-gray-900/90 text-white px-5 py-2.5 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 backdrop-blur-sm border border-gray-700 max-w-md">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                  <p className="text-sm font-medium">{footerNotification}</p>
                </div>
              </div>
            )}
          </main>
          {/* Draggable Divider Above Footer */}
          <div
            style={{
              width: '100%',
              height: '6px',
              background: '#363A45',
              borderRadius: '3px',
              cursor: 'ns-resize',
              zIndex: 20,
            }}
            onMouseDown={() => setIsDraggingFooter(true)}
            title="Drag to expand/collapse footer panel"
          />
          {/* Footer Panel (expands upward) */}
          {footerPanelHeight > MIN_FOOTER_HEIGHT ? (
            <div
              style={{
                width: '100%',
                height: footerPanelHeight,
                background: '#18181b',
                borderTop: '1px solid #363A45',
                boxShadow: '0 -4px 10px rgba(0,0,0,0.3)',
                zIndex: 10,
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Footer as header (tab bar) */}
              <ChartFooter onItemClick={handleFooterButtonClick} isDragging={isDraggingFooter} shouldBlurButtons={shouldBlurFooterButtons && footerPanelHeight <= MIN_FOOTER_HEIGHT} />
              {/* Placeholder for selected page/component below */}
              <div style={{flex: 1, background: '#111119', borderTop: '1px solid #363A45'}}>
                {/* TODO: Render selected component/page here */}
              </div>
            </div>
          ) : (
            <footer className="flex-shrink-0">
              <ChartFooter onItemClick={handleFooterButtonClick} isDragging={isDraggingFooter} shouldBlurButtons={shouldBlurFooterButtons && footerPanelHeight <= MIN_FOOTER_HEIGHT} />
              {/* Divider below footer components */}
              <div style={{width: '100%', height: '3px', background: '#363A45', borderRadius: '2px'}} />
            </footer>
          )}
        </div>

        {/* Right side panel with WatchlistPanel */}
        <div style={{height: '100%', borderLeft: '3px solid #363A45', borderRadius: '2px', flexShrink: 0, display: 'flex', alignItems: 'stretch'}}>
          <WatchlistPanel isOpen={isWatchlistOpen} onToggle={toggleWatchlist} />
        </div>
        {/* Rightmost vertical divider */}
        <div style={{height: '100%', width: '3px', background: '#363A45', borderRadius: '2px', flexShrink: 0}} />
      </div>
      
      {/* Other components remain the same */}
      {isSearchPanelOpen && (
        <SymbolSearchPanel 
          isOpen={isSearchPanelOpen} 
          onClose={toggleSearchPanel} 
          onSymbolSelect={handleSymbolSelect}
        />
      )}
      {isSettingsPanelOpen && (
        <ChartSettingsPanel
          isOpen={isSettingsPanelOpen}
          onClose={toggleSettingsPanel}
        />
      )}
      {isIndicatorsPanelOpen && (
        <IndicatorsPanel
          isOpen={isIndicatorsPanelOpen}
          onClose={toggleIndicatorsPanel}
        />
      )}
    </div>
  );
} 