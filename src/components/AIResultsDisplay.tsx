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
      <section
        className="card fade-in"
        dir={isRTL ? "rtl" : "ltr"} // Set text direction based on language
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          boxShadow: "0 20px 60px rgba(102, 126, 234, 0.4)",
          border: "none",
          padding: 32,
        }}
      >
        {/* Section Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 24,
            paddingBottom: 20,
            borderBottom: "3px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <span style={{ fontSize: 42 }}>💡</span>
          <h2
            style={{
              color: "white",
              margin: 0,
              fontSize: 28,
              fontWeight: 700,
              textShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            {t.yourRecommendations} {/* Display the title for recommendations */}
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
          {aiTips.split("\n").map((line, index) => {
            const trimmedLine = line.trim();

            if (!trimmedLine) {
              return <div key={index} style={{ height: 14 }} />; // Empty line
            }

            if (trimmedLine.startsWith("-")) {
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
                  <span
                    style={{
                      color: "#667eea",
                      fontWeight: "bold",
                      fontSize: 22,
                      flexShrink: 0,
                      marginTop: 3,
                    }}
                  >
                    {isRTL ? "◄" : "►"} {/* Arrow indicator for list items */}
                  </span>
                  <span
                    style={{
                      flex: 1,
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    {trimmedLine.replace(/^-\s*/, "")} {/* Remove leading dash */}
                  </span>
                </div>
              );
            }

            if (
              trimmedLine.length < 60 &&
              trimmedLine.match(/^[A-Z\u0590-\u05FF]/) &&
              !trimmedLine.includes(".")
            ) {
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
                  {trimmedLine} {/* Display highlighted lines */}
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
                {trimmedLine} {/* Display regular lines */}
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
          <span
            style={{
              flex: 1,
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {t.recommendationsNote} {/* Display additional note about recommendations */}
          </span>
        </div>
      </section>
    </div>
  );
}