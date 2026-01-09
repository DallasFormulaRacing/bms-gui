import {
  Thermometer,
  Zap,
  AlertCircle,
  CheckCircle,
  Flame,
} from "lucide-react";
import { useState, useEffect } from "react";

interface CellData {
  voltages: number[];
  temperatures: number[];
  balancingCells: number[]; // Array of cell indices that are being balanced
}

interface BatterySegmentProps {
  segmentNumber: number;
  cells: CellData;
  minVoltageGlobal: number;
  maxVoltageGlobal: number;
  maxTempGlobal: number;
  heatmapEnabled: boolean;
}

export function BatterySegment({
  segmentNumber,
  cells,
  minVoltageGlobal,
  maxVoltageGlobal,
  maxTempGlobal,
  heatmapEnabled,
}: BatterySegmentProps) {
  const [blinkState, setBlinkState] = useState(true);

  // Blink at 0.5 Hz (toggle every 1 second)
  useEffect(() => {
    const interval = setInterval(() => {
      setBlinkState((prev) => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const avgVoltage = (
    cells.voltages.reduce((sum, v) => sum + v, 0) /
    cells.voltages.length
  ).toFixed(2);
  const avgTemp = (
    cells.temperatures.reduce((sum, t) => sum + t, 0) /
    cells.temperatures.length
  ).toFixed(1);

  // Check if any cell is outside normal range
  const hasWarning =
    cells.voltages.some((v) => v < 3.3 || v > 4.1) ||
    cells.temperatures.some((t) => t > 38);

  // Heatmap color calculation for voltage (3.7V to 4.2V)
  const getVoltageHeatmapColor = (voltage: number) => {
    const nominalVoltage = 3.7;
    const maxVoltage = 4.2;
    const minVoltage = 2.5;
    
    // Calculate absolute distance from nominal
    const distance = Math.abs(voltage - nominalVoltage);
    const maxDistance = Math.max(
      Math.abs(maxVoltage - nominalVoltage),
      Math.abs(minVoltage - nominalVoltage)
    );
    
    // Normalize distance (0 = nominal, 1 = furthest away)
    const normalized = Math.min(1, distance / maxDistance);
    
    // Green (nominal) -> Yellow -> Orange -> Red (furthest from nominal)
    if (normalized < 0.33) {
      // Green to Yellow-Green
      const ratio = normalized * 3;
      return `rgb(${Math.round(ratio * 200)}, 255, 0)`;
    } else if (normalized < 0.66) {
      // Yellow to Orange
      const ratio = (normalized - 0.33) * 3;
      return `rgb(255, ${Math.round(255 - ratio * 100)}, 0)`;
    } else {
      // Orange to Red
      const ratio = (normalized - 0.66) * 3;
      return `rgb(255, ${Math.round(155 - ratio * 155)}, 0)`;
    }
  };

  // Heatmap color calculation for temperature (0°C to 60°C)
  const getTempHeatmapColor = (temp: number) => {
    const min = 0;
    const max = 60;
    const normalized = Math.max(0, Math.min(1, (temp - min) / (max - min)));
    
    // More pronounced gradient: Blue (cold) -> Cyan -> Green -> Yellow -> Orange -> Red (hot)
    if (normalized < 0.2) {
      // Blue to Cyan
      const ratio = normalized * 5;
      return `rgb(0, ${Math.round(ratio * 200)}, 255)`;
    } else if (normalized < 0.4) {
      // Cyan to Green
      const ratio = (normalized - 0.2) * 5;
      return `rgb(0, ${Math.round(200 + ratio * 55)}, ${Math.round(255 - ratio * 255)})`;
    } else if (normalized < 0.6) {
      // Green to Yellow
      const ratio = (normalized - 0.4) * 5;
      return `rgb(${Math.round(ratio * 255)}, 255, 0)`;
    } else if (normalized < 0.8) {
      // Yellow to Orange
      const ratio = (normalized - 0.6) * 5;
      return `rgb(255, ${Math.round(255 - ratio * 100)}, 0)`;
    } else {
      // Orange to Red
      const ratio = (normalized - 0.8) * 5;
      return `rgb(255, ${Math.round(155 - ratio * 155)}, 0)`;
    }
  };

  const getCellVoltageStatus = (
    voltage: number,
    index: number,
  ) => {
    const isBalancing = cells.balancingCells.includes(index);
    const isMinMax =
      voltage === minVoltageGlobal ||
      voltage === maxVoltageGlobal;

    let className = "";

    // When heatmap is enabled, use black text for better readability
    if (heatmapEnabled) {
      className += "text-black ";
    } else if (voltage < 3.3 || voltage > 4.1) {
      className += "text-destructive ";
    } else {
      className += "text-foreground ";
    }

    // Only show balancing blink if heatmap is disabled
    if (isBalancing && blinkState && !heatmapEnabled) {
      className += "bg-sky-400 ";
    }

    if (isMinMax) {
      className += "outline outline-2 outline-orange-500 ";
    }

    return className.trim();
  };

  const getCellTempStatus = (temp: number) => {
    const isMaxTemp = Math.abs(temp - maxTempGlobal) < 0.01;
    let className = "";

    // When heatmap is enabled, use black text for better readability
    if (heatmapEnabled) {
      className += "text-black ";
    } else if (temp > 38) {
      className += "text-destructive ";
    } else {
      className += "text-foreground ";
    }

    if (isMaxTemp) {
      className += "outline outline-2 outline-orange-500 ";
    }

    return className.trim();
  };

  return (
    <div className="bg-card border border-border rounded-lg p-3 backdrop-blur-xl hover:border-primary/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-medium tracking-wide">SEGMENT {segmentNumber}</h3>
          {hasWarning ? (
            <AlertCircle className="w-3.5 h-3.5 text-destructive" />
          ) : (
            <CheckCircle className="w-3.5 h-3.5 text-primary" />
          )}
        </div>
        <div className="flex gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-0.5">
            <Zap className="w-3 h-3 text-primary" />
            <span className="font-mono">{avgVoltage}V</span>
          </div>
          <div className="flex items-center gap-0.5">
            <Thermometer className="w-3 h-3 text-primary" />
            <span className="font-mono">{avgTemp}°C</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {/* Cell Voltages - Column 1 */}
        <div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
            <Zap className="w-3 h-3" />
            <span>1-12</span>
          </div>
          <div className="space-y-0.5">
            {cells.voltages
              .slice(0, 12)
              .map((voltage, index) => (
                <div
                  key={`voltage-${index}`}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">
                    C{index + 1}
                  </span>
                  <span
                    className={`font-mono px-1 rounded ${getCellVoltageStatus(voltage, index)}`}
                    style={
                      heatmapEnabled
                        ? { backgroundColor: getVoltageHeatmapColor(voltage) }
                        : {}
                    }
                  >
                    {voltage.toFixed(3)}V
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Cell Voltages - Column 2 */}
        <div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
            <Zap className="w-3 h-3" />
            <span>13-24</span>
          </div>
          <div className="space-y-0.5">
            {cells.voltages
              .slice(12, 24)
              .map((voltage, index) => (
                <div
                  key={`voltage-${index + 12}`}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">
                    C{index + 13}
                  </span>
                  <span
                    className={`font-mono px-1 rounded ${getCellVoltageStatus(voltage, index + 12)}`}
                    style={
                      heatmapEnabled
                        ? { backgroundColor: getVoltageHeatmapColor(voltage) }
                        : {}
                    }
                  >
                    {voltage.toFixed(3)}V
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Cell Temperatures - Column 1 */}
        <div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
            <Thermometer className="w-3 h-3" />
            <span>1-10</span>
          </div>
          <div className="space-y-0.5">
            {cells.temperatures
              .slice(0, 10)
              .map((temp, index) => (
                <div
                  key={`temp-${index}`}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">
                    T{index + 1}
                  </span>
                  <span
                    className={`font-mono px-1 rounded ${getCellTempStatus(temp)}`}
                    style={
                      heatmapEnabled
                        ? { backgroundColor: getTempHeatmapColor(temp) }
                        : {}
                    }
                  >
                    {temp.toFixed(1)}°C
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Cell Temperatures - Column 2 */}
        <div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
            <Thermometer className="w-3 h-3" />
            <span>11-20</span>
          </div>
          <div className="space-y-0.5">
            {cells.temperatures
              .slice(10, 20)
              .map((temp, index) => (
                <div
                  key={`temp-${index + 10}`}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">
                    T{index + 11}
                  </span>
                  <span
                    className={`font-mono px-1 rounded ${getCellTempStatus(temp)}`}
                    style={
                      heatmapEnabled
                        ? { backgroundColor: getTempHeatmapColor(temp) }
                        : {}
                    }
                  >
                    {temp.toFixed(1)}°C
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}