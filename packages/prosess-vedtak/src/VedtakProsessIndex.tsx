import { ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/gui/utils/formidling.js';
import {
  sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto,
  sak_kontrakt_behandling_BehandlingsresultatDto as BehandlingsresultatDto,
  sak_kontrakt_behandling_BehandlingÅrsakDto as BehandlingÅrsakDto,
  sak_kontrakt_vedtak_DokumentMedUstrukturerteDataDto as DokumentMedUstrukturerteDataDto,
  sak_kontrakt_ytelser_OverlappendeYtelseDto as OverlappendeYtelseDto,
  sak_kontrakt_person_PersonopplysningDto as PersonopplysningDto,
  sak_kontrakt_økonomi_tilbakekreving_TilbakekrevingValgDto as TilbakekrevingValgDto,
  sak_kontrakt_vilkår_VilkårMedPerioderDto as VilkårMedPerioderDto,
} from '@navikt/k9-sak-typescript-client';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messages from '../i18n/nb_NO.json';
import VedtakPanels from './components/VedtakPanels';
import { InformasjonsbehovVedtaksbrev } from './components/brev/InformasjonsbehovAutomatiskVedtaksbrev';
import { Beregningsgrunnlag } from './types/Beregningsgrunnlag';
import { DokumentDataType, LagreDokumentdataType } from './types/Dokumentdata';
import { VedtakSimuleringResultat } from './types/VedtakSimuleringResultat';
import { VedtakVarsel } from './types/VedtakVarsel';
import { Vedtaksbrev } from './types/Vedtaksbrev';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface VedtakProsessIndexProps {
  aksjonspunkter: AksjonspunktDto[];
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  behandling: {
    type: string;
    status: string;
    språkkode: string;
    behandlingsresultat?: BehandlingsresultatDto;
    behandlingPåVent: boolean;
    behandlingÅrsaker?: Array<BehandlingÅrsakDto>;
  };
  beregningsgrunnlag: Beregningsgrunnlag[];
  dokumentdataHente: DokumentDataType;
  fritekstdokumenter: DokumentMedUstrukturerteDataDto[];
  hentFritekstbrevHtmlCallback: () => void;
  informasjonsbehovVedtaksbrev: InformasjonsbehovVedtaksbrev;
  isReadOnly: boolean;
  lagreDokumentdata: LagreDokumentdataType;
  medlemskap: {
    fom: string;
  };
  overlappendeYtelser: Array<OverlappendeYtelseDto>;
  personopplysninger: PersonopplysningDto;
  previewCallback: () => Promise<any>;
  simuleringResultat: VedtakSimuleringResultat;
  submitCallback: (data) => void;
  tilbakekrevingvalg: TilbakekrevingValgDto;
  tilgjengeligeVedtaksbrev: Vedtaksbrev;
  vedtakVarsel: VedtakVarsel;
  vilkar: VilkårMedPerioderDto[];
  ytelseTypeKode: string;
}

const VedtakProsessIndex = ({
  aksjonspunkter,
  arbeidsgiverOpplysningerPerId,
  behandling,
  beregningsgrunnlag,
  dokumentdataHente,
  fritekstdokumenter,
  hentFritekstbrevHtmlCallback,
  informasjonsbehovVedtaksbrev,
  isReadOnly,
  lagreDokumentdata,
  medlemskap,
  overlappendeYtelser,
  personopplysninger,
  previewCallback,
  simuleringResultat,
  submitCallback,
  tilbakekrevingvalg,
  tilgjengeligeVedtaksbrev,
  vedtakVarsel,
  vilkar,
  ytelseTypeKode,
}: VedtakProsessIndexProps) => (
  <RawIntlProvider value={intl}>
    <VedtakPanels
      behandlingTypeKode={behandling.type}
      behandlingStatus={behandling.status}
      språkkode={behandling.språkkode}
      behandlingresultat={behandling.behandlingsresultat}
      behandlingPåVent={behandling.behandlingPåVent}
      behandlingÅrsaker={behandling.behandlingÅrsaker}
      beregningsgrunnlag={beregningsgrunnlag}
      vilkar={vilkar}
      tilbakekrevingvalg={tilbakekrevingvalg}
      simuleringResultat={simuleringResultat}
      medlemskapFom={medlemskap ? medlemskap.fom : undefined}
      aksjonspunkter={aksjonspunkter}
      ytelseTypeKode={ytelseTypeKode}
      readOnly={isReadOnly}
      previewCallback={previewCallback}
      hentFritekstbrevHtmlCallback={hentFritekstbrevHtmlCallback}
      submitCallback={submitCallback}
      personopplysninger={personopplysninger}
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      vedtakVarsel={vedtakVarsel}
      tilgjengeligeVedtaksbrev={tilgjengeligeVedtaksbrev}
      informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
      dokumentdata={dokumentdataHente}
      fritekstdokumenter={fritekstdokumenter}
      lagreDokumentdata={lagreDokumentdata}
      overlappendeYtelser={overlappendeYtelser}
    />
  </RawIntlProvider>
);

export default VedtakProsessIndex;
