export interface PasswordRule {
  label: string;
  passed: boolean;
}

/**
 * Checks a password against every rule and returns each one individually
 * (label + pass/fail), so the UI can render a checklist that colors each
 * line independently as the user types.
 */
export function getPasswordRules(password: string): PasswordRule[] {
  return [
    { label: "Not made up of only numbers", passed: password.length > 0 && !/^\d+$/.test(password) },
    { label: "No spaces", passed: password.length > 0 && !/\s/.test(password) },
    { label: "At least 8 characters", passed: password.length >= 8 },
    { label: "No more than 12 characters", passed: password.length > 0 && password.length <= 12 },
    { label: "At least 1 capital letter", passed: /[A-Z]/.test(password) },
    { label: "At least 1 lowercase letter", passed: /[a-z]/.test(password) },
    { label: "At least 1 number", passed: /[0-9]/.test(password) },
    { label: "At least 1 symbol (!, @, $, or &)", passed: /[!@$&]/.test(password) },
  ];
}

export function isPasswordValid(password: string): boolean {
  return getPasswordRules(password).every((rule) => rule.passed);
}