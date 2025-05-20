import { Time } from "lightweight-charts";
import { 
  ChartType, 
  CandlestickData, 
  ChartOptions, 
  transformOHLCData 
} from "./candlestick-transforms";

// Mock data generation for demonstration purposes
// In a real application, this would be replaced with actual API calls
export const generateMockCandlestickData = (
  count: number, 
  startPrice: number = 100, 
  volatility: number = 2,
  timeframe: string = '1 minute'
): CandlestickData[] => {
  const data: CandlestickData[] = [];
  let lastClose = startPrice;
  
  // Determine time increment based on timeframe
  let timeIncrement: number;
  if (timeframe.includes('second')) {
    timeIncrement = parseInt(timeframe) || 1;
  } else if (timeframe.includes('minute')) {
    timeIncrement = (parseInt(timeframe) || 1) * 60;
  } else if (timeframe.includes('hour')) {
    timeIncrement = (parseInt(timeframe) || 1) * 60 * 60;
  } else if (timeframe.includes('day')) {
    timeIncrement = (parseInt(timeframe) || 1) * 60 * 60 * 24;
  } else {
    // Default to 1 minute
    timeIncrement = 60;
  }

  // Create a date object for today at 9:00 AM
  const today = new Date();
  today.setHours(9, 0, 0, 0); // Set to 9:00:00.000 AM
  
  // Calculate start time based on the trading hours (9:00 AM - 3:00 PM)
  // If count is greater than the number of minutes in 6 hours (360),
  // we'll still generate the data but extend before 9:00 AM
  const tradingMinutes = 6 * 60; // 6 hours * 60 minutes
  const startTime = Math.floor(today.getTime() / 1000);

  // Track used timestamps to ensure uniqueness
  const usedTimestamps = new Set<number>();

  for (let i = 0; i < count; i++) {
    // For 1-minute data, ensure we don't exceed 3:00 PM
    const minuteOffset = i % tradingMinutes;
    const dayOffset = Math.floor(i / tradingMinutes);
    
    // Calculate the actual time for this candle
    let candleTime = startTime + minuteOffset * 60 - dayOffset * 24 * 60 * 60;
    
    // Ensure timestamp uniqueness
    while (usedTimestamps.has(candleTime)) {
      candleTime += 1; // Add 1 second if timestamp already exists
    }
    
    usedTimestamps.add(candleTime);
    const time = candleTime as Time;
    
    const change = (Math.random() - 0.5) * volatility;
    const open = lastClose;
    const close = Math.max(0.1, open + change);
    const high = Math.max(open, close) + Math.random() * (volatility / 2);
    const low = Math.min(open, close) - Math.random() * (volatility / 2);
    
    data.push({ 
      time, 
      open, 
      high, 
      low, 
      close 
    });
    
    lastClose = close;
  }
  
  // Sort data by time to ensure it's in ascending order
  return data.sort((a, b) => Number(a.time) - Number(b.time));
};

// Interface for chart data request parameters
export interface ChartDataRequest {
  symbol: string;        // Trading symbol
  timeframe: string;     // Time period (e.g., '1 minute', '1 hour')
  startDate?: Date;      // Optional start date for historical data
  endDate?: Date;        // Optional end date for historical data
  count?: number;        // Number of bars to return
  chartType: ChartType;  // Type of chart to display
  chartOptions?: ChartOptions; // Options for chart transformations
}

/**
 * Get chart data with the requested parameters
 * This function centralizes all chart data requests
 */
export const getChartData = async (
  request: ChartDataRequest
): Promise<CandlestickData[]> => {
  try {
    // In a real application, this would make API calls to fetch actual OHLC data
    // For now, we'll generate mock data
    
    const count = request.count || 500; // Default to 500 bars if not specified
    
    // Simulate a network delay for realism
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Generate the raw OHLC data
    const rawData = generateMockCandlestickData(count, 100, 2, request.timeframe);
    
    // Transform the data based on the requested chart type
    let transformedData = transformOHLCData(rawData, request.chartType, request.chartOptions);
    
    // Ensure data is properly ordered with no duplicates
    const timeMap = new Map<number, CandlestickData>();
    
    // If there are multiple entries with the same timestamp,
    // keep only the latest one (assuming timestamps are numbers)
    transformedData.forEach(item => {
      const timestamp = Number(item.time);
      // If we encounter a timestamp we've seen before, increment it by 1 second
      if (timeMap.has(timestamp)) {
        // Add 1 second to ensure unique ascending timestamps
        const newTime = timestamp + 1;
        timeMap.set(newTime, { ...item, time: newTime as Time });
      } else {
        timeMap.set(timestamp, item);
      }
    });
    
    // Convert back to array and sort by time
    transformedData = Array.from(timeMap.values()).sort((a, b) => 
      Number(a.time) - Number(b.time)
    );
    
    return transformedData;
  } catch (error) {
    console.error('Error fetching chart data:', error);
    throw error;
  }
};

/**
 * Get real-time update for the last bar
 * In a real application, this would connect to a WebSocket or polling mechanism
 */
export const getRealtimeUpdate = (
  symbol: string, 
  timeframe: string,
  lastBar: CandlestickData
): CandlestickData => {
  // Simulate a small price movement from the last bar
  const change = (Math.random() - 0.5) * 1;
  const close = Math.max(0.1, lastBar.close + change);
  const high = Math.max(lastBar.high, close);
  const low = Math.min(lastBar.low, close);
  
  return {
    time: lastBar.time,
    open: lastBar.open,
    high,
    low,
    close
  };
};

/**
 * Utility function to update chart when changing chart types
 * This avoids having to refetch all data from source when just changing visualization
 */
export const changeChartType = (
  currentData: CandlestickData[], 
  newChartType: ChartType,
  chartOptions?: ChartOptions
): CandlestickData[] => {
  return transformOHLCData(currentData, newChartType, chartOptions);
}; 