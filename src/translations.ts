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
    tagline: "AI-Powered Personalized Fitness & Nutrition",
    
    // Profile Section
    yourProfile: "Your Profile",
    gender: "Gender",
    male: "Male",
    female: "Female",
    age: "Age (years)",
    height: "Height (cm)",
    weight: "Weight (kg)",
    activityLevel: "Activity Level",
    goal: "Goal",
    
    // Goal Options
    cut: "Cut",        // Lose weight/fat
    maintain: "Maintain",  // Maintain current weight
    bulk: "Bulk",      // Gain muscle mass
    
    // Activity Level Options
    sedentary: "Sedentary",
    light: "Light",
    moderate: "Moderate",
    very: "Very Active",
    athlete: "Athlete",
    
    // Targets Section (Calculated Values)
    yourTargets: "Your Targets",
    bmr: "BMR",        // Basal Metabolic Rate
    tdee: "TDEE",      // Total Daily Energy Expenditure
    dailyCalories: "Daily Calories",
    protein: "Protein",
    fat: "Fat",
    carbs: "Carbs",
    targetsNote: "Calculated using Mifflin-St Jeor equation",
    
    // Targets Section Explanations
    bmrExplanation: "Basal Metabolic Rate - the number of calories your body burns at rest just to maintain basic functions (breathing, circulation, cell production).",
    tdeeExplanation: "Total Daily Energy Expenditure - your BMR plus all the calories you burn through daily activities and exercise.",
    caloriesExplanation: "Your personalized daily calorie target based on your goal. Cut = 20% deficit, Maintain = TDEE, Bulk = 10% surplus.",
    macros: "Macros",
    macrosExplanation: "Protein helps build/maintain muscle, fats support hormones, and carbs provide energy. Distribution is optimized for your goal.",
    
    // AI Recommendations Section
    recommendedTips: "AI Recommendations",
    recommendationsPrompt: "Get personalized AI-powered fitness and nutrition advice",
    customPrompt: "Additional Instructions (Optional)",
    promptPlaceholder: "e.g., I have knee problems, prefer home workouts...",
    getRecommendations: "Get AI Recommendations",
    generating: "Generating...",
    yourRecommendations: "Your Personalized Recommendations",
    recommendationsNote: "AI recommendations are for informational purposes. Consult professionals for medical advice.",
    
    // Validation Messages
    ageValidation: "Age must be 11-99",
    heightValidation: "Height must be 120-230 cm",
    weightValidation: "Weight must be 35-240 kg",
    fixInputs: "Please fix the input errors",
    
    // Action Buttons
    saveLocal: "Save Profile",
    
    // Footer
    disclaimer: "This app is for informational purposes only. Consult healthcare professionals before starting any fitness program.",
  },

  /**
   * ============================================
   * HEBREW TRANSLATIONS (עברית)
   * ============================================
   * RTL (Right-to-Left) layout is automatically applied
   */
  he: {
    // Header / Branding
    brand: "סמארט פיטנס",
    tagline: "כושר ותזונה מותאמים אישית מבוססי AI",
    
    // Profile Section
    yourProfile: "הפרופיל שלך",
    gender: "מגדר",
    male: "זכר",
    female: "נקבה",
    age: "גיל (שנים)",
    height: "גובה (ס״מ)",
    weight: "משקל (ק״ג)",
    activityLevel: "רמת פעילות",
    goal: "מטרה",
    
    // Goal Options
    cut: "חיתוך",      // Lose weight/fat
    maintain: "שמירה",  // Maintain current weight
    bulk: "הגדלה",     // Gain muscle mass
    
    // Activity Level Options
    sedentary: "ישיבה",
    light: "קל",
    moderate: "בינוני",
    very: "פעיל מאוד",
    athlete: "ספורטאי",
    
    // Targets Section (Calculated Values)
    yourTargets: "היעדים שלך",
    bmr: "BMR",
    tdee: "TDEE",
    dailyCalories: "קלוריות יומיות",
    protein: "חלבון",
    fat: "שומן",
    carbs: "פחמימות",
    targetsNote: "מחושב לפי נוסחת Mifflin-St Jeor",
    
    // Targets Section Explanations
    bmrExplanation: "קצב מטבוליזם בסיסי - כמות הקלוריות שהגוף שורף במנוחה רק כדי לתחזק תפקודים בסיסיים (נשימה, זרימת דם, ייצור תאים).",
    tdeeExplanation: "הוצאת אנרגיה יומית כוללת - ה-BMR שלך בתוספת כל הקלוריות שאתה שורף דרך פעילויות יומיות ופעילות גופנית.",
    caloriesExplanation: "יעד קלוריות יומי מותאם אישית על סמך המטרה שלך. חיתוך = גירעון 20%, שמירה = TDEE, הגדלה = עודף 10%.",
    macros: "מקרו",
    macrosExplanation: "חלבון עוזר לבנות/לתחזק שריר, שומנים תומכים בהורמונים, ופחמימות מספקות אנרגיה. החלוקה מותאמת למטרה שלך.",
    
    // AI Recommendations Section
    recommendedTips: "המלצות AI",
    recommendationsPrompt: "קבל ייעוץ מותאם אישית לכושר ותזונה מבוסס AI",
    customPrompt: "הנחיות נוספות (אופציונלי)",
    promptPlaceholder: "לדוגמה, יש לי בעיות ברכיים, מעדיף אימונים בבית...",
    getRecommendations: "קבל המלצות AI",
    generating: "מייצר...",
    yourRecommendations: "ההמלצות המותאמות שלך",
    recommendationsNote: "המלצות AI הן למטרות מידע בלבד. התייעץ עם אנשי מקצוע לייעוץ רפואי.",
    
    // Validation Messages
    ageValidation: "הגיל חייב להיות 11-99",
    heightValidation: "הגובה חייב להיות 120-230 ס״מ",
    weightValidation: "המשקל חייב להיות 35-240 ק״ג",
    fixInputs: "אנא תקן את שגיאות הקלט",
    
    // Action Buttons
    saveLocal: "שמור פרופיל",
    
    // Footer
    disclaimer: "אפליקציה זו מיועדת למטרות מידע בלבד. התייעץ עם אנשי מקצוע בתחום הבריאות לפני תחילת כל תוכנית כושר.",
  },
};