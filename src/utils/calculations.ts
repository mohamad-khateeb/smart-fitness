/**
 * ============================================
 * CALCULATION UTILITIES
 * ============================================
 * All fitness-related calculations (BMR, TDEE, macros)
 */

import type { Sex, Activity, Goal } from "../types";

/**
 * Activity multipliers for TDEE calculation
 * Based on typical exercise frequency/intensity
 */
export const activityMultipliers: Record<Activity, number> = {
  sedentary: 1.2,    // Little to no exercise
  light: 1.375,      // 1-3 days/week
  moderate: 1.55,    // 3-5 days/week
  very: 1.725,       // 6-7 days/week
  athlete: 1.9,      // 2× daily training
};

/**
 * Calculate Basal Metabolic Rate using Mifflin-St Jeor equation
 * The number of calories your body burns at rest
 * 
 * @param sex - User's biological sex
 * @param age - User's age in years
 * @param heightCm - User's height in centimeters
 * @param weightKg - User's weight in kilograms
 * @returns BMR in calories
 * 
 * Formula:
 * Men:   BMR = 10×weight + 6.25×height - 5×age + 5
 * Women: BMR = 10×weight + 6.25×height - 5×age - 161
 */
export function calculateBMR(
  sex: Sex,
  age: number,
  heightCm: number,
  weightKg: number
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === "male" ? base + 5 : base - 161;
}

/**
 * Calculate Total Daily Energy Expenditure
 * The total calories you burn in a day including activity
 * 
 * @param bmr - Basal Metabolic Rate
 * @param activity - User's activity level
 * @returns TDEE in calories
 * 
 * Formula: TDEE = BMR × Activity Multiplier
 */
export function calculateTDEE(bmr: number, activity: Activity): number {
  return bmr * activityMultipliers[activity];
}

/**
 * Calculate daily calorie target based on goal
 * 
 * @param tdee - Total Daily Energy Expenditure
 * @param goal - User's fitness goal
 * @returns Target calories per day
 * 
 * Goals:
 * - Cut (lose fat): -20% from TDEE
 * - Maintain: Equal to TDEE
 * - Bulk (gain muscle): +10% from TDEE
 */
export function calculateTargetCalories(tdee: number, goal: Goal): number {
  switch (goal) {
    case "cut":
      return tdee * 0.8;     // -20%
    case "maintain":
      return tdee;           // 0%
    case "bulk":
      return tdee * 1.1;     // +10%
    default:
      return tdee;
  }
}

/**
 * Calculate daily protein target
 * High protein (2.2g/kg) for muscle preservation/growth
 * 
 * @param weightKg - User's weight in kilograms
 * @returns Protein target in grams
 */
export function calculateProtein(weightKg: number): number {
  return Math.round(weightKg * 2.2);
}

/**
 * Calculate daily fat target
 * 25% of total calories (essential for hormones)
 * 
 * @param targetKcal - Daily calorie target
 * @returns Fat target in grams
 * 
 * Note: 1g fat = 9 calories
 */
export function calculateFat(targetKcal: number): number {
  return Math.round((targetKcal * 0.25) / 9);
}

/**
 * Calculate daily carb target
 * Remainder after protein and fat
 * 
 * @param targetKcal - Daily calorie target
 * @param proteinG - Protein in grams
 * @param fatG - Fat in grams
 * @returns Carbs target in grams
 * 
 * Note: 1g carb = 4 calories, 1g protein = 4 calories
 */
export function calculateCarbs(
  targetKcal: number,
  proteinG: number,
  fatG: number
): number {
  return Math.round((targetKcal - proteinG * 4 - fatG * 9) / 4);
}