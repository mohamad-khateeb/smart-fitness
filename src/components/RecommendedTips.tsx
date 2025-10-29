/**
 * ============================================
 * RECOMMENDED TIPS COMPONENT
 * ============================================
 * 
 * This component handles AI-powered personalized fitness recommendations INPUT ONLY.
 * The results are displayed in the parent App component.
 * 
 * Features:
 * - Multi-language support (English/Hebrew with RTL)
 * - Real-time AI recommendations via OpenAI GPT
 * - Fallback recommendations when AI is unavailable
 * - Form validation and error handling
 * - Loading states and user feedback
 * 
 * Props:
 * - User profile data (sex, age, height, weight, activity, goal)
 * - allValid: boolean indicating if profile is complete
 * - language: current UI language (affects AI response language)
 * - onTipsGenerated: callback to send generated tips to parent
 */

import React, { useState } from "react";
import { translations } from "../translations.ts";
import type { Language } from "../translations.ts";

/**
 * Component props type definition
 */
type ProfileProps = {
  sex: "male" | "female";
  age: number;
  heightCm: number;
  weightKg: number;
  activity: string;
  goal: string;
  allValid: boolean;
  language: Language;
  onTipsGenerated: (tips: string) => void;
};

export default function RecommendedTips({
  sex,
  age,
  heightCm,
  weightKg,
  activity,
  goal,
  allValid,
  language,
  onTipsGenerated,
}: ProfileProps) {
  const t = translations[language];
  const isRTL = language === "he";

  const [tipsPrompt, setTipsPrompt] = useState<string>("");
  const [tipsLoading, setTipsLoading] = useState<boolean>(false);
  const [tipsError, setTipsError] = useState<string | null>(null);

  /**
   * Request AI recommendations from server
   */
  async function requestTips() {
    console.log("=== Starting requestTips ===");
    
    setTipsError(null);
    onTipsGenerated("");
    
    if (!allValid) {
      console.log("Validation failed");
      setTipsError(t.fixInputs);
      return;
    }
    
    setTipsLoading(true);
    
    try {
      const payload = { 
        sex, age, heightCm, weightKg, activity, goal, 
        prompt: tipsPrompt,
        language
      };
      console.log("Request payload:", payload);
      
      const res = await fetch("http://localhost:3001/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      console.log("Response status:", res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log("Response data:", data);
        const tips = typeof data === "string" ? data : data.tips ?? JSON.stringify(data);
        onTipsGenerated(tips);
        console.log("Tips set successfully");
      } else {
        const errorText = await res.text();
        console.error("Server error:", errorText);
        setTipsError(`Server error: ${res.status}`);
        onTipsGenerated(generateFallbackTips(payload));
        console.log("Using fallback tips");
      }
    } catch (err: any) {
      console.error("Request failed:", err);
      setTipsError(err?.message ?? t.fixInputs);
      onTipsGenerated(generateFallbackTips({ 
        sex, age, heightCm, weightKg, activity, goal, prompt: tipsPrompt 
      }));
    } finally {
      setTipsLoading(false);
      console.log("=== requestTips completed ===");
    }
  }

  /**
   * Generate fallback recommendations
   */
  function generateFallbackTips(data: any): string {
    const lines: string[] = [];
    
    if (language === "he") {
      lines.push(
        `פרופיל: ${data.sex === "male" ? "זכר" : "נקבה"}, ` +
        `${data.age} שנים, ${data.heightCm} ס״מ, ${data.weightKg} ק״ג, ` +
        `פעילות=${data.activity}, מטרה=${data.goal}`
      );
      
      if (data.goal === "cut") {
        lines.push("- שאף לגירעון קלורי של כ-20% מ-TDEE. תעדוף חלבון (1.8-2.2 גרם/ק״ג).");
        lines.push("- העדף אימוני התנגדות 3 פעמים בשבוע + 1-2 אימוני אירובי.");
      } else if (data.goal === "bulk") {
        lines.push("- עודף קלורי קטן (~+10%). תעדוף אימוני כוח עם עומס פרוגרסיבי.");
        lines.push("- חלבון ~2.0-2.2 גרם/ק״ג, כלול שגרת גוף מלא או פיצול 3-5 פעמים בשבוע.");
      } else {
        lines.push("- שמור על קלוריות, התמקד במאקרו מאוזן ואימון עקבי.");
      }
      
      lines.push("- הידרציה, שינה (7-9 שעות) ובדיקות התקדמות שבועיות עוזרות לעקביות.");
      if (data.prompt) lines.push(`\nהערה (הנחיה): ${data.prompt}`);
    } else {
      lines.push(
        `Profile: ${data.sex}, ${data.age}y, ${data.heightCm}cm, ` +
        `${data.weightKg}kg, activity=${data.activity}, goal=${data.goal}`
      );
      
      if (data.goal === "cut") {
        lines.push("- Aim for ~20% calorie deficit from TDEE. Prioritize protein (1.8–2.2 g/kg).");
        lines.push("- Prefer resistance training 3×/week + 1–2 cardio sessions.");
      } else if (data.goal === "bulk") {
        lines.push("- Small calorie surplus (~+10%). Prioritize progressive overload strength training.");
        lines.push("- Protein ~2.0–2.2 g/kg, include full-body or split routine 3–5×/week.");
      } else {
        lines.push("- Maintain calories, focus on balanced macros and consistent training.");
      }
      
      lines.push("- Hydration, sleep (7–9h), and weekly progress checks help adherence.");
      if (data.prompt) lines.push(`\nNote (prompt): ${data.prompt}`);
    }
    
    return lines.join("\n");
  }

  return (
    <section className="card fade-in" dir={isRTL ? "rtl" : "ltr"}>
      <h2 className="card-title">{t.recommendedTips}</h2>
      <p className="note">{t.recommendationsPrompt}</p>

      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          requestTips();
        }}
      >
        <div className="field">
          <label className="label">{t.customPrompt}</label>
          <textarea
            className="input"
            rows={3}
            placeholder={t.promptPlaceholder}
            value={tipsPrompt}
            onChange={(e) => setTipsPrompt(e.target.value)}
            disabled={tipsLoading}
          />
        </div>

        <div className="actions">
          <button 
            className="btn primary" 
            type="submit" 
            disabled={tipsLoading || !allValid}
          >
            {tipsLoading ? t.generating : t.getRecommendations}
          </button>
        </div>

        {tipsError && (
          <div className="help" style={{ marginTop: 12, color: "#dc2626" }}>
            ⚠️ {tipsError}
          </div>
        )}
      </form>
    </section>
  );
}