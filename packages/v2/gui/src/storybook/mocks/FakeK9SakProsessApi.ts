import type { BeregningsgrunnlagDto } from '@k9-sak-web/backend/k9sak/kontrakt/BeregningsgrunnlagDto.js';
import type { SimuleringDto } from '@k9-sak-web/backend/k9sak/kontrakt/oppdrag/simulering/v1/SimuleringDto.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { ArbeidsgiverOversiktDto } from '@k9-sak-web/backend/combined/kontrakt/arbeidsgiver/ArbeidsgiverOversiktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/k9sak/kontrakt/behandling/BehandlingDto.js';
import type { BeregningsgrunnlagKoblingDto } from '@k9-sak-web/backend/k9sak/kontrakt/beregningsgrunnlag/BeregningsgrunnlagKoblingDto.js';
import type { BeregningsresultatMedUtbetaltePeriodeDto } from '@k9-sak-web/backend/k9sak/kontrakt/beregningsresultat/BeregningsresultatMedUtbetaltePeriodeDto.js';
import type { FagsakDto } from '@k9-sak-web/backend/k9sak/kontrakt/fagsak/FagsakDto.js';
import type { MedlemV2Dto } from '@k9-sak-web/backend/k9sak/kontrakt/medlem/MedlemV2Dto.js';
import type { OpptjeningerDto } from '@k9-sak-web/backend/k9sak/kontrakt/opptjening/OpptjeningerDto.js';
import type { PersonopplysningDto } from '@k9-sak-web/backend/k9sak/kontrakt/person/PersonopplysningDto.js';
import type { SøknadsfristTilstandDto } from '@k9-sak-web/backend/k9sak/kontrakt/søknadsfrist/SøknadsfristTilstandDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/k9sak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import type { OverlappendeYtelseDto } from '@k9-sak-web/backend/k9sak/kontrakt/ytelser/OverlappendeYtelseDto.js';
import type { TilbakekrevingValgDto } from '@k9-sak-web/backend/k9sak/kontrakt/økonomi/tilbakekreving/TilbakekrevingValgDto.js';
import type { UttaksplanMedUtsattePerioder } from '@k9-sak-web/backend/k9sak/tjenester/behandling/uttak/UttaksplanMedUtsattePerioder.js';

interface FakeK9SakProsessApiOptions {
  vilkår?: VilkårMedPerioderDto[];
  aksjonspunkter?: AksjonspunktDto[];
  uttak?: UttaksplanMedUtsattePerioder;
  beregningsresultatUtbetaling?: BeregningsresultatMedUtbetaltePeriodeDto;
  simuleringResultat?: SimuleringDto | null;
  fagsak?: FagsakDto;
  personopplysninger?: PersonopplysningDto;
  arbeidsgiverOpplysninger?: ArbeidsgiverOversiktDto;
  beregningreferanser?: BeregningsgrunnlagKoblingDto[];
  beregningsgrunnlag?: BeregningsgrunnlagDto[];
  behandling?: BehandlingDto;
  tilbakekrevingValg?: TilbakekrevingValgDto;
  medlemskap?: MedlemV2Dto;
  overlappendeYtelser?: OverlappendeYtelseDto[];
  opptjening?: OpptjeningerDto;
  søknadsfristStatus?: SøknadsfristTilstandDto;
}

export class FakeK9SakProsessApi {
  private options: FakeK9SakProsessApiOptions;

  constructor(options: FakeK9SakProsessApiOptions = {}) {
    this.options = options;
  }

  async getVilkår(): Promise<VilkårMedPerioderDto[]> {
    return this.options.vilkår ?? [];
  }

  async getAksjonspunkter(): Promise<AksjonspunktDto[]> {
    return this.options.aksjonspunkter ?? [];
  }

  async getUttaksplan(): Promise<UttaksplanMedUtsattePerioder> {
    return this.options.uttak ?? { uttaksplan: { perioder: {} }, simulertUttaksplan: { perioder: {} } };
  }

  async getBeregningsresultatMedUtbetaling(): Promise<BeregningsresultatMedUtbetaltePeriodeDto> {
    return this.options.beregningsresultatUtbetaling ?? { perioder: [] };
  }

  async getSimuleringResultat(): Promise<SimuleringDto> {
    return this.options.simuleringResultat ?? ({} as SimuleringDto);
  }

  async getFagsak(): Promise<FagsakDto> {
    return this.options.fagsak ?? ({} as FagsakDto);
  }

  async getPersonopplysninger(): Promise<PersonopplysningDto> {
    return this.options.personopplysninger ?? ({} as PersonopplysningDto);
  }

  async getArbeidsgiverOpplysninger(): Promise<ArbeidsgiverOversiktDto> {
    return this.options.arbeidsgiverOpplysninger ?? ({} as ArbeidsgiverOversiktDto);
  }

  async getBeregningreferanserTilVurdering(): Promise<
    BeregningsgrunnlagKoblingDto[]
  > {
    return this.options.beregningreferanser ?? [];
  }

  async getAlleBeregningsgrunnlag(): Promise<
    BeregningsgrunnlagDto[]
  > {
    return this.options.beregningsgrunnlag ?? [];
  }

  async getBehandling(): Promise<BehandlingDto> {
    return this.options.behandling ?? ({} as BehandlingDto);
  }

  async getTilbakekrevingValg(): Promise<TilbakekrevingValgDto> {
    return this.options.tilbakekrevingValg ?? ({} as TilbakekrevingValgDto);
  }

  async getMedlemskap(): Promise<MedlemV2Dto> {
    return this.options.medlemskap ?? ({} as MedlemV2Dto);
  }

  async getOverlappendeYtelser(): Promise<OverlappendeYtelseDto[]> {
    return this.options.overlappendeYtelser ?? [];
  }

  async getOpptjening(): Promise<OpptjeningerDto> {
    return this.options.opptjening ?? ({} as OpptjeningerDto);
  }

  async getSøknadsfristStatus(): Promise<SøknadsfristTilstandDto> {
    return this.options.søknadsfristStatus ?? ({} as SøknadsfristTilstandDto);
  }
}
