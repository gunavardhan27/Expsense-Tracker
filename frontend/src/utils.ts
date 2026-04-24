/**
 * Formats a decimal string as INR currency: "₹1,234.56"
 */
export function formatINR(amount: string): string {
  const numberAmount = parseFloat(amount || "0");
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(numberAmount);
}

/**
 * Formats a YYYY-MM-DD date string as "24 Apr 2026"
 */
export function formatDate(date: string): string {
  if (!date) return '';
  const [yearStr, monthStr, dayStr] = date.split('-');
  const year = parseInt(yearStr || '', 10);
  const month = parseInt(monthStr || '', 10);
  const day = parseInt(dayStr || '', 10);
  
  if (isNaN(year) || isNaN(month) || isNaN(day)) return date;
  
  const d = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(d);
}

/**
 * Generates a UUID v4 using crypto.randomUUID().
 */
export function generateUUID(): string {
  return crypto.randomUUID();
}

/**
 * Retries an async fn up to maxRetries times with exponential backoff.
 * Only retries on network errors (not 4xx).
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 2,
  delayMs: number = 800
): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name !== 'TypeError' && !error.message.toLowerCase().includes('network') && !error.message.toLowerCase().includes('fetch')) {
           throw error;
        }
      }
      
      attempt++;
      if (attempt > maxRetries) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs * Math.pow(2, attempt - 1)));
    }
  }
}
