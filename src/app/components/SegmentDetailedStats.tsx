interface SegmentStats {
  segmentNumber: number;
  minVoltage: number;
  avgVoltage: number;
  maxVoltage: number;
  voltageDelta: number;
  minTemp: number;
  avgTemp: number;
  maxTemp: number;
  tempDelta: number;
  imbalanceCount: number;
}

interface SegmentDetailedStatsProps {
  segments: SegmentStats[];
}

export function SegmentDetailedStats({ segments }: SegmentDetailedStatsProps) {
  return (
    <div>
      <h2 className="mb-3 text-base uppercase tracking-wider text-primary/80">Segment-Level Details</h2>
      <div className="grid grid-cols-3 gap-3">
        {segments.map((segment) => (
          <div
            key={segment.segmentNumber}
            className="bg-card border border-border rounded-lg p-2 backdrop-blur-xl hover:border-primary/30 transition-all duration-300"
          >
            <h3 className="text-sm mb-1.5 font-medium">Segment {segment.segmentNumber}</h3>
            
            <div className="grid grid-cols-2 gap-2">
              {/* Voltage Section */}
              <div>
                <div className="text-sm text-muted-foreground mb-1">Voltage</div>
                <div className="space-y-0.5 text-sm">
                  <div className="flex justify-between gap-1">
                    <span className="text-muted-foreground">Min:</span>
                    <span className="font-mono">{segment.minVoltage.toFixed(3)}V</span>
                  </div>
                  <div className="flex justify-between gap-1">
                    <span className="text-muted-foreground">Avg:</span>
                    <span className="font-mono">{segment.avgVoltage.toFixed(3)}V</span>
                  </div>
                  <div className="flex justify-between gap-1">
                    <span className="text-muted-foreground">Max:</span>
                    <span className="font-mono">{segment.maxVoltage.toFixed(3)}V</span>
                  </div>
                  <div className="flex justify-between gap-1">
                    <span className="text-muted-foreground">Δ:</span>
                    <span className="font-mono">{(segment.voltageDelta * 1000).toFixed(0)}mV</span>
                  </div>
                </div>
              </div>

              {/* Temperature Section */}
              <div>
                <div className="text-sm text-muted-foreground mb-1">Temperature</div>
                <div className="space-y-0.5 text-sm">
                  <div className="flex justify-between gap-1">
                    <span className="text-muted-foreground">Min:</span>
                    <span className="font-mono">{segment.minTemp.toFixed(1)}°C</span>
                  </div>
                  <div className="flex justify-between gap-1">
                    <span className="text-muted-foreground">Avg:</span>
                    <span className="font-mono">{segment.avgTemp.toFixed(1)}°C</span>
                  </div>
                  <div className="flex justify-between gap-1">
                    <span className="text-muted-foreground">Max:</span>
                    <span className="font-mono">{segment.maxTemp.toFixed(1)}°C</span>
                  </div>
                  <div className="flex justify-between gap-1">
                    <span className="text-muted-foreground">Δ:</span>
                    <span className="font-mono">{segment.tempDelta.toFixed(1)}°C</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Imbalance Section */}
            <div className="mt-2 pt-2 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Imbalance Count:</span>
                <span className={`font-mono ${segment.imbalanceCount > 0 ? 'text-orange-500' : 'text-foreground'}`}>
                  {segment.imbalanceCount}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}