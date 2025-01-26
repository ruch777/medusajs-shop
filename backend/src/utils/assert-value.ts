/**
 * Assert that a value is not undefined. If it is, throw an error with the provided message.
 * @param v - Value to assert
 * @param errorMessage - Error message to throw if value is undefined
 */
export function assertValue<T>(value: T | undefined | null, key: string): T {
  if (value === undefined || value === null) {
    throw new Error(`Environment variable for ${key} is not set`);
  }
  return value;
}
