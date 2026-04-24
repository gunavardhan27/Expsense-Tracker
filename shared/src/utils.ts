import { MAX_AMOUNT_INTEGER_DIGITS } from './constants';
import moment from 'moment-timezone';

/**
 * Validates an amount string. Must be a positive decimal with at most 3 decimal places.
 * Rejects negatives, zero, NaN, Infinity, values with more than MAX_AMOUNT_INTEGER_DIGITS
 * integer digits, and values with more than 3 decimal places.
 * Returns { valid: true } or { valid: false, reason: string }.
 */
export function validateAmount(value: string): { valid: boolean; reason?: string } {
  if (!value || typeof value !== 'string') {
    return { valid: false, reason: 'Amount is required' };
  }

  // Reject leading zeros (e.g. "007"), allow "0.50"
  if (!/^([1-9]\d*|0)(\.\d{1,2})?$/.test(value)) {
    return { valid: false, reason: 'Amount must be a valid number with at most 2 decimal places' };
  }

  const [integerPart] = value.split('.');

  if ((integerPart?.length ?? 0) > MAX_AMOUNT_INTEGER_DIGITS) {
    return { valid: false, reason: `Amount exceeds maximum of ${MAX_AMOUNT_INTEGER_DIGITS} digits` };
  }

  // Guard against float parse giving Infinity or NaN
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return { valid: false, reason: 'Amount must be a positive number' };
  }

  return { valid: true };
}

/**
 * Validates a date string. Must match YYYY-MM-DD exactly and be a real calendar date.
 * Returns { valid: true } or { valid: false, reason: string }.
 */
export function validateDate(value: string): { valid: boolean; reason?: string } {
  if (!value || typeof value !== 'string') {
    return { valid: false, reason: 'Date must be a string' };
  }

  // Uses strict parsing 'true' to ensure precise "YYYY-MM-DD" mapping
  // Evaluated in UTC to prevent isolated timezone rollover bugs
  if (!moment.tz(value, 'YYYY-MM-DD', true, 'UTC').isValid()) {
    return { valid: false, reason: 'Date must be a valid YYYY-MM-DD calendar date' };
  }

  return { valid: true };
}

/**
 * Adds two decimal strings correctly using integer arithmetic (no float).
 * e.g. addDecimalStrings("1.10", "2.05") === "3.15"
 */
export function addDecimalStrings(a: string, b: string): string {
  const normalize = (val: string) => {
    let [intPart, decPart = ''] = val.split('.');
    decPart = decPart.padEnd(2, '0');
    return BigInt(intPart + decPart);
  };

  const valA = normalize(a || "0.00");
  const valB = normalize(b || "0.00");
  const sum = valA + valB;

  const sumStr = sum.toString().padStart(3, '0');
  const intPart = sumStr.slice(0, -2);
  const decPart = sumStr.slice(-2);

  return `${intPart}.${decPart}`;
}

/**
 * Sums an array of decimal strings. Returns "0.00" for empty array.
 */
export function sumDecimalStrings(values: string[]): string {
  if (values.length === 0) return '0.00';
  return values.reduce((acc, curr) => addDecimalStrings(acc, curr), '0.00');
}
