import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from 'next-themes';
import PartitionBar, {
  PartitionBarSegment,
  PartitionBarSegmentTitle,
  PartitionBarSegmentValue
} from "./ui/partition-bar";

interface CollapsibleChartProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function CollapsibleChart({ title, defaultOpen = false, children }: CollapsibleChartProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-card border border-border rounded-lg backdrop-blur-xl hover:border-primary/30 transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/10 transition-colors rounded-t-lg"
      >
        <h3 className="text-sm font-medium tracking-wide uppercase text-primary/90">{title}</h3>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-primary" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 pt-0 border-t border-border/50">
          {children}
        </div>
      )}
    </div>
  );
}

// Generate mock historical data
const generateHistoricalData = () => {
  const data = [];
  const now = Date.now();
  const interval = 60000; // 1 minute intervals
  
  for (let i = 30; i >= 0; i--) {
    const timestamp = now - (i * interval);
    const time = new Date(timestamp);
    const timeStr = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
    
    // Generate realistic battery data with some variation
    const baseSOC = 85 - (30 - i) * 0.5; // Slowly decreasing SoC
    const baseCellDelta = 0.05 + Math.sin(i * 0.3) * 0.02; // Oscillating cell delta
    const baseTempHigh = 35 + Math.sin(i * 0.2) * 5; // Temperature variation
    const baseTempAvg = 30 + Math.sin(i * 0.2) * 4;
    const baseVoltageMin = 3.65 + Math.sin(i * 0.4) * 0.05;
    const baseVoltageMax = 3.85 + Math.sin(i * 0.4) * 0.05;
    const baseVoltageAvg = 3.75 + Math.sin(i * 0.4) * 0.05;
    
    data.push({
      time: timeStr,
      timestamp,
      soc: Math.max(0, Math.min(100, baseSOC + (Math.random() - 0.5) * 2)),
      cellDelta: Math.max(0, baseCellDelta + (Math.random() - 0.5) * 0.01),
      tempHigh: baseTempHigh + (Math.random() - 0.5) * 2,
      tempAvg: baseTempAvg + (Math.random() - 0.5) * 2,
      voltageMin: baseVoltageMin + (Math.random() - 0.5) * 0.02,
      voltageMax: baseVoltageMax + (Math.random() - 0.5) * 0.02,
      voltageAvg: baseVoltageAvg + (Math.random() - 0.5) * 0.02,
    });
  }
  
  return data;
};

export function AnalyticsPage() {
  const [data, setData] = useState(generateHistoricalData());
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Cell voltage delta tolerance calculation
  const TARGET_CELL_DELTA = 10; // 10 mV target delta (from settings)
  const TOTAL_CELLS = 6 * 24; // 6 segments × 24 cells
  
  // Simulate cell balancing progress
  const cellsBalanced = Math.floor(TOTAL_CELLS * 0.92); // ~92% balanced
  const cellsLeftToBalance = TOTAL_CELLS - cellsBalanced;

  // Define color schemes based on theme
  const colors = {
    primary: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
    secondary: isDark ? 'rgba(180,180,180,0.9)' : 'rgba(80,80,80,0.9)',
    tertiary: isDark ? 'rgba(140,140,140,0.8)' : 'rgba(120,120,120,0.8)',
    grid: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    axis: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
    axisLabel: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
    tooltipBg: isDark ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.95)',
    tooltipBorder: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
    tooltipText: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => {
        const newData = [...prevData];
        newData.shift(); // Remove oldest
        
        const now = Date.now();
        const time = new Date(now);
        const timeStr = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
        
        const lastPoint = newData[newData.length - 1];
        
        // Generate new data point based on last point
        newData.push({
          time: timeStr,
          timestamp: now,
          soc: Math.max(0, Math.min(100, lastPoint.soc - 0.1 + (Math.random() - 0.5) * 0.5)),
          cellDelta: Math.max(0, lastPoint.cellDelta + (Math.random() - 0.5) * 0.005),
          tempHigh: lastPoint.tempHigh + (Math.random() - 0.5) * 1,
          tempAvg: lastPoint.tempAvg + (Math.random() - 0.5) * 0.8,
          voltageMin: lastPoint.voltageMin + (Math.random() - 0.5) * 0.01,
          voltageMax: lastPoint.voltageMax + (Math.random() - 0.5) * 0.01,
          voltageAvg: lastPoint.voltageAvg + (Math.random() - 0.5) * 0.01,
        });
        
        return newData;
      });
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2 className="mb-4 text-base uppercase tracking-wider text-primary/80">
        Analytics Dashboard
      </h2>

      {/* Cell Balancing Progress Bar */}
      <div className="mb-3 bg-card border border-border rounded-lg backdrop-blur-xl p-4">
        <h3 className="text-sm font-medium tracking-wide uppercase text-primary/90 mb-3">
          Cell Balancing Progress
        </h3>
        <PartitionBar size="md">
          <PartitionBarSegment num={cellsBalanced} variant="success">
            <PartitionBarSegmentTitle>Balanced</PartitionBarSegmentTitle>
            <PartitionBarSegmentValue>{cellsBalanced} cells</PartitionBarSegmentValue>
          </PartitionBarSegment>

          <PartitionBarSegment num={cellsLeftToBalance} variant="warning">
            <PartitionBarSegmentTitle>Left to Balance</PartitionBarSegmentTitle>
            <PartitionBarSegmentValue>{cellsLeftToBalance} cells</PartitionBarSegmentValue>
          </PartitionBarSegment>
        </PartitionBar>
        <p className="mt-2 text-xs text-muted-foreground">
          Target Delta: ±{TARGET_CELL_DELTA} mV • Total cells: {TOTAL_CELLS} • {cellsBalanced} cells within target, {cellsLeftToBalance} cells to balance
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* State of Charge vs Time */}
        <CollapsibleChart title="State of Charge (SoC) vs Time" defaultOpen={true}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 15, right: 20, left: 45, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              <XAxis 
                dataKey="time" 
                stroke={colors.axis} 
                style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace' }}
              />
              <YAxis 
                stroke={colors.axis} 
                style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace' }}
                domain={[0, 100]}
                label={{ value: 'SoC (%)', angle: -90, position: 'insideLeft', style: { fill: colors.axisLabel, fontSize: '10px', textAnchor: 'middle' } }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: colors.tooltipBg, 
                  border: `1px solid ${colors.tooltipBorder}`,
                  borderRadius: '8px',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '11px'
                }}
                labelStyle={{ color: colors.tooltipText }}
                formatter={(value: number) => `${value.toFixed(1)}%`}
              />
              <Legend 
                verticalAlign="top"
                height={30}
                wrapperStyle={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', paddingBottom: '5px' }}
              />
              <Line 
                type="monotone" 
                dataKey="soc" 
                stroke={colors.primary} 
                strokeWidth={2}
                strokeDasharray=""
                dot={{ fill: colors.primary, r: 3 }}
                name="SoC %"
              />
            </LineChart>
          </ResponsiveContainer>
        </CollapsibleChart>

        {/* Cell Delta vs Time */}
        <CollapsibleChart title="Cell Voltage Delta vs Time">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 15, right: 20, left: 45, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              <XAxis 
                dataKey="time" 
                stroke={colors.axis} 
                style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace' }}
              />
              <YAxis 
                stroke={colors.axis} 
                style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace' }}
                domain={[0, 'auto']}
                label={{ value: 'Delta (V)', angle: -90, position: 'insideLeft', style: { fill: colors.axisLabel, fontSize: '10px', textAnchor: 'middle' } }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: colors.tooltipBg, 
                  border: `1px solid ${colors.tooltipBorder}`,
                  borderRadius: '8px',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '11px'
                }}
                labelStyle={{ color: colors.tooltipText }}
                formatter={(value: number) => value.toFixed(3)}
              />
              <Legend 
                verticalAlign="top"
                height={30}
                wrapperStyle={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', paddingBottom: '5px' }}
              />
              <Line 
                type="monotone" 
                dataKey="cellDelta" 
                stroke={colors.primary} 
                strokeWidth={2}
                strokeDasharray=""
                dot={{ fill: colors.primary, r: 3 }}
                name="Cell Δ (V)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CollapsibleChart>

        {/* Temperature vs Time */}
        <CollapsibleChart title="Temperature vs Time">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 15, right: 20, left: 45, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              <XAxis 
                dataKey="time" 
                stroke={colors.axis} 
                style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace' }}
              />
              <YAxis 
                stroke={colors.axis} 
                style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace' }}
                domain={['auto', 'auto']}
                label={{ value: 'Temp (°C)', angle: -90, position: 'insideLeft', style: { fill: colors.axisLabel, fontSize: '10px', textAnchor: 'middle' } }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: colors.tooltipBg, 
                  border: `1px solid ${colors.tooltipBorder}`,
                  borderRadius: '8px',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '11px'
                }}
                labelStyle={{ color: colors.tooltipText }}
                formatter={(value: number) => `${value.toFixed(1)}°C`}
              />
              <Legend 
                verticalAlign="top"
                height={30}
                wrapperStyle={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', paddingBottom: '5px' }}
              />
              <Line 
                type="monotone" 
                dataKey="tempHigh" 
                stroke={colors.primary} 
                strokeWidth={2}
                strokeDasharray=""
                dot={{ fill: colors.primary, r: 3 }}
                name="High °C"
              />
              <Line 
                type="monotone" 
                dataKey="tempAvg" 
                stroke={colors.secondary} 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: colors.secondary, r: 3 }}
                name="Avg °C"
              />
            </LineChart>
          </ResponsiveContainer>
        </CollapsibleChart>

        {/* Voltage vs Time */}
        <CollapsibleChart title="Cell Voltage vs Time">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 15, right: 20, left: 45, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              <XAxis 
                dataKey="time" 
                stroke={colors.axis} 
                style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace' }}
              />
              <YAxis 
                stroke={colors.axis} 
                style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace' }}
                domain={['auto', 'auto']}
                label={{ value: 'Voltage (V)', angle: -90, position: 'insideLeft', style: { fill: colors.axisLabel, fontSize: '10px', textAnchor: 'middle' } }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: colors.tooltipBg, 
                  border: `1px solid ${colors.tooltipBorder}`,
                  borderRadius: '8px',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '11px'
                }}
                labelStyle={{ color: colors.tooltipText }}
                formatter={(value: number) => `${value.toFixed(3)}V`}
              />
              <Legend 
                verticalAlign="top"
                height={30}
                wrapperStyle={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', paddingBottom: '5px' }}
              />
              <Line 
                type="monotone" 
                dataKey="voltageMax" 
                stroke={colors.primary} 
                strokeWidth={2}
                strokeDasharray=""
                dot={{ fill: colors.primary, r: 3 }}
                name="Max V"
              />
              <Line 
                type="monotone" 
                dataKey="voltageAvg" 
                stroke={colors.secondary} 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: colors.secondary, r: 3 }}
                name="Avg V"
              />
              <Line 
                type="monotone" 
                dataKey="voltageMin" 
                stroke={colors.tertiary} 
                strokeWidth={2}
                strokeDasharray="8 4"
                dot={{ fill: colors.tertiary, r: 3 }}
                name="Min V"
              />
            </LineChart>
          </ResponsiveContainer>
        </CollapsibleChart>
      </div>

      <div className="mt-3 p-3 bg-muted/20 rounded text-xs text-muted-foreground">
        <p className="font-medium mb-1">Analytics Notes:</p>
        <ul className="list-disc list-inside space-y-0.5">
          <li>Charts display the last 30 minutes of data</li>
          <li>Data updates in real-time every 5 seconds</li>
          <li>Click on chart titles to collapse/expand individual graphs</li>
        </ul>
      </div>
    </div>
  );
}