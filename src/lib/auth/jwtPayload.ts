/**
 * Decode the JWT payload (middle segment) without verifying the signature.
 * The backend always embeds `type` in the access token; Admin documents from Mongo
 * have no `type` field, so this is the source of truth for role when the user object is incomplete.
 */
export function decodeJwtPayload<T extends Record<string, unknown> = { _id: string; type: string }>(
  token: string | null | undefined,
): T | null {
  if (!token || typeof token !== 'string') return null;
  try {
    const parts = token.split('.');
    if (parts.length < 2 || !parts[1]) return null;
    const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(
      b64 + '='.repeat((4 - (b64.length % 4)) % 4),
    );
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}
