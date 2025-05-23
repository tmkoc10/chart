import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronDown, ChevronRight } from 'lucide-react';
import './scrollbar.css';
import { motion, AnimatePresence } from 'framer-motion';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@radix-ui/react-tooltip';

// Add global style for select dropdowns
const globalStyles = `
  select {
    text-overflow: ellipsis;
    width: 100% !important;
    transition: all 0.2s ease;
  }
  select option {
    padding: 8px 12px;
    min-width: 200px;
    white-space: normal;
    background-color: #1a1a1a;
    color: #ffffff;
    font-size: 14px;
  }
  select option:hover, select option:focus {
    background-color: #333333;
  }
  .dropdown-container {
    width: 100%;
  }
  
  /* Enhanced select elements */
  select:focus {
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
    border-color: #404040;
  }
`;

interface ChartSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  initialSettings: Partial<ChartCanvasSettings & { symbol: SymbolSettings }>; // To load current chart settings
  onSettingsChange: (newSettings: Partial<ChartCanvasSettings & { symbol: Partial<SymbolSettings> }>) => void; // Callback for changes
}

// Expanded settings interface based on TradingView's Canvas panel
interface ChartCanvasSettings {
  backgroundType: 'solid' | 'gradient';
  backgroundColor: string;
  backgroundColor2?: string; // For gradient
  vertGridColor: string;
  horzGridColor: string;
  gridStyle: 'solid' | 'dashed' | 'dotted'; // Example, actual options might differ
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
  marginRight: number; // In bars
}

interface SymbolSettings { // Added interface
  chartType: string;
  // Potentially other symbol-specific settings here like colors for wicks, borders etc.
}

const ControlRow: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({ label, children, className }) => (
  <div className={`flex items-center justify-between mb-4 ${className || ''}`}>
    <label className="text-sm text-gray-300 min-w-[120px] truncate pr-3 font-medium">{label}</label>
    <div className="flex-grow flex justify-end items-center space-x-3">{children}</div>
  </div>
);

const ColorPicker: React.FC<{ value: string; onChange: (value: string) => void; disabled?: boolean }> = ({ value, onChange, disabled }) => (
  <div className="relative group">
    <input 
      type="color" 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-[28px] h-[28px] cursor-pointer opacity-0 absolute inset-0 z-10 ${disabled ? 'cursor-not-allowed' : ''}`}
      disabled={disabled}
    />
    <div 
      className={`w-[28px] h-[28px] rounded-md border overflow-hidden ${disabled ? 'border-gray-700 opacity-50' : 'border-gray-600 group-hover:border-gray-400'}`}
      style={{ background: disabled ? '#333' : value }}
    />
  </div>
);

// Improved styled select with better styling
const StyledSelect: React.FC<{ options: {value: string, label: string}[]; value: string; onChange: (value: string) => void; className?: string }> = 
  ({ options, value, onChange, className }) => {
  // Find the selected option label
  const selectedLabel = options.find(opt => opt.value === value)?.label || '';
  
  return (
    <div className={`relative ${className || ''}`}>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="appearance-none bg-[#1a1a1a] border border-[#333333] text-white text-sm rounded-md py-2 pl-3 pr-8 focus:outline-none focus:border-[#ffffff40] focus:ring-2 focus:ring-[#ffffff20] h-[32px] w-full transition-all duration-150"
        style={{ minWidth: '100%', fontSize: '14px' }}
        title={selectedLabel} // Add tooltip to show full text on hover
      >
        {options.map(opt => (
          <option 
            key={opt.value} 
            value={opt.value}
            style={{ padding: '8px', fontSize: '14px' }}
          >
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300" />
    </div>
  );
};

const StyledTextInput: React.FC<{ value: string | number; onChange: (value: string) => void; type?: string, className?: string, unit?: string }> = 
  ({ value, onChange, type = 'text', className, unit }) => (
    <div className={`relative flex items-center ${className || ''}`}>
        <input 
            type={type} 
            value={value} 
            onChange={(e) => onChange(e.target.value)} 
            className="bg-[#1a1a1a] border border-[#333333] text-white text-sm text-right rounded-md py-2 px-3 focus:outline-none focus:border-[#ffffff40] focus:ring-2 focus:ring-[#ffffff20] h-[32px] w-full appearance-none transition-all duration-150"
            style={unit ? {paddingRight: '24px'} : {}}
        />
        {unit && <span className="absolute right-3 text-xs text-white/70 pointer-events-none">{unit}</span>}
    </div>
);

const StyledCheckbox: React.FC<{checked: boolean; onChange: (checked: boolean) => void; label?: string;}> = ({checked, onChange, label}) => (
    <label className="flex items-center space-x-2 cursor-pointer text-sm text-gray-300">
        <input 
            type="checkbox" 
            checked={checked} 
            onChange={(e) => onChange(e.target.checked)} 
            className="form-checkbox h-4 w-4 text-green-500 bg-[#111] border-[#333] rounded focus:ring-green-400 accent-green-500"
        />
        {label && <span>{label}</span>}
    </label>
);

const ChartSettingsPanel: React.FC<ChartSettingsPanelProps> = ({ isOpen, onClose, initialSettings, onSettingsChange }) => {
  if (!isOpen) return null;

  const settingsPanelRef = useRef<HTMLDivElement>(null); // Ref for the settings panel
  const [activeTabId, setActiveTabId] = useState('canvas'); // Default to canvas tab

  // Initialize settings with defaults, then override with initialSettings
  const [settings, setSettings] = useState<ChartCanvasSettings & { symbol: SymbolSettings }>(() => {
    const defaults: ChartCanvasSettings & { symbol: SymbolSettings } = {
        backgroundType: 'solid',
        backgroundColor: '#131722',
        backgroundColor2: '#000000',
        vertGridColor: '#363A45',
        horzGridColor: '#363A45',
        gridStyle: 'solid',
        crosshairColor: '#888888',
        crosshairStyle: 'dashed',
        crosshairWidth: 1,
        watermarkVisible: false,
        watermarkColor: '#FFFFFF',
        scalesTextColor: '#D1D4DC',
        scalesFontSize: 12,
        scalesLineColor: '#363A45',
        navButtonsVisibility: 'mouseover',
        paneButtonsVisibility: 'mouseover',
        marginTop: 10, 
        marginBottom: 8, 
        marginRight: 10, 
        symbol: {
          chartType: 'candles', // Default chart type
        },
    };
    return { ...defaults, ...initialSettings, symbol: { ...defaults.symbol, ...initialSettings?.symbol } };
  });

  // Effect to update internal settings if initialSettings prop changes while panel is open
  useEffect(() => {
    setSettings(prev => ({
      ...prev, // Keep existing potentially modified settings
      ...initialSettings, // Apply new initial settings over them
      symbol: { // Deep merge symbol settings
        ...prev.symbol, 
        ...initialSettings?.symbol,
      }
    }));
  }, [initialSettings]);

  const handleSettingChange = <K extends keyof ChartCanvasSettings>(key: K, value: ChartCanvasSettings[K]) => {
    const updatedPart: Partial<ChartCanvasSettings> = { [key]: value };
    setSettings(prev => ({ ...prev, ...updatedPart }));
    onSettingsChange(updatedPart);
  };

  const handleSymbolSettingChange = <K extends keyof SymbolSettings>(key: K, value: SymbolSettings[K]) => {
    const updatedSymbolPart: Partial<SymbolSettings> = { [key]: value };
    setSettings(prev => ({
      ...prev,
      symbol: {
        ...prev.symbol,
        ...updatedSymbolPart,
      },
    }));
    onSettingsChange({ symbol: updatedSymbolPart });
  };
  
  const handleApplySettings = () => {
    console.log('Applying settings:', settings);
    // TODO: Pass settings to chart update function
    onClose();
  };

  const gridStyleOptions = [
    { value: 'solid', label: 'Solid' },
    { value: 'dashed', label: 'Dashed' },
    { value: 'dotted', label: 'Dotted' },
  ];

  const visibilityOptions = [
    { value: 'always', label: 'Always Visible' },
    { value: 'mouseover', label: 'Visible on Mouse Over' },
    { value: 'never', label: 'Not Visible' },
  ];

  const fontSizeOptions = Array.from({length: 11}, (_, i) => ({ value: (i + 8).toString(), label: (i+8).toString() })); // 8 to 18

  const chartTypeOptions = [ // Added chart type options
    { value: 'bars', label: 'Bars' },
    { value: 'candles', label: 'Candles' },
    { value: 'hollow_candles', label: 'Hollow Candles' },
    { value: 'line', label: 'Line' },
    { value: 'area', label: 'Area' },
    { value: 'baseline', label: 'Baseline' },
    { value: 'heikin_ashi', label: 'Heikin Ashi' },
    { value: 'renko', label: 'Renko' },
    { value: 'line_break', label: 'Line Break' },
    { value: 'kagi', label: 'Kagi' },
  ];

  const tabs = [
    {id: 'canvas', label: 'Canvas'},
    {id: 'symbol', label: 'Symbol'},
    {id: 'status', label: 'Status line'},
    {id: 'scales', label: 'Scales'},
    {id: 'trading', label: 'Trading'},
    {id: 'events', label: 'Events'},
  ];

  // Effect to handle clicks outside the settings panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsPanelRef.current && !settingsPanelRef.current.contains(event.target as Node)) {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center backdrop-blur-[5px]"
        >
          <TooltipProvider>
            <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
            <style jsx global>{`
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
              body { font-family: 'Inter', 'SF Pro', 'Poppins', Arial, sans-serif; }
            `}</style>
            <div 
              ref={settingsPanelRef} 
              className="w-full max-w-4xl bg-black border border-[#333] shadow-2xl flex flex-col overflow-hidden mt-8 rounded-md"
              style={{ height: '80vh', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset' }}
            >
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-[#333] bg-gradient-to-r from-black to-[#111]">
                <h2 className="text-lg font-medium text-white tracking-wide">Chart settings</h2>
                <button 
                  onClick={onClose} 
                  className="p-1.5 rounded-md hover:bg-[#222] text-gray-400 hover:text-white transition-colors duration-150"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Tabs & Content Wrapper*/}
              <div className="flex flex-grow overflow-hidden">
                  {/* Tabs Sidebar - Mimicking TradingView Layout */}
                  <div className="w-48 bg-black border-r border-[#333] py-2 flex-shrink-0 flex flex-col">
                      {tabs.map(tab => (
                          <button
                              key={tab.id}
                              onClick={() => setActiveTabId(tab.id)}
                              className={`w-full flex items-center pl-4 pr-3 py-3 text-sm text-left focus:outline-none transition-all duration-150
                                          ${activeTabId === tab.id
                                              ? 'bg-[#111] text-white border-l-2 border-white'
                                              : 'text-gray-400 hover:bg-[#111] hover:text-gray-200 border-l-2 border-transparent'}`}
                          >
                              <span>{tab.label}</span>
                              {activeTabId === tab.id ? 
                                <ChevronDown size={16} className="ml-auto" /> : 
                                <ChevronRight size={16} className="ml-auto" />
                              }
                          </button>
                      ))}
                  </div>

                  {/* Settings Content Area - Scrollable */}
                  {activeTabId === 'canvas' && (
                  <div className="flex-grow overflow-y-auto p-6 space-y-6 text-sm bg-black custom-scrollbar">
                      {/* Section Title - Subtle heading */}
                      <h3 className="text-xs font-semibold uppercase text-gray-400 tracking-wider pb-3 mb-5 border-b border-[#222]">Chart basic styles</h3>
                      
                      {/* Background */}
                      <ControlRow label="Background">
                          <StyledSelect 
                              className="w-64"
                              options={[{value: 'solid', label: 'Solid'}, {value: 'gradient', label: 'Gradient'}]}
                              value={settings.backgroundType}
                              onChange={(v) => handleSettingChange('backgroundType', v as 'solid'|'gradient')}
                          />
                          <ColorPicker value={settings.backgroundColor} onChange={(v) => handleSettingChange('backgroundColor', v)} />
                          {settings.backgroundType === 'gradient' && 
                              <ColorPicker value={settings.backgroundColor2 || '#000000'} onChange={(v) => handleSettingChange('backgroundColor2', v)} />
                          }
                      </ControlRow>

                      {/* Grid lines */}
                      <ControlRow label="Grid lines">
                          <StyledSelect 
                              className="w-64"
                              options={gridStyleOptions}
                              value={settings.gridStyle}
                              onChange={(v) => handleSettingChange('gridStyle', v as 'solid'|'dashed'|'dotted')}
                          />
                          <ColorPicker value={settings.vertGridColor} onChange={(v) => handleSettingChange('vertGridColor', v)} />
                          <ColorPicker value={settings.horzGridColor} onChange={(v) => handleSettingChange('horzGridColor', v)} />
                      </ControlRow>

                      {/* Crosshair */}
                      <ControlRow label="Crosshair">
                           <ColorPicker value={settings.crosshairColor} onChange={(v) => handleSettingChange('crosshairColor', v)} />
                           <StyledSelect 
                              className="w-64"
                              options={gridStyleOptions}
                              value={settings.crosshairStyle}
                              onChange={(v) => handleSettingChange('crosshairStyle', v as 'solid'|'dashed'|'dotted')}
                          />
                          <StyledTextInput 
                              className="w-20"
                              type="number" 
                              value={settings.crosshairWidth}
                              onChange={(v) => handleSettingChange('crosshairWidth', parseInt(v) || 1)}
                          />
                      </ControlRow>

                      {/* Watermark */}
                      <ControlRow label="Watermark">
                          <StyledSelect
                              className="w-64"
                              options={[{value: 'visible', label: 'Visible'}, {value: 'hidden', label: 'Hidden'}]}
                              value={settings.watermarkVisible ? 'visible' : 'hidden'}
                              onChange={(v) => handleSettingChange('watermarkVisible', v === 'visible')}
                          />
                          <ColorPicker 
                              value={settings.watermarkColor || '#FFFFFF'} 
                              onChange={(v) => handleSettingChange('watermarkColor', v)} 
                              disabled={!settings.watermarkVisible}
                          />
                      </ControlRow>

                      {/* Section Title: Scales */}
                      <h3 className="text-xs font-semibold uppercase text-gray-400 tracking-wider pt-4 pb-3 mb-5 border-b border-[#222]">Scales</h3>
                      
                      <ControlRow label="Text">
                          <ColorPicker value={settings.scalesTextColor} onChange={(v) => handleSettingChange('scalesTextColor', v)} />
                          <StyledSelect 
                              className="w-64"
                              options={fontSizeOptions}
                              value={settings.scalesFontSize.toString()}
                              onChange={(v) => handleSettingChange('scalesFontSize', parseInt(v))}
                          />
                      </ControlRow>

                      <ControlRow label="Lines">
                          <ColorPicker value={settings.scalesLineColor} onChange={(v) => handleSettingChange('scalesLineColor', v)} />
                      </ControlRow>

                      {/* Section Title: Buttons */}
                      <h3 className="text-xs font-semibold uppercase text-gray-400 tracking-wider pt-4 pb-3 mb-5 border-b border-[#222]">Buttons</h3>

                      <ControlRow label="Navigation">
                          <StyledSelect 
                              className="w-80"
                              options={visibilityOptions}
                              value={settings.navButtonsVisibility}
                              onChange={(v) => handleSettingChange('navButtonsVisibility', v as 'always'|'mouseover'|'never')}
                          />
                      </ControlRow>
                      <ControlRow label="Pane">
                           <StyledSelect 
                              className="w-80"
                              options={visibilityOptions}
                              value={settings.paneButtonsVisibility}
                              onChange={(v) => handleSettingChange('paneButtonsVisibility', v as 'always'|'mouseover'|'never')}
                          />
                      </ControlRow>

                      {/* Section Title: Margins */}
                      <h3 className="text-xs font-semibold uppercase text-gray-400 tracking-wider pt-4 pb-3 mb-5 border-b border-[#222]">Margins</h3>
                      <ControlRow label="Top">
                          <StyledTextInput className="w-24" type="number" value={settings.marginTop} onChange={(v) => handleSettingChange('marginTop', parseInt(v))} unit="%" />
                      </ControlRow>
                      <ControlRow label="Bottom">
                          <StyledTextInput className="w-24" type="number" value={settings.marginBottom} onChange={(v) => handleSettingChange('marginBottom', parseInt(v))} unit="%"/>
                      </ControlRow>
                      <ControlRow label="Right">
                          <StyledTextInput className="w-24" type="number" value={settings.marginRight} onChange={(v) => handleSettingChange('marginRight', parseInt(v))} unit="bars"/>
                      </ControlRow>

                  </div>
                  )}

                  {activeTabId === 'symbol' && ( // Added Symbol tab content
                    <div className="flex-grow p-6 overflow-y-auto custom-scrollbar" style={{ backgroundColor: '#0A0A0A' }}> {/* Darker content area */}
                      <h3 className="text-md font-semibold text-gray-200 mb-6">Chart Style</h3>
                      <ControlRow label="Chart Type">
                        <StyledSelect
                          className="w-full"
                          options={chartTypeOptions}
                          value={settings.symbol.chartType}
                          onChange={(value) => handleSymbolSettingChange('chartType', value)}
                        />
                      </ControlRow>
                      {/* TODO: Add more symbol settings here based on selected chartType if needed */}
                      {/* For example, colors for candles, wicks, borders etc. */}
                      {settings.symbol.chartType === 'candles' && (
                        <>
                          {/* Example: Placeholder for candle specific settings */}
                          {/* <ControlRow label="Body Up Color">
                            <ColorPicker value={...} onChange={...} />
                          </ControlRow>
                          <ControlRow label="Body Down Color">
                            <ColorPicker value={...} onChange={...} />
                          </ControlRow> */}
                        </>
                      )}
                    </div>
                  )}
              </div>

              {/* Footer Action Buttons */}
              <div className="flex justify-between items-center py-4 px-6 border-t border-[#333] bg-gradient-to-r from-black to-[#111]">
                  <div>
                       <button className="px-4 py-2 text-sm text-gray-400 hover:text-gray-200 hover:bg-[#222] rounded-md flex items-center space-x-2 transition-colors duration-150">
                          <ChevronDown size={14}/><span>Template</span>
                      </button>
                  </div>
                  <div className="flex space-x-3">
                      <button 
                          onClick={onClose} 
                          className="px-6 py-2 rounded-md text-sm font-medium text-gray-300 bg-[#222] hover:bg-[#333] transition-colors duration-150 focus:outline-none"
                      >
                          Cancel
                      </button>
                      <button 
                          onClick={handleApplySettings}
                          className="px-6 py-2 rounded-md text-sm font-medium text-white bg-black hover:bg-[#333] transition-colors duration-150 focus:outline-none"
                      >
                          OK
                      </button>
                  </div>
              </div>
            </div>
          </TooltipProvider>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChartSettingsPanel; 