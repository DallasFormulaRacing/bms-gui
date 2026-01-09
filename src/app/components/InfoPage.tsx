import { Copy, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { useState } from 'react';

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
}

function InfoCard({ title, children }: InfoCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg backdrop-blur-xl p-4">
      <h3 className="text-xs font-medium tracking-wide uppercase text-primary/90 mb-3">{title}</h3>
      {children}
    </div>
  );
}

interface InfoRowProps {
  label: string;
  value: string | number;
  mono?: boolean;
}

function InfoRow({ label, value, mono = false }: InfoRowProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`text-xs text-foreground ${mono ? 'font-mono' : ''}`}>{value}</span>
        <button
          onClick={handleCopy}
          className="p-1 hover:bg-muted/20 rounded transition-colors"
          title="Copy to clipboard"
        >
          {copied ? (
            <Check className="w-3 h-3 text-green-500" />
          ) : (
            <Copy className="w-3 h-3 text-muted-foreground" />
          )}
        </button>
      </div>
    </div>
  );
}

interface CollapsibleSegmentInfoProps {
  segmentNumber: number;
  asicRevision: string;
  asicSerial: string;
}

function CollapsibleSegmentInfo({ segmentNumber, asicRevision, asicSerial }: CollapsibleSegmentInfoProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-border/50 rounded bg-muted/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2 text-left hover:bg-muted/10 transition-colors"
      >
        <span className="text-xs font-mono text-foreground">Segment {segmentNumber}</span>
        {isOpen ? (
          <ChevronUp className="w-3 h-3 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        )}
      </button>
      {isOpen && (
        <div className="px-2 pb-2 space-y-1">
          <InfoRow label="ASIC" value="ADBMS6830B" mono />
          <InfoRow label="Revision" value={asicRevision} mono />
          <InfoRow label="Serial ID" value={asicSerial} mono />
        </div>
      )}
    </div>
  );
}

export function InfoPage() {
  // Mock data
  const systemId = 'BMS-EV-2024-A7F3';
  const vehicleId = 'VEH-001-PROTO';
  const segments = 6;
  const cellsPerSegment = 24;
  const totalCells = segments * cellsPerSegment;
  
  const firmwareVersion = '2.3.1';
  const buildHash = 'a7f3d2c9';
  const buildDate = '2025-12-15 14:32:11 UTC';
  const schemaVersion = '1.4';
  
  const uptimeSeconds = 3847;
  const uptimeHours = Math.floor(uptimeSeconds / 3600);
  const uptimeMinutes = Math.floor((uptimeSeconds % 3600) / 60);
  
  const segmentData = Array.from({ length: segments }, (_, i) => ({
    segmentNumber: i + 1,
    asicRevision: `Rev ${String.fromCharCode(65 + (i % 3))}`,
    asicSerial: `0x${Math.floor(Math.random() * 0xFFFFFFFF).toString(16).toUpperCase().padStart(8, '0')}`,
  }));

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="mb-4 text-base uppercase tracking-wider text-primary/80">
        System Information
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {/* System Identity */}
        <InfoCard title="System Identity">
          <div className="space-y-0">
            <InfoRow label="System ID" value={systemId} mono />
            <InfoRow label="Vehicle ID" value={vehicleId} mono />
            <InfoRow label="Segments" value={segments} />
            <InfoRow label="Cells/Segment" value={cellsPerSegment} />
            <InfoRow label="Total Cells" value={totalCells} />
            <InfoRow label="Comm Mode" value="isoSPI" mono />
            <InfoRow label="Daisy Chain" value="Bidirectional" />
          </div>
        </InfoCard>

        {/* Firmware & Build */}
        <InfoCard title="Firmware & Build">
          <div className="space-y-0">
            <InfoRow label="Firmware" value={firmwareVersion} mono />
            <InfoRow label="Build Hash" value={buildHash} mono />
            <InfoRow label="Build Date" value={buildDate} mono />
            <InfoRow label="Schema Ver" value={schemaVersion} mono />
            <InfoRow label="Boot Source" value="Flash" />
            <InfoRow label="Host MCU" value="STM32H7" mono />
            <InfoRow label="Board Rev" value="v3.2" mono />
          </div>
        </InfoCard>

        {/* Hardware Fingerprint */}
        <div className="col-span-2">
          <InfoCard title="Hardware Fingerprint">
            <div className="grid grid-cols-3 gap-2">
              {segmentData.map((seg) => (
                <CollapsibleSegmentInfo
                  key={seg.segmentNumber}
                  segmentNumber={seg.segmentNumber}
                  asicRevision={seg.asicRevision}
                  asicSerial={seg.asicSerial}
                />
              ))}
            </div>
          </InfoCard>
        </div>

        {/* Runtime State */}
        <InfoCard title="Runtime State">
          <div className="space-y-0">
            <InfoRow label="Core State" value="Measure" />
            <InfoRow label="ADC Mode" value="Continuous" />
            <InfoRow label="Digital Filter" value="Enabled (10 Hz)" />
            <InfoRow label="Balancing" value="Active" />
            <InfoRow label="LPCM" value="Disabled" />
            <InfoRow label="Watchdog" value="Running" />
            <InfoRow label="Uptime" value={`${uptimeHours}h ${uptimeMinutes}m`} />
          </div>
        </InfoCard>

        {/* Communication Health */}
        <InfoCard title="Communication Health">
          <div className="space-y-0">
            <InfoRow label="isoSPI Status" value="OK" />
            <InfoRow label="PEC Errors" value={0} mono />
            <InfoRow label="Cmd Counter Errors" value={0} mono />
            <InfoRow label="Last Error" value="None" />
            <InfoRow label="Tx Packets" value="145,892" mono />
            <InfoRow label="Rx Packets" value="145,890" mono />
            <InfoRow label="Link Quality" value="99.8%" mono />
          </div>
        </InfoCard>

        {/* Fault & Diagnostic Snapshot */}
        <InfoCard title="Fault & Diagnostic">
          <div className="space-y-0">
            <InfoRow label="Fault Latch" value="Clear" />
            <InfoRow label="OV/UV Faults" value="None" />
            <InfoRow label="ADC Mismatch" value="None" />
            <InfoRow label="Open Wire" value="None" />
            <InfoRow label="Thermal" value="None" />
            <InfoRow label="Comms Fault" value="None" />
            <InfoRow label="Last Fault" value="Never" />
            <InfoRow label="Reset Count" value={3} mono />
          </div>
        </InfoCard>

        {/* Data Provenance */}
        <InfoCard title="Data Provenance">
          <div className="space-y-0">
            <InfoRow label="Config Source" value="Flash Persisted" />
            <InfoRow label="Applied" value="2025-12-15 14:45:33" mono />
            <InfoRow label="Time Source" value="MCU RTC" />
            <InfoRow label="Calibration" value="Factory + Field" />
            <InfoRow label="Cal Date" value="2025-11-20" mono />
          </div>
        </InfoCard>
      </div>

      <div className="mt-3 p-3 bg-muted/20 rounded text-xs text-muted-foreground">
        <p className="font-medium mb-1">Information Notes:</p>
        <ul className="list-disc list-inside space-y-0.5">
          <li>All data is read-only and reflects current system state</li>
          <li>Click copy icons to copy values to clipboard</li>
          <li>Expand segment cards to view per-ASIC hardware details</li>
        </ul>
      </div>
    </div>
  );
}