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
  // AI RECOMMENDATIONS STATE
  // ============================================
  
  /** Store AI-generated recommendations */
  const [aiTips, setAiTips] = useState<string>("");
  
  /** Show/hide target explanations */
  const [showExplanations, setShowExplanations] = useState<boolean>(false);

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
          <span style={{ fontSize: 40 }}>💪</span>
          <h1 className="brand">{t.brand}</h1>
          
          {/* Language toggle button */}
          <button
            className="btn"
            onClick={() => setLanguage(language === "en" ? "he" : "en")}
            style={{ fontSize: 20, padding: "6px 14px" }}
            aria-label="Toggle language"
          >
            {language === "en" ? "🇮🇱 עברית" : "🇺🇸 English"}
          </button>
        </div>
        <p className="tag">{t.tagline}</p>
      </header>

      <main className="main">
        {/* ============================================
            TOP ROW: THREE SECTIONS SIDE-BY-SIDE
            ============================================
            Profile, Targets, and AI Input Form */}
        <div className="grid three">
          
          {/* ===== PROFILE INPUT SECTION ===== */}
          <section className="card fade-in" style={{ 
            background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
            border: "2px solid #bae6fd"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 28 }}>👤</span>
              <h2 className="card-title" style={{ margin: 0 }}>{t.yourProfile}</h2>
            </div>
            <form className="form" onSubmit={(e) => e.preventDefault()}>
              
              {/* Sex selection */}
              <div className="field">
                <label className="label">
                  <span style={{ marginRight: isRTL ? 0 : 6, marginLeft: isRTL ? 6 : 0 }}>⚧️</span>
                  {t.sex}
                </label>
                <div className="radio-group">
                  <label className={`chip ${sex === "male" ? "chip-active" : ""}`}>
                    <input 
                      type="radio" 
                      name="sex" 
                      checked={sex === "male"} 
                      onChange={() => setSex("male")} 
                    />
                    <span>♂️</span> {t.male}
                  </label>
                  <label className={`chip ${sex === "female" ? "chip-active" : ""}`}>
                    <input 
                      type="radio" 
                      name="sex" 
                      checked={sex === "female"} 
                      onChange={() => setSex("female")} 
                    />
                    <span>♀️</span> {t.female}
                  </label>
                </div>
              </div>

              {/* Age, Height, Weight inputs */}
              <div className="form-row">
                {/* Age */}
                <div className="field">
                  <label className="label">
                    <span style={{ marginRight: isRTL ? 0 : 6, marginLeft: isRTL ? 6 : 0 }}>🎂</span>
                    {t.age}
                  </label>
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
                  <label className="label">
                    <span style={{ marginRight: isRTL ? 0 : 6, marginLeft: isRTL ? 6 : 0 }}>📏</span>
                    {t.height}
                  </label>
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
                  <label className="label">
                    <span style={{ marginRight: isRTL ? 0 : 6, marginLeft: isRTL ? 6 : 0 }}>⚖️</span>
                    {t.weight}
                  </label>
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
                <label className="label">
                  <span style={{ marginRight: isRTL ? 0 : 6, marginLeft: isRTL ? 6 : 0 }}>🏃</span>
                  {t.activityLevel}
                </label>
                <select 
                  className="select" 
                  value={activity} 
                  onChange={(e) => setActivity(e.target.value as Activity)}
                >
                  <option value="sedentary">🪑 {t.sedentary}</option>
                  <option value="light">🚶 {t.light}</option>
                  <option value="moderate">🏃 {t.moderate}</option>
                  <option value="very">🏋️ {t.very}</option>
                  <option value="athlete">🏅 {t.athlete}</option>
                </select>
              </div>

              {/* Goal selection */}
              <div className="field">
                <label className="label">
                  <span style={{ marginRight: isRTL ? 0 : 6, marginLeft: isRTL ? 6 : 0 }}>🎯</span>
                  {t.goal}
                </label>
                <div className="radio-group">
                  <label className={`chip ${goal === "cut" ? "chip-active" : ""}`}>
                    <input 
                      type="radio" 
                      name="goal" 
                      checked={goal === "cut"} 
                      onChange={() => setGoal("cut")} 
                    />
                    <span>📉</span> {t.cut}
                  </label>
                  <label className={`chip ${goal === "maintain" ? "chip-active" : ""}`}>
                    <input 
                      type="radio" 
                      name="goal" 
                      checked={goal === "maintain"} 
                      onChange={() => setGoal("maintain")} 
                    />
                    <span>➖</span> {t.maintain}
                  </label>
                  <label className={`chip ${goal === "bulk" ? "chip-active" : ""}`}>
                    <input 
                      type="radio" 
                      name="goal" 
                      checked={goal === "bulk"} 
                      onChange={() => setGoal("bulk")} 
                    />
                    <span>📈</span> {t.bulk}
                  </label>
                </div>
              </div>

              {/* Save button */}
              <div className="actions">
                <button 
                  className="btn primary" 
                  type="button" 
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  style={{ width: "100%" }}
                >
                  💾 {t.saveLocal}
                </button>
              </div>
            </form>
          </section>

          {/* ===== CALCULATED TARGETS SECTION ===== */}
          <section className="card fade-in" style={{ 
            background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
            border: "2px solid #fcd34d"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 28 }}>🎯</span>
                <h2 className="card-title" style={{ margin: 0 }}>{t.yourTargets}</h2>
              </div>
              <button 
                className="btn"
                onClick={() => setShowExplanations(!showExplanations)}
                style={{ 
                  padding: "6px 12px", 
                  fontSize: 20,
                  background: "rgba(255, 255, 255, 0.7)",
                  border: "1px solid #fbbf24"
                }}
                title={language === "en" ? "Toggle explanations" : "הצג/הסתר הסברים"}
              >
                {showExplanations ? "ℹ️" : "❓"}
              </button>
            </div>
            
            {/* Display calculated values in stat grid */}
            <div className="stats">
              <div className="stat" style={{ background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)" }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>🔥</div>
                <div className="stat-label">{t.bmr}</div>
                <div className="stat-value">{round(bmr)}</div>
                <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>kcal</div>
              </div>
              
              <div className="stat" style={{ background: "linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%)" }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>⚡</div>
                <div className="stat-label">{t.tdee}</div>
                <div className="stat-value">{round(tdee)}</div>
                <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>kcal</div>
              </div>
              
              <div className="stat stat-big" style={{ background: "linear-gradient(135deg, #6ee7b7 0%, #34d399 100%)" }}>
                <div style={{ fontSize: 28, marginBottom: 4 }}>🍽️</div>
                <div className="stat-label" style={{ color: "#064e3b" }}>{t.dailyCalories}</div>
                <div className="stat-value" style={{ color: "#064e3b", fontSize: 32 }}>{round(targetKcal)}</div>
                <div style={{ fontSize: 12, color: "#065f46", marginTop: 2, fontWeight: 600 }}>kcal/day</div>
              </div>
              
              <div className="stat" style={{ background: "linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)" }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>🥩</div>
                <div className="stat-label">{t.protein}</div>
                <div className="stat-value">{proteinG}g</div>
              </div>
              
              <div className="stat" style={{ background: "linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)" }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>🥑</div>
                <div className="stat-label">{t.fat}</div>
                <div className="stat-value">{fatG}g</div>
              </div>
              
              <div className="stat" style={{ background: "linear-gradient(135deg, #fde68a 0%, #fcd34d 100%)" }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>🍞</div>
                <div className="stat-label">{t.carbs}</div>
                <div className="stat-value">{carbsG}g</div>
              </div>
            </div>
            
            {/* Explanations Toggle */}
            {showExplanations && (
              <div style={{ 
                marginTop: 16, 
                padding: 16, 
                background: "rgba(255, 255, 255, 0.8)",
                borderRadius: 12,
                fontSize: 13,
                lineHeight: 1.6,
                border: "1px solid #fbbf24"
              }}>
                <div style={{ marginBottom: 12 }}>
                  <strong style={{ color: "#1e40af" }}>🔥 BMR:</strong> {t.bmrExplanation}
                </div>
                <div style={{ marginBottom: 12 }}>
                  <strong style={{ color: "#7c3aed" }}>⚡ TDEE:</strong> {t.tdeeExplanation}
                </div>
                <div style={{ marginBottom: 12 }}>
                  <strong style={{ color: "#059669" }}>🍽️ {t.dailyCalories}:</strong> {t.caloriesExplanation}
                </div>
                <div>
                  <strong style={{ color: "#dc2626" }}>🥩🥑🍞 {t.macros}:</strong> {t.macrosExplanation}
                </div>
              </div>
            )}
            
            {/* Formula note */}
            <p className="note" style={{ marginTop: 12, fontSize: 11 }}>{t.targetsNote}</p>
          </section>

          {/* ===== AI INPUT FORM SECTION ===== */}
          <div style={{ 
            background: "linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 100%)",
            borderRadius: 16,
            border: "2px solid #c084fc",
            overflow: "hidden"
          }}>
            <RecommendedTips
              sex={sex}
              age={age}
              heightCm={heightCm}
              weightKg={weightKg}
              activity={activity}
              goal={goal}
              allValid={allValid}
              language={language}
              onTipsGenerated={setAiTips}
            />
          </div>
        </div>

        {/* ============================================
            BOTTOM ROW: AI RESULTS SECTION
            ============================================
            Full-width dynamic display of AI recommendations */}
        {aiTips && (
          <div style={{ marginTop: 32, width: "100%", maxWidth: "1400px" }}>
            <section 
              className="card fade-in" 
              dir={isRTL ? "rtl" : "ltr"}
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                boxShadow: "0 20px 60px rgba(102, 126, 234, 0.4)",
                border: "none",
                padding: 32,
              }}
            >
              {/* Section Header */}
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 16, 
                marginBottom: 24,
                paddingBottom: 20,
                borderBottom: "3px solid rgba(255, 255, 255, 0.3)",
              }}>
                <span style={{ fontSize: 42 }}>💡</span>
                <h2 style={{ 
                  color: "white", 
                  margin: 0, 
                  fontSize: 28,
                  fontWeight: 700,
                  textShadow: "0 2px 4px rgba(0,0,0,0.2)"
                }}>
                  {t.yourRecommendations}
                </h2>
              </div>
              
              {/* AI Recommendations Content Box */}
              <div 
                style={{ 
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  lineHeight: "1.9",
                  fontSize: "16px",
                  padding: "28px",
                  backgroundColor: "rgba(255, 255, 255, 0.98)",
                  borderRadius: "16px",
                  color: "#1f2937",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                  minHeight: "250px",
                  maxWidth: "100%",
                  overflow: "visible",
                }}
              >
                {aiTips.split('\n').map((line, index) => {
                  const trimmedLine = line.trim();
                  
                  if (!trimmedLine) {
                    return <div key={index} style={{ height: 14 }} />;
                  }
                  
                  if (trimmedLine.startsWith('-')) {
                    return (
                      <div 
                        key={index} 
                        style={{ 
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 14,
                          marginBottom: 16,
                          paddingLeft: isRTL ? 0 : 10,
                          paddingRight: isRTL ? 10 : 0,
                        }}
                      >
                        <span style={{ 
                          color: "#667eea", 
                          fontWeight: "bold",
                          fontSize: 22,
                          flexShrink: 0,
                          marginTop: 3,
                        }}>
                          {isRTL ? "◄" : "►"}
                        </span>
                        <span style={{ 
                          flex: 1,
                          wordBreak: "break-word",
                          overflowWrap: "break-word",
                        }}>
                          {trimmedLine.replace(/^-\s*/, '')}
                        </span>
                      </div>
                    );
                  }
                  
                  if (trimmedLine.length < 60 && trimmedLine.match(/^[A-Z\u0590-\u05FF]/) && !trimmedLine.includes('.')) {
                    return (
                      <div 
                        key={index}
                        style={{
                          fontWeight: "700",
                          fontSize: 20,
                          color: "#667eea",
                          marginTop: index > 0 ? 24 : 0,
                          marginBottom: 14,
                          wordBreak: "break-word",
                          overflowWrap: "break-word",
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <span style={{ fontSize: 24 }}>🎯</span>
                        {trimmedLine}
                      </div>
                    );
                  }
                  
                  return (
                    <div 
                      key={index} 
                      style={{ 
                        marginBottom: 12,
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                        maxWidth: "100%",
                      }}
                    >
                      {trimmedLine}
                    </div>
                  );
                })}
              </div>
              
              {/* Footer Note */}
              <div 
                style={{ 
                  marginTop: 24, 
                  fontSize: 15, 
                  color: "rgba(255, 255, 255, 0.95)",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "16px 20px",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: "12px",
                  backdropFilter: "blur(10px)",
                }}
              >
                <span style={{ fontSize: 26, flexShrink: 0 }}>💭</span>
                <span style={{ 
                  flex: 1,
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}>
                  {t.recommendationsNote}
                </span>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* ============================================
          FOOTER
          ============================================
          Legal disclaimer */}
      <footer className="site-footer" style={{ marginTop: 40 }}>
        ⚠️ {t.disclaimer}
      </footer>
    </div>
  );
}

// ============================================
// STAT COMPONENT (Not used anymore - integrated inline)
// ============================================

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

