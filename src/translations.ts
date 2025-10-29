export type Language = "en" | "he";

export const translations = {
  en: {
    brand: "Smart Fitness",
    tagline: "Clean, simple starter — React + CSS",
    
    // Profile section
    yourProfile: "Your Profile",
    sex: "Sex",
    male: "Male",
    female: "Female",
    age: "Age",
    height: "Height (cm)",
    weight: "Weight (kg)",
    activityLevel: "Activity level",
    goal: "Goal",
    
    // Activity levels
    sedentary: "Sedentary (little to no exercise)",
    light: "Light (1–3 days/wk)",
    moderate: "Moderate (3–5 days/wk)",
    very: "Very (6–7 days/wk)",
    athlete: "Athlete (2×/day training)",
    
    // Goals
    cut: "Cut",
    maintain: "Maintain",
    bulk: "Bulk",
    
    // Targets section
    yourTargets: "Your Targets",
    bmr: "BMR",
    tdee: "TDEE",
    dailyCalories: "Daily Calories",
    protein: "Protein",
    fat: "Fat",
    carbs: "Carbs",
    targetsNote: "Mifflin–St Jeor · TDEE = BMR × activity · Cut ≈ −20% · Bulk ≈ +10%",
    
    // Recommendations
    recommendedTips: "Recommended Tips",
    recommendationsPrompt: "Ask for personalized training / nutrition tips based on the profile above. Optional: add a short prompt for the AI.",
    customPrompt: "Custom prompt (optional)",
    promptPlaceholder: "e.g. focus on fat loss with 3x weekly gym, grocery-friendly meals...",
    getRecommendations: "Get AI Recommendations",
    generating: "Generating...",
    yourRecommendations: "💡 Your Personalized Recommendations",
    recommendationsNote: "💭 These recommendations are based on your profile. Adjust your prompt for more specific advice.",
    
    // Validation
    ageValidation: "Age must be 11–99.",
    heightValidation: "120–230 cm.",
    weightValidation: "35–240 kg.",
    fixInputs: "Please fix profile inputs before requesting tips.",
    
    // Actions
    saveLocal: "Save (local)",
    
    // Footer
    disclaimer: "Disclaimer: Informational only, not medical advice.",
  },
  he: {
    brand: "כושר חכם",
    tagline: "מתחיל פשוט ונקי — React + CSS",
    
    // Profile section
    yourProfile: "הפרופיל שלך",
    sex: "מין",
    male: "זכר",
    female: "נקבה",
    age: "גיל",
    height: "גובה (ס״מ)",
    weight: "משקל (ק״ג)",
    activityLevel: "רמת פעילות",
    goal: "מטרה",
    
    // Activity levels
    sedentary: "בישיבה (מעט או ללא פעילות)",
    light: "קלה (1-3 ימים בשבוע)",
    moderate: "בינונית (3-5 ימים בשבוע)",
    very: "גבוהה (6-7 ימים בשבוע)",
    athlete: "ספורטאי (אימונים פעמיים ביום)",
    
    // Goals
    cut: "חיתוך",
    maintain: "שמירה",
    bulk: "הגדלה",
    
    // Targets section
    yourTargets: "היעדים שלך",
    bmr: "BMR",
    tdee: "TDEE",
    dailyCalories: "קלוריות יומיות",
    protein: "חלבון",
    fat: "שומן",
    carbs: "פחמימות",
    targetsNote: "Mifflin–St Jeor · TDEE = BMR × פעילות · חיתוך ≈ −20% · הגדלה ≈ +10%",
    
    // Recommendations
    recommendedTips: "המלצות מותאמות אישית",
    recommendationsPrompt: "בקש עצות אימון ותזונה מותאמות אישית על סמך הפרופיל שלך. אופציונלי: הוסף הנחיה קצרה ל-AI.",
    customPrompt: "הנחיה מותאמת אישית (אופציונלי)",
    promptPlaceholder: "למשל: התמקדות בירידה במשקל עם 3 אימונים בשבוע, ארוחות נוחות...",
    getRecommendations: "קבל המלצות AI",
    generating: "מייצר...",
    yourRecommendations: "💡 ההמלצות האישיות שלך",
    recommendationsNote: "💭 המלצות אלו מבוססות על הפרופיל שלך. התאם את ההנחיה לעצות ספציפיות יותר.",
    
    // Validation
    ageValidation: "גיל חייב להיות 11-99.",
    heightValidation: "120-230 ס״מ.",
    weightValidation: "35-240 ק״ג.",
    fixInputs: "אנא תקן את שדות הפרופיל לפני בקשת עצות.",
    
    // Actions
    saveLocal: "שמור (מקומי)",
    
    // Footer
    disclaimer: "הצהרה: מידע בלבד, לא ייעוץ רפואי.",
  },
};