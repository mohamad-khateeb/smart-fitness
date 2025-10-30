/**
 * ============================================
 * TYPE DEFINITIONS
 * ============================================
 * Shared types used across the application
 */

/** User's biological sex (affects BMR calculation) */
export type Sex = "male" | "female";

/** Activity level (affects TDEE multiplier) */
export type Activity = "sedentary" | "light" | "moderate" | "very" | "athlete";

/** Fitness goal (affects calorie target) */
export type Goal = "cut" | "maintain" | "bulk";

/** User profile data */
export interface UserProfile {
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  activity: Activity;
  goal: Goal;
}

/** Calculated nutritional targets */
export interface NutritionTargets {
  bmr: number;
  tdee: number;
  targetKcal: number;
  proteinG: number;
  fatG: number;
  carbsG: number;
}

/** Validation state for form inputs */
export interface ValidationState {
  age: boolean;
  height: boolean;
  weight: boolean;
}