import type { BekreftedeAksjonspunkterDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/BekreftedeAksjonspunkterDto.js';
import type { BekreftetOgOverstyrteAksjonspunkterDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/BekreftetOgOverstyrteAksjonspunkterDto.js';
import type { ArbeidsgiverOversiktDto } from '@k9-sak-web/backend/k9sak/kontrakt/arbeidsforhold/ArbeidsgiverOversiktDto.js';
import type { InntektgraderingDto } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/inntektgradering/InntektgraderingDto.js';
import type { OverstyrbareUttakAktiviterDto } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/overstyring/OverstyrbareUttakAktiviterDto.js';
import type { OverstyrtUttakDto } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/overstyring/OverstyrtUttakDto.js';
import type { EgneOverlappendeSakerDto } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/søskensaker/EgneOverlappendeSakerDto.js';
import type { OverstyrbareAktiviteterForUttakRequest } from '@k9-sak-web/backend/k9sak/tjenester/behandling/uttak/overstyring/OverstyrbareAktiviteterForUttakRequest.js';
import type { UttaksplanMedUtsattePerioder } from '@k9-sak-web/backend/k9sak/tjenester/behandling/uttak/UttaksplanMedUtsattePerioder.js';
import type { BackendTilhørighet } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';

export interface UttakBackendApiType extends BackendTilhørighet {
  hentUttak(behandlingUuid: string): Promise<UttaksplanMedUtsattePerioder>;
  getEgneOverlappendeSaker(behandlingUuid: string): Promise<EgneOverlappendeSakerDto>;
  bekreftAksjonspunkt(requestBody: BekreftedeAksjonspunkterDto): Promise<void>;
  hentOverstyringUttak(behandlingUuid: string): Promise<OverstyrtUttakDto>;
  hentAktuelleAktiviteter(
    behandlingUuid: OverstyrbareAktiviteterForUttakRequest['behandlingIdDto'],
    fom: OverstyrbareAktiviteterForUttakRequest['fom'],
    tom: OverstyrbareAktiviteterForUttakRequest['tom'],
  ): Promise<OverstyrbareUttakAktiviterDto>;
  getArbeidsgivere(behandlingUuid: string): Promise<ArbeidsgiverOversiktDto>;
  overstyringUttak(requestBody: BekreftetOgOverstyrteAksjonspunkterDto): Promise<void>;
  hentInntektsgraderinger(behandlingUuid: string): Promise<InntektgraderingDto>;
}
