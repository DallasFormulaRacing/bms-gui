import { Wifi, WifiOff } from 'lucide-react';
import { useState } from 'react';

interface ConnectionPageProps {
  onConnectionChange?: (isConnected: boolean) => void;
}

export function ConnectionPage({ onConnectionChange }: ConnectionPageProps) {
  const [comPort, setComPort] = useState('COM3');
  const [baudRate, setBaudRate] = useState(115200);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

  const handleConnect = () => {
    if (isConnected) {
      // Disconnect
      setConnectionStatus('disconnected');
      setIsConnected(false);
      onConnectionChange?.(false);
    } else {
      // Connect
      setConnectionStatus('connecting');
      // Simulate connection delay
      setTimeout(() => {
        setConnectionStatus('connected');
        setIsConnected(true);
        onConnectionChange?.(true);
      }, 1000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="mb-6 text-base uppercase tracking-wider text-primary/80">
        Communication Connection
      </h2>

      <div className="bg-card border border-border rounded-lg backdrop-blur-xl p-6">
        {/* Connection Status Indicator */}
        <div className="mb-6 flex items-center gap-3">
          <div className={`p-3 rounded-full transition-all duration-300 ${
            isConnected 
              ? 'bg-green-500/20 text-green-500' 
              : 'bg-muted/20 text-muted-foreground'
          }`}>
            {isConnected ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Connection Status</p>
            <p className={`text-xs ${
              connectionStatus === 'connected' ? 'text-green-500' :
              connectionStatus === 'connecting' ? 'text-yellow-500' :
              'text-muted-foreground'
            }`}>
              {connectionStatus === 'connected' ? 'Connected' :
               connectionStatus === 'connecting' ? 'Connecting...' :
               'Disconnected'}
            </p>
          </div>
        </div>

        {/* COM Port Selection */}
        <div className="mb-4">
          <label className="block text-sm text-foreground mb-2">COM Port</label>
          <select
            value={comPort}
            onChange={(e) => setComPort(e.target.value)}
            disabled={isConnected}
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="COM1">COM1</option>
            <option value="COM2">COM2</option>
            <option value="COM3">COM3</option>
            <option value="COM4">COM4</option>
            <option value="COM5">COM5</option>
            <option value="COM6">COM6</option>
            <option value="COM7">COM7</option>
            <option value="COM8">COM8</option>
            <option value="/dev/ttyUSB0">/dev/ttyUSB0</option>
            <option value="/dev/ttyUSB1">/dev/ttyUSB1</option>
            <option value="/dev/ttyACM0">/dev/ttyACM0</option>
          </select>
          <p className="text-xs text-muted-foreground mt-1">Select the serial port for BMS communication</p>
        </div>

        {/* Baud Rate Selection */}
        <div className="mb-6">
          <label className="block text-sm text-foreground mb-2">Baud Rate</label>
          <select
            value={baudRate}
            onChange={(e) => setBaudRate(Number(e.target.value))}
            disabled={isConnected}
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="9600">9600</option>
            <option value="19200">19200</option>
            <option value="38400">38400</option>
            <option value="57600">57600</option>
            <option value="115200">115200</option>
            <option value="230400">230400</option>
            <option value="460800">460800</option>
            <option value="921600">921600</option>
          </select>
          <p className="text-xs text-muted-foreground mt-1">Communication speed in bits per second</p>
        </div>

        {/* Connect/Disconnect Button */}
        <button
          onClick={handleConnect}
          disabled={connectionStatus === 'connecting'}
          className={`w-full px-4 py-3 rounded text-sm font-medium uppercase tracking-wide transition-all duration-300 ${
            isConnected
              ? 'bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-500'
              : 'bg-primary/20 hover:bg-primary/30 border border-primary/50 text-primary'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {connectionStatus === 'connecting' ? 'Connecting...' : isConnected ? 'Disconnect' : 'Connect'}
        </button>

        {/* Connection Info */}
        {isConnected && (
          <div className="mt-6 p-3 bg-primary/10 border border-primary/30 rounded text-xs">
            <p className="text-primary font-medium mb-2">Active Connection</p>
            <div className="space-y-1 text-muted-foreground font-mono">
              <p>Port: {comPort}</p>
              <p>Baud Rate: {baudRate.toLocaleString()} bps</p>
              <p>Protocol: isoSPI</p>
            </div>
          </div>
        )}

        {/* Connection Notes */}
        <div className="mt-6 p-3 bg-muted/20 rounded text-xs text-muted-foreground">
          <p className="font-medium mb-1">Connection Notes:</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>Ensure the BMS device is powered on before connecting</li>
            <li>Verify COM port and baud rate match device settings</li>
            <li>Connection settings cannot be changed while connected</li>
          </ul>
        </div>
      </div>
    </div>
  );
}