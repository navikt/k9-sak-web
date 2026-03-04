import type { BeregningsgrunnlagDto } from '@k9-sak-web/backend/k9sak/kontrakt/BeregningsgrunnlagDto.js';
import type { SimuleringDto } from '@k9-sak-web/backend/k9sak/kontrakt/oppdrag/simulering/v1/SimuleringDto.js';
import { ArbeidsgiverOversiktDto } from '@k9-sak-web/backend/combined/kontrakt/arbeidsgiver/ArbeidsgiverOversiktDto.js';
import { BehandlingDto } from '@k9-sak-web/backend/k9sak/kontrakt/behandling/BehandlingDto.js';
import type { BeregningsgrunnlagKoblingDto } from '@k9-sak-web/backend/k9sak/kontrakt/beregningsgrunnlag/BeregningsgrunnlagKoblingDto.js';
import type { BeregningsresultatMedUtbetaltePeriodeDto } from '@k9-sak-web/backend/k9sak/kontrakt/beregningsresultat/BeregningsresultatMedUtbetaltePeriodeDto.js';
import type { MedlemV2Dto } from '@k9-sak-web/backend/k9sak/kontrakt/medlem/MedlemV2Dto.js';
import type { OpptjeningerDto } from '@k9-sak-web/backend/k9sak/kontrakt/opptjening/OpptjeningerDto.js';
import type { PersonopplysningDto } from '@k9-sak-web/backend/k9sak/kontrakt/person/PersonopplysningDto.js';
import type { SøknadsfristTilstandDto } from '@k9-sak-web/backend/k9sak/kontrakt/søknadsfrist/SøknadsfristTilstandDto.js';
import type { OverlappendeYtelseDto } from '@k9-sak-web/backend/k9sak/kontrakt/ytelser/OverlappendeYtelseDto.js';
import type { TilbakekrevingValgDto } from '@k9-sak-web/backend/k9sak/kontrakt/økonomi/tilbakekreving/TilbakekrevingValgDto.js';
import type { UttaksplanMedUtsattePerioder } from '@k9-sak-web/backend/k9sak/tjenester/behandling/uttak/UttaksplanMedUtsattePerioder.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { FagsakDto } from '@k9-sak-web/backend/k9sak/kontrakt/fagsak/FagsakDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/k9sak/kontrakt/vilkår/VilkårMedPerioderDto.js';

export interface K9SakProsessApi {
  getAksjonspunkter(behandlingUuid: string): Promise<AksjonspunktDto[]>;
  getVilkår(behandlingUuid: string): Promise<VilkårMedPerioderDto[]>;
  getFagsak(saksnummer: string): Promise<FagsakDto>;
  getUttaksplan(
    behandlingUuid: string,
  ): Promise<UttaksplanMedUtsattePerioder>;
  getBeregningsresultatMedUtbetaling(
    behandlingUuid: string,
  ): Promise<BeregningsresultatMedUtbetaltePeriodeDto>;
  getPersonopplysninger(behandlingUuid: string): Promise<PersonopplysningDto>;
  getArbeidsgiverOpplysninger(behandlingUuid: string): Promise<ArbeidsgiverOversiktDto>;
  getBeregningreferanserTilVurdering(
    behandlingUuid: string,
  ): Promise<BeregningsgrunnlagKoblingDto[]>;
  getAlleBeregningsgrunnlag(
    behandlingUuid: string,
  ): Promise<BeregningsgrunnlagDto[]>;
  getBehandling(behandlingUuid: string): Promise<BehandlingDto>;
  getSimuleringResultat(behandlingUuid: string): Promise<SimuleringDto>;
  getTilbakekrevingValg(behandlingUuid: string): Promise<TilbakekrevingValgDto>;
  getMedlemskap(behandlingUuid: string): Promise<MedlemV2Dto>;
  getOverlappendeYtelser(behandlingUuid: string): Promise<Array<OverlappendeYtelseDto>>;
  getOpptjening(behandlingUuid: string): Promise<OpptjeningerDto>;
  getSøknadsfristStatus(behandlingUuid: string): Promise<SøknadsfristTilstandDto>;
}
