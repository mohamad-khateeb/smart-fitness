/**
 * ============================================
 * PROFILE FORM COMPONENT
 * ============================================
 * User profile input form (gender, age, height, weight, activity, goal)
 */

import React from "react";
import type { Sex, Activity, Goal, ValidationState } from "../types";
import type { Language } from "../translations";
import { translations } from "../translations";

interface ProfileFormProps {
  sex: Sex;
  setSex: (sex: Sex) => void;
  age: number;
  setAge: (age: number) => void;
  heightCm: number;
  setHeightCm: (height: number) => void;
  weightKg: number;
  setWeightKg: (weight: number) => void;
  activity: Activity;
  setActivity: (activity: Activity) => void;
  goal: Goal;
  setGoal: (goal: Goal) => void;
  valid: ValidationState;
  language: Language;
}

export default function ProfileForm({
  sex,
  setSex,
  age,
  setAge,
  heightCm,
  setHeightCm,
  weightKg,
  setWeightKg,
  activity,
  setActivity,
  goal,
  setGoal,
  valid,
  language,
}: ProfileFormProps) {
  const t = translations[language];
  const isRTL = language === "he";

  return (
    <section
      className="card fade-in"
      style={{
        background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
        border: "2px solid #bae6fd",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 28 }}>👤</span>
        <h2 className="card-title" style={{ margin: 0 }}>
          {t.yourProfile}
        </h2>
      </div>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        {/* Gender selection */}
        <div className="field">
          <label className="label">
            <span style={{ marginRight: isRTL ? 0 : 6, marginLeft: isRTL ? 6 : 0 }}>
              ⚧️
            </span>
            {t.gender}
          </label>
          <div className="radio-group">
            <label className={`chip ${sex === "male" ? "chip-active" : ""}`}>
              <input
                type="radio"
                name="gender"
                checked={sex === "male"}
                onChange={() => setSex("male")}
              />
              <span>♂️</span> {t.male}
            </label>
            <label className={`chip ${sex === "female" ? "chip-active" : ""}`}>
              <input
                type="radio"
                name="gender"
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
              <span style={{ marginRight: isRTL ? 0 : 6, marginLeft: isRTL ? 6 : 0 }}>
                🎂
              </span>
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
              <span style={{ marginRight: isRTL ? 0 : 6, marginLeft: isRTL ? 6 : 0 }}>
                📏
              </span>
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
              <span style={{ marginRight: isRTL ? 0 : 6, marginLeft: isRTL ? 6 : 0 }}>
                ⚖️
              </span>
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
            <span style={{ marginRight: isRTL ? 0 : 6, marginLeft: isRTL ? 6 : 0 }}>
              🏃
            </span>
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
            <span style={{ marginRight: isRTL ? 0 : 6, marginLeft: isRTL ? 6 : 0 }}>
              🎯
            </span>
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
  );
}