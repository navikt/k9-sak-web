import type { AuthFixApi } from '@k9-sak-web/backend/shared/auth/AuthFixApi.ts';

export interface AuthFixConnectedApi extends AuthFixApi {
  /**
   * Returnerer true viss autentiseringsflyt for denne AuthFixer (eller andre AuthFixer denne er kobla til) er i gang.
   */
  readonly isAuthenticating: boolean;
}
