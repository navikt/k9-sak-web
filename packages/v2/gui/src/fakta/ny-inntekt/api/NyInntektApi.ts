export interface NyInntektApi {
  reaktiverAksjonspunktNyInntekt(behandlingUuid: string): Promise<void>;
}
