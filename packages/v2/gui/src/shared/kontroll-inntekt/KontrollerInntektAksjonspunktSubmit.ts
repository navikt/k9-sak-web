import type { FastsettInntektPeriodeDto } from '@k9-sak-web/backend/ungsak/kontrakt/kontroll/FastsettInntektPeriodeDto.js';

export interface KontrollerInntektAksjonspunktSubmit {
  kode: string;
  begrunnelse: string;
  perioder: FastsettInntektPeriodeDto[];
}
