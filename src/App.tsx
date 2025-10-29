// =========================
// src/App.tsx (React + TS)
// =========================
import React, { useMemo, useState, useEffect } from "react";
import "./App.css";
import RecommendedTips from "./components/RecommendedTips";

export default function App() {
  type Sex = "male" | "female";
  type Activity = "sedentary" | "light" | "moderate" | "very" | "athlete";
  type Goal = "cut" | "maintain" | "bulk";

  // --- Form State ---
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState<number>(27);
  const [heightCm, setHeightCm] = useState<number>(172);
  const [weightKg, setWeightKg] = useState<number>(86);
  const [activity, setActivity] = useState<Activity>("moderate");
  const [goal, setGoal] = useState<Goal>("cut");

  // Persist to localStorage (nice UX when reloading)
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
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "smartFitnessForm",
      JSON.stringify({ sex, age, heightCm, weightKg, activity, goal })
    );
  }, [sex, age, heightCm, weightKg, activity, goal]);

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
    <div className="app-shell">
      <header className="site-header">
        <h1 className="brand">Smart Fitness</h1>
        <p className="tag">Clean, simple starter — React + CSS</p>
      </header>

      <main className="main">
        <div className="grid three">
          <section className="card fade-in">
            <h2 className="card-title">Your Profile</h2>
            <form className="form" onSubmit={(e) => e.preventDefault()}>
              {/* Sex */}
              <div className="field">
                <label className="label">Sex</label>
                <div className="radio-group">
                  <label className={`chip ${sex === "male" ? "chip-active" : ""}`}>
                    <input type="radio" name="sex" checked={sex === "male"} onChange={() => setSex("male")} />
                    Male
                  </label>
                  <label className={`chip ${sex === "female" ? "chip-active" : ""}`}>
                    <input type="radio" name="sex" checked={sex === "female"} onChange={() => setSex("female")} />
                    Female
                  </label>
                </div>
              </div>

              {/* Age / Height / Weight */}
              <div className="form-row">
                <div className="field">
                  <label className="label">Age</label>
                  <input
                    type="number"
                    className={`input ${!valid.age ? "input-error" : ""}`}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    min={11}
                    max={99}
                  />
                  {!valid.age && <div className="help">Age must be 11–99.</div>}
                </div>
                <div className="field">
                  <label className="label">Height (cm)</label>
                  <input
                    type="number"
                    className={`input ${!valid.height ? "input-error" : ""}`}
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    min={120}
                    max={230}
                  />
                  {!valid.height && <div className="help">120–230 cm.</div>}
                </div>
                <div className="field">
                  <label className="label">Weight (kg)</label>
                  <input
                    type="number"
                    className={`input ${!valid.weight ? "input-error" : ""}`}
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    min={35}
                    max={240}
                  />
                  {!valid.weight && <div className="help">35–240 kg.</div>}
                </div>
              </div>

              {/* Activity */}
              <div className="field">
                <label className="label">Activity level</label>
                <select className="select" value={activity} onChange={(e) => setActivity(e.target.value as Activity)}>
                  <option value="sedentary">Sedentary (little to no exercise)</option>
                  <option value="light">Light (1–3 days/wk)</option>
                  <option value="moderate">Moderate (3–5 days/wk)</option>
                  <option value="very">Very (6–7 days/wk)</option>
                  <option value="athlete">Athlete (2×/day training)</option>
                </select>
              </div>

              {/* Goal */}
              <div className="field">
                <label className="label">Goal</label>
                <div className="radio-group">
                  {["cut", "maintain", "bulk"].map((g) => (
                    <label key={g} className={`chip ${goal === g ? "chip-active" : ""}`}>
                      <input type="radio" name="goal" checked={goal === g} onChange={() => setGoal(g as Goal)} />
                      {g}
                    </label>
                  ))}
                </div>
              </div>

              <div className="actions">
                <button className="btn primary" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                  Save (local)
                </button>
              </div>
            </form>
          </section>

          <section className="card fade-in">
            <h2 className="card-title">Your Targets</h2>
            <div className="stats">
              <Stat label="BMR" value={`${round(bmr)} kcal`} />
              <Stat label="TDEE" value={`${round(tdee)} kcal`} />
              <Stat big label="Daily Calories" value={`${round(targetKcal)} kcal`} />
              <Stat label="Protein" value={`${proteinG} g`} />
              <Stat label="Fat" value={`${fatG} g`} />
              <Stat label="Carbs" value={`${carbsG} g`} />
            </div>
            <p className="note">Mifflin–St Jeor · TDEE = BMR × activity · Cut ≈ −20% · Bulk ≈ +10%</p>
          </section>


<RecommendedTips
  sex={sex}
  age={age}
  heightCm={heightCm}
  weightKg={weightKg}
  activity={activity}
  goal={goal}
  allValid={allValid}
/>


          
+     

        </div>

        <section className="card fade-in wide">
          <h2 className="card-title">Next steps</h2>
          <ul className="list">
            <li>Unit toggles (kg↔lb, cm↔in)</li>
            <li>Food DB + logging</li>
            <li>1‑day AI meal plan (server route)</li>
            <li>EN/HE/AR + RTL</li>
          </ul>
        </section>
      </main>

      <footer className="site-footer">Disclaimer: Informational only, not medical advice.</footer>
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

