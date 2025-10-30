/**
 * ============================================
 * SMART FITNESS - MAIN APPLICATION
 * ============================================
 * 
 * Main app component that orchestrates all sub-components
 */

import React, { useMemo, useState, useEffect } from "react";
import "./App.css";
import ProfileForm from "./components/ProfileForm";
import TargetsDisplay from "./components/TargetsDisplay";
import RecommendedTips from "./components/RecommendedTips";
import AIResultsDisplay from "./components/AIResultsDisplay";
import { translations, type Language } from "./translations";
import type { Sex, Activity, Goal, UserProfile } from "./types";
import {
  calculateBMR,
  calculateTDEE,
  calculateTargetCalories,
  calculateProtein,
  calculateFat,
  calculateCarbs,
} from "./utils/calculations";
import { validateInputs, isAllValid } from "./utils/validation";

export default function App() {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  
  const [language, setLanguage] = useState<Language>("en");
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState<number>(27);
  const [heightCm, setHeightCm] = useState<number>(172);
  const [weightKg, setWeightKg] = useState<number>(82);
  const [activity, setActivity] = useState<Activity>("moderate");
  const [goal, setGoal] = useState<Goal>("cut");
  const [aiTips, setAiTips] = useState<string>("");

  const t = translations[language];
  const isRTL = language === "he";

  // ============================================
  // LOCALSTORAGE PERSISTENCE
  // ============================================
  
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

  useEffect(() => {
    localStorage.setItem(
      "smartFitnessForm",
      JSON.stringify({ sex, age, heightCm, weightKg, activity, goal, language })
    );
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [sex, age, heightCm, weightKg, activity, goal, language, isRTL]);

  // ============================================
  // VALIDATION & CALCULATIONS
  // ============================================
  
  const valid = useMemo(
    () => validateInputs(age, heightCm, weightKg),
    [age, heightCm, weightKg]
  );

  const allValid = useMemo(() => isAllValid(valid), [valid]);

  const targets = useMemo(() => {
    if (!allValid) {
      return { bmr: 0, tdee: 0, targetKcal: 0, proteinG: 0, fatG: 0, carbsG: 0 };
    }

    const bmr = calculateBMR(sex, age, heightCm, weightKg);
    const tdee = calculateTDEE(bmr, activity);
    const targetKcal = calculateTargetCalories(tdee, goal);
    const proteinG = calculateProtein(weightKg);
    const fatG = calculateFat(targetKcal);
    const carbsG = calculateCarbs(targetKcal, proteinG, fatG);

    return { bmr, tdee, targetKcal, proteinG, fatG, carbsG };
  }, [sex, age, heightCm, weightKg, activity, goal, allValid]);

  // ============================================
  // RENDER
  // ============================================
  
  return (
    <div className="app-shell" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="site-header">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 12,
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 40 }}>💪</span>
          <h1 className="brand">{t.brand}</h1>
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
        {/* Top Row: Profile, Targets, AI Input */}
        <div className="grid three">
          <ProfileForm
            sex={sex}
            setSex={setSex}
            age={age}
            setAge={setAge}
            heightCm={heightCm}
            setHeightCm={setHeightCm}
            weightKg={weightKg}
            setWeightKg={setWeightKg}
            activity={activity}
            setActivity={setActivity}
            goal={goal}
            setGoal={setGoal}
            valid={valid}
            language={language}
          />

          <TargetsDisplay targets={targets} language={language} />

          <div
            style={{
              background: "linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 100%)",
              borderRadius: 16,
              border: "2px solid #c084fc",
              overflow: "hidden",
            }}
          >
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

        {/* Bottom Row: AI Results */}
        <AIResultsDisplay aiTips={aiTips} language={language} />
      </main>

      {/* Footer */}
      <footer className="site-footer" style={{ marginTop: 40 }}>
        ⚠️ {t.disclaimer}
      </footer>
    </div>
  );
}

