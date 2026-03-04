import { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { DokumentMedUstrukturerteDataDto } from '@k9-sak-web/backend/k9sak/kontrakt/vedtak/DokumentMedUstrukturerteDataDto.js';
import { ArbeidsgiverOversiktDto } from '@k9-sak-web/backend/combined/kontrakt/arbeidsgiver/ArbeidsgiverOversiktDto.js';
import { BehandlingDto } from '@k9-sak-web/backend/k9sak/kontrakt/behandling/BehandlingDto.js';
import type { OverlappendeYtelseDto } from '@k9-sak-web/backend/k9sak/kontrakt/ytelser/OverlappendeYtelseDto.js';
import type { PersonopplysningDto } from '@k9-sak-web/backend/k9sak/kontrakt/person/PersonopplysningDto.js';
import type { TilbakekrevingValgDto } from '@k9-sak-web/backend/k9sak/kontrakt/økonomi/tilbakekreving/TilbakekrevingValgDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/k9sak/kontrakt/vilkår/VilkårMedPerioderDto.js';
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
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOversiktDto['arbeidsgivere'];
  behandling: Pick<
    BehandlingDto,
    'type' | 'status' | 'behandlingsresultat' | 'behandlingPåVent' | 'behandlingÅrsaker'
  > & { språkkode: string };
  beregningsgrunnlag: Beregningsgrunnlag[];
  dokumentdataHente: DokumentDataType;
  fritekstdokumenter: DokumentMedUstrukturerteDataDto[];
  hentFritekstbrevHtmlCallback: (parameters: any) => Promise<any>;
  informasjonsbehovVedtaksbrev: InformasjonsbehovVedtaksbrev;
  isReadOnly: boolean;
  lagreDokumentdata: LagreDokumentdataType;
  medlemskap?: {
    fom: string;
  };
  overlappendeYtelser: Array<OverlappendeYtelseDto>;
  personopplysninger: PersonopplysningDto;
  previewCallback: (data: any, aapneINyttVindu: boolean) => Promise<any>;
  simuleringResultat: VedtakSimuleringResultat;
  submitCallback: (data) => void;
  tilbakekrevingvalg: TilbakekrevingValgDto;
  tilgjengeligeVedtaksbrev: Vedtaksbrev;
  vedtakVarsel?: VedtakVarsel;
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
