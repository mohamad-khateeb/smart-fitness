/**
 * ============================================
 * VALIDATION UTILITIES
 * ============================================
 * Input validation logic
 */

import type { ValidationState } from "../types";

/**
 * Validate user profile inputs
 * 
 * @param age - User's age
 * @param heightCm - User's height in cm
 * @param weightKg - User's weight in kg
 * @returns Validation state for each field
 */
export function validateInputs(
  age: number,
  heightCm: number,
  weightKg: number
): ValidationState {
  return {
    age: age >= 11 && age <= 99,          // Reasonable age range
    height: heightCm >= 120 && heightCm <= 230,  // Reasonable height range
    weight: weightKg >= 35 && weightKg <= 240,   // Reasonable weight range
  };
}

/**
 * Check if all validations pass
 * 
 * @param valid - Validation state object
 * @returns True if all fields are valid
 */
export function isAllValid(valid: ValidationState): boolean {
  return valid.age && valid.height && valid.weight;
}