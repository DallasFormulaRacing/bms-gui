import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BatterySegment } from './components/BatterySegment';
import { DraggableOverviewStats } from './components/DraggableOverviewStats';
import { SegmentDetailedStats } from './components/SegmentDetailedStats';
import { SettingsPage } from './components/SettingsPage';
import { ConnectionPage } from './components/ConnectionPage';
import { AnalyticsPage } from './components/AnalyticsPage';
import { InfoPage } from './components/InfoPage';
import { SystemBanner } from './components/SystemBanner';
import { ThemeProvider } from 'next-themes';
import { useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Flame } from 'lucide-react';

// Generate mock battery data for 6 segments, each with 24 cell voltages and 20 thermistors
const generateBatteryData = () => {
  return Array.from({ length: 6 }, (_, segmentIndex) => ({
    segmentNumber: segmentIndex + 1,
    cells: {
      voltages: Array.from({ length: 24 }, () => 3.6 + Math.random() * 0.4),
      temperatures: Array.from({ length: 20 }, () => 25 + Math.random() * 15),
      balancingCells: Math.random() > 0.5 ? [Math.floor(Math.random() * 24), Math.floor(Math.random() * 24)] : [],
    },
  }));
};

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [activeTab, setActiveTab] = useState('overview');
  const [cardOrder, setCardOrder] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  const [heatmapEnabled, setHeatmapEnabled] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const batterySegments = generateBatteryData();
  
  // Calculate system stats
  const totalVoltage = batterySegments.reduce((sum, segment) => 
    sum + segment.cells.voltages.reduce((cellSum, voltage) => cellSum + voltage, 0), 0
  );
  
  const allTemperatures = batterySegments.flatMap(segment => segment.cells.temperatures);
  const avgTemperature = allTemperatures.reduce((sum, temp) => sum + temp, 0) / allTemperatures.length;
  
  const allVoltages = batterySegments.flatMap(segment => segment.cells.voltages);
  const minVoltage = Math.min(...allVoltages);
  const maxVoltage = Math.max(...allVoltages);
  const cellDelta = maxVoltage - minVoltage;
  const maxTemp = Math.max(...allTemperatures);
  
  const balancingActive = batterySegments.some(segment => segment.cells.balancingCells.length > 0);
  const powerStatus: 'charging' | 'discharging' | 'idle' = Math.random() > 0.5 ? 'charging' : 'discharging';
  const totalCurrent = 15.5 + Math.random() * 10;
  const packPower = totalVoltage * totalCurrent;
  
  // Calculate segment-level stats
  const segmentStats = batterySegments.map((segment) => {
    const minVoltage = Math.min(...segment.cells.voltages);
    const maxVoltage = Math.max(...segment.cells.voltages);
    const avgVoltage = segment.cells.voltages.reduce((sum, v) => sum + v, 0) / segment.cells.voltages.length;
    const voltageDelta = maxVoltage - minVoltage;
    
    const minTemp = Math.min(...segment.cells.temperatures);
    const maxTemp = Math.max(...segment.cells.temperatures);
    const avgTemp = segment.cells.temperatures.reduce((sum, t) => sum + t, 0) / segment.cells.temperatures.length;
    const tempDelta = maxTemp - minTemp;
    
    // Imbalance count: cells that deviate from average by more than 50mV
    const imbalanceCount = segment.cells.voltages.filter(v => Math.abs(v - avgVoltage) > 0.05).length;
    
    return {
      segmentNumber: segment.segmentNumber,
      minVoltage,
      avgVoltage,
      maxVoltage,
      voltageDelta,
      minTemp,
      avgTemp,
      maxTemp,
      tempDelta,
      imbalanceCount,
    };
  });

  const handleReorder = useCallback((dragIndex: number, hoverIndex: number) => {
    setCardOrder((prevOrder) => {
      const newOrder = [...prevOrder];
      const [removed] = newOrder.splice(dragIndex, 1);
      newOrder.splice(hoverIndex, 0, removed);
      return newOrder;
    });
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <DndProvider backend={HTML5Backend}>
        <div className="h-screen flex flex-col bg-background relative overflow-hidden">
          {/* System Connection Banner */}
          <SystemBanner text="BMS Connected" isConnected={isConnected} size="sm" />
          
          {/* Geometric accent elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
          
          <Navbar />
          <div className="flex flex-1 overflow-hidden relative z-10">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
            <main className="flex-1 overflow-auto p-6">
              {activeTab === 'overview' && (
                <>
                  <h2 className="mb-4 text-base uppercase tracking-wider text-primary/80">Battery Overview</h2>
                  <DraggableOverviewStats 
                    totalVoltage={totalVoltage}
                    avgTemperature={avgTemperature}
                    stateOfCharge={85}
                    cellDelta={cellDelta}
                    powerStatus={powerStatus}
                    balancingActive={balancingActive}
                    totalCurrent={totalCurrent}
                    packPower={packPower}
                    minVoltage={minVoltage}
                    maxVoltage={maxVoltage}
                    cardOrder={cardOrder}
                    onReorder={handleReorder}
                  />
                  
                  <SegmentDetailedStats segments={segmentStats} />
                </>
              )}
              
              {activeTab === 'segments' && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base uppercase tracking-wider text-primary/80">Battery Segments</h2>
                    <button
                      onClick={() => setHeatmapEnabled(!heatmapEnabled)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm hover:bg-muted transition-all duration-300 uppercase tracking-wide ${
                        heatmapEnabled ? 'bg-orange-500/20 text-orange-500' : 'text-muted-foreground'
                      }`}
                      title="Toggle Heatmap"
                    >
                      <Flame className="w-4 h-4" />
                      <span>Heatmap</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {batterySegments.map((segment) => (
                      <BatterySegment
                        key={segment.segmentNumber}
                        segmentNumber={segment.segmentNumber}
                        cells={segment.cells}
                        minVoltageGlobal={minVoltage}
                        maxVoltageGlobal={maxVoltage}
                        maxTempGlobal={maxTemp}
                        heatmapEnabled={heatmapEnabled}
                      />
                    ))}
                  </div>
                </>
              )}
              
              {activeTab === 'settings' && (
                <SettingsPage />
              )}
              
              {activeTab === 'info' && (
                <InfoPage />
              )}
              
              {activeTab === 'connection' && (
                <ConnectionPage onConnectionChange={setIsConnected} />
              )}
              
              {activeTab === 'analytics' && (
                <AnalyticsPage />
              )}
            </main>
          </div>
        </div>
      </DndProvider>
    </ThemeProvider>
  );
}