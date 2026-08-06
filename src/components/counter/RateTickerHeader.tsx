'use client';

import React from 'react';
import { DailyRates } from '@/types/counter';
import { Sparkles, Clock, RefreshCw, Flame } from 'lucide-react';

interface RateTickerHeaderProps {
  rates: DailyRates;
  onOpenRateController?: () => void;
  isLoading?: boolean;
}

export const RateTickerHeader: React.FC<RateTickerHeaderProps> = ({
  rates,
  onOpenRateController,
  isLoading = false,
}) => {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const formattedTime = React.useMemo(() => {
    if (!rates.updated_at) return 'Today';
    try {
      const date = new Date(rates.updated_at);
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return 'Today';
    }
  }, [rates.updated_at]);


  return (
    <div className="w-full bg-surface-container-high/90 backdrop-blur-md border-b border-primary/20 text-on-surface py-2.5 px-3 sm:px-6 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left Badge & Title */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2 bg-primary/10 border border-primary/30 px-2.5 py-1 rounded-full text-xs font-semibold text-primary">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="tracking-wide uppercase">Jammu Rate</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
            <Clock className="w-3.5 h-3.5 text-primary/80" />
            <span>Updated: <strong suppressHydrationWarning className="text-on-surface font-medium">{isMounted ? formattedTime : 'Today'}</strong></span>
          </div>

          {onOpenRateController && (
            <button
              onClick={onOpenRateController}
              className="md:hidden flex items-center gap-1 text-xs text-primary font-medium underline underline-offset-2 hover:text-primary/80"
            >
              <RefreshCw className="w-3 h-3" /> Edit
            </button>
          )}
        </div>

        {/* Ticker Rates Chips */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar w-full md:w-auto py-1 justify-start md:justify-end">
          <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-lg border border-outline-variant/30 text-xs shrink-0">
            <span className="font-semibold text-amber-400">24K</span>
            <span className="text-on-surface font-bold">₹{rates.gold_24k.toLocaleString('en-IN')}<span className="text-[10px] text-on-surface-variant font-normal">/g</span></span>
          </div>

          <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-lg border border-primary/40 text-xs shrink-0 gold-border">
            <span className="font-bold text-primary">22K</span>
            <span className="text-primary font-extrabold">₹{rates.gold_22k.toLocaleString('en-IN')}<span className="text-[10px] text-primary/80 font-normal">/g</span></span>
          </div>

          <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-lg border border-outline-variant/30 text-xs shrink-0">
            <span className="font-semibold text-amber-200">18K</span>
            <span className="text-on-surface font-bold">₹{rates.gold_18k.toLocaleString('en-IN')}<span className="text-[10px] text-on-surface-variant font-normal">/g</span></span>
          </div>

          <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-lg border border-outline-variant/30 text-xs shrink-0">
            <span className="font-semibold text-amber-100">14K</span>
            <span className="text-on-surface font-bold">₹{rates.gold_14k.toLocaleString('en-IN')}<span className="text-[10px] text-on-surface-variant font-normal">/g</span></span>
          </div>

          <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-lg border border-outline-variant/30 text-xs shrink-0">
            <span className="font-semibold text-slate-300">Silver (999)</span>
            <span className="text-slate-100 font-bold">₹{rates.silver_999.toLocaleString('en-IN')}<span className="text-[10px] text-slate-400 font-normal">/g</span></span>
          </div>

          {onOpenRateController && (
            <button
              onClick={onOpenRateController}
              disabled={isLoading}
              className="hidden md:flex items-center gap-1.5 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shrink-0 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Update Morning Rates</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
