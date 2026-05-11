const CORRECT_PASSWORD = '0711';

export function checkPassword(input: string): boolean {
  return input === CORRECT_PASSWORD;
}
