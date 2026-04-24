import { SortOrder } from '../../shared/src/enums';

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';
export const DEFAULT_SORT = SortOrder.DateDesc;
export const DEBOUNCE_MS = 300;
export const MAX_RETRIES = 2;
export const RETRY_DELAY_MS = 800;
