import React from "react";
import { Check } from "lucide-react";
import { cn } from "../../src/lib/utils";

const tones = [
  {
    value: "professional",
    label: "Professional",
    description: "Clear, concise and business-appropriate",
    color: "bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200",
  },
  {
    value: "friendly",
    label: "Friendly", 
    description: "Warm, approachable and personable",
    color: "bg-green-100 border-green-300 text-green-700 hover:bg-green-200",
  },
  {
    value: "formal",
    label: "Formal",
    description: "Respectful, sophisticated and traditional", 
    color: "bg-purple-100 border-purple-300 text-purple-700 hover:bg-purple-200",
  },
  {
    value: "casual",
    label: "Casual",
    description: "Relaxed, conversational and laid-back",
    color: "bg-amber-100 border-amber-300 text-amber-700 hover:bg-amber-200",
  },
  {
    value: "enthusiastic", 
    label: "Enthusiastic",
    description: "Energetic, positive and motivating",
    color: "bg-rose-100 border-rose-300 text-rose-700 hover:bg-rose-200",
  }
];

export function ToneSelector({ selectedTone, onToneChange }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-gray-700">Select Tone</label>
        <p className="text-xs text-gray-500">Choose how you'd like your email to sound</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {tones.map((tone) => (
          <button
            key={tone.value}
            onClick={() => onToneChange(tone.value)}
            className={cn(
              "relative flex flex-col items-start p-3 border rounded-lg transition-all duration-200",
              tone.color,
              selectedTone === tone.value 
                ? "ring-2 ring-offset-2 ring-purple-500" 
                : "hover:scale-105"
            )}
          >
            {selectedTone === tone.value && (
              <div className="absolute right-2 top-2">
                <Check size={16} className="text-purple-600" />
              </div>
            )}
            <div className="font-medium">{tone.label}</div>
            <div className="text-xs mt-1 opacity-90">{tone.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
