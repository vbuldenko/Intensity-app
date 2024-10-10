const key = "accessToken";

/**
 * Retrieves the access token from localStorage.
 * @returns The access token string or null if not found.
 */
function get(): string | null {
  return localStorage.getItem(key);
}

/**
 * Saves the access token to localStorage.
 * @param token - The access token to be saved.
 */
function save(token: string): void {
  localStorage.setItem(key, token);
}

/**
 * Removes the access token from localStorage.
 */
function remove(): void {
  localStorage.removeItem(key);
}

export const accessTokenService = { get, save, remove };
