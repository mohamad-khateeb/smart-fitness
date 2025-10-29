/**
 * ============================================
 * RECOMMENDED TIPS COMPONENT
 * ============================================
 * 
 * This component handles AI-powered personalized fitness recommendations.
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
 * 
 * Usage:
 * <RecommendedTips 
 *   sex="male" 
 *   age={27} 
 *   heightCm={172}
 *   weightKg={86}
 *   activity="moderate"
 *   goal="cut"
 *   allValid={true}
 *   language="en"
 * />
 */

import React, { useState } from "react";
import { translations } from "../translations.ts";
import type { Language } from "../translations.ts";

/**
 * Component props type definition
 * All profile data required to generate personalized recommendations
 */
type ProfileProps = {
  sex: "male" | "female";           // User's biological sex
  age: number;                      // User's age (11-99)
  heightCm: number;                 // Height in centimeters (120-230)
  weightKg: number;                 // Weight in kilograms (35-240)
  activity: string;                 // Activity level (sedentary/light/moderate/very/athlete)
  goal: string;                     // Fitness goal (cut/maintain/bulk)
  allValid: boolean;                // Whether all form inputs are valid
  language: Language;               // UI language (en/he)
};

/**
 * Main component function
 */
export default function RecommendedTips({
  sex,
  age,
  heightCm,
  weightKg,
  activity,
  goal,
  allValid,
  language,
}: ProfileProps) {
  // ============================================
  // STATE & TRANSLATIONS
  // ============================================
  
  /** Get translations for current language */
  const t = translations[language];
  
  /** Check if RTL (Right-to-Left) layout is needed for Hebrew */
  const isRTL = language === "he";

  /** User's custom prompt/instructions for the AI */
  const [tipsPrompt, setTipsPrompt] = useState<string>("");
  
  /** AI-generated or fallback recommendations text */
  const [aiTips, setAiTips] = useState<string>("");
  
  /** Loading state while waiting for AI response */
  const [tipsLoading, setTipsLoading] = useState<boolean>(false);
  
  /** Error message to display if request fails */
  const [tipsError, setTipsError] = useState<string | null>(null);

  // ============================================
  // API REQUEST HANDLER
  // ============================================
  
  /**
   * Request AI-powered recommendations from the server
   * 
   * Flow:
   * 1. Validate user inputs
   * 2. Send profile data + language to server
   * 3. Server calls OpenAI API with localized prompt
   * 4. Display AI response or fallback recommendations
   * 
   * Error handling:
   * - Network errors → fallback recommendations
   * - Server errors → fallback recommendations
   * - Invalid inputs → error message
   */
  async function requestTips() {
    console.log("=== Starting requestTips ===");
    
    // Reset previous state
    setTipsError(null);
    setAiTips("");
    
    // Validate all profile inputs are correct
    if (!allValid) {
      console.log("Validation failed - allValid is false");
      setTipsError(t.fixInputs);
      return;
    }
    
    // Show loading state
    setTipsLoading(true);
    
    try {
      // Build request payload with all profile data
      const payload = { 
        sex, 
        age, 
        heightCm, 
        weightKg, 
        activity, 
        goal, 
        prompt: tipsPrompt,
        language  // Tell server what language to use for AI response
      };
      console.log("Request payload:", payload);
      
      // Send POST request to Express server
      console.log("Fetching from:", "http://localhost:3001/api/recommend");
      const res = await fetch("http://localhost:3001/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      console.log("Response status:", res.status);
      console.log("Response ok:", res.ok);
      
      // Handle successful response
      if (res.ok) {
        const data = await res.json();
        console.log("Response data:", data);
        
        // Extract tips from response (handle different formats)
        setAiTips(typeof data === "string" ? data : data.tips ?? JSON.stringify(data));
        console.log("Tips set successfully");
      } 
      // Handle server error response
      else {
        const errorText = await res.text();
        console.error("Server error response:", errorText);
        setTipsError(`Server error: ${res.status}`);
        
        // Use fallback recommendations when server fails
        setAiTips(generateFallbackTips(payload));
        console.log("Using fallback tips due to server error");
      }
    } 
    // Handle network or unexpected errors
    catch (err: any) {
      console.error("Request failed with error:", err);
      console.error("Error details:", {
        message: err?.message,
        name: err?.name,
        stack: err?.stack
      });
      
      setTipsError(err?.message ?? t.fixInputs);
      
      // Use fallback recommendations when request fails
      setAiTips(generateFallbackTips({ 
        sex, age, heightCm, weightKg, activity, goal, prompt: tipsPrompt 
      }));
      console.log("Using fallback tips due to request failure");
    } 
    // Always hide loading state when done
    finally {
      setTipsLoading(false);
      console.log("=== requestTips completed ===");
    }
  }

  // ============================================
  // FALLBACK RECOMMENDATIONS GENERATOR
  // ============================================
  
  /**
   * Generate rule-based fitness recommendations
   * 
   * Used when:
   * - AI service is unavailable
   * - Network request fails
   * - OpenAI quota exceeded
   * 
   * Provides basic, goal-specific advice based on:
   * - User's fitness goal (cut/maintain/bulk)
   * - Current language (English/Hebrew)
   * 
   * @param data - User profile data
   * @returns Formatted recommendation text
   */
  function generateFallbackTips(data: any): string {
    const lines: string[] = [];
    
    // ============================================
    // HEBREW RECOMMENDATIONS
    // ============================================
    if (language === "he") {
      // Profile summary
      lines.push(
        `פרופיל: ${data.sex === "male" ? "זכר" : "נקבה"}, ` +
        `${data.age} שנים, ${data.heightCm} ס״מ, ${data.weightKg} ק״ג, ` +
        `פעילות=${data.activity}, מטרה=${data.goal}`
      );
      
      // Goal-specific recommendations
      if (data.goal === "cut") {
        // Weight loss recommendations
        lines.push("- שאף לגירעון קלורי של כ-20% מ-TDEE. תעדוף חלבון (1.8-2.2 גרם/ק״ג).");
        lines.push("- העדף אימוני התנגדות 3 פעמים בשבוע + 1-2 אימוני אירובי.");
      } else if (data.goal === "bulk") {
        // Muscle gain recommendations
        lines.push("- עודף קלורי קטן (~+10%). תעדוף אימוני כוח עם עומס פרוגרסיבי.");
        lines.push("- חלבון ~2.0-2.2 גרם/ק״ג, כלול שגרת גוף מלא או פיצול 3-5 פעמים בשבוע.");
      } else {
        // Maintenance recommendations
        lines.push("- שמור על קלוריות, התמקד במאקרו מאוזן ואימון עקבי.");
      }
      
      // General health tips
      lines.push("- הידרציה, שינה (7-9 שעות) ובדיקות התקדמות שבועיות עוזרות לעקביות.");
      
      // Include user's custom prompt if provided
      if (data.prompt) lines.push(`\nהערה (הנחיה): ${data.prompt}`);
    } 
    
    // ============================================
    // ENGLISH RECOMMENDATIONS
    // ============================================
    else {
      // Profile summary
      lines.push(
        `Profile: ${data.sex}, ${data.age}y, ${data.heightCm}cm, ` +
        `${data.weightKg}kg, activity=${data.activity}, goal=${data.goal}`
      );
      
      // Goal-specific recommendations
      if (data.goal === "cut") {
        // Weight loss recommendations
        lines.push("- Aim for ~20% calorie deficit from TDEE. Prioritize protein (1.8–2.2 g/kg).");
        lines.push("- Prefer resistance training 3×/week + 1–2 cardio sessions.");
      } else if (data.goal === "bulk") {
        // Muscle gain recommendations
        lines.push("- Small calorie surplus (~+10%). Prioritize progressive overload strength training.");
        lines.push("- Protein ~2.0–2.2 g/kg, include full-body or split routine 3–5×/week.");
      } else {
        // Maintenance recommendations
        lines.push("- Maintain calories, focus on balanced macros and consistent training.");
      }
      
      // General health tips
      lines.push("- Hydration, sleep (7–9h), and weekly progress checks help adherence.");
      
      // Include user's custom prompt if provided
      if (data.prompt) lines.push(`\nNote (prompt): ${data.prompt}`);
    }
    
    return lines.join("\n");
  }

  // ============================================
  // COMPONENT RENDER
  // ============================================
  
  return (
    <>
      {/* ============================================
          INPUT FORM SECTION
          ============================================
          User enters optional custom instructions and submits */}
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
          {/* Custom prompt textarea */}
          <div className="field">
            <label className="label">{t.customPrompt}</label>
            <textarea
              className="input"
              rows={3}
              placeholder={t.promptPlaceholder}
              value={tipsPrompt}
              onChange={(e) => setTipsPrompt(e.target.value)}
              disabled={tipsLoading}  // Disable while loading
            />
          </div>

          {/* Submit button */}
          <div className="actions">
            <button 
              className="btn primary" 
              type="submit" 
              disabled={tipsLoading || !allValid}  // Disable if loading or invalid
            >
              {tipsLoading ? t.generating : t.getRecommendations}
            </button>
          </div>

          {/* Error message display */}
          {tipsError && (
            <div className="help" style={{ marginTop: 12, color: "#dc2626" }}>
              ⚠️ {tipsError}
            </div>
          )}
        </form>
      </section>

      {/* ============================================
          RESULTS SECTION
          ============================================
          Displays AI recommendations when available */}
      {aiTips && (
        <section 
          className="card fade-in" 
          style={{ marginTop: 20 }} 
          dir={isRTL ? "rtl" : "ltr"}
        >
          <h2 className="card-title">{t.yourRecommendations}</h2>
          
          {/* Recommendations text (preserves line breaks) */}
          <div 
            style={{ 
              whiteSpace: "pre-wrap",      // Preserve line breaks and spacing
              lineHeight: "1.6",
              fontSize: "15px",
              padding: "16px",
              backgroundColor: "#f8fafc",
              borderRadius: "8px",
              border: "1px solid #e2e8f0"
            }}
          >
            {aiTips}
          </div>
          
          {/* Helpful note for users */}
          <div style={{ marginTop: 12, fontSize: 13, color: "#64748b" }}>
            {t.recommendationsNote}
          </div>
        </section>
      )}
    </>
  );
}