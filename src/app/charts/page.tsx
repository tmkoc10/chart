'use client'

import { createChart, LineSeries, AreaSeries, CandlestickSeries, BarSeries, BaselineSeries, HistogramSeries, LineData, CandlestickData, Time, LineSeriesPartialOptions, IChartApi, ISeriesApi, SeriesType } from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';
import { LogOut, Search, User, Settings, Plus, ChevronDown, CandlestickChart, BarChart, LineChart, Activity, TrendingUp, BarChart2, ChevronRight, LayoutDashboard, MousePointer2, Ruler, Shapes, Target, Brush, Moon, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SymbolSearchPanel from '@/components/SymbolSearchPanel';
import ChartSettingsPanel from '@/components/ChartSettingsPanel';
import IndicatorsPanel from '@/components/IndicatorsPanel';
import WatchlistPanel from '@/components/WatchlistPanel';
import ChartFooter from '@/components/ChartFooter';
import BrokerPanel from '@/components/BrokerPanel';
import CodeCompilerPanel from '@/components/CodeCompilerPanel';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ANIMATION_DURATION } from '@/utils/animation';
import { toast } from 'sonner';
import { LogoIcon } from '@/components/logo';
import { motion, AnimatePresence } from 'framer-motion';

// Pixel-perfect SVGs matching the screenshot
const IconCursor = (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#fff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    {/* Vertical line with a gap at the center */}
    <line x1="16" y1="4" x2="16" y2="14" stroke="#fff" strokeWidth="1" />
    <line x1="16" y1="18" x2="16" y2="28" stroke="#fff" strokeWidth="1" />
    {/* Horizontal line with a gap at the center */}
    <line x1="4" y1="16" x2="14" y2="16" stroke="#fff" strokeWidth="1" />
    <line x1="18" y1="16" x2="28" y2="16" stroke="#fff" strokeWidth="1" />
  </svg>
);
const IconTrendLine = (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#fff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    {/* Top ring */}
    <circle cx="8" cy="24" r="2" fill="#000" stroke="#fff" strokeWidth="1" />
    <circle cx="8" cy="24" r="1" fill="#000" stroke="#000" strokeWidth="1" />
    {/* Bottom ring */}
    <circle cx="24" cy="8" r="2" fill="#000" stroke="#fff" strokeWidth="1" />
    <circle cx="24" cy="8" r="1" fill="#000" stroke="#000" strokeWidth="1" />
    {/* Thin trend line */}
    <line x1="8" y1="24" x2="24" y2="8" stroke="#fff" strokeWidth="1" />
  </svg>
);
const IconParallel = (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#fff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    {/* First line */}
    <line x1="8" y1="10" x2="24" y2="10" stroke="#fff" strokeWidth="1" />
    {/* Second line with ring at right */}
    <line x1="8" y1="16" x2="20" y2="16" stroke="#fff" strokeWidth="1" />
    <circle cx="24" cy="16" r="2" fill="#000" stroke="#fff" strokeWidth="1" />
    <circle cx="24" cy="16" r="1" fill="#000" stroke="#000" strokeWidth="1" />
    {/* Third line */}
    <line x1="8" y1="22" x2="24" y2="22" stroke="#fff" strokeWidth="1" />
    {/* Fourth line with ring at left */}
    <line x1="12" y1="28" x2="24" y2="28" stroke="#fff" strokeWidth="1" />
    <circle cx="8" cy="28" r="2" fill="#000" stroke="#fff" strokeWidth="1" />
    <circle cx="8" cy="28" r="1" fill="#000" stroke="#000" strokeWidth="1" />
  </svg>
);
const IconPattern = (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#fff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    {/* Elliott Wave zigzag: 3 segments, 4 points */}
    <polyline points="8,24 16,12 24,20 28,8" stroke="#fff" strokeWidth="1" fill="none" />
    {/* Hollow dots (rings) at each intersection */}
    <circle cx="8" cy="24" r="2" fill="#000" stroke="#fff" strokeWidth="1" />
    <circle cx="8" cy="24" r="1" fill="#000" stroke="#000" strokeWidth="1" />
    <circle cx="16" cy="12" r="2" fill="#000" stroke="#fff" strokeWidth="1" />
    <circle cx="16" cy="12" r="1" fill="#000" stroke="#000" strokeWidth="1" />
    <circle cx="24" cy="20" r="2" fill="#000" stroke="#fff" strokeWidth="1" />
    <circle cx="24" cy="20" r="1" fill="#000" stroke="#000" strokeWidth="1" />
    <circle cx="28" cy="8" r="2" fill="#000" stroke="#fff" strokeWidth="1" />
    <circle cx="28" cy="8" r="1" fill="#000" stroke="#000" strokeWidth="1" />
  </svg>
);
const IconFib = (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#fff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <g transform="rotate(30 16 22)">
      {/* Handle */}
      <rect x="14.25" y="5" width="3.5" height="15" rx="1.5" fill="#fff" stroke="#fff" strokeWidth="0.5" />
      {/* Ferrule */}
      <rect x="13.5" y="20" width="5" height="4" rx="1" fill="#b0b0b0" stroke="#fff" strokeWidth="0.5" />
      {/* Bristles (main shape) */}
      <path d="M13.5 24 C13 27, 14 29.5, 16 30 C18 29.5, 19 27, 18.5 24 Z" fill="#fff" stroke="#fff" strokeWidth="0.5"/>
      {/* Paint Hint (on top of bristles) */}
      <path d="M14.5 24.5 C14.25 26.5, 15 28, 16 28.5 C17 28, 17.75 26.5, 17.5 24.5 Z" fill="#e0e0e0" stroke="none"/>
    </g>
  </svg>
);
const IconText = (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="16" y1="8" x2="16" y2="26"/> 
    <line x1="8" y1="8" x2="24" y2="8"/>
  </svg>
);

const IconSmilingEmoji = (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#fff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    {/* Outer circle */}
    <circle cx="16" cy="16" r="12" stroke="#fff" strokeWidth="1" />
    {/* Left eye */}
    <circle cx="12" cy="13" r="1.5" fill="#fff" />
    {/* Right eye */}
    <circle cx="20" cy="13" r="1.5" fill="#fff" />
    {/* Smile */}
    <path d="M10 20 Q16 24 22 20" stroke="#fff" strokeWidth="1" fill="none" />
  </svg>
);

// Import types from ChartSettingsPanel. Assuming they are exported or defined in a shared types file.
// For now, let's redefine them here or assume they will be imported.
// We'll need ChartCanvasSettings and SymbolSettings from the panel's structure.
// If not exported, this would be:
interface ChartCanvasSettings {
  backgroundType: 'solid' | 'gradient';
  backgroundColor: string;
  backgroundColor2?: string;
  vertGridColor: string;
  horzGridColor: string;
  gridStyle: 'solid' | 'dashed' | 'dotted';
  crosshairColor: string;
  crosshairStyle: 'solid' | 'dashed' | 'dotted';
  crosshairWidth: number;
  watermarkVisible: boolean;
  watermarkColor?: string;
  scalesTextColor: string;
  scalesFontSize: number;
  scalesLineColor: string;
  navButtonsVisibility: 'always' | 'mouseover' | 'never';
  paneButtonsVisibility: 'always' | 'mouseover' | 'never';
  marginTop: number;
  marginBottom: number;
  marginRight: number;
}

interface SymbolSettings {
  chartType: string;
}

// Define SeriesTypeRecord if it's not provided by the library
type SeriesTypeRecord = Record<SeriesType, any>;

export default function ChartsPage() {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null); // Ref for chart instance
  const seriesRef = useRef<ISeriesApi<keyof SeriesTypeRecord> | null>(null); // Ref for current series instance
  const router = useRouter();
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(false);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [isIndicatorsPanelOpen, setIsIndicatorsPanelOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false); // Default to closed
  const [currentSymbol, setCurrentSymbol] = useState("GOLD");
  const [selectedTimeframe, setSelectedTimeframe] = useState("1 minute"); // Changed default to "1 minute"
  const [isTimeframeDropdownOpen, setIsTimeframeDropdownOpen] = useState(false);
  const [isChartTypeDropdownOpen, setIsChartTypeDropdownOpen] = useState(false);
  
  const [chartSettings, setChartSettings] = useState<ChartCanvasSettings & { symbol: SymbolSettings }>({
    backgroundType: 'solid',
    backgroundColor: '#121212', // Updated to match our theme
    backgroundColor2: '#1a1a1a',
    vertGridColor: '#222222', // Subtle grid lines
    horzGridColor: '#222222',
    gridStyle: 'dotted', // Changed to dotted for subtlety
    crosshairColor: '#ffffff', // White crosshair for better visibility
    crosshairStyle: 'dashed',
    crosshairWidth: 1,
    watermarkVisible: false,
    watermarkColor: '#ffffff',
    scalesTextColor: '#e0e0e0', // Improved text color for readability
    scalesFontSize: 12,
    scalesLineColor: '#333333', // Better contrast for scale lines
    navButtonsVisibility: 'mouseover',
    paneButtonsVisibility: 'mouseover',
    marginTop: 0, // No margin needed since we're using absolute positioning for the symbol info
    marginBottom: 8,
    marginRight: 10,
    symbol: {
        chartType: 'candles', // Initial chart type
    },
  });

  // Add state for draggable footer panel height
  const [footerPanelHeight, setFooterPanelHeight] = useState(0); // 0 = collapsed
  const [isDraggingFooter, setIsDraggingFooter] = useState(false);
  const [shouldBlurFooterButtons, setShouldBlurFooterButtons] = useState(false);
  const chartPanelRef = useRef<HTMLDivElement | null>(null);
  const MIN_FOOTER_HEIGHT = 48; // Minimum height for the expanded/collapsed footer panel

  // OHLC and market data state variables for symbol info display
  const [ohlcData, setOhlcData] = useState({
    open: 0,
    high: 0,
    low: 0,
    close: 0,
    change: 0,
    changePercent: 0
  });
  const [marketPrices, setMarketPrices] = useState({
    bid: 0,
    ask: 0,
    spread: 0
  });
  const [symbolFullName, setSymbolFullName] = useState("Gold");

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

  // Add activeFooterItem state with a default value of "Broker"
  const [activeFooterItem, setActiveFooterItem] = useState("Broker");

  // Add ref to store zoom level state for time formatting
  const isZoomedInRef = useRef<boolean>(false);

  // Add a ref to track the last day that was shown with date label
  const lastDateDayRef = useRef<string | null>(null);

  const [theme, setTheme] = useState('dark');

  const handleLogout = () => {
    router.push('/');
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;
    
    const chart = createChart(chartContainerRef.current, { 
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
          background: { color: chartSettings.backgroundColor }, // Use settings
          textColor: chartSettings.scalesTextColor, // Use settings
          attributionLogo: false,
          fontFamily: "'Inter', 'Roboto', sans-serif", // Improved typography
      },
      grid: {
          vertLines: { 
              color: chartSettings.vertGridColor, // Use settings
              style: chartSettings.gridStyle === 'dotted' ? 2 : chartSettings.gridStyle === 'dashed' ? 1 : 0, // Apply grid style
          },
          horzLines: { 
              color: chartSettings.horzGridColor, // Use settings 
              style: chartSettings.gridStyle === 'dotted' ? 2 : chartSettings.gridStyle === 'dashed' ? 1 : 0, // Apply grid style
          },
      },
      crosshair: {
          vertLine: {
              color: chartSettings.crosshairColor,
              style: chartSettings.crosshairStyle === 'dotted' ? 2 : chartSettings.crosshairStyle === 'dashed' ? 1 : 0,
              visible: true,
              labelVisible: true,
          },
          horzLine: {
              color: chartSettings.crosshairColor,
              style: chartSettings.crosshairStyle === 'dotted' ? 2 : chartSettings.crosshairStyle === 'dashed' ? 1 : 0,
              visible: true,
              labelVisible: true,
          },
          mode: 1, // Use crosshair mode 1 for better UX
      },
      handleScroll: {
        pressedMouseMove: true,
        horzTouchDrag: false,
      },
      timeScale: {
        borderVisible: false,
        // Adjust right offset based on watchlist state - this creates space between price scale and right edge
        rightOffset: isWatchlistOpen ? 20 : 12,
        timeVisible: true,
        secondsVisible: false,
        // Configure time format behavior
        tickMarkFormatter: (time: number): string => {
          const date = new Date(time * 1000);
          const currentDay = date.getDate();
          const currentMonth = date.getMonth();
          const currentYear = date.getFullYear();
          
          // Use composite key to accurately track date changes (year-month-day)
          const dateKey = `${currentYear}-${currentMonth}-${currentDay}`;
          
          // When zoomed in, show time only 
          if (isZoomedInRef.current) {
            return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
          }
          
          // When zoomed out, show date for first tick of each day, time for the rest
          // Using the composite date key to make sure date only appears once per day
          // even when scrolling across multiple days
          if (lastDateDayRef.current !== dateKey) {
            lastDateDayRef.current = dateKey;
            // Show only the date for the day change point
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          } else {
            // For all other ticks on the same day, show only time
            return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
          }
        },
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

    chartRef.current = chart;
    
    // Set up zoom detection for dynamic time format adjustment
    chart.timeScale().subscribeVisibleTimeRangeChange(() => {
      const logicalRange = chart.timeScale().getVisibleLogicalRange();
      if (logicalRange !== null) {
        // Consider zoomed in when the visible range is less than 30 bars
        const visibleBars = logicalRange.to - logicalRange.from;
        const wasZoomedIn = isZoomedInRef.current;
        isZoomedInRef.current = visibleBars < 30;
        
        // Only update if zoom state changed to avoid unnecessary re-renders
        if (wasZoomedIn !== isZoomedInRef.current) {
          // Reset the last date day tracking to ensure proper date labels
          lastDateDayRef.current = null;
          
          // Force time scale to redraw with the new format
          chart.applyOptions({
            timeScale: {
              visible: true, // This triggers a redraw
            }
          });
        }
      }
    });

    // Helper function to generate mock OHLC data
    const generateMockCandlestickData = (count: number): CandlestickData<Time>[] => {
      const data: CandlestickData<Time>[] = [];
      let lastClose = 100;
      
      // Create a date object for today at 9:00 AM
      const today = new Date();
      today.setHours(9, 0, 0, 0); // Set to 9:00:00.000 AM
      
      // Calculate start time based on the trading hours (9:00 AM - 3:00 PM)
      const tradingMinutes = 6 * 60; // 6 hours * 60 minutes
      const startTime = Math.floor(today.getTime() / 1000);
      
      // Ensure we don't generate more than 6 hours of data (360 minutes)
      const actualCount = Math.min(count, tradingMinutes);

      for (let i = 0; i < actualCount; i++) {
        // Calculate the time for this candle (9:00 AM + i minutes)
        const time = (startTime + i * 60) as Time;
        
        const open = lastClose + (Math.random() - 0.5) * 2;
        const close = open + (Math.random() - 0.5) * 5;
        const high = Math.max(open, close) + Math.random() * 2;
        const low = Math.min(open, close) - Math.random() * 2;
        data.push({ time, open, high, low, close });
        lastClose = close;
      }
      return data;
    };

    // Add series to chart - Changed to CandlestickSeries
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#ffffff', // White for up candles
      downColor: '#333333', // Dark gray for down candles
      borderUpColor: '#ffffff',
      borderDownColor: '#333333',
      wickUpColor: '#ffffff',
      wickDownColor: '#cccccc',
    });
    
    // Store the series reference so we can remove it later when changing chart types
    seriesRef.current = candlestickSeries;
    
    // Set data - 6 hours * 60 minutes/hour = 360 data points
    const mockData: CandlestickData<Time>[] = generateMockCandlestickData(360);
    candlestickSeries.setData(mockData);
    
    // Remove old line series and data
    // const lineSeriesOptions: LineSeriesPartialOptions = {
    //   color: 'rgba(34, 197, 94, 1)',
    //   lineWidth: 2,
    // };
    // const lineSeries = chart.addSeries(LineSeries, lineSeriesOptions);
    // const data: LineData<Time>[] = [
    //   { time: '2019-04-11', value: 80.01 },
    //   { time: '2019-04-12', value: 96.63 },
    //   { time: '2019-04-13', value: 76.64 },
    //   { time: '2019-04-14', value: 81.89 },
    //   { time: '2019-04-15', value: 74.43 },
    //   { time: '2019-04-16', value: 80.01 },
    //   { time: '2019-04-17', value: 96.63 },
    //   { time: '2019-04-18', value: 76.64 },
    //   { time: '2019-04-19', value: 81.89 },
    //   { time: '2019-04-20', value: 74.43 },
    // ];
    // lineSeries.setData(data);
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
  }, [isWatchlistOpen, chartSettings.backgroundColor, chartSettings.scalesTextColor, chartSettings.vertGridColor, chartSettings.horzGridColor]); // Add other relevant chartSettings dependencies

  useEffect(() => {
    router.prefetch('/');
  }, [router]);

  // Initialize OHLC data and market prices when component mounts
  useEffect(() => {
    // Initial data for GOLD symbol
    const basePrice = 3233.50;
    
    // Generate random price fluctuations around the base price
    const open = basePrice * (1 + (Math.random() - 0.5) * 0.01);
    const close = basePrice * (1 + (Math.random() - 0.5) * 0.005);
    const high = Math.max(open, close) * (1 + Math.random() * 0.002);
    const low = Math.min(open, close) * (1 - Math.random() * 0.002);
    const change = close - open;
    const changePercent = (change / open) * 100;
    
    // Calculate bid/ask spread
    const spread = basePrice * 0.0005; // 0.05% spread
    const bid = basePrice - spread / 2;
    const ask = basePrice + spread / 2;
    
    // Update state with initial data
    setOhlcData({
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2))
    });
    
    setMarketPrices({
      bid: parseFloat(bid.toFixed(2)),
      ask: parseFloat(ask.toFixed(2)),
      spread: parseFloat(spread.toFixed(2))
    });
  }, []);

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
    // TODO: Fetch new data for this timeframe and update chart
    toast(`Timeframe changed to: ${timeframe}`);
  };

  const handleChartTypeSelect = async (type: string) => {
    // This function is called by the existing header dropdown
    // It should now update the main chartSettings state
    const newChartType = type.toLowerCase().replace(' ', '_'); // e.g. "Hollow Candles" -> "hollow_candles"
    
    setChartSettings(prev => ({
        ...prev,
        symbol: {
            ...prev.symbol,
            chartType: newChartType,
        }
    }));

    try {
      // Show loading indicator
      toast.loading("Updating chart type...", { id: "chart-type-update" });
      
      // Update the chart series if chart ref is available
      if (chartRef.current) {
          await updateChartSeries(chartRef.current, newChartType, seriesRef);
      }
      
      // Dismiss loading indicator with success message
      toast.success("Chart type updated", { id: "chart-type-update" });
    } catch (error) {
      console.error("Error handling chart type selection:", error);
      toast.error("Failed to update chart type", { id: "chart-type-update" });
    }
    
    setIsChartTypeDropdownOpen(false);
  };

  const handleSymbolSelect = (symbol: string) => {
    setCurrentSymbol(symbol);
    
    // Update symbol full name based on selected symbol
    const symbolNames: Record<string, string> = {
      "GOLD": "Gold",
      "BTCUSD": "Bitcoin / US Dollar",
      "AAPL": "Apple Inc.",
      "MSFT": "Microsoft Corp.",
      "GOOGL": "Alphabet Inc.",
      "EURUSD": "Euro / US Dollar",
      "GBPUSD": "British Pound / US Dollar",
      "USDJPY": "US Dollar / Japanese Yen",
      "ETHUSD": "Ethereum / US Dollar",
      "XRPUSD": "Ripple / US Dollar",
      "LTCUSD": "Litecoin / US Dollar",
      "NIFTY": "Nifty 50 Index",
    };
    
    setSymbolFullName(symbolNames[symbol] || symbol);
    
    // Generate mock OHLC data for the selected symbol
    const basePrice = {
      "GOLD": 3233.50,
      "BTCUSD": 104968,
      "AAPL": 188.23,
      "MSFT": 429.56,
      "GOOGL": 177.89,
      "EURUSD": 1.1235,
      "GBPUSD": 1.3353,
      "USDJPY": 145.025,
      "ETHUSD": 2474.6,
      "XRPUSD": 2.35047,
      "LTCUSD": 97.99,
      "NIFTY": 24683.90,
    }[symbol] || 100;
    
    // Generate random price fluctuations around the base price
    const open = basePrice * (1 + (Math.random() - 0.5) * 0.01);
    const close = basePrice * (1 + (Math.random() - 0.5) * 0.005);
    const high = Math.max(open, close) * (1 + Math.random() * 0.002);
    const low = Math.min(open, close) * (1 - Math.random() * 0.002);
    const change = close - open;
    const changePercent = (change / open) * 100;
    
    // Calculate bid/ask spread
    const spread = basePrice * 0.0005; // 0.05% spread
    const bid = basePrice - spread / 2;
    const ask = basePrice + spread / 2;
    
    // Update state with new data
    setOhlcData({
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2))
    });
    
    setMarketPrices({
      bid: parseFloat(bid.toFixed(2)),
      ask: parseFloat(ask.toFixed(2)),
      spread: parseFloat(spread.toFixed(2))
    });
    
    // Potentially update chart data with new symbol
    if (chartRef.current && seriesRef.current) {
      updateChartSeries(chartRef.current, chartSettings.symbol.chartType, seriesRef);
    }
  };

  const toggleWatchlist = () => {
    setIsWatchlistOpen(!isWatchlistOpen);
  };

  // Update the handleFooterButtonClick function to remove notifications
  const handleFooterButtonClick = (component: string) => {
    // Only set the active footer item, no notifications
    setActiveFooterItem(component);
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

  // Add a simple ToolButton component for the sidebar
  function ToolButton({ icon, options }: { icon: React.ReactNode, options: string[] }) {
    const [open, setOpen] = useState(false);
    return (
      <div className="relative flex flex-col items-center mb-4">
        <button
          className="flex flex-col items-center justify-center w-8 h-8 rounded hover:bg-gray-800 focus:outline-none"
          onClick={() => setOpen((v) => !v)}
          title="Tool"
        >
          {icon}
        </button>
        {open && options.length > 0 && (
          <div className="absolute left-9 top-0 z-50 bg-black border border-gray-700 rounded shadow-lg py-1 px-2 min-w-[120px]">
            {options.map((opt) => (
              <div key={opt} className="text-xs text-gray-200 py-1 px-2 hover:bg-gray-800 rounded cursor-pointer whitespace-nowrap">{opt}</div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Import all the transformation utilities from our backend service
  const getChartTransforms = async () => {
    const { 
      transformToRenko,
      transformToLineBreak,
      transformToKagi,
      transformToPointFigure,
      transformToRange,
      transformToHeikinAshi,
      transformOHLCData
    } = await import('@/lib/candlestick-transforms');
    
    return {
      transformToRenko,
      transformToLineBreak,
      transformToKagi,
      transformToPointFigure,
      transformToRange, 
      transformToHeikinAshi,
      transformOHLCData
    };
   };

  const updateChartSeries = async (
    chart: IChartApi,
    newType: string,
    currentSeriesRef: React.MutableRefObject<ISeriesApi<keyof SeriesTypeRecord> | null>
  ) => {
      // Import the chart service
      const { getChartData } = await import('@/lib/chart-service');
      const { transformOHLCData } = await import('@/lib/candlestick-transforms');
      
      // Remove all existing series to ensure no overlaps
      if (currentSeriesRef.current) {
          chart.removeSeries(currentSeriesRef.current);
          currentSeriesRef.current = null;
      }
      
      // Clear any other unexpected series that might be on the chart
      try {
        // Different versions of the library have different methods
        const allSeries = (chart as any).series?.() || [];
        if (allSeries.length > 0) {
            allSeries.forEach((series: ISeriesApi<any>) => {
                chart.removeSeries(series);
            });
        }
      } catch (e) {
        console.warn("Could not clear all series:", e);
      }

      let newSeries: ISeriesApi<keyof SeriesTypeRecord> | null = null;
      
      try {
        // Get data from our chart service
        const data = await getChartData({
          symbol: currentSymbol,
          timeframe: selectedTimeframe,
          chartType: newType as any, // Type assertion to avoid type errors
          chartOptions: {
            // Add any specific options for each chart type
            brickSize: 1,    // For Renko
            lineCount: 1,    // For Line Break
            reversal: 1,     // For Kagi
            boxSize: 1,      // For Point & Figure
            range: 1         // For Range
          },
          count: 720 // Approx 12 hours of 1-min data
        });
        
        // Validate data: ensure timestamps are unique and in ascending order
        // This is another safety check in case our chart-service.ts changes don't catch all cases
        const orderedData = [...data].sort((a, b) => Number(a.time) - Number(b.time));
        const uniqueData: typeof data = [];
        
        // Use a Set to track timestamps we've already seen
        const seenTimestamps = new Set<number>();
        
        for (const item of orderedData) {
          const timestamp = Number(item.time);
          
          // Skip duplicate timestamps
          if (seenTimestamps.has(timestamp)) {
            console.warn(`Skipping duplicate timestamp: ${timestamp}`);
            continue;
          }
          
          seenTimestamps.add(timestamp);
          uniqueData.push(item);
        }
        
        // Create appropriate series based on chart type
        switch (newType.toLowerCase()) {
            case 'bars':
                const barSeries = chart.addSeries(BarSeries, {
                  // thinBars: false, // Example customization
                });
                barSeries.setData(uniqueData);
                newSeries = barSeries;
                break;
            case 'line':
                const lineSeries = chart.addSeries(LineSeries);
                lineSeries.setData(uniqueData.map(d => ({ time: d.time, value: d.close })));
                newSeries = lineSeries;
                break;
            case 'area':
                const areaSeries = chart.addSeries(AreaSeries);
                areaSeries.setData(uniqueData.map(d => ({ time: d.time, value: d.close })));
                newSeries = areaSeries;
                break;
            case 'baseline':
                const baselineSeries = chart.addSeries(BaselineSeries);
                baselineSeries.setData(uniqueData.map(d => ({ time: d.time, value: d.close })));
                newSeries = baselineSeries;
                break;
            case 'hollow_candles':
                const hollowCandleSeries = chart.addSeries(CandlestickSeries, {
                    upColor: chartSettings.backgroundColor, // Make body transparent for up candles
                    downColor: '#333333', // Filled dark gray for down candles
                    borderUpColor: '#ffffff', // White border for up candles
                    borderDownColor: '#333333', // Dark border for down candles
                    wickUpColor: '#ffffff', // White wick for up candles
                    wickDownColor: '#cccccc', // Light gray wick for down candles
                    // Enhance visual clarity
                    borderVisible: true,
                    wickVisible: true,
                });
                hollowCandleSeries.setData(uniqueData);
                newSeries = hollowCandleSeries;
                break;
            case 'heikin_ashi':
            case 'renko':
            case 'line_break':
            case 'kagi':
                // For all special chart types, use CandlestickSeries
                // The transformation has already been applied in the service
                const specialSeries = chart.addSeries(CandlestickSeries, {
                    upColor: '#ffffff', downColor: '#333333',
                    borderUpColor: '#ffffff', borderDownColor: '#333333',
                    wickUpColor: '#ffffff', wickDownColor: '#cccccc',
                    // Enhanced visualization properties
                    borderVisible: true,
                    wickVisible: true,
                });
                specialSeries.setData(uniqueData);
                newSeries = specialSeries;
                break;
            case 'candles':
            default:
                const candleSeries = chart.addSeries(CandlestickSeries, {
                    upColor: '#ffffff', downColor: '#333333',
                    borderUpColor: '#ffffff', borderDownColor: '#333333',
                    wickUpColor: '#ffffff', wickDownColor: '#cccccc',
                    // Apply thinner, cleaner lines for better visualization
                    borderVisible: true,
                    borderColor: undefined,
                    wickVisible: true,
                });
                candleSeries.setData(uniqueData);
                newSeries = candleSeries;
                break;
        }
        
        if (newSeries) {
            currentSeriesRef.current = newSeries;
            // Fit content after setting new data/series
            if (chartRef.current) {
              chartRef.current.timeScale().fitContent();
            }
        }
      } catch (error) {
        console.error("Error updating chart series:", error);
        
        if (error instanceof Error) {
          // Check if the error is about data ordering
          if (error.message.includes("data must be asc ordered by time")) {
            toast.error("Chart data time ordering issue. This is now fixed and shouldn't happen again.");
          } else {
            toast.error(`Chart error: ${error.message}`);
          }
        } else {
          toast.error("Failed to update chart. Please try again.");
        }
      }
  };

  const handlePanelSettingsChange = (newSettings: Partial<ChartCanvasSettings & { symbol: Partial<SymbolSettings> }>) => {
    setChartSettings(prev => {
        const updated = {
            ...prev,
            ...newSettings, // Apply canvas settings directly
            symbol: { // Deep merge symbol settings
                ...prev.symbol,
                ...(newSettings.symbol || {}),
            },
        };

        if (chartRef.current) {
            // Apply general chart options
            chartRef.current.applyOptions({
                layout: {
                    background: { color: updated.backgroundColor },
                    textColor: updated.scalesTextColor,
                },
                grid: {
                    vertLines: { color: updated.vertGridColor, style: updated.gridStyle === 'dotted' ? 2 : updated.gridStyle === 'dashed' ? 1 : 0 /* Solid */},
                    horzLines: { color: updated.horzGridColor, style: updated.gridStyle === 'dotted' ? 2 : updated.gridStyle === 'dashed' ? 1 : 0 /* Solid */ },
                },
                crosshair: {
                  // Use crosshairOptions with proper properties
                  vertLine: { 
                    color: updated.crosshairColor,
                    style: updated.crosshairStyle === 'dotted' ? 2 : updated.crosshairStyle === 'dashed' ? 1 : 0
                  },
                  horzLine: {
                    color: updated.crosshairColor,
                    style: updated.crosshairStyle === 'dotted' ? 2 : updated.crosshairStyle === 'dashed' ? 1 : 0
                  }
                },
                // watermak, scales, etc. need to be mapped to lightweight-charts options
            });

            // If chartType changed via panel, update series
            if (newSettings.symbol?.chartType && newSettings.symbol.chartType !== prev.symbol.chartType) {
                if (chartRef.current && seriesRef.current) { // Ensure chart and series ref are available
                    updateChartSeries(chartRef.current, updated.symbol.chartType, seriesRef);
                }
            }
        }
        return updated;
    });
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    // Update chart theme
    if (chartRef.current) {
      chartRef.current.applyOptions({
        layout: {
          background: { color: newTheme === 'dark' ? '#121212' : '#ffffff' },
          textColor: newTheme === 'dark' ? '#ffffff' : '#121212',
        },
        grid: {
          vertLines: { color: newTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' },
          horzLines: { color: newTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' },
        },
      });
    }
  };

  return (
    <div className="flex flex-col w-full h-screen max-h-screen">
      {/* Header Divider */}
      <div style={{width: '100%', height: '3px', background: '#333333', borderRadius: '2px'}} />
      {/* Header and main layout alignment */}
      <div className="flex w-full">
        {/* Sidebar width and divider in header for alignment */}
        <div className="flex flex-row items-center justify-center" style={{ width: 40, marginLeft: 8 }}>
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-gray-800 focus:ring-1 focus:ring-white/30 rounded-md h-8 w-8 ml-1 transition-all duration-200"
            title="Profile"
          >
            <User className="h-4 w-4 text-white" />
          </Button>
        </div>
        {/* Symbol and rest of header */}
        <header className="flex-1 flex items-center px-4 py-0.5 h-9 bg-[#0F0F0F] border-b border-[#222]">
          <div className="flex items-center space-x-3">
            {/* Symbol search button - improved styling */}
            <Button 
              onClick={toggleSearchPanel} 
              variant="ghost"
              className="chart-header-item chart-header-symbol"
              title={`Symbol: ${currentSymbol}`}
            >
              <Search className="chart-header-icon" />
              <span>{currentSymbol}</span>
            </Button>
            {/* Plus Icon Button - improved styling */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="chart-header-item"
              title="Add to Watchlist"
            >
              <Plus className="chart-header-icon" />
            </Button>
            {/* Visual Separator */}
            <div style={{height: '24px', width: '2px', background: '#333333', borderRadius: '2px', margin: '0 4px'}}></div>
            {/* Timeframe Dropdown - redesigned visually only */}
            <div ref={timeframeDropdownRef} className="relative">
              <Button
                onClick={toggleTimeframeDropdown}
                variant="ghost"
                className="chart-header-item"
                aria-haspopup="listbox"
                aria-expanded={isTimeframeDropdownOpen}
                aria-controls="timeframe-dropdown-panel"
                title={`Time Interval: ${selectedTimeframe}`}
              >
                <span>{selectedTimeframe}</span>
                <ChevronDown className="chart-header-icon" />
              </Button>
              <AnimatePresence>
                {isTimeframeDropdownOpen && (
                  <motion.div
                    id="timeframe-dropdown-panel"
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute mt-2 w-56 bg-black/95 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(255,255,255,0.08)] z-30 py-2 px-1 focus:outline-none"
                    style={{ boxShadow: '0 8px 32px 0 rgba(255,255,255,0.08)' }}
                    tabIndex={-1}
                  >
                    <button
                      onClick={() => console.log('Add custom interval clicked')}
                      className="block w-full px-4 py-2.5 text-left text-sm text-white/80 hover:bg-white/5 rounded-lg font-medium border-b border-white/10 mb-1 transition-colors"
                      tabIndex={0}
                    >
                      Add custom interval...
                    </button>
                    <div className="max-h-80 overflow-y-auto custom-scrollbar">
                      {timeframeCategories.map((category) => (
                        <div key={category.name} className="py-1">
                          <button
                            onClick={() => toggleCategory(category.name)}
                            className={cn(
                              "w-full flex items-center justify-between px-4 py-2 text-xs font-bold uppercase tracking-wider text-white/90 group focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 rounded-lg transition-all",
                              openCategories[category.name] ? "bg-white/5" : "hover:bg-white/5"
                            )}
                            tabIndex={0}
                            aria-expanded={openCategories[category.name]}
                            aria-controls={`dropdown-group-${category.name}`}
                          >
                            <span>{category.name}</span>
                            {openCategories[category.name] ? (
                              <ChevronDown className="h-3.5 w-3.5 text-white/80 transition-transform group-hover:scale-110" />
                            ) : (
                              <ChevronRight className="h-3.5 w-3.5 text-white/80 transition-transform group-hover:scale-110" />
                            )}
                          </button>
                          <AnimatePresence initial={false}>
                            {openCategories[category.name] && (
                              <motion.div
                                id={`dropdown-group-${category.name}`}
                                initial="collapsed"
                                animate="open"
                                exit="collapsed"
                                variants={{
                                  open: { height: 'auto', opacity: 1 },
                                  collapsed: { height: 0, opacity: 0 },
                                }}
                                transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                                className="overflow-hidden"
                              >
                                {category.options.map((tf) => {
                                  const isActive = selectedTimeframe === tf;
                                  return (
                                    <motion.button
                                      key={tf}
                                      onClick={() => handleTimeframeSelect(tf)}
                                      className={cn(
                                        "block w-full pl-8 pr-4 py-2 text-left text-sm rounded-lg font-medium transition-all flex items-center gap-2",
                                        isActive
                                          ? "text-white font-bold bg-white/10 border-l-2 border-white shadow-[0_0_8px_0_rgba(255,255,255,0.08)]"
                                          : "text-white/70 hover:text-white hover:bg-white/5 border-l-2 border-transparent",
                                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                                      )}
                                      tabIndex={0}
                                      style={{ position: 'relative' }}
                                      whileHover={{ scale: 1.03 }}
                                      whileTap={{ scale: 0.98 }}
                                    >
                                      {isActive && (
                                        <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white rounded-full shadow-[0_0_8px_0_rgba(255,255,255,0.18)]" />
                                      )}
                                      {tf}
                                    </motion.button>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Visual Separator */}
            <div style={{height: '24px', width: '2px', background: '#333333', borderRadius: '2px', margin: '0 4px'}}></div>
            
            {/* Chart Type Dropdown - visually redesigned to match timeframe dropdown */}
            <div ref={chartTypeDropdownRef} className="relative">
              <Button
                onClick={toggleChartTypeDropdown}
                variant="ghost"
                className="chart-header-item"
                aria-haspopup="listbox"
                aria-expanded={isChartTypeDropdownOpen}
                aria-controls="charttype-dropdown-panel"
                title={`Chart Type: ${chartSettings.symbol.chartType}`}
              >
                {chartSettings.symbol.chartType === "candles" && <CandlestickChart className="chart-header-icon" />}
                {chartSettings.symbol.chartType === "bars" && <BarChart className="chart-header-icon" />}
                {chartSettings.symbol.chartType === "line" && <LineChart className="chart-header-icon" />}
                {chartSettings.symbol.chartType === "area" && <Activity className="chart-header-icon" />}
                {chartSettings.symbol.chartType === "baseline" && <TrendingUp className="chart-header-icon" />}
                {chartSettings.symbol.chartType === "hollow_candles" && <CandlestickChart className="chart-header-icon" />}
                {chartSettings.symbol.chartType === "heikin_ashi" && <CandlestickChart className="chart-header-icon" />}
                {chartSettings.symbol.chartType === "renko" && <BarChart className="chart-header-icon" />}
                {chartSettings.symbol.chartType === "line_break" && <LineChart className="chart-header-icon" />}
                {chartSettings.symbol.chartType === "kagi" && <Activity className="chart-header-icon" />}
                <span style={{marginLeft: 6}}>{
                  chartSettings.symbol.chartType === "candles" ? "Candles" :
                  chartSettings.symbol.chartType === "bars" ? "Bars" :
                  chartSettings.symbol.chartType === "line" ? "Line" :
                  chartSettings.symbol.chartType === "area" ? "Area" :
                  chartSettings.symbol.chartType === "baseline" ? "Baseline" :
                  chartSettings.symbol.chartType === "hollow_candles" ? "Hollow" :
                  chartSettings.symbol.chartType === "heikin_ashi" ? "Heikin Ashi" :
                  chartSettings.symbol.chartType === "renko" ? "Renko" :
                  chartSettings.symbol.chartType === "line_break" ? "Line Break" :
                  chartSettings.symbol.chartType === "kagi" ? "Kagi" : ''
                }</span>
                <ChevronDown className="chart-header-icon" />
              </Button>
              <AnimatePresence>
                {isChartTypeDropdownOpen && (
                  <motion.div
                    id="charttype-dropdown-panel"
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute mt-2 w-60 bg-black/95 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(255,255,255,0.08)] z-30 py-2 px-1 focus:outline-none"
                    style={{ boxShadow: '0 8px 32px 0 rgba(255,255,255,0.08)' }}
                    tabIndex={-1}
                  >
                    {/* Primary chart types */}
                    <div className="flex flex-col gap-0.5">
                      <ChartTypeOption
                        icon={<BarChart className="h-4 w-4" />}
                        label="Bars"
                        active={chartSettings.symbol.chartType === "bars"}
                        onClick={() => handleChartTypeSelect("bars")}
                      />
                      <ChartTypeOption
                        icon={<CandlestickChart className="h-4 w-4" />}
                        label="Candles"
                        active={chartSettings.symbol.chartType === "candles"}
                        onClick={() => handleChartTypeSelect("candles")}
                      />
                      <ChartTypeOption
                        icon={<CandlestickChart className="h-4 w-4" />}
                        label="Hollow Candles"
                        active={chartSettings.symbol.chartType === "hollow_candles"}
                        onClick={() => handleChartTypeSelect("hollow_candles")}
                      />
                      <ChartTypeOption
                        icon={<LineChart className="h-4 w-4" />}
                        label="Line"
                        active={chartSettings.symbol.chartType === "line"}
                        onClick={() => handleChartTypeSelect("line")}
                      />
                      <ChartTypeOption
                        icon={<Activity className="h-4 w-4" />}
                        label="Area"
                        active={chartSettings.symbol.chartType === "area"}
                        onClick={() => handleChartTypeSelect("area")}
                      />
                      <ChartTypeOption
                        icon={<TrendingUp className="h-4 w-4" />}
                        label="Baseline"
                        active={chartSettings.symbol.chartType === "baseline"}
                        onClick={() => handleChartTypeSelect("baseline")}
                      />
                    </div>
                    {/* Divider for alternative types */}
                    <div className="border-t border-white/10 my-2 mx-2"></div>
                    {/* Alternative chart types */}
                    <div className="flex flex-col gap-0.5">
                      <ChartTypeOption
                        icon={<CandlestickChart className="h-4 w-4" />}
                        label="Heikin Ashi"
                        active={chartSettings.symbol.chartType === "heikin_ashi"}
                        onClick={() => handleChartTypeSelect("heikin_ashi")}
                      />
                      <ChartTypeOption
                        icon={<BarChart className="h-4 w-4" />}
                        label="Renko"
                        active={chartSettings.symbol.chartType === "renko"}
                        onClick={() => handleChartTypeSelect("renko")}
                      />
                      <ChartTypeOption
                        icon={<LineChart className="h-4 w-4" />}
                        label="Line Break"
                        active={chartSettings.symbol.chartType === "line_break"}
                        onClick={() => handleChartTypeSelect("line_break")}
                      />
                      <ChartTypeOption
                        icon={<Activity className="h-4 w-4" />}
                        label="Kagi"
                        active={chartSettings.symbol.chartType === "kagi"}
                        onClick={() => handleChartTypeSelect("kagi")}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Visual Separator */}
            <div style={{height: '24px', width: '3px', background: '#363A45', borderRadius: '2px'}}></div>
            
            {/* Indicators Button - improved styling */}
            <Button
              onClick={toggleIndicatorsPanel}
              variant="ghost"
              className="chart-header-item"
              title="Indicators"
            >
              <BarChart2 className="chart-header-icon" />
              <span>Indicators</span>
              <ChevronDown className="chart-header-icon" />
            </Button>
          </div>
          {/* Center area - can be used for status or notifications */}
          <div className="flex-1 flex justify-center"></div>
          {/* Right side - User and settings */}
          <div className="flex items-center space-x-3 absolute right-4 top-1.5">
            <Button 
              onClick={toggleSettingsPanel}
              variant="ghost" 
              size="icon" 
              className="hover:bg-[#1a1a1a] focus:ring-1 focus:ring-white/20 rounded-md h-8 w-8 transition-all duration-200"
              title="Settings"
            >
              <Settings className="h-4 w-4 text-white" />
            </Button>
            <Button 
              onClick={handleLogout} 
              variant="ghost" 
              size="icon" 
              className="hover:bg-[#1a1a1a] focus:ring-1 focus:ring-white/20 rounded-md h-8 w-8 transition-all duration-200"
              title="Logout"
            >
              <LogOut className="h-4 w-4 text-white" />
            </Button>
          </div>
        </header>
      </div>
      
      {/* Thick separator line */}
      <div className="w-full h-[3px] bg-[#363A45] flex-shrink-0" />
      
      {/* Flex container for sidebar and main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Vertical Divider */}
        <div style={{height: '100%', width: '3px', background: '#363A45', borderRadius: '2px', flexShrink: 0}} />
        <aside className="w-12 bg-background p-1 flex-shrink-0 overflow-y-auto flex flex-col items-center pt-2">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-gray-700 transition-colors duration-150 mb-2"
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5 text-white" /> : <Moon className="h-5 w-5 text-gray-700" />}
          </button>
          {/* Pixel-perfect SVG toolbar icons matching screenshot */}
          <ToolButton icon={IconCursor} options={[]} />
          <ToolButton icon={IconTrendLine} options={[]} />
          <ToolButton icon={IconParallel} options={[]} />
          <ToolButton icon={IconPattern} options={[]} />
          <ToolButton icon={IconFib} options={[]} />
          <ToolButton icon={IconSmilingEmoji} options={[]} />
          <ToolButton icon={IconText} options={[]} />
        </aside>
        {/* Vertical Divider 1 */}
        <div style={{height: '100%', width: '3px', background: '#363A45', borderRadius: '2px', flexShrink: 0}} />
        
        {/* Main content area */}
        <div className="flex flex-col flex-1 overflow-hidden relative" ref={chartPanelRef}>
          {/* Chart area, shrinks as footer panel expands */}
          <main
            className="flex-1 pt-0 overflow-hidden relative"
            style={{
              // Dynamic height: subtract footer panel height
              height: footerPanelHeight ? `calc(100% - ${footerPanelHeight}px)` : '100%'
            }}
          >
            {/* Chart container with symbol info overlay */}
            <div className="w-full h-full relative">
              {/* The chart itself - no paddingTop so it extends under the symbol info */}
              <div
                ref={chartContainerRef}
                className="w-full h-full"
              />
              
              {/* Symbol info toolbar - positioned as an absolute overlay with no background */}
              <div className="absolute top-2 left-0 right-0 z-10 pointer-events-none px-3">
                {/* Symbol info section - completely transparent */}
                <div className="flex flex-col">
                  {/* Symbol Name, Exchange, OHLC, and Change - all in one row */}
                  <div className="flex items-center flex-wrap mb-1 gap-x-3 gap-y-1">
                    <span className="text-base font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">{symbolFullName}</span>
                    <span className="text-gray-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">·</span>
                    <span className="text-gray-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">NSE</span>
                    {/* OHLC Values */}
                    <div className="flex items-center space-x-2 ml-4">
                      <span className="text-xs font-medium text-gray-400 mr-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">O</span>
                      <span className="text-xs font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">{ohlcData.open.toLocaleString()}</span>
                      <span className="text-xs font-medium text-gray-400 ml-2 mr-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">H</span>
                      <span className="text-xs font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">{ohlcData.high.toLocaleString()}</span>
                      <span className="text-xs font-medium text-gray-400 ml-2 mr-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">L</span>
                      <span className="text-xs font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">{ohlcData.low.toLocaleString()}</span>
                      <span className="text-xs font-medium text-gray-400 ml-2 mr-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">C</span>
                      <span className="text-xs font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">{ohlcData.close.toLocaleString()}</span>
                    </div>
                    {/* Change amount and percentage */}
                    <span className={`text-xs font-medium ml-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] ${ohlcData.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>{ohlcData.change >= 0 ? '+' : ''}{ohlcData.change.toLocaleString()} ({ohlcData.change >= 0 ? '+' : ''}{ohlcData.changePercent.toFixed(2)}%)</span>
                  </div>
                  {/* Buy/Sell Buttons with Spread - row below */}
                  <div className="flex items-center space-x-2 mt-1 pointer-events-auto">
                    {/* Sell Button */}
                    <div className="flex items-center bg-black/20 hover:bg-black/30 transition-colors backdrop-blur-[1px] px-3 py-0.5 rounded border border-red-500/30 cursor-pointer">
                      <span className="text-sm font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">{marketPrices.bid.toLocaleString()}</span>
                      <span className="text-xs font-medium text-red-500 ml-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">Sell</span>
                    </div>
                    {/* Spread */}
                    <div className="px-2 py-0.5 bg-black/10 backdrop-blur-[1px] rounded text-xs font-medium text-gray-400" title="Spread">{marketPrices.spread.toFixed(2)}</div>
                    {/* Buy Button */}
                    <div className="flex items-center bg-black/20 hover:bg-black/30 transition-colors backdrop-blur-[1px] px-3 py-0.5 rounded border border-green-500/30 cursor-pointer">
                      <span className="text-sm font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">{marketPrices.ask.toLocaleString()}</span>
                      <span className="text-xs font-medium text-green-500 ml-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">Buy</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
          
          {/* Expandable/Collapsible Footer Panel */}
          {activeFooterItem && (
            <footer
              className="flex flex-col bg-[#0a0a0a] border-t border-gray-800 w-full relative z-10"
              style={{
                // Height: 0 (collapsed) or user-defined (expanded)
                height: footerPanelHeight ? `${footerPanelHeight}px` : `${MIN_FOOTER_HEIGHT}px`,
                boxShadow: '0 -4px 20px rgba(0,0,0,0.5)',
                transition: 'height 0.15s ease-out'
              }}
            >
              {/* Resize handle */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5 cursor-ns-resize z-20 transform -translate-y-1/2"
                onMouseDown={() => {
                  setIsDraggingFooter(true);
                  setShouldBlurFooterButtons(false);
                }}
              />
              
              {/* Footer Tabs */}
              <ChartFooter 
                onItemClick={handleFooterButtonClick} 
                isDragging={isDraggingFooter} 
                shouldBlurButtons={shouldBlurFooterButtons}
                activeItem={activeFooterItem}
              />
              
              {/* Panel Content Container - always rendered but height controlled by parent */}
              <div className="flex-1 overflow-hidden relative">
                {/* Dynamic Content based on activeFooterItem */}
                {activeFooterItem === 'Broker' && <BrokerPanel />}
                {activeFooterItem === 'Code Compiler' && <CodeCompilerPanel />}
                {activeFooterItem === 'Backtest' && (
                  <div className="p-4 text-gray-300">
                    <h2 className="text-xl mb-2">Backtest</h2>
                    <p>Strategy backtesting interface will appear here.</p>
              </div>
                )}
                {activeFooterItem === 'Optimization' && (
                  <div className="p-4 text-gray-300">
                    <h2 className="text-xl mb-2">Optimization</h2>
                    <p>Strategy optimization tools will appear here.</p>
            </div>
                )}
                {activeFooterItem === 'Footprint' && (
                  <div className="p-4 text-gray-300">
                    <h2 className="text-xl mb-2">Footprint Chart</h2>
                    <p>Footprint chart analysis tools will appear here.</p>
        </div>
                )}
        </div>
            </footer>
          )}
      </div>
      
        {/* Watchlist panel */}
        <AnimatePresence>
          {isWatchlistOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0.3 }}
              animate={{ width: 250, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.24, ease: 'easeInOut' }}
              className="bg-[#080808] border-l border-[#232323] h-full overflow-hidden"
              style={{ boxShadow: 'inset 8px 0 16px -8px #000' }}
            >
              <WatchlistPanel isOpen={isWatchlistOpen} onToggle={toggleWatchlist} onSymbolSelect={handleSymbolSelect} />
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
      
      {/* Settings Panel */}
        <ChartSettingsPanel
          isOpen={isSettingsPanelOpen}
          onClose={toggleSettingsPanel}
          initialSettings={chartSettings}
          onSettingsChange={handlePanelSettingsChange}
        />
      
      {/* Symbol Search Panel */}
      <SymbolSearchPanel
        isOpen={isSearchPanelOpen}
        onClose={toggleSearchPanel}
        onSymbolSelect={handleSymbolSelect}
      />
      
      {/* Indicators Panel */}
        <IndicatorsPanel
          isOpen={isIndicatorsPanelOpen}
          onClose={toggleIndicatorsPanel}
        />
    </div>
  );
}

function ChartTypeOption({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 w-full px-5 py-2 rounded-lg text-left text-sm font-medium transition-all relative",
        active
          ? "text-white font-bold bg-white/10 border-l-2 border-white shadow-[0_0_8px_0_rgba(255,255,255,0.08)]"
          : "text-white/80 hover:text-white hover:bg-white/5 border-l-2 border-transparent",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
      )}
      tabIndex={0}
      style={{ position: 'relative', minHeight: 40 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      {active && (
        <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white rounded-full shadow-[0_0_8px_0_rgba(255,255,255,0.18)]" />
      )}
      <span className={cn("flex items-center justify-center", active ? "text-white" : "text-white/80")}>{icon}</span>
      <span className="flex-1 text-base font-sans" style={{ fontWeight: active ? 700 : 500 }}>{label}</span>
    </motion.button>
  );
} 