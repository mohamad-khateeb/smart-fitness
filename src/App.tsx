/**
 * ============================================
 * SMART FITNESS - MAIN APPLICATION
 * ============================================
 * 
 * A React-based fitness tracking app with AI-powered recommendations
 * 
 * Features:
 * - User profile management (sex, age, height, weight, activity, goal)
 * - Automatic BMR/TDEE/macro calculations
 * - Multi-language support (English/Hebrew with RTL)
 * - LocalStorage persistence
 * - AI-powered personalized fitness recommendations
 * - Responsive grid layout
 * 
 * Calculations:
 * - BMR: Mifflin-St Jeor equation
 * - TDEE: BMR × activity multiplier
 * - Macros: Goal-based (Cut -20%, Maintain 0%, Bulk +10%)
 * 
 * Dependencies:
 * - React 18+
 * - TypeScript
 * - Custom CSS (App.css)
 */

import React, { useMemo, useState, useEffect } from "react";
import "./App.css";
import RecommendedTips from "./components/RecommendedTips";
import { translations, type Language } from "./translations.ts";

/**
 * Main App Component
 * Manages all state and calculations for the fitness app
 */
export default function App() {
  // ============================================
  // TYPE DEFINITIONS
  // ============================================
  
  /** User's biological sex (affects BMR calculation) */
  type Sex = "male" | "female";
  
  /** Activity level (affects TDEE multiplier) */
  type Activity = "sedentary" | "light" | "moderate" | "very" | "athlete";
  
  /** Fitness goal (affects calorie target) */
  type Goal = "cut" | "maintain" | "bulk";

  // ============================================
  // LANGUAGE STATE
  // ============================================
  
  /** Current UI language (default: English) */
  const [language, setLanguage] = useState<Language>("en");
  
  /** Get translations for current language */
  const t = translations[language];
  
  /** Check if RTL (Right-to-Left) layout is needed */
  const isRTL = language === "he";

  // ============================================
  // FORM STATE
  // ============================================
  
  /** User's biological sex */
  const [sex, setSex] = useState<Sex>("male");
  
  /** User's age in years (11-99) */
  const [age, setAge] = useState<number>(27);
  
  /** User's height in centimeters (120-230) */
  const [heightCm, setHeightCm] = useState<number>(172);
  
  /** User's weight in kilograms (35-240) */
  const [weightKg, setWeightKg] = useState<number>(86);
  
  /** User's activity level */
  const [activity, setActivity] = useState<Activity>("moderate");
  
  /** User's fitness goal */
  const [goal, setGoal] = useState<Goal>("cut");

  // ============================================
  // LOCALSTORAGE PERSISTENCE
  // ============================================
  
  /**
   * Load saved form data from localStorage on mount
   * Allows users to close and return without losing data
   */
  useEffect(() => {
    const saved = localStorage.getItem("smartFitnessForm");
    if (saved) {
      try {
        const s = JSON.parse(saved);
        setSex(s.sex ?? "male");
        setAge(Number(s.age ?? 27));
        setHeightCm(Number(s.heightCm ?? 172));
        setWeightKg(Number(s.weightKg ?? 86));
        setActivity(s.activity ?? "moderate");
        setGoal(s.goal ?? "cut");
        setLanguage(s.language ?? "en");
      } catch (error) {
        console.error("Failed to load saved data:", error);
      }
    }
  }, []);

  /**
   * Save form data to localStorage whenever it changes
   * Also updates HTML attributes for RTL/language support
   */
  useEffect(() => {
    localStorage.setItem(
      "smartFitnessForm",
      JSON.stringify({ sex, age, heightCm, weightKg, activity, goal, language })
    );
    
    // Update HTML direction for RTL support
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    
    // Update HTML lang attribute for accessibility
    document.documentElement.lang = language;
  }, [sex, age, heightCm, weightKg, activity, goal, language, isRTL]);

  // ============================================
  // INPUT VALIDATION
  // ============================================
  
  /**
   * Validation rules for each input field
   * Used to show error messages and disable submit
   */
  const valid = useMemo(
    () => ({
      age: age >= 11 && age <= 99,          // Reasonable age range
      height: heightCm >= 120 && heightCm <= 230,  // Reasonable height range
      weight: weightKg >= 35 && weightKg <= 240,   // Reasonable weight range
    }),
    [age, heightCm, weightKg]
  );

  /** True if all inputs are valid */
  const allValid = useMemo(
    () => valid.age && valid.height && valid.weight,
    [valid]
  );

  // ============================================
  // BMR CALCULATION (Mifflin-St Jeor Equation)
  // ============================================
  
  /**
   * Calculate Basal Metabolic Rate
   * The number of calories your body burns at rest
   * 
   * Formula:
   * Men:   BMR = 10×weight + 6.25×height - 5×age + 5
   * Women: BMR = 10×weight + 6.25×height - 5×age - 161
   */
  const bmr = useMemo(() => {
    if (!allValid) return 0;
    const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
    return sex === "male" ? base + 5 : base - 161;
  }, [sex, age, heightCm, weightKg, allValid]);

  // ============================================
  // TDEE CALCULATION
  // ============================================
  
  /**
   * Activity multipliers for TDEE calculation
   * Based on typical exercise frequency/intensity
   */
  const activityMultipliers: Record<Activity, number> = {
    sedentary: 1.2,    // Little to no exercise
    light: 1.375,      // 1-3 days/week
    moderate: 1.55,    // 3-5 days/week
    very: 1.725,       // 6-7 days/week
    athlete: 1.9,      // 2× daily training
  };

  /**
   * Calculate Total Daily Energy Expenditure
   * The total calories you burn in a day including activity
   * 
   * Formula: TDEE = BMR × Activity Multiplier
   */
  const tdee = useMemo(
    () => bmr * activityMultipliers[activity],
    [bmr, activity, activityMultipliers]
  );

  // ============================================
  // CALORIE TARGET CALCULATION
  // ============================================
  
  /**
   * Calculate daily calorie target based on goal
   * 
   * Goals:
   * - Cut (lose fat): -20% from TDEE
   * - Maintain: Equal to TDEE
   * - Bulk (gain muscle): +10% from TDEE
   */
  const targetKcal = useMemo(() => {
    switch (goal) {
      case "cut":
        return tdee * 0.8;     // -20%
      case "maintain":
        return tdee;           // 0%
      case "bulk":
        return tdee * 1.1;     // +10%
      default:
        return tdee;
    }
  }, [tdee, goal]);

  // ============================================
  // MACRO CALCULATIONS
  // ============================================
  
  /**
   * Calculate daily protein target
   * High protein (2.2g/kg) for muscle preservation/growth
   */
  const proteinG = useMemo(
    () => Math.round(weightKg * 2.2),
    [weightKg]
  );

  /**
   * Calculate daily fat target
   * 25% of total calories (essential for hormones)
   * 1g fat = 9 calories
   */
  const fatG = useMemo(
    () => Math.round((targetKcal * 0.25) / 9),
    [targetKcal]
  );

  /**
   * Calculate daily carb target
   * Remainder after protein and fat
   * 1g carb = 4 calories, 1g protein = 4 calories
   */
  const carbsG = useMemo(
    () => Math.round((targetKcal - proteinG * 4 - fatG * 9) / 4),
    [targetKcal, proteinG, fatG]
  );

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================
  
  /**
   * Round number to nearest integer
   * Used for displaying clean calorie values
   */
  function round(n: number): number {
    return Math.round(n);
  }

  // ============================================
  // COMPONENT RENDER
  // ============================================
  
  return (
    <div className="app-shell" dir={isRTL ? "rtl" : "ltr"}>
      {/* ============================================
          HEADER SECTION
          ============================================
          App title and language toggle */}
      <header className="site-header">
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          gap: 12, 
          marginBottom: 8 
        }}>
          <h1 className="brand">{t.brand}</h1>
          
          {/* Language toggle button */}
          <button
            className="btn"
            onClick={() => setLanguage(language === "en" ? "he" : "en")}
            style={{ fontSize: 20, padding: "4px 12px" }}
            aria-label="Toggle language"
          >
            {language === "en" ? "🇮🇱 עברית" : "🇺🇸 English"}
          </button>
        </div>
        <p className="tag">{t.tagline}</p>
      </header>

      <main className="main">
        {/* ============================================
            PROFILE & TARGETS ROW
            ============================================
            Two-column grid for profile input and calculated results */}
        <div className="grid two">
          
          {/* ===== PROFILE INPUT SECTION ===== */}
          <section className="card fade-in">
            <h2 className="card-title">{t.yourProfile}</h2>
            <form className="form" onSubmit={(e) => e.preventDefault()}>
              
              {/* Sex selection */}
              <div className="field">
                <label className="label">{t.sex}</label>
                <div className="radio-group">
                  <label className={`chip ${sex === "male" ? "chip-active" : ""}`}>
                    <input 
                      type="radio" 
                      name="sex" 
                      checked={sex === "male"} 
                      onChange={() => setSex("male")} 
                    />
                    {t.male}
                  </label>
                  <label className={`chip ${sex === "female" ? "chip-active" : ""}`}>
                    <input 
                      type="radio" 
                      name="sex" 
                      checked={sex === "female"} 
                      onChange={() => setSex("female")} 
                    />
                    {t.female}
                  </label>
                </div>
              </div>

              {/* Age, Height, Weight inputs */}
              <div className="form-row">
                {/* Age */}
                <div className="field">
                  <label className="label">{t.age}</label>
                  <input
                    type="number"
                    className={`input ${!valid.age ? "input-error" : ""}`}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    min={11}
                    max={99}
                  />
                  {!valid.age && <div className="help">{t.ageValidation}</div>}
                </div>

                {/* Height */}
                <div className="field">
                  <label className="label">{t.height}</label>
                  <input
                    type="number"
                    className={`input ${!valid.height ? "input-error" : ""}`}
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    min={120}
                    max={230}
                  />
                  {!valid.height && <div className="help">{t.heightValidation}</div>}
                </div>

                {/* Weight */}
                <div className="field">
                  <label className="label">{t.weight}</label>
                  <input
                    type="number"
                    className={`input ${!valid.weight ? "input-error" : ""}`}
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    min={35}
                    max={240}
                  />
                  {!valid.weight && <div className="help">{t.weightValidation}</div>}
                </div>
              </div>

              {/* Activity level */}
              <div className="field">
                <label className="label">{t.activityLevel}</label>
                <select 
                  className="select" 
                  value={activity} 
                  onChange={(e) => setActivity(e.target.value as Activity)}
                >
                  <option value="sedentary">{t.sedentary}</option>
                  <option value="light">{t.light}</option>
                  <option value="moderate">{t.moderate}</option>
                  <option value="very">{t.very}</option>
                  <option value="athlete">{t.athlete}</option>
                </select>
              </div>

              {/* Goal selection */}
              <div className="field">
                <label className="label">{t.goal}</label>
                <div className="radio-group">
                  {["cut", "maintain", "bulk"].map((g) => (
                    <label 
                      key={g} 
                      className={`chip ${goal === g ? "chip-active" : ""}`}
                    >
                      <input 
                        type="radio" 
                        name="goal" 
                        checked={goal === g} 
                        onChange={() => setGoal(g as Goal)} 
                      />
                      {t[g as Goal]}
                    </label>
                  ))}
                </div>
              </div>

              {/* Save button (scroll to top) */}
              <div className="actions">
                <button 
                  className="btn primary" 
                  type="button" 
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                  {t.saveLocal}
                </button>
              </div>
            </form>
          </section>

          {/* ===== CALCULATED TARGETS SECTION ===== */}
          <section className="card fade-in">
            <h2 className="card-title">{t.yourTargets}</h2>
            
            {/* Display calculated values in stat grid */}
            <div className="stats">
              <Stat label={t.bmr} value={`${round(bmr)} kcal`} />
              <Stat label={t.tdee} value={`${round(tdee)} kcal`} />
              <Stat big label={t.dailyCalories} value={`${round(targetKcal)} kcal`} />
              <Stat label={t.protein} value={`${proteinG} g`} />
              <Stat label={t.fat} value={`${fatG} g`} />
              <Stat label={t.carbs} value={`${carbsG} g`} />
            </div>
            
            {/* Formula explanation note */}
            <p className="note">{t.targetsNote}</p>
          </section>
        </div>

        {/* ============================================
            AI RECOMMENDATIONS ROW
            ============================================
            Full-width section for AI-powered tips */}
        <div className="grid two" style={{ marginTop: 20 }}>
          <RecommendedTips
            sex={sex}
            age={age}
            heightCm={heightCm}
            weightKg={weightKg}
            activity={activity}
            goal={goal}
            allValid={allValid}
            language={language}
          />
        </div>
      </main>

      {/* ============================================
          FOOTER
          ============================================
          Legal disclaimer */}
      <footer className="site-footer">{t.disclaimer}</footer>
    </div>
  );
}

// ============================================
// STAT COMPONENT
// ============================================

/**
 * Reusable stat display component
 * Shows a label and value in a styled card
 * 
 * @param label - Stat name (e.g., "BMR", "TDEE")
 * @param value - Stat value (e.g., "1800 kcal")
 * @param big - Optional: Make this stat larger/prominent
 */
function Stat({ 
  label, 
  value, 
  big = false 
}: { 
  label: string; 
  value: string; 
  big?: boolean;
}) {
  return (
    <div className={`stat ${big ? "stat-big" : ""}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}

