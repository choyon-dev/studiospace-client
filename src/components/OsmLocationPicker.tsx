'use client';

import React, { useState, useEffect, useRef } from 'react';
import { searchOsmLocations } from '@/lib/api';
import { OsmLocationSuggestion } from '@/types';
import { MapPin, Loader2, Check } from 'lucide-react';

interface OsmLocationPickerProps {
  value: string;
  onChange: (value: string, details?: OsmLocationSuggestion) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export default function OsmLocationPicker({
  value,
  onChange,
  placeholder = 'Search verified studio facility address via OpenStreetMap...',
  required = false,
  className = '',
}: OsmLocationPickerProps) {
  const [inputValue, setInputValue] = useState(value || '');
  const [suggestions, setSuggestions] = useState<OsmLocationSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!inputValue || inputValue.trim().length < 3) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await searchOsmLocations(inputValue);
        setSuggestions(results);
        setIsOpen(results.length > 0);
      } catch (err) {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [inputValue]);

  const handleSelect = (item: OsmLocationSuggestion) => {
    setInputValue(item.formatted || item.displayName);
    onChange(item.formatted || item.displayName, item);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    onChange(val);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative">
        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-amber-500 pointer-events-none" />
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          required={required}
          className={
            className ||
            'w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-zinc-100/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all'
          }
        />
        {loading && (
          <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-amber-500 animate-spin" />
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-64 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center justify-between">
            <span>OpenStreetMap Verified Locations</span>
            <span>Global Geocoding</span>
          </div>

          <div className="space-y-0.5">
            {suggestions.map((item, idx) => (
              <button
                key={`${item.osmPlaceId}-${idx}`}
                type="button"
                onClick={() => handleSelect(item)}
                className="w-full text-left p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors flex items-start gap-2.5 group cursor-pointer"
              >
                <div className="size-6 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-amber-500 group-hover:text-zinc-950 transition-colors">
                  <MapPin className="size-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                    {item.label}
                  </p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                    {item.displayName}
                  </p>
                </div>
                <div className="shrink-0 text-[10px] font-mono text-zinc-400 px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800">
                  {item.city}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
