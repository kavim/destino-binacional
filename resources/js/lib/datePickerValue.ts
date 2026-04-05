export type DatePickerValue = Date | null | [Date | null, Date | null];

/**
 * Normaliza o valor do react-date-picker (Date | range | null) para um único Date ou null.
 */
export function datePickerValueToDate(value: DatePickerValue): Date | null {
  if (value == null) return null;
  if (Array.isArray(value)) {
    const first = value[0];
    return first instanceof Date ? first : null;
  }
  return value instanceof Date ? value : null;
}
