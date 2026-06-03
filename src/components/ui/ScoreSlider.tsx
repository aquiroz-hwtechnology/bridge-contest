import { useState } from 'react';
import { getEmojiForScore, getEmojiLabel } from '@/lib/utils';

interface ScoreSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function ScoreSlider({ label, value, onChange, min = 1, max = 10 }: ScoreSliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const emoji = getEmojiForScore(value);
  const emojiLabel = getEmojiLabel(value);
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        <div className="flex items-center gap-2">
          <span
            className={`text-3xl transition-transform duration-200 ${isDragging ? 'scale-125' : ''}`}
          >
            {emoji}
          </span>
          <span className="text-xs text-gray-500 font-medium">{emojiLabel}</span>
        </div>
      </div>

      <div className="relative">
        <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full rounded-full transition-all duration-150"
            style={{
              width: `${percentage}%`,
              background: value <= 2
                ? '#ef4444'
                : value <= 4
                ? '#f97316'
                : value <= 6
                ? '#eab308'
                : value <= 8
                ? '#22c55e'
                : '#3b82f6',
            }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className="absolute top-0 left-0 w-full h-3 opacity-0 cursor-pointer"
        />
      </div>

      <div className="flex justify-between text-xs text-gray-400">
        <span>{min}</span>
        <span className="text-2xl font-bold text-gray-800">{value}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
