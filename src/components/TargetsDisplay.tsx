/**
 * ============================================
 * TARGETS DISPLAY COMPONENT
 * ============================================
 * Displays calculated BMR, TDEE, calories, and macros
 */

import React, { useState } from "react";
import type { NutritionTargets } from "../types";
import type { Language } from "../translations";
import { translations } from "../translations";

interface TargetsDisplayProps {
  targets: NutritionTargets;
  language: Language;
}

export default function TargetsDisplay({ targets, language }: TargetsDisplayProps) {
  const t = translations[language];
  const [showExplanations, setShowExplanations] = useState<boolean>(false);

  const { bmr, tdee, targetKcal, proteinG, fatG, carbsG } = targets;

  return (
    <section
      className="card fade-in"
      style={{
        background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
        border: "2px solid #fcd34d",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 28 }}>🎯</span>
          <h2 className="card-title" style={{ margin: 0 }}>
            {t.yourTargets}
          </h2>
        </div>
        <button
          className="btn"
          onClick={() => setShowExplanations(!showExplanations)}
          style={{
            padding: "6px 12px",
            fontSize: 20,
            background: "rgba(255, 255, 255, 0.7)",
            border: "1px solid #fbbf24",
          }}
          title={language === "en" ? "Toggle explanations" : "הצג/הסתר הסברים"}
        >
          {showExplanations ? "ℹ️" : "❓"}
        </button>
      </div>

      {/* Display calculated values in stat grid */}
      <div className="stats">
        <div
          className="stat"
          style={{ background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)" }}
        >
          <div style={{ fontSize: 24, marginBottom: 4 }}>🔥</div>
          <div className="stat-label">{t.bmr}</div>
          <div className="stat-value">{Math.round(bmr)}</div>
          <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>kcal</div>
        </div>

        <div
          className="stat"
          style={{ background: "linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%)" }}
        >
          <div style={{ fontSize: 24, marginBottom: 4 }}>⚡</div>
          <div className="stat-label">{t.tdee}</div>
          <div className="stat-value">{Math.round(tdee)}</div>
          <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>kcal</div>
        </div>

        <div
          className="stat stat-big"
          style={{ background: "linear-gradient(135deg, #6ee7b7 0%, #34d399 100%)" }}
        >
          <div style={{ fontSize: 28, marginBottom: 4 }}>🍽️</div>
          <div className="stat-label" style={{ color: "#064e3b" }}>
            {t.dailyCalories}
          </div>
          <div className="stat-value" style={{ color: "#064e3b", fontSize: 32 }}>
            {Math.round(targetKcal)}
          </div>
          <div style={{ fontSize: 12, color: "#065f46", marginTop: 2, fontWeight: 600 }}>
            kcal/day
          </div>
        </div>

        <div
          className="stat"
          style={{ background: "linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)" }}
        >
          <div style={{ fontSize: 24, marginBottom: 4 }}>🥩</div>
          <div className="stat-label">{t.protein}</div>
          <div className="stat-value">{proteinG}g</div>
        </div>

        <div
          className="stat"
          style={{ background: "linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)" }}
        >
          <div style={{ fontSize: 24, marginBottom: 4 }}>🥑</div>
          <div className="stat-label">{t.fat}</div>
          <div className="stat-value">{fatG}g</div>
        </div>

        <div
          className="stat"
          style={{ background: "linear-gradient(135deg, #fde68a 0%, #fcd34d 100%)" }}
        >
          <div style={{ fontSize: 24, marginBottom: 4 }}>🍞</div>
          <div className="stat-label">{t.carbs}</div>
          <div className="stat-value">{carbsG}g</div>
        </div>
      </div>

      {/* Explanations Toggle */}
      {showExplanations && (
        <div
          style={{
            marginTop: 16,
            padding: 16,
            background: "rgba(255, 255, 255, 0.8)",
            borderRadius: 12,
            fontSize: 13,
            lineHeight: 1.6,
            border: "1px solid #fbbf24",
          }}
        >
          <div style={{ marginBottom: 12 }}>
            <strong style={{ color: "#1e40af" }}>🔥 BMR:</strong> {t.bmrExplanation}
          </div>
          <div style={{ marginBottom: 12 }}>
            <strong style={{ color: "#7c3aed" }}>⚡ TDEE:</strong> {t.tdeeExplanation}
          </div>
          <div style={{ marginBottom: 12 }}>
            <strong style={{ color: "#059669" }}>🍽️ {t.dailyCalories}:</strong>{" "}
            {t.caloriesExplanation}
          </div>
          <div>
            <strong style={{ color: "#dc2626" }}>
              🥩🥑🍞 {t.macros}:
            </strong>{" "}
            {t.macrosExplanation}
          </div>
        </div>
      )}

      {/* Formula note */}
      <p className="note" style={{ marginTop: 12, fontSize: 11 }}>
        {t.targetsNote}
      </p>
    </section>
  );
}