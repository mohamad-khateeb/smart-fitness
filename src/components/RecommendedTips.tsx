import React, { useState } from "react";

type ProfileProps = {
  sex: "male" | "female";
  age: number;
  heightCm: number;
  weightKg: number;
  activity: string;
  goal: string;
  allValid: boolean;
};

export default function RecommendedTips({
  sex,
  age,
  heightCm,
  weightKg,
  activity,
  goal,
  allValid,
}: ProfileProps) {
  const [tipsPrompt, setTipsPrompt] = useState<string>("");
  const [aiTips, setAiTips] = useState<string>("");
  const [tipsLoading, setTipsLoading] = useState<boolean>(false);
  const [tipsError, setTipsError] = useState<string | null>(null);

  async function requestTips() {
    console.log("=== Starting requestTips ===");
    setTipsError(null);
    setAiTips("");
    if (!allValid) {
      console.log("Validation failed - allValid is false");
      setTipsError("Please fix profile inputs before requesting tips.");
      return;
    }
    setTipsLoading(true);
    try {
      const payload = { sex, age, heightCm, weightKg, activity, goal, prompt: tipsPrompt };
      console.log("Request payload:", payload);
      
      console.log("Fetching from:", "http://localhost:3001/api/recommend");
      const res = await fetch("http://localhost:3001/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      console.log("Response status:", res.status);
      console.log("Response ok:", res.ok);
      
      if (res.ok) {
        const data = await res.json();
        console.log("Response data:", data);
        setAiTips(typeof data === "string" ? data : data.tips ?? JSON.stringify(data));
        console.log("Tips set successfully");
      } else {
        const errorText = await res.text();
        console.error("Server error response:", errorText);
        setTipsError(`Server error: ${res.status}`);
        setAiTips(generateFallbackTips(payload));
        console.log("Using fallback tips due to server error");
      }
    } catch (err: any) {
      console.error("Request failed with error:", err);
      console.error("Error details:", {
        message: err?.message,
        name: err?.name,
        stack: err?.stack
      });
      setTipsError(err?.message ?? "Request failed");
      setAiTips(generateFallbackTips({ sex, age, heightCm, weightKg, activity, goal, prompt: tipsPrompt }));
      console.log("Using fallback tips due to request failure");
    } finally {
      setTipsLoading(false);
      console.log("=== requestTips completed ===");
    }
  }

  function generateFallbackTips(data: any) {
    const lines: string[] = [];
    lines.push(`Profile: ${data.sex}, ${data.age}y, ${data.heightCm}cm, ${data.weightKg}kg, activity=${data.activity}, goal=${data.goal}`);
    if (data.goal === "cut") {
      lines.push("- Aim for ~20% calorie deficit from TDEE. Prioritize protein (1.8–2.2 g/kg).");
      lines.push("- Prefer resistance training 3×/week + 1–2 cardio sessions.");
    } else if (data.goal === "bulk") {
      lines.push("- Small calorie surplus (~+10%). Prioritize progressive overload strength training.");
      lines.push("- Protein ~2.0–2.2 g/kg, include full-body or split routine 3–5×/week.");
    } else {
      lines.push("- Maintain calories, focus on balanced macros and consistent training.");
    }
    lines.push("- Hydration, sleep (7–9h), and weekly progress checks help adherence.");
    if (data.prompt) lines.push(`\nNote (prompt): ${data.prompt}`);
    return lines.join("\n");
  }

  return (
    <>
      <section className="card fade-in">
      <h2 className="card-title">Recommended Tips</h2>
      <p className="note">Ask for personalized training / nutrition tips based on the profile above. Optional: add a short prompt for the AI.</p>

      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          requestTips();
        }}
      >
        <div className="field">
          <label className="label">Custom prompt (optional)</label>
          <textarea
            className="input"
            rows={3}
            placeholder="e.g. focus on fat loss with 3x weekly gym, grocery-friendly meals..."
            value={tipsPrompt}
            onChange={(e) => setTipsPrompt(e.target.value)}
            disabled={tipsLoading}
          />
        </div>

        <div className="actions">
          <button className="btn primary" type="submit" disabled={tipsLoading || !allValid}>
            {tipsLoading ? "Generating..." : "Get AI Recommendations"}
          </button>
        </div>

        {tipsError && (
          <div className="help" style={{ marginTop: 12, color: "#dc2626" }}>
            ⚠️ {tipsError}
          </div>
        )}
      </form>
      </section>
      
      {aiTips && (
        <section className="card fade-in" style={{ marginTop: 20 }}>
          <h2 className="card-title">💡 Your Personalized Recommendations</h2>
          <div 
            style={{ 
              whiteSpace: "pre-wrap",
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
          <div style={{ marginTop: 12, fontSize: 13, color: "#64748b" }}>
            💭 These recommendations are based on your profile. Adjust your prompt for more specific advice.
          </div>
        </section>
      )}
    </>
  );
}