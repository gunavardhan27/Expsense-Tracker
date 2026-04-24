import { validateAmount } from '../../shared/src/utils';
import { MINOR_UNIT_MULTIPLIER } from './constants';
import { LogLevel } from './enums';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';

/**
 * Converts a decimal string amount (e.g. "12.50") to integer minor units (e.g. 1250).
 * Rounds safely to the nearest minor unit using Math.round.
 * Throws if the string fails validateAmount.
 */
export function amountToMinorUnits(amount: string): number {
  const result = validateAmount(amount);
  if (!result.valid) {
    throw new Error(result.reason || 'Invalid amount');
  }

  return Math.round(parseFloat(amount) * MINOR_UNIT_MULTIPLIER);
}

/**
 * Converts integer minor units back to a decimal string "12.50".
 */
export function minorUnitsToAmount(units: number): string {
  const isNegative = units < 0;
  const absUnits = Math.abs(units).toString();
  const padded = absUnits.padStart(3, '0');
  
  const intPart = padded.slice(0, -2);
  const decPart = padded.slice(-2);
  
  return `${isNegative ? '-' : ''}${intPart}.${decPart}`;
}

/**
 * Validates a UUID v4 string. Returns boolean.
 */
export function isValidUUIDv4(value: string): boolean {
  return uuidValidate(value) && uuidVersion(value) === 4;
}

/**
 * Simple structured logger: logs JSON to stdout.
 */
export function log(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  };
  console.log(JSON.stringify(entry));
}
