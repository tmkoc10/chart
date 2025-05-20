import React, { useState } from 'react';
import { Edit, Trash2, Link, ToggleLeft, ToggleRight, ExternalLink } from 'lucide-react';
import './scrollbar.css';

interface BrokerPanelProps {
  className?: string;
}

// Define types for our brokers
type ConnectedBroker = {
  name: string;
  connectionDate: string;
  isActive: boolean;
};

type AvailableBroker = {
  name: string;
  fields: number;
  logo?: string;
  customLogo?: React.ReactNode;
};

// Alice Blue logo component in black and white
const AliceBlueLogo = () => (
  <>
    <div className="w-14 h-14 bg-gray-900 rounded-md flex items-center justify-center mb-3">
      <div className="relative w-10 h-10">
        {/* Outer circle */}
        <div className="absolute inset-0 border-2 border-white rounded-full"></div>
        {/* Inner circle */}
        <div className="absolute inset-[3px] border-2 border-white rounded-full"></div>
        {/* Diagonal line */}
        <div className="absolute w-full h-full">
          <div className="absolute top-[30%] left-[15%] w-[70%] h-[40%] border-t-2 border-white transform -rotate-[30deg]"></div>
        </div>
      </div>
    </div>
    <div className="text-sm font-medium text-white mb-3">aliceblue</div>
  </>
);

// AngelOne logo component in black and white
const AngelOneLogo = () => (
  <>
    <div className="w-14 h-14 bg-gray-900 rounded-md flex items-center justify-center mb-3">
      <div className="relative w-10 h-10">
        {/* Diagonal line (stripe) */}
        <div className="absolute top-0 right-0 w-2 h-[140%] bg-white transform -rotate-[30deg] origin-top-right"></div>
        
        {/* Triangles pyramid structure */}
        <div className="absolute bottom-0 left-0 flex flex-col items-center">
          {/* Row 1 (bottom) */}
          <div className="flex">
            <div className="w-2 h-2 border-b border-r border-l border-white transform rotate-180"></div>
            <div className="w-2 h-2 border-b border-r border-l border-white transform rotate-180"></div>
            <div className="w-2 h-2 border-b border-r border-l border-white transform rotate-180"></div>
            <div className="w-2 h-2 border-b border-r border-l border-white transform rotate-180"></div>
          </div>
          {/* Row 2 */}
          <div className="flex -mt-[1px]">
            <div className="w-2 h-2 border-b border-r border-l border-white transform rotate-180"></div>
            <div className="w-2 h-2 border-b border-r border-l border-white transform rotate-180"></div>
            <div className="w-2 h-2 border-b border-r border-l border-white transform rotate-180"></div>
          </div>
          {/* Row 3 */}
          <div className="flex -mt-[1px]">
            <div className="w-2 h-2 border-b border-r border-l border-white transform rotate-180"></div>
            <div className="w-2 h-2 border-b border-r border-l border-white transform rotate-180"></div>
          </div>
          {/* Row 4 (top) */}
          <div className="flex -mt-[1px]">
            <div className="w-2 h-2 border-b border-r border-l border-white transform rotate-180"></div>
          </div>
        </div>
      </div>
    </div>
    <div className="text-sm font-medium text-white mb-3">angelone</div>
  </>
);

const BrokerPanel: React.FC<BrokerPanelProps> = ({ className = '' }) => {
  // Sample data - would be fetched from an API in a real implementation
  const [connectedBrokers, setConnectedBrokers] = useState<ConnectedBroker[]>([
    { name: 'Fyers', connectionDate: '5/5/2025', isActive: false }
  ]);

  const [availableBrokers, setAvailableBrokers] = useState<AvailableBroker[]>([
    { name: 'Paper Trading', fields: 1, logo: "🗒️" },
    { name: 'Alice Blue', fields: 2, customLogo: <AliceBlueLogo /> },
    { name: 'Angel One', fields: 2, customLogo: <AngelOneLogo /> },
    { name: 'Angel Broking', fields: 2 },
    { name: 'Binance', fields: 2 },
    { name: 'Delta Exchange', fields: 2 },
    { name: 'Dhan', fields: 2 },
    { name: 'Finvasia', fields: 2 },
    { name: 'Fyers', fields: 2 },
    { name: 'ICICI Direct', fields: 2 },
    { name: 'IIFL', fields: 2 },
    { name: 'Kotak Neo', fields: 2 },
    { name: 'Metatrader 4', fields: 2 },
    { name: 'Metatrader 5', fields: 2 },
    { name: 'Upstox', fields: 2 },
    { name: 'Zerodha', fields: 2 }
  ]);

  const handleToggleBroker = (index: number) => {
    const updatedBrokers = [...connectedBrokers];
    updatedBrokers[index] = {
      ...updatedBrokers[index],
      isActive: !updatedBrokers[index].isActive
    };
    setConnectedBrokers(updatedBrokers);
  };

  const handleDeleteBroker = (index: number) => {
    const updatedBrokers = connectedBrokers.filter((_, i) => i !== index);
    setConnectedBrokers(updatedBrokers);
  };

  const handleConnectBroker = (broker: AvailableBroker) => {
    // In a real implementation, this would open a form to collect credentials
    console.log(`Connect ${broker.name}`);
  };

  // Function to get placeholder logo for brokers
  const getBrokerLogo = (name: string) => {
    // Return first letter of broker name as a placeholder
    return name.charAt(0);
  };

  return (
    <div className={`w-full h-full flex flex-col bg-black overflow-y-auto custom-scrollbar ${className}`}>
      {/* Connected Brokers Section */}
      <div className="flex items-center px-5 py-4 border-b border-gray-800">
        <div className="flex items-center">
          <Link className="h-5 w-5 text-gray-400 mr-2" />
          <h2 className="text-sm font-mono uppercase text-gray-300">CONNECTED_BROKERS</h2>
        </div>
      </div>

      {/* Connected Broker Items */}
      {connectedBrokers.length > 0 ? (
        <div className="p-5">
          {connectedBrokers.map((broker, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between mb-2 p-4 bg-black rounded border border-gray-800"
            >
              <div className="flex items-center">
                <span className="text-lg font-medium text-white mr-2">{broker.name}</span>
                <span className="text-xs text-gray-400">CONNECTED: {broker.connectionDate}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  <span 
                    className={`inline-block mr-2 h-2 w-2 rounded-full ${broker.isActive ? 'bg-green-500' : 'bg-gray-500'}`}
                  ></span>
                  <span className="text-gray-300 text-sm">
                    {broker.isActive ? 'ACTIVE' : 'INACTIVE TO ACTIVATE'}
                  </span>
                </div>
                <button 
                  className="bg-transparent p-1.5 rounded-md hover:bg-gray-800 transition-all transform"
                  onClick={() => handleToggleBroker(index)}
                >
                  {broker.isActive ? 
                    <ToggleRight className="h-6 w-6 text-gray-300" /> : 
                    <ToggleLeft className="h-6 w-6 text-gray-300" />
                  }
                </button>
                <button 
                  className="bg-transparent p-1.5 rounded-md hover:bg-gray-800"
                  onClick={() => {/* Edit broker logic */}}
                >
                  <Edit className="h-4 w-4 text-gray-400" />
                </button>
                <button 
                  className="bg-transparent p-1.5 rounded-md hover:bg-gray-800"
                  onClick={() => handleDeleteBroker(index)}
                >
                  <Trash2 className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-gray-500">
          No connected brokers
        </div>
      )}

      {/* Available Brokers Section */}
      <div className="flex items-center px-5 py-4 border-b border-gray-800 mt-2">
        <div className="flex items-center">
          <ExternalLink className="h-5 w-5 text-gray-400 mr-2" />
          <h2 className="text-sm font-mono uppercase text-gray-300">AVAILABLE_BROKERS</h2>
        </div>
      </div>

      {/* Available Broker Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 gap-4 p-4">
        {availableBrokers.map((broker, index) => (
          <div 
            key={index} 
            className="flex flex-col bg-black rounded border border-gray-800 overflow-hidden hover:border-gray-600 transition-all"
          >
            <div className="flex flex-col items-center justify-center p-4">
              {broker.customLogo ? (
                broker.customLogo
              ) : broker.logo ? (
                <>
                  <span className="text-4xl mb-3">{broker.logo}</span>
                  <div className="text-sm font-medium text-white mb-3">{broker.name}</div>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 bg-gray-900 text-white rounded-md flex items-center justify-center text-xl font-bold mb-3">
                    {getBrokerLogo(broker.name)}
                  </div>
                  <div className="text-sm font-medium text-white mb-3">{broker.name}</div>
                </>
              )}
            </div>
            
            <div className="px-3 pb-3 text-center mt-auto">
              <button 
                onClick={() => handleConnectBroker(broker)}
                className="w-full py-1.5 px-2 bg-black hover:bg-gray-900 text-white text-xs border border-gray-700 rounded transition-colors"
              >
                CONNECT
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrokerPanel; 