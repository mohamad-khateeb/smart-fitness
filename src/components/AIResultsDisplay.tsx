/**
 * ============================================
 * AI RESULTS DISPLAY COMPONENT
 * ============================================
 * This component displays AI-generated recommendations for the user.
 * It formats the tips and provides a visually appealing layout.
 */

import React from "react";
import type { Language } from "../translations";
import { translations } from "../translations";
import './AIResultsDisplay.css'; // Import the CSS file

// Define the props for the AIResultsDisplay component
interface AIResultsDisplayProps {
  aiTips: string; // The AI-generated tips to display
  language: Language; // The current language setting for translations
}

/**
 * AIResultsDisplay component
 *
 * @param {AIResultsDisplayProps} props - The props for the component
 * @returns {JSX.Element} The rendered component
 */
export default function AIResultsDisplay({ aiTips, language }: AIResultsDisplayProps) {
  const t = translations[language]; // Get translations based on the current language
  const isRTL = language === "he"; // Check if the language is right-to-left (Hebrew)

  // If no tips are provided, return null (nothing to display)
  if (!aiTips) return null;

  return (
    <div style={{ marginTop: 32, width: "100%", maxWidth: "1400px" }}>
      <section className="card fade-in" dir={isRTL ? "rtl" : "ltr"}>
        {/* Section Header */}
        <div className="section-header">
          <span style={{ fontSize: 42 }}>💡</span>
          <h2>{t.yourRecommendations}</h2>
        </div>

        {/* AI Recommendations Content Box */}
        <div className="ai-tips-container">
          {aiTips.split("\n").map((line, index) => {
            const trimmedLine = line.trim();

            if (!trimmedLine) {
              return <div key={index} style={{ height: 14 }} />; // Empty line
            }

            if (trimmedLine.startsWith("-")) {
              return (
                <div key={index} style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16, paddingLeft: isRTL ? 0 : 10, paddingRight: isRTL ? 10 : 0 }}>
                  <span style={{ color: "#667eea", fontWeight: "bold", fontSize: 22, flexShrink: 0, marginTop: 3 }}>
                    {isRTL ? "◄" : "►"}
                  </span>
                  <span style={{ flex: 1, wordBreak: "break-word", overflowWrap: "break-word" }}>
                    {trimmedLine.replace(/^-\s*/, "")}
                  </span>
                </div>
              );
            }

            if (trimmedLine.length < 60 && trimmedLine.match(/^[A-Z\u0590-\u05FF]/) && !trimmedLine.includes(".")) {
              return (
                <div key={index} style={{ fontWeight: "700", fontSize: 20, color: "#667eea", marginTop: index > 0 ? 24 : 0, marginBottom: 14, wordBreak: "break-word", overflowWrap: "break-word", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 24 }}>🎯</span>
                  {trimmedLine}
                </div>
              );
            }

            return (
              <div key={index} style={{ marginBottom: 12, wordBreak: "break-word", overflowWrap: "break-word", maxWidth: "100%" }}>
                {trimmedLine}
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="footer-note">
          <span style={{ fontSize: 26, flexShrink: 0 }}>💭</span>
          <span style={{ flex: 1, wordBreak: "break-word", overflowWrap: "break-word" }}>
            {t.recommendationsNote}
          </span>
        </div>
      </section>
    </div>
  );
}