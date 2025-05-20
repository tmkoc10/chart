import { Time } from "lightweight-charts";

// Define the OHLC data interface
export interface CandlestickData {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
}

export type ChartType = 
  | 'candles'
  | 'bars'
  | 'line'
  | 'area'
  | 'baseline'
  | 'hollow_candles'
  | 'heikin_ashi'
  | 'renko'
  | 'line_break'
  | 'kagi'
  | 'point_figure'
  | 'range';

// Options for different chart types
export interface ChartOptions {
  brickSize?: number;     // For Renko
  lineCount?: number;     // For Line Break
  reversal?: number;      // For Kagi and Point & Figure
  boxSize?: number;       // For Point & Figure
  range?: number;         // For Range
}

// Base transform function type
export type TransformFunction = (data: CandlestickData[], options?: ChartOptions) => CandlestickData[];

/**
 * Transform OHLC data to Heikin-Ashi
 */
export const transformToHeikinAshi: TransformFunction = (ohlcData, options) => {
  if (!ohlcData || ohlcData.length === 0) return [];
  
  const haData: CandlestickData[] = [];
  let prevHaOpen = ohlcData[0].open;
  let prevHaClose = ohlcData[0].close;
  
  for (let i = 0; i < ohlcData.length; i++) {
    const current = ohlcData[i];
    
    // Calculate Heikin-Ashi values
    const haOpen = i === 0 ? (current.open + current.close) / 2 : (prevHaOpen + prevHaClose) / 2;
    const haClose = (current.open + current.high + current.low + current.close) / 4;
    const haHigh = Math.max(current.high, haOpen, haClose);
    const haLow = Math.min(current.low, haOpen, haClose);
    
    haData.push({
      time: current.time,
      open: haOpen,
      high: haHigh,
      low: haLow,
      close: haClose,
    });
    
    prevHaOpen = haOpen;
    prevHaClose = haClose;
  }
  
  return haData;
};

/**
 * Transform OHLC data to Renko
 */
export const transformToRenko: TransformFunction = (ohlcData, options) => {
  if (!ohlcData || ohlcData.length === 0) return [];
  
  const brickSize = options?.brickSize || 1;
  const renkoData: CandlestickData[] = [];
  let lastClose = ohlcData[0].close;
  let currentDirection = 0; // 0: initial, 1: up, -1: down
  
  for (let i = 1; i < ohlcData.length; i++) {
    const current = ohlcData[i];
    const absoluteChange = Math.abs(current.close - lastClose);
    
    if (absoluteChange >= brickSize) {
      const bricksToCreate = Math.floor(absoluteChange / brickSize);
      const direction = current.close > lastClose ? 1 : -1;
      
      for (let j = 0; j < bricksToCreate; j++) {
        const brickPrice = lastClose + (direction * brickSize * (j + 1));
        const time = current.time;
        
        if (direction === 1) {
          // Up brick
          renkoData.push({
            time,
            open: brickPrice - brickSize,
            close: brickPrice,
            high: brickPrice,
            low: brickPrice - brickSize
          });
        } else {
          // Down brick
          renkoData.push({
            time,
            open: brickPrice + brickSize,
            close: brickPrice,
            high: brickPrice + brickSize,
            low: brickPrice
          });
        }
      }
      
      lastClose = lastClose + (direction * brickSize * bricksToCreate);
      currentDirection = direction;
    }
  }
  
  return renkoData;
};

/**
 * Transform OHLC data to Line Break
 */
export const transformToLineBreak: TransformFunction = (ohlcData, options) => {
  if (!ohlcData || ohlcData.length === 0) return [];
  
  const lineCount = options?.lineCount || 1;
  const lineBreakData: CandlestickData[] = [];
  const lines: number[] = [ohlcData[0].close];
  
  lineBreakData.push({
    time: ohlcData[0].time,
    open: ohlcData[0].open,
    high: ohlcData[0].high,
    low: ohlcData[0].low,
    close: ohlcData[0].close
  });
  
  for (let i = 1; i < ohlcData.length; i++) {
    const current = ohlcData[i];
    const lastLine = lines[lines.length - 1];
    const isLastLineWhite = lines.length > 1 ? lines[lines.length - 1] > lines[lines.length - 2] : true;
    
    if ((current.close > lastLine && isLastLineWhite) || 
        (current.close < lastLine && !isLastLineWhite)) {
      // Continue in same direction - no new line
      continue;
    } else if (current.close > lastLine) {
      // New white line
      lineBreakData.push({
        time: current.time,
        open: lastLine,
        high: current.close,
        low: lastLine,
        close: current.close
      });
      lines.push(current.close);
    } else if (current.close < lines[Math.max(0, lines.length - lineCount)]) {
      // New black line - must break the lineCount previous lines
      lineBreakData.push({
        time: current.time,
        open: lastLine,
        high: lastLine,
        low: current.close,
        close: current.close
      });
      lines.push(current.close);
    }
    
    // Trim history if needed
    if (lines.length > lineCount * 3) {
      lines.shift();
    }
  }
  
  return lineBreakData;
};

/**
 * Transform OHLC data to Kagi
 */
export const transformToKagi: TransformFunction = (ohlcData, options) => {
  if (!ohlcData || ohlcData.length === 0) return [];
  
  const reversal = options?.reversal || 1;
  const kagiData: CandlestickData[] = [];
  let lastPrice = ohlcData[0].close;
  let currentDirection = 0; // 0: initial, 1: up, -1: down
  let lastHigh = lastPrice;
  let lastLow = lastPrice;
  
  for (let i = 0; i < ohlcData.length; i++) {
    const current = ohlcData[i];
    
    if (currentDirection === 0) {
      // First data point - initialize direction
      currentDirection = current.close > lastPrice ? 1 : -1;
      lastHigh = Math.max(lastPrice, current.close);
      lastLow = Math.min(lastPrice, current.close);
      
      kagiData.push({
        time: current.time,
        open: lastPrice,
        close: current.close,
        high: lastHigh,
        low: lastLow
      });
    } else if (currentDirection === 1) {
      // Current direction is up
      if (current.close > lastHigh) {
        // Continue up trend
        lastHigh = current.close;
        kagiData.push({
          time: current.time,
          open: kagiData[kagiData.length - 1].close,
          close: current.close,
          high: current.close,
          low: kagiData[kagiData.length - 1].close
        });
      } else if (current.close < (lastHigh - (lastHigh * reversal / 100))) {
        // Reversal - switch to down
        currentDirection = -1;
        lastLow = current.close;
        kagiData.push({
          time: current.time,
          open: kagiData[kagiData.length - 1].close,
          close: current.close,
          high: kagiData[kagiData.length - 1].close,
          low: current.close
        });
      }
    } else if (currentDirection === -1) {
      // Current direction is down
      if (current.close < lastLow) {
        // Continue down trend
        lastLow = current.close;
        kagiData.push({
          time: current.time,
          open: kagiData[kagiData.length - 1].close,
          close: current.close,
          high: kagiData[kagiData.length - 1].close,
          low: current.close
        });
      } else if (current.close > (lastLow + (lastLow * reversal / 100))) {
        // Reversal - switch to up
        currentDirection = 1;
        lastHigh = current.close;
        kagiData.push({
          time: current.time,
          open: kagiData[kagiData.length - 1].close,
          close: current.close,
          high: current.close,
          low: kagiData[kagiData.length - 1].close
        });
      }
    }
  }
  
  return kagiData;
};

/**
 * Transform OHLC data to Point & Figure
 */
export const transformToPointFigure: TransformFunction = (ohlcData, options) => {
  if (!ohlcData || ohlcData.length === 0) return [];
  
  const boxSize = options?.boxSize || 1;
  const reversal = options?.reversal || 3;
  const pfData: CandlestickData[] = [];
  
  // Initialize with the first data point
  let currentDirection = 0; // 0: initial, 1: X (up), -1: O (down)
  const firstPrice = ohlcData[0].close;
  let lastPrice = firstPrice;
  
  // Calculate the box level for the first price
  let currentBoxTop = Math.ceil(firstPrice / boxSize) * boxSize;
  let currentBoxBottom = currentBoxTop - boxSize;
  
  // We track the highest/lowest box in the current column
  let columnTop = currentBoxTop;
  let columnBottom = currentBoxBottom;
  let currentTime = ohlcData[0].time;
  
  for (let i = 1; i < ohlcData.length; i++) {
    const current = ohlcData[i];
    currentTime = current.time; // Always use the latest time for the column
    
    if (currentDirection === 0) {
      // Determine initial direction
      if (current.close >= currentBoxTop + boxSize) {
        // Initial direction is up
        currentDirection = 1;
        
        // Calculate how many boxes to fill
        const newBoxTop = Math.floor(current.close / boxSize) * boxSize;
        const boxesToFill = Math.floor((newBoxTop - currentBoxBottom) / boxSize);
        
        for (let j = 0; j < boxesToFill; j++) {
          const boxBottom = currentBoxBottom + (j * boxSize);
          const boxTop = boxBottom + boxSize;
          
          pfData.push({
            time: currentTime,
            open: boxBottom,
            high: boxTop,
            low: boxBottom,
            close: boxTop
          });
        }
        
        columnTop = newBoxTop;
        lastPrice = current.close;
      } 
      else if (current.close <= currentBoxBottom - boxSize) {
        // Initial direction is down
        currentDirection = -1;
        
        // Calculate how many boxes to fill
        const newBoxBottom = Math.ceil(current.close / boxSize) * boxSize;
        const boxesToFill = Math.floor((currentBoxTop - newBoxBottom) / boxSize);
        
        for (let j = 0; j < boxesToFill; j++) {
          const boxTop = currentBoxTop - (j * boxSize);
          const boxBottom = boxTop - boxSize;
          
          pfData.push({
            time: currentTime,
            open: boxTop,
            high: boxTop,
            low: boxBottom,
            close: boxBottom
          });
        }
        
        columnBottom = newBoxBottom;
        lastPrice = current.close;
      }
    } 
    else if (currentDirection === 1) {
      // Current direction is up (X)
      if (current.close >= columnTop + boxSize) {
        // Continue the X column upward
        const newBoxTop = Math.floor(current.close / boxSize) * boxSize;
        const boxesToFill = Math.floor((newBoxTop - columnTop) / boxSize);
        
        for (let j = 0; j < boxesToFill; j++) {
          const boxBottom = columnTop + (j * boxSize);
          const boxTop = boxBottom + boxSize;
          
          pfData.push({
            time: currentTime,
            open: boxBottom,
            high: boxTop,
            low: boxBottom,
            close: boxTop
          });
        }
        
        columnTop = newBoxTop;
        lastPrice = current.close;
      } 
      else if (current.close <= columnTop - (reversal * boxSize)) {
        // Reverse to O column (down)
        currentDirection = -1;
        
        // Start new column one box below the highest X
        const newBoxTop = columnTop - boxSize;
        const newBoxBottom = Math.max(
          Math.ceil(current.close / boxSize) * boxSize,
          newBoxTop - (Math.floor((columnTop - current.close) / boxSize) * boxSize)
        );
        
        const boxesToFill = Math.floor((newBoxTop - newBoxBottom) / boxSize) + 1;
        
        // Only reverse if we have at least 'reversal' number of boxes
        if (boxesToFill >= reversal) {
          for (let j = 0; j < boxesToFill; j++) {
            const boxTop = newBoxTop - (j * boxSize);
            const boxBottom = boxTop - boxSize;
            
            pfData.push({
              time: currentTime,
              open: boxTop,
              high: boxTop,
              low: boxBottom,
              close: boxBottom
            });
          }
          
          columnTop = newBoxTop;
          columnBottom = newBoxBottom;
          lastPrice = current.close;
        }
      }
    } 
    else if (currentDirection === -1) {
      // Current direction is down (O)
      if (current.close <= columnBottom - boxSize) {
        // Continue the O column downward
        const newBoxBottom = Math.ceil(current.close / boxSize) * boxSize;
        const boxesToFill = Math.floor((columnBottom - newBoxBottom) / boxSize);
        
        for (let j = 0; j < boxesToFill; j++) {
          const boxTop = columnBottom - (j * boxSize);
          const boxBottom = boxTop - boxSize;
          
          pfData.push({
            time: currentTime,
            open: boxTop,
            high: boxTop,
            low: boxBottom,
            close: boxBottom
          });
        }
        
        columnBottom = newBoxBottom;
        lastPrice = current.close;
      } 
      else if (current.close >= columnBottom + (reversal * boxSize)) {
        // Reverse to X column (up)
        currentDirection = 1;
        
        // Start new column one box above the lowest O
        const newBoxBottom = columnBottom + boxSize;
        const newBoxTop = Math.min(
          Math.floor(current.close / boxSize) * boxSize,
          newBoxBottom + (Math.floor((current.close - columnBottom) / boxSize) * boxSize)
        );
        
        const boxesToFill = Math.floor((newBoxTop - newBoxBottom) / boxSize) + 1;
        
        // Only reverse if we have at least 'reversal' number of boxes
        if (boxesToFill >= reversal) {
          for (let j = 0; j < boxesToFill; j++) {
            const boxBottom = newBoxBottom + (j * boxSize);
            const boxTop = boxBottom + boxSize;
            
            pfData.push({
              time: currentTime,
              open: boxBottom,
              high: boxTop,
              low: boxBottom,
              close: boxTop
            });
          }
          
          columnBottom = newBoxBottom;
          columnTop = newBoxTop;
          lastPrice = current.close;
        }
      }
    }
  }
  
  return pfData;
};

/**
 * Transform OHLC data to Range bars
 */
export const transformToRange: TransformFunction = (ohlcData, options) => {
  if (!ohlcData || ohlcData.length === 0) return [];
  
  const rangeSize = options?.range || 1;
  const rangeData: CandlestickData[] = [];
  
  // Start with the first data point
  let currentBar: CandlestickData = {
    time: ohlcData[0].time,
    open: ohlcData[0].open,
    high: ohlcData[0].high,
    low: ohlcData[0].low,
    close: ohlcData[0].close
  };
  
  for (let i = 1; i < ohlcData.length; i++) {
    const current = ohlcData[i];
    
    // Update the current high/low with new price action
    currentBar.high = Math.max(currentBar.high, current.high);
    currentBar.low = Math.min(currentBar.low, current.low);
    
    // Check if the bar's range (high-low) has exceeded the threshold
    if (currentBar.high - currentBar.low >= rangeSize) {
      // Determine the closing price based on trend direction
      if (current.close > currentBar.open) {
        // Upward trend
        currentBar.close = currentBar.high;
      } else {
        // Downward trend
        currentBar.close = currentBar.low;
      }
      
      // Add the completed range bar
      rangeData.push({ ...currentBar });
      
      // Create a new bar starting from the close of the previous bar
      currentBar = {
        time: current.time,
        open: currentBar.close, // Open at previous close (gapless)
        high: Math.max(current.high, currentBar.close),
        low: Math.min(current.low, currentBar.close),
        close: current.close
      };
    } else {
      // If range not met, just update the current bar's closing price
      currentBar.close = current.close;
      currentBar.time = current.time; // Use the latest time
    }
  }
  
  // Add the last bar if it exists
  if (currentBar && rangeData.indexOf(currentBar) === -1) {
    rangeData.push(currentBar);
  }
  
  return rangeData;
};

/**
 * Transform OHLC data based on the specified chart type
 */
export const transformOHLCData = (ohlcData: CandlestickData[], chartType: ChartType, options?: ChartOptions): CandlestickData[] => {
  switch (chartType) {
    case 'heikin_ashi':
      return transformToHeikinAshi(ohlcData, options);
    case 'renko':
      return transformToRenko(ohlcData, options);
    case 'line_break':
      return transformToLineBreak(ohlcData, options);
    case 'kagi':
      return transformToKagi(ohlcData, options);
    case 'point_figure':
      return transformToPointFigure(ohlcData, options);
    case 'range':
      return transformToRange(ohlcData, options);
    // For these chart types we return the original data, the chart rendering code handles these formats
    case 'candles':
    case 'hollow_candles':
    case 'bars':
    case 'line':
    case 'area':
    case 'baseline':
    default:
      return ohlcData;
  }
}; 