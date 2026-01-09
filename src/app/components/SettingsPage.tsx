import { ChevronDown, ChevronUp, Save, RotateCcw, Lock, Unlock } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function CollapsibleSection({ title, defaultOpen = false, children }: CollapsibleSectionProps) {
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

// Form control components
interface FormRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}

function FormRow({ label, description, children }: FormRowProps) {
  return (
    <div className="py-2 border-b border-border/30 last:border-b-0">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <label className="text-sm text-foreground">{label}</label>
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
        <div className="flex-shrink-0">
          {children}
        </div>
      </div>
    </div>
  );
}

interface SettingsPageProps {
  onSettingsChange?: (settings: any) => void;
}

export function SettingsPage({ onSettingsChange }: SettingsPageProps) {
  // Lock state
  const [isLocked, setIsLocked] = useState(true);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimerRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const HOLD_DURATION = 2000; // 2 seconds hold required

  // 1. Measurement Behavior
  const [measurementMode, setMeasurementMode] = useState('continuous');
  const [redundantMeasurement, setRedundantMeasurement] = useState(true);
  const [syncConversions, setSyncConversions] = useState(false);
  
  // 2. Digital Filtering
  const [iirFilterEnabled, setIirFilterEnabled] = useState(true);
  const [iirCornerFreq, setIirCornerFreq] = useState(110);
  
  // 3. Balancing Control
  const [balancingMode, setBalancingMode] = useState('normal');
  const [pauseDuringMeasurement, setPauseDuringMeasurement] = useState(true);
  const [targetCellDelta, setTargetCellDelta] = useState(10); // 10 mV default target delta
  
  // 4. Thresholds and Fault Limits
  const [ovThreshold, setOvThreshold] = useState(4.2);
  const [uvThreshold, setUvThreshold] = useState(3.0);
  const [adcMismatchThreshold, setAdcMismatchThreshold] = useState(50);
  const [faultLatchEnabled, setFaultLatchEnabled] = useState(true);

  // 5. Open-Wire Detection
  const [openWireDetection, setOpenWireDetection] = useState('all');
  const [openWirePeriodic, setOpenWirePeriodic] = useState(false);
  
  // 6. GPIO and AUX Measurements
  const [gpio1Mode, setGpio1Mode] = useState('analog-input');
  const [gpio2Mode, setGpio2Mode] = useState('analog-input');
  const [gpio3Mode, setGpio3Mode] = useState('analog-input');
  const [gpio4Mode, setGpio4Mode] = useState('analog-input');
  const [auxPullDirection, setAuxPullDirection] = useState('pull-down');
  const [soakTime, setSoakTime] = useState(100);
  const [auxMeasurementMode, setAuxMeasurementMode] = useState('single-shot');
  
  // 7. Power State Control
  const [powerState, setPowerState] = useState('measure');
  const [lpcmEnabled, setLpcmEnabled] = useState(false);
  const [watchdogTimeout, setWatchdogTimeout] = useState(5000);
  const [dischargeTimeout, setDischargeTimeout] = useState(30000);
  
  // 8. Communication Behavior
  const [commandCounter, setCommandCounter] = useState(true);
  const [pecChecking, setPecChecking] = useState(true);
  const [snapshotMode, setSnapshotMode] = useState(false);
  
  // 9. Diagnostics
  const [comparisonDiagnostics, setComparisonDiagnostics] = useState(true);

  // Handle press and hold for lock toggle
  const handleMouseDown = () => {
    setHoldProgress(0);
    holdTimerRef.current = window.setTimeout(() => {
      setIsLocked(!isLocked);
      setHoldProgress(0);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }, HOLD_DURATION);
    
    progressIntervalRef.current = window.setInterval(() => {
      setHoldProgress((prev) => Math.min(prev + 2, 100));
    }, HOLD_DURATION / 50);
  };

  const handleMouseUp = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    setHoldProgress(0);
  };

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current);
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base uppercase tracking-wider text-primary/80">
          ADBMS6830B Configuration
        </h2>
        <div className="flex gap-2">
          {/* Lock/Unlock Button */}
          <button
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded transition-all duration-300 uppercase tracking-wide overflow-hidden ${
              isLocked
                ? 'bg-red-500/20 hover:bg-red-500/30 border-red-500/50 text-red-400'
                : 'bg-green-500/20 hover:bg-green-500/30 border-green-500/50 text-green-400'
            }`}
            title={isLocked ? 'Press and hold to unlock' : 'Press and hold to lock'}
          >
            <div
              className="absolute inset-0 bg-white/10 transition-all duration-100"
              style={{ width: `${holdProgress}%` }}
            />
            {isLocked ? (
              <><Lock className="w-3.5 h-3.5 relative z-10" /><span className="relative z-10">Locked</span></>
            ) : (
              <><Unlock className="w-3.5 h-3.5 relative z-10" /><span className="relative z-10">Unlocked</span></>
            )}
          </button>
          
          <button
            disabled={isLocked}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm border border-border rounded transition-all duration-300 uppercase tracking-wide ${
              isLocked
                ? 'bg-muted/10 text-muted-foreground/50 cursor-not-allowed'
                : 'bg-muted/20 hover:bg-muted/40 text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => {
              if (confirm('Reset all settings to default values?')) {
                window.location.reload();
              }
            }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            disabled={isLocked}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded transition-all duration-300 uppercase tracking-wide ${
              isLocked
                ? 'bg-primary/10 border-primary/30 text-primary/50 cursor-not-allowed'
                : 'bg-primary/20 hover:bg-primary/30 border-primary/50 text-primary hover:text-primary'
            }`}
            onClick={() => {
              alert('Configuration saved! (In production, this would write to ASIC registers)');
            }}
          >
            <Save className="w-3.5 h-3.5" />
            Flash Config
          </button>
        </div>
      </div>

      {/* 1. Cell Voltage Measurement Configuration */}
      <CollapsibleSection title="1. Cell Voltage Measurement Configuration" defaultOpen={true}>
        <div className="space-y-1">
          <FormRow label="Measurement Mode" description="Single-shot or continuous sampling">
            <select
              value={measurementMode}
              onChange={(e) => setMeasurementMode(e.target.value)}
              className="px-3 py-1 text-sm bg-background border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              <option value="single-shot">Single-shot</option>
              <option value="continuous">Continuous</option>
            </select>
          </FormRow>

          <FormRow label="Redundant Measurement" description="Enable C-ADC + S-ADC comparison for safety">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={redundantMeasurement}
                onChange={(e) => setRedundantMeasurement(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </FormRow>

          <FormRow label="Synchronize Conversions" description="Align C-ADC and S-ADC sampling">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={syncConversions}
                onChange={(e) => setSyncConversions(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </FormRow>

          <FormRow label="IIR Digital Filter" description="Enable low-pass filtering">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={iirFilterEnabled}
                onChange={(e) => setIirFilterEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </FormRow>

          {iirFilterEnabled && (
            <FormRow label="IIR Corner Frequency" description="−3 dB cutoff frequency (Hz)">
              <select
                value={iirCornerFreq}
                onChange={(e) => setIirCornerFreq(Number(e.target.value))}
                className="px-3 py-1 text-sm bg-background border border-border rounded text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary/50"
              >
                <option value="110">110 Hz</option>
                <option value="55">55 Hz</option>
                <option value="27.5">27.5 Hz</option>
                <option value="13.75">13.75 Hz</option>
                <option value="6.875">6.875 Hz</option>
                <option value="3.4375">3.4375 Hz</option>
                <option value="1.71875">1.71875 Hz</option>
                <option value="0.625">0.625 Hz</option>
              </select>
            </FormRow>
          )}

          <FormRow label="Open-Wire Detection" description="Which channels to check for disconnection">
            <select
              value={openWireDetection}
              onChange={(e) => setOpenWireDetection(e.target.value)}
              className="px-3 py-1 text-sm bg-background border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              <option value="disabled">Disabled</option>
              <option value="odd">Odd Channels</option>
              <option value="even">Even Channels</option>
              <option value="all">All Channels</option>
            </select>
          </FormRow>

          <FormRow label="Periodic Open-Wire Check" description="Enable periodic open-wire detection">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={openWirePeriodic}
                onChange={(e) => setOpenWirePeriodic(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </FormRow>

          <div className="mt-3 p-2 bg-muted/20 rounded text-xs text-muted-foreground">
            <strong>Note:</strong> C-ADC samples at ~1 kHz, S-ADC at ~125 Hz. Redundant mode enables comparison for fault detection.
          </div>
        </div>
      </CollapsibleSection>

      {/* 2. Cell Balancing */}
      <CollapsibleSection title="2. Cell Balancing (Passive Discharge)">
        <div className="space-y-1">
          <FormRow label="Balancing Mode" description="Normal, extended, or timer-based discharge">
            <select
              value={balancingMode}
              onChange={(e) => setBalancingMode(e.target.value)}
              className="px-3 py-1 text-sm bg-background border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              <option value="normal">Normal Mode</option>
              <option value="extended">Extended Balancing</option>
              <option value="dtm">Discharge Timer Monitor</option>
            </select>
          </FormRow>

          <FormRow label="Pause During Measurement" description="Disable balancing during voltage acquisition">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={pauseDuringMeasurement}
                onChange={(e) => setPauseDuringMeasurement(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </FormRow>

          <FormRow label="Target Cell Delta (mV)" description="Passive cell balancing will balance cells to this delta">
            <input
              type="number"
              min="5"
              max="100"
              step="1"
              value={targetCellDelta}
              onChange={(e) => setTargetCellDelta(Number(e.target.value))}
              className="w-24 px-2 py-1 text-sm bg-background border border-border rounded text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </FormRow>

          <div className="mt-3 p-2 bg-muted/20 rounded text-xs text-muted-foreground">
            <strong>Hardware Limit:</strong> Passive balancing only, max ~300 mA per cell. Active balancing not supported.
          </div>
        </div>
      </CollapsibleSection>

      {/* 3. Thresholds and Safety Monitoring */}
      <CollapsibleSection title="3. Thresholds and Safety Monitoring">
        <div className="space-y-1">
          <FormRow label="Overvoltage Threshold (V)" description="Cell voltage alarm upper limit">
            <input
              type="number"
              min="3.0"
              max="5.0"
              step="0.01"
              value={ovThreshold}
              onChange={(e) => setOvThreshold(Number(e.target.value))}
              className="w-24 px-2 py-1 text-sm bg-background border border-border rounded text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </FormRow>

          <FormRow label="Undervoltage Threshold (V)" description="Cell voltage alarm lower limit">
            <input
              type="number"
              min="2.0"
              max="3.5"
              step="0.01"
              value={uvThreshold}
              onChange={(e) => setUvThreshold(Number(e.target.value))}
              className="w-24 px-2 py-1 text-sm bg-background border border-border rounded text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </FormRow>

          <FormRow label="ADC Mismatch Threshold (mV)" description="C-ADC vs S-ADC fault detection limit">
            <input
              type="number"
              min="0"
              max="200"
              step="5"
              value={adcMismatchThreshold}
              onChange={(e) => setAdcMismatchThreshold(Number(e.target.value))}
              className="w-24 px-2 py-1 text-sm bg-background border border-border rounded text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </FormRow>

          <FormRow label="Fault Latch Enabled" description="Lock fault status until reset">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={faultLatchEnabled}
                onChange={(e) => setFaultLatchEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </FormRow>

          <div className="mt-3 p-2 bg-orange-500/10 border border-orange-500/30 rounded text-xs text-orange-400">
            <strong>Safety Critical:</strong> These thresholds affect autonomous fault responses and discharge behavior.
          </div>
        </div>
      </CollapsibleSection>

      {/* 4. Power and Operating States */}
      <CollapsibleSection title="4. Power and Operating States">
        <div className="space-y-1">
          <FormRow label="Power State" description="Configure the power mode of the device">
            <select
              value={powerState}
              onChange={(e) => setPowerState(e.target.value)}
              className="px-3 py-1 text-sm bg-background border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              <option value="measure">Measure Mode</option>
              <option value="sleep">Sleep Mode</option>
              <option value="standby">Standby Mode</option>
              <option value="refup">REFUP Mode</option>
            </select>
          </FormRow>

          <FormRow label="Watchdog Timeout (ms)" description="Timeout for the watchdog timer">
            <input
              type="number"
              min="1000"
              max="10000"
              step="100"
              value={watchdogTimeout}
              onChange={(e) => setWatchdogTimeout(Number(e.target.value))}
              className="w-24 px-2 py-1 text-sm bg-background border border-border rounded text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </FormRow>

          <FormRow label="Low Power Cell Monitoring (LPCM)" description="Periodic µA-level measurements">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={lpcmEnabled}
                onChange={(e) => setLpcmEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </FormRow>

          <FormRow label="Discharge Timeout (ms)" description="Timeout for discharge operations">
            <input
              type="number"
              min="1000"
              max="60000"
              step="1000"
              value={dischargeTimeout}
              onChange={(e) => setDischargeTimeout(Number(e.target.value))}
              className="w-24 px-2 py-1 text-sm bg-background border border-border rounded text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </FormRow>
        </div>
      </CollapsibleSection>

      {/* 5. Communication and Topology */}
      <CollapsibleSection title="5. Communication and Topology">
        <div className="space-y-1">
          <FormRow label="Command Counter" description="Enable command sequence checking">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={commandCounter}
                onChange={(e) => setCommandCounter(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </FormRow>

          <FormRow label="Packet Error Checking (PEC)" description="Enable error detection">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={pecChecking}
                onChange={(e) => setPecChecking(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </FormRow>

          <FormRow label="Snapshot Mode" description="Enable snapshot command for data consistency">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={snapshotMode}
                onChange={(e) => setSnapshotMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </FormRow>
        </div>
      </CollapsibleSection>

      {/* 6. GPIO and Auxiliary Measurements */}
      <CollapsibleSection title="6. GPIO and Auxiliary Measurements">
        <div className="space-y-1">
          <FormRow label="GPIO1 Mode" description="Configure GPIO1 function">
            <select
              value={gpio1Mode}
              onChange={(e) => setGpio1Mode(e.target.value)}
              className="px-3 py-1 text-sm bg-background border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              <option value="analog-input">Analog Input</option>
              <option value="digital-input">Digital Input</option>
              <option value="digital-output">Digital Output</option>
            </select>
          </FormRow>

          <FormRow label="GPIO2 Mode" description="Configure GPIO2 function">
            <select
              value={gpio2Mode}
              onChange={(e) => setGpio2Mode(e.target.value)}
              className="px-3 py-1 text-sm bg-background border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              <option value="analog-input">Analog Input</option>
              <option value="digital-input">Digital Input</option>
              <option value="digital-output">Digital Output</option>
            </select>
          </FormRow>

          <FormRow label="GPIO3 Mode" description="Configure GPIO3 function">
            <select
              value={gpio3Mode}
              onChange={(e) => setGpio3Mode(e.target.value)}
              className="px-3 py-1 text-sm bg-background border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              <option value="analog-input">Analog Input</option>
              <option value="digital-input">Digital Input</option>
              <option value="digital-output">Digital Output</option>
            </select>
          </FormRow>

          <FormRow label="GPIO4 Mode" description="Configure GPIO4 function">
            <select
              value={gpio4Mode}
              onChange={(e) => setGpio4Mode(e.target.value)}
              className="px-3 py-1 text-sm bg-background border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              <option value="analog-input">Analog Input</option>
              <option value="digital-input">Digital Input</option>
              <option value="digital-output">Digital Output</option>
            </select>
          </FormRow>

          <FormRow label="Auxiliary Pull Direction" description="Set pull-up or pull-down for aux channels">
            <select
              value={auxPullDirection}
              onChange={(e) => setAuxPullDirection(e.target.value)}
              className="px-3 py-1 text-sm bg-background border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              <option value="pull-down">Pull Down</option>
              <option value="pull-up">Pull Up</option>
            </select>
          </FormRow>

          <FormRow label="Soak Time (µs)" description="Settling time before conversion">
            <input
              type="number"
              min="0"
              max="1000"
              step="10"
              value={soakTime}
              onChange={(e) => setSoakTime(Number(e.target.value))}
              className="w-24 px-2 py-1 text-sm bg-background border border-border rounded text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </FormRow>

          <FormRow label="Auxiliary Measurement Mode" description="Single-shot or continuous sampling">
            <select
              value={auxMeasurementMode}
              onChange={(e) => setAuxMeasurementMode(e.target.value)}
              className="px-3 py-1 text-sm bg-background border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              <option value="single-shot">Single-shot</option>
              <option value="continuous">Continuous</option>
            </select>
          </FormRow>
        </div>
      </CollapsibleSection>

      {/* 7. Diagnostics and Functional Safety */}
      <CollapsibleSection title="7. Diagnostics and Functional Safety">
        <div className="space-y-1">
          <FormRow label="Comparison Diagnostics" description="Enable ADC comparison diagnostics">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={comparisonDiagnostics}
                onChange={(e) => setComparisonDiagnostics(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </FormRow>

          <div className="mt-3 p-2 bg-primary/10 border border-primary/30 rounded text-xs text-primary">
            <strong>Functional Safety:</strong> These diagnostics support ASIL-D level safety coverage architecture.
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
}