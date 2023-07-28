import { TilgjengeligeVedtaksbrev } from '@fpsak-frontend/utils/src/formidlingUtils';
import {
  ArbeidsgiverOpplysningerPerId,
  KodeverkMedNavn,
  Personopplysninger,
  SimuleringResultat,
  Vilkar,
} from '@k9-sak-web/types';
import { DokumentDataType, LagreDokumentdataType } from '@k9-sak-web/types/src/dokumentdata';
import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messages from '../i18n/nb_NO.json';
import { InformasjonsbehovVedtaksbrev } from './components/brev/InformasjonsbehovAutomatiskVedtaksbrev';
import { UstrukturerteDokumenterType } from './components/UstrukturerteDokumenter';
import VedtakPanels from './components/VedtakPanels';
import OverlappendeYtelseType from './types/overlappendeYtelseType';
import VedtakAksjonspunkterPropType from './types/vedtakAksjonspunkterType';
import VedtakBehandlingPropType from './types/vedtakBehandlingType';
import VedtakBeregningsgrunnlagPropType from './types/vedtakBeregningsgrunnlagType';
import VedtakMedlemskapType from './types/vedtakMedlemskapType';
import VedtakOriginalBehandlingType from './types/vedtakOriginalBehandlingType';
import VedtakTilbakekrevingvalgType from './types/vedtakTilbakekrevingvalgType';
import VedtakVarselPropType from './types/vedtakVarselType';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface VedtakProsessIndexProps {
  behandling: VedtakBehandlingPropType;
  beregningresultatForeldrepenger?: VedtakOriginalBehandlingType;
  vilkar: Vilkar[];
  beregningsresultatOriginalBehandling?: VedtakOriginalBehandlingType;
  medlemskap: VedtakMedlemskapType;
  aksjonspunkter: VedtakAksjonspunkterPropType[];
  simuleringResultat?: SimuleringResultat;
  tilbakekrevingvalg?: VedtakTilbakekrevingvalgType;
  submitCallback: () => void;
  previewCallback: () => void;
  isReadOnly: boolean;
  ytelseTypeKode: string;
  employeeHasAccess: boolean;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  personopplysninger?: Personopplysninger;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  beregningsgrunnlag?: VedtakBeregningsgrunnlagPropType[];
  vedtakVarsel?: VedtakVarselPropType;
  tilgjengeligeVedtaksbrev?: TilgjengeligeVedtaksbrev;
  informasjonsbehovVedtaksbrev?: InformasjonsbehovVedtaksbrev;
  dokumentdataHente?: DokumentDataType;
  fritekstdokumenter?: UstrukturerteDokumenterType[];
  lagreDokumentdata: LagreDokumentdataType;
  overlappendeYtelser?: OverlappendeYtelseType[];
  hentFritekstbrevHtmlCallback: () => void;
}

const VedtakProsessIndex = ({
  behandling,
  beregningresultatForeldrepenger,
  tilbakekrevingvalg,
  simuleringResultat,
  beregningsgrunnlag,
  vilkar,
  beregningsresultatOriginalBehandling,
  medlemskap,
  aksjonspunkter,
  isReadOnly,
  previewCallback,
  hentFritekstbrevHtmlCallback,
  submitCallback,
  ytelseTypeKode,
  alleKodeverk,
  personopplysninger,
  arbeidsgiverOpplysningerPerId,
  vedtakVarsel,
  tilgjengeligeVedtaksbrev,
  informasjonsbehovVedtaksbrev,
  dokumentdataHente,
  fritekstdokumenter,
  lagreDokumentdata,
  overlappendeYtelser,
}: VedtakProsessIndexProps) => (
  <RawIntlProvider value={intl}>
    <VedtakPanels
      behandlingTypeKode={behandling.type.kode}
      behandlingStatus={behandling.status}
      sprakkode={behandling.sprakkode}
      behandlingresultat={behandling.behandlingsresultat}
      behandlingPaaVent={behandling.behandlingPaaVent}
      behandlingArsaker={behandling.behandlingÅrsaker}
      beregningsgrunnlag={beregningsgrunnlag}
      vilkar={vilkar}
      tilbakekrevingvalg={tilbakekrevingvalg}
      simuleringResultat={simuleringResultat}
      resultatstruktur={beregningresultatForeldrepenger}
      resultatstrukturOriginalBehandling={beregningsresultatOriginalBehandling}
      medlemskapFom={medlemskap ? medlemskap.fom : undefined}
      aksjonspunkter={aksjonspunkter}
      ytelseTypeKode={ytelseTypeKode}
      readOnly={isReadOnly}
      previewCallback={previewCallback}
      hentFritekstbrevHtmlCallback={hentFritekstbrevHtmlCallback}
      submitCallback={submitCallback}
      alleKodeverk={alleKodeverk}
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

VedtakProsessIndex.defaultProps = {
  beregningresultatForeldrepenger: undefined,
  beregningsresultatOriginalBehandling: undefined,
  simuleringResultat: undefined,
  beregningsgrunnlag: undefined,
};

export default VedtakProsessIndex;
