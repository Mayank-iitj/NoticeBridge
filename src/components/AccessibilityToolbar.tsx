"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Type, Contrast, Space } from "lucide-react";

export function AccessibilityToolbar() {
  const [textSize, setTextSize] = useState<0 | 1 | 2>(0);
  const [highContrast, setHighContrast] = useState(false);
  const [dyslexiaSpacing, setDyslexiaSpacing] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    // Text Size
    html.classList.remove("text-base", "text-lg", "text-xl");
    if (textSize === 0) html.classList.add("text-base");
    if (textSize === 1) html.classList.add("text-lg");
    if (textSize === 2) html.classList.add("text-xl");

    // High Contrast
    if (highContrast) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }

    // Dyslexia spacing
    if (dyslexiaSpacing) {
      html.style.letterSpacing = "0.1em";
      html.style.lineHeight = "2";
      html.style.wordSpacing = "0.2em";
    } else {
      html.style.letterSpacing = "";
      html.style.lineHeight = "";
      html.style.wordSpacing = "";
    }
  }, [textSize, highContrast, dyslexiaSpacing]);

  return (
    <div className="w-full bg-primary text-primary-foreground py-2 px-4 flex flex-wrap justify-between items-center text-sm font-sans z-50 sticky top-0 print:hidden">
      <div className="font-bold">Accessibility Options</div>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={() => setTextSize(s => (s + 1) % 3 as 0|1|2)} className="hover:bg-primary-foreground/20" aria-label="Toggle text size">
          <Type className="w-4 h-4 mr-1" /> A{textSize > 0 ? "+".repeat(textSize) : ""}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setHighContrast(!highContrast)} className="hover:bg-primary-foreground/20" aria-label="Toggle high contrast">
          <Contrast className="w-4 h-4 mr-1" /> Contrast
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setDyslexiaSpacing(!dyslexiaSpacing)} className="hover:bg-primary-foreground/20" aria-label="Toggle dyslexia spacing">
          <Space className="w-4 h-4 mr-1" /> Spacing
        </Button>
      </div>
    </div>
  );
}
