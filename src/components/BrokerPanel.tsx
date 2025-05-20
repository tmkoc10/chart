import React, { useState } from 'react';
import { Edit, Trash2, Link, ToggleLeft, ToggleRight, ExternalLink, Shield, Calendar, CheckCircle } from 'lucide-react';
import './scrollbar.css';
import { motion } from 'framer-motion';

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
  popular?: boolean;
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
    <div className="text-sm font-medium text-white mb-1">aliceblue</div>
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
    <div className="text-sm font-medium text-white mb-1">angelone</div>
  </>
);

const BrokerPanel: React.FC<BrokerPanelProps> = ({ className = '' }) => {
  // Sample data - would be fetched from an API in a real implementation
  const [connectedBrokers, setConnectedBrokers] = useState<ConnectedBroker[]>([
    { name: 'Fyers', connectionDate: '5/5/2025', isActive: false }
  ]);

  const [availableBrokers, setAvailableBrokers] = useState<AvailableBroker[]>([
    { name: 'Paper Trading', fields: 1, logo: "🗒️", popular: true },
    { name: 'Alice Blue', fields: 2, customLogo: <AliceBlueLogo />, popular: true },
    { name: 'Angel One', fields: 2, customLogo: <AngelOneLogo /> },
    { name: 'Angel Broking', fields: 2 },
    { name: 'Binance', fields: 2, popular: true },
    { name: 'Delta Exchange', fields: 2 },
    { name: 'Dhan', fields: 2 },
    { name: 'Finvasia', fields: 2 },
    { name: 'Fyers', fields: 2, popular: true },
    { name: 'ICICI Direct', fields: 2 },
    { name: 'IIFL', fields: 2 },
    { name: 'Kotak Neo', fields: 2 },
    { name: 'Metatrader 4', fields: 2 },
    { name: 'Metatrader 5', fields: 2 },
    { name: 'Upstox', fields: 2, popular: true },
    { name: 'Zerodha', fields: 2, popular: true }
  ]);

  const [connectingBroker, setConnectingBroker] = useState<string | null>(null);

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
    // Simulate connection loading
    setConnectingBroker(broker.name);
    setTimeout(() => {
      setConnectingBroker(null);
      // In a real implementation, this would open a form to collect credentials
      console.log(`Connect ${broker.name}`);
    }, 800);
  };

  // Function to get placeholder logo for brokers
  const getBrokerLogo = (name: string) => {
    // Return first letter of broker name as a placeholder
    return name.charAt(0);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <div className={`w-full h-full flex flex-col bg-black overflow-y-auto custom-scrollbar ${className}`}>
      {/* Connected Brokers Section */}
      <div className="flex items-center px-5 py-4 border-b border-gray-800 bg-gradient-to-r from-[#121212] to-black">
        <div className="flex items-center">
          <Link className="h-5 w-5 text-gray-300 mr-2" />
          <h2 className="text-sm font-mono uppercase text-white font-semibold tracking-wide">CONNECTED_BROKERS</h2>
          {connectedBrokers.length > 0 && (
            <div className="ml-3 px-1.5 py-0.5 bg-gray-800 rounded text-xs text-white font-medium">
              {connectedBrokers.length}
            </div>
          )}
        </div>
      </div>

      {/* Connected Broker Items */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-5 pt-5 pb-2"
      >
        {connectedBrokers.length > 0 ? (
          connectedBrokers.map((broker, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="flex items-center justify-between mb-4 p-4 bg-[#131313] rounded-md border border-gray-800 hover:border-gray-700 transition-all shadow-sm"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="text-lg font-medium text-white mr-3">{broker.name}</span>
                  <div className="flex items-center bg-[#0c0c0c] px-2 py-0.5 rounded-full">
                    <Shield className="h-3 w-3 text-gray-400 mr-1" />
                    <span className="text-xs text-gray-400">SECURED</span>
                  </div>
                </div>
                <div className="flex items-center mt-1 text-xs text-gray-400">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>CONNECTED: {broker.connectionDate}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  <span 
                    className={`inline-block mr-2 h-2 w-2 rounded-full ${broker.isActive ? 'bg-white' : 'bg-gray-600'}`}
                  ></span>
                  <span className={`text-xs font-medium ${broker.isActive ? 'text-white' : 'text-gray-400'}`}>
                    {broker.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
                <motion.button 
                  className="bg-transparent p-1.5 rounded-md hover:bg-gray-800 transition-all"
                  onClick={() => handleToggleBroker(index)}
                  whileTap={{ scale: 0.95 }}
                >
                  {broker.isActive ? 
                    <ToggleRight className="h-6 w-6 text-white" /> : 
                    <ToggleLeft className="h-6 w-6 text-gray-300" />
                  }
                </motion.button>
                <motion.button 
                  className="bg-transparent p-1.5 rounded-md hover:bg-gray-800 transition-all"
                  onClick={() => {/* Edit broker logic */}}
                  whileTap={{ scale: 0.95 }}
                >
                  <Edit className="h-4 w-4 text-gray-400 hover:text-white transition-colors" />
                </motion.button>
                <motion.button 
                  className="bg-transparent p-1.5 rounded-md hover:bg-gray-800 transition-all"
                  onClick={() => handleDeleteBroker(index)}
                  whileTap={{ scale: 0.95 }}
                >
                  <Trash2 className="h-4 w-4 text-gray-400 hover:text-white transition-colors" />
                </motion.button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-8 text-center text-gray-500 border border-dashed border-gray-800 rounded-md">
            No connected brokers
          </div>
        )}
      </motion.div>

      {/* Available Brokers Section */}
      <div className="flex items-center px-5 py-4 border-y border-gray-800 bg-gradient-to-r from-[#121212] to-black mt-5">
        <div className="flex items-center">
          <ExternalLink className="h-5 w-5 text-gray-300 mr-2" />
          <h2 className="text-sm font-mono uppercase text-white font-semibold tracking-wide">AVAILABLE_BROKERS</h2>
          <div className="ml-3 px-1.5 py-0.5 bg-gray-800 rounded text-xs text-white font-medium">
            {availableBrokers.length}
          </div>
        </div>
      </div>

      {/* Available Broker Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-5"
      >
        {availableBrokers.map((broker, index) => (
          <motion.div 
            key={index}
            variants={itemVariants}
            className="flex flex-col bg-[#131313] rounded-md border border-gray-800 overflow-hidden hover:border-gray-700 transition-all shadow-md"
            whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)" }}
          >
            <div className="flex flex-col items-center justify-center pt-5 px-4">
              {broker.customLogo ? (
                broker.customLogo
              ) : broker.logo ? (
                <>
                  <span className="text-4xl mb-3">{broker.logo}</span>
                  <div className="text-sm font-medium text-white mb-1">{broker.name}</div>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 bg-gray-900 text-white rounded-full flex items-center justify-center text-xl font-bold mb-3 shadow-inner border border-gray-800">
                    {getBrokerLogo(broker.name)}
                  </div>
                  <div className="text-sm font-medium text-white mb-1">{broker.name}</div>
                </>
              )}
              
              {broker.popular && (
                <div className="flex items-center mb-3 bg-[#1e1e1e] px-2 py-0.5 rounded-full">
                  <CheckCircle className="h-3 w-3 text-white mr-1" />
                  <span className="text-xs text-gray-300">POPULAR</span>
                </div>
              )}
            </div>
            
            <div className="px-3 pb-4 text-center mt-auto pt-3">
              <motion.button 
                onClick={() => handleConnectBroker(broker)}
                className="w-full py-2 px-2 bg-[#1a1a1a] hover:bg-[#222] text-white text-xs font-medium border border-gray-700 rounded-md transition-colors flex items-center justify-center"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={connectingBroker === broker.name}
              >
                {connectingBroker === broker.name ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    CONNECTING
                  </div>
                ) : (
                  <>
                    <Link className="h-3 w-3 mr-1.5" />
                    CONNECT
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default BrokerPanel; 