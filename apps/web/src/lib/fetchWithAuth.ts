import { refresh_token } from "@/services/auth.service";

/**
 * Callback registrado por el AuthProvider.
 * Se llama cuando el refresh token también expiró → logout forzado.
 */
type LogoutCallback = () => void;
let onSessionExpired: LogoutCallback | null = null;

export function registerSessionExpiredCallback(cb: LogoutCallback) {
  onSessionExpired = cb;
}

/**
 * Wrapper de fetch con interceptor de 401.
 *
 * Flujo:
 *  1. Hace la petición original.
 *  2. Si responde 401 → intenta renovar el access_token con /refresh.
 *     a. Si el refresh OK  → reintenta la petición original una vez.
 *     b. Si el refresh 401 → ambos tokens expiraron → logout forzado.
 *  3. Devuelve la respuesta final (original o del reintento).
 */
export async function fetchWithAuth(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  // Siempre incluir credenciales para que las cookies se envíen
  const options: RequestInit = { credentials: "include", ...init };

  const response = await fetch(input, options);

  if (response.status !== 401) return response;

  // — 401: intentar renovar el token —
  try {
    await refresh_token();
  } catch {
    // El refresh también falló → sesión completamente expirada
    onSessionExpired?.();
    throw new Error("Sesión expirada. Por favor vuelve a iniciar sesión.");
  }

  // Token renovado → reintento de la petición original
  return fetch(input, options);
}
