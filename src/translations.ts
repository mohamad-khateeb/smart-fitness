/**
 * ============================================
 * MULTI-LANGUAGE TRANSLATIONS
 * ============================================
 * 
 * This file contains all UI text translations for the fitness app.
 * 
 * Supported languages:
 * - English (en)
 * - Hebrew (he) with RTL (Right-to-Left) support
 * 
 * Usage:
 * import { translations } from './translations';
 * const t = translations[language];
 * <h1>{t.brand}</h1>
 */

/**
 * Language type definition
 * Ensures type safety when switching languages
 */
export type Language = "en" | "he";

/**
 * Translation object structure
 * Each language must have all the same keys
 */
export const translations = {
  /**
   * ============================================
   * ENGLISH TRANSLATIONS
   * ============================================
   */
  en: {
    // Header / Branding
    brand: "Smart Fitness",
    tagline: "Clean, simple starter — React + CSS",
    
    // Profile Section
    yourProfile: "Your Profile",
    sex: "Sex",
    male: "Male",
    female: "Female",
    age: "Age",
    height: "Height (cm)",
    weight: "Weight (kg)",
    activityLevel: "Activity level",
    goal: "Goal",
    
    // Activity Level Options
    sedentary: "Sedentary (little to no exercise)",
    light: "Light (1–3 days/wk)",
    moderate: "Moderate (3–5 days/wk)",
    very: "Very (6–7 days/wk)",
    athlete: "Athlete (2×/day training)",
    
    // Goal Options
    cut: "Cut",        // Lose weight/fat
    maintain: "Maintain",  // Maintain current weight
    bulk: "Bulk",      // Gain muscle mass
    
    // Targets Section (Calculated Values)
    yourTargets: "Your Targets",
    bmr: "BMR",        // Basal Metabolic Rate
    tdee: "TDEE",      // Total Daily Energy Expenditure
    dailyCalories: "Daily Calories",
    protein: "Protein",
    fat: "Fat",
    carbs: "Carbs",
    targetsNote: "Mifflin–St Jeor · TDEE = BMR × activity · Cut ≈ −20% · Bulk ≈ +10%",
    
    // AI Recommendations Section
    recommendedTips: "Recommended Tips",
    recommendationsPrompt: "Ask for personalized training / nutrition tips based on the profile above. Optional: add a short prompt for the AI.",
    customPrompt: "Custom prompt (optional)",
    promptPlaceholder: "e.g. focus on fat loss with 3x weekly gym, grocery-friendly meals...",
    getRecommendations: "Get AI Recommendations",
    generating: "Generating...",
    yourRecommendations: "💡 Your Personalized Recommendations",
    recommendationsNote: "💭 These recommendations are based on your profile. Adjust your prompt for more specific advice.",
    
    // Validation Messages
    ageValidation: "Age must be 11–99.",
    heightValidation: "120–230 cm.",
    weightValidation: "35–240 kg.",
    fixInputs: "Please fix profile inputs before requesting tips.",
    
    // Action Buttons
    saveLocal: "Save (local)",
    
    // Footer
    disclaimer: "Disclaimer: Informational only, not medical advice.",
  },

  /**
   * ============================================
   * HEBREW TRANSLATIONS (עברית)
   * ============================================
   * RTL (Right-to-Left) layout is automatically applied
   */
  he: {
    // Header / Branding
    brand: "כושר חכם",
    tagline: "מתחיל פשוט ונקי — React + CSS",
    
    // Profile Section
    yourProfile: "הפרופיל שלך",
    sex: "מין",
    male: "זכר",
    female: "נקבה",
    age: "גיל",
    height: "גובה (ס״מ)",
    weight: "משקל (ק״ג)",
    activityLevel: "רמת פעילות",
    goal: "מטרה",
    
    // Activity Level Options
    sedentary: "בישיבה (מעט או ללא פעילות)",
    light: "קלה (1-3 ימים בשבוע)",
    moderate: "בינונית (3-5 ימים בשבוע)",
    very: "גבוהה (6-7 ימים בשבוע)",
    athlete: "ספורטאי (אימונים פעמיים ביום)",
    
    // Goal Options
    cut: "חיתוך",      // Lose weight/fat
    maintain: "שמירה",  // Maintain current weight
    bulk: "הגדלה",     // Gain muscle mass
    
    // Targets Section (Calculated Values)
    yourTargets: "היעדים שלך",
    bmr: "BMR",
    tdee: "TDEE",
    dailyCalories: "קלוריות יומיות",
    protein: "חלבון",
    fat: "שומן",
    carbs: "פחמימות",
    targetsNote: "Mifflin–St Jeor · TDEE = BMR × פעילות · חיתוך ≈ −20% · הגדלה ≈ +10%",
    
    // AI Recommendations Section
    recommendedTips: "המלצות מותאמות אישית",
    recommendationsPrompt: "בקש עצות אימון ותזונה מותאמות אישית על סמך הפרופיל שלך. אופציונלי: הוסף הנחיה קצרה ל-AI.",
    customPrompt: "הנחיה מותאמת אישית (אופציונלי)",
    promptPlaceholder: "למשל: התמקדות בירידה במשקל עם 3 אימונים בשבוע, ארוחות נוחות...",
    getRecommendations: "קבל המלצות AI",
    generating: "מייצר...",
    yourRecommendations: "💡 ההמלצות האישיות שלך",
    recommendationsNote: "💭 המלצות אלו מבוססות על הפרופיל שלך. התאם את ההנחיה לעצות ספציפיות יותר.",
    
    // Validation Messages
    ageValidation: "גיל חייב להיות 11-99.",
    heightValidation: "120-230 ס״מ.",
    weightValidation: "35-240 ק״ג.",
    fixInputs: "אנא תקן את שדות הפרופיל לפני בקשת עצות.",
    
    // Action Buttons
    saveLocal: "שמור (מקומי)",
    
    // Footer
    disclaimer: "הצהרה: מידע בלבד, לא ייעוץ רפואי.",
  },
};