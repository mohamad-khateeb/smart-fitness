// =========================
// src/App.tsx (React + TS)
// =========================
import React, { useMemo, useState, useEffect } from "react";
import "./App.css";
import RecommendedTips from "./components/RecommendedTips";
import { translations, type Language } from "./translations.ts";

export default function App() {
  type Sex = "male" | "female";
  type Activity = "sedentary" | "light" | "moderate" | "very" | "athlete";
  type Goal = "cut" | "maintain" | "bulk";

  // Language state
  const [language, setLanguage] = useState<Language>("en");
  const t = translations[language];
  const isRTL = language === "he";

  // --- Form State ---
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState<number>(27);
  const [heightCm, setHeightCm] = useState<number>(172);
  const [weightKg, setWeightKg] = useState<number>(86);
  const [activity, setActivity] = useState<Activity>("moderate");
  const [goal, setGoal] = useState<Goal>("cut");

  // Persist to localStorage
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
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "smartFitnessForm",
      JSON.stringify({ sex, age, heightCm, weightKg, activity, goal, language })
    );
    // Update HTML dir attribute for RTL support
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [sex, age, heightCm, weightKg, activity, goal, language, isRTL]);

  const activityFactor: Record<Activity, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very: 1.725,
    athlete: 1.9,
  };

  const valid = useMemo(() => ({
    age: age >= 11 && age <= 99,
    height: heightCm >= 120 && heightCm <= 230,
    weight: weightKg >= 35 && weightKg <= 240,
  }), [age, heightCm, weightKg]);

  const allValid = valid.age && valid.height && valid.weight;

  // --- Calculations ---
  const { bmr, tdee, targetKcal, proteinG, fatG, carbsG } = useMemo(() => {
    if (!allValid) return { bmr: 0, tdee: 0, targetKcal: 0, proteinG: 0, fatG: 0, carbsG: 0 };

    // Mifflin–St Jeor
    const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
    const bmr = sex === "male" ? base + 5 : base - 161;
    const tdee = bmr * activityFactor[activity];

    // Goal calories
    let target = tdee;
    if (goal === "cut") target = tdee * 0.8; // ~20% deficit
    if (goal === "bulk") target = tdee * 1.1; // ~10% surplus

    // Macro splits (simple, realistic defaults)
    const proteinPerKg = goal === "bulk" ? 2.2 : goal === "maintain" ? 1.8 : 2.0;
    const fatPerKg = goal === "bulk" ? 1.0 : 0.8;

    const pCalories = proteinPerKg * weightKg * 4;
    const fCalories = fatPerKg * weightKg * 9;
    const cCalories = Math.max(0, target - (pCalories + fCalories));

    const proteinG = Math.round(pCalories / 4);
    const fatG = Math.round(fCalories / 9);
    const carbsG = Math.round(cCalories / 4);

    return { bmr, tdee, targetKcal: target, proteinG, fatG, carbsG };
  }, [allValid, sex, age, heightCm, weightKg, activity, goal]);

  const round = (n: number) => Math.round(n);

  return (
    <div className="app-shell" dir={isRTL ? "rtl" : "ltr"}>
      <header className="site-header">
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <h1 className="brand">{t.brand}</h1>
          <button
            className="btn"
            onClick={() => setLanguage(language === "en" ? "he" : "en")}
            style={{ fontSize: 20, padding: "4px 12px" }}
          >
            {language === "en" ? "🇮🇱 עברית" : "🇺🇸 English"}
          </button>
        </div>
        <p className="tag">{t.tagline}</p>
      </header>

      <main className="main">
        <div className="grid two">
          <section className="card fade-in">
            <h2 className="card-title">{t.yourProfile}</h2>
            <form className="form" onSubmit={(e) => e.preventDefault()}>
              {/* Sex */}
              <div className="field">
                <label className="label">{t.sex}</label>
                <div className="radio-group">
                  <label className={`chip ${sex === "male" ? "chip-active" : ""}`}>
                    <input type="radio" name="sex" checked={sex === "male"} onChange={() => setSex("male")} />
                    {t.male}
                  </label>
                  <label className={`chip ${sex === "female" ? "chip-active" : ""}`}>
                    <input type="radio" name="sex" checked={sex === "female"} onChange={() => setSex("female")} />
                    {t.female}
                  </label>
                </div>
              </div>

              {/* Age / Height / Weight */}
              <div className="form-row">
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

              {/* Activity */}
              <div className="field">
                <label className="label">{t.activityLevel}</label>
                <select className="select" value={activity} onChange={(e) => setActivity(e.target.value as Activity)}>
                  <option value="sedentary">{t.sedentary}</option>
                  <option value="light">{t.light}</option>
                  <option value="moderate">{t.moderate}</option>
                  <option value="very">{t.very}</option>
                  <option value="athlete">{t.athlete}</option>
                </select>
              </div>

              {/* Goal */}
              <div className="field">
                <label className="label">{t.goal}</label>
                <div className="radio-group">
                  {["cut", "maintain", "bulk"].map((g) => (
                    <label key={g} className={`chip ${goal === g ? "chip-active" : ""}`}>
                      <input type="radio" name="goal" checked={goal === g} onChange={() => setGoal(g as Goal)} />
                      {t[g as Goal]}
                    </label>
                  ))}
                </div>
              </div>

              <div className="actions">
                <button className="btn primary" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                  {t.saveLocal}
                </button>
              </div>
            </form>
          </section>

          <section className="card fade-in">
            <h2 className="card-title">{t.yourTargets}</h2>
            <div className="stats">
              <Stat label={t.bmr} value={`${round(bmr)} kcal`} />
              <Stat label={t.tdee} value={`${round(tdee)} kcal`} />
              <Stat big label={t.dailyCalories} value={`${round(targetKcal)} kcal`} />
              <Stat label={t.protein} value={`${proteinG} g`} />
              <Stat label={t.fat} value={`${fatG} g`} />
              <Stat label={t.carbs} value={`${carbsG} g`} />
            </div>
            <p className="note">{t.targetsNote}</p>
          </section>
        </div>

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

      <footer className="site-footer">{t.disclaimer}</footer>
    </div>
  );
}

function Stat({ label, value, big = false }: { label: string; value: string; big?: boolean }) {
  return (
    <div className={`stat ${big ? "stat-big" : ""}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}

