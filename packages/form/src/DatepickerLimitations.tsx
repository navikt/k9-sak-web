import type { DatepickerDateRange } from './PureDatepicker';

export interface DatepickerLimitations {
  minDate?: string;
  maxDate?: string;
  invalidDateRanges?: DatepickerDateRange[];
  weekendsNotSelectable?: boolean;
}
