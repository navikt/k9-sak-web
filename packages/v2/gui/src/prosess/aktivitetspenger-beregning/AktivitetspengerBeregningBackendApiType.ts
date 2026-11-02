import type { ArbeidsgiverOversiktDto } from '@k9-sak-web/backend/ungsak/kontrakt/arbeidsforhold/ArbeidsgiverOversiktDto.js';
import type { KontrollerInntektDto } from '@k9-sak-web/backend/ungsak/kontrakt/kontroll/KontrollerInntektDto.js';
import type { FastsettInntektDto } from '@k9-sak-web/backend/ungsak/kontrakt/kontroll/FastsettInntektDto.ts';
import type { BackendTilhørighet } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';

export interface AktivitetspengerBeregningBackendApiType extends BackendTilhørighet {
  getKontrollerInntekt(behandlingUuid: string): Promise<KontrollerInntektDto>;
  getArbeidsgiverOpplysninger(behandlingUuid: string): Promise<ArbeidsgiverOversiktDto>;
  bekreftKontrollerInntektAksjonspunkt(
    behandlingUuid: string,
    behandlingVersjon: number,
    fastsettInntektDto: FastsettInntektDto,
  ): Promise<void>;
}
