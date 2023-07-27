import React from 'react';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { TilgjengeligeVedtaksbrev } from '@fpsak-frontend/utils/src/formidlingUtils';

import {
  ArbeidsgiverOpplysningerPerId,
  Behandlingsresultat,
  Kodeverk,
  KodeverkMedNavn,
  Personopplysninger,
  SimuleringResultat,
  Vilkar,
} from '@k9-sak-web/types';
import { DokumentDataType, LagreDokumentdataType } from '@k9-sak-web/types/src/dokumentdata';
import BehandlingArsaker from '../types/behandlingArsaker';
import OverlappendeYtelseType from '../types/overlappendeYtelseType';
import VedtakAksjonspunkterType from '../types/vedtakAksjonspunkterType';
import vedtakBeregningsgrunnlagPropType from '../types/vedtakBeregningsgrunnlagType';

import VedtakOriginalBehandlingType from '../types/vedtakOriginalBehandlingType';
import VedtakTilbakekrevingvalgType from '../types/vedtakTilbakekrevingvalgType';
import vedtakVarselPropType from '../types/vedtakVarselType';
import { InformasjonsbehovVedtaksbrev } from './brev/InformasjonsbehovAutomatiskVedtaksbrev';
import { UstrukturerteDokumenterType } from './UstrukturerteDokumenter';
import VedtakForm from './VedtakForm';
import { finnSistePeriodeMedAvslagsårsakBeregning } from './VedtakHelper';
import VedtakSjekkTilbakekreving from './VedtakSjekkTilbakekreving';

/*
 * VedtakPanels
 *
 * Presentasjonskomponent.
 */

interface VedtakPanelsProps {
  behandlingresultat: Behandlingsresultat;
  sprakkode: Kodeverk;
  behandlingStatus: Kodeverk;
  behandlingPaaVent: boolean;
  behandlingArsaker: BehandlingArsaker[];
  tilbakekrevingvalg?: VedtakTilbakekrevingvalgType;
  simuleringResultat?: SimuleringResultat;
  resultatstruktur: VedtakOriginalBehandlingType;
  medlemskapFom?: string;
  aksjonspunkter: VedtakAksjonspunkterType[];
  ytelseTypeKode: string;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  personopplysninger?: Personopplysninger;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  vilkar: Vilkar[];
  resultatstrukturOriginalBehandling?: VedtakOriginalBehandlingType;
  readOnly: boolean;
  previewCallback: () => void;
  submitCallback: () => void;
  behandlingTypeKode: string;
  beregningsgrunnlag?: vedtakBeregningsgrunnlagPropType[];
  vedtakVarsel?: vedtakVarselPropType;
  tilgjengeligeVedtaksbrev?: TilgjengeligeVedtaksbrev;
  informasjonsbehovVedtaksbrev?: InformasjonsbehovVedtaksbrev;
  dokumentdata?: DokumentDataType;
  fritekstdokumenter?: UstrukturerteDokumenterType[];
  lagreDokumentdata: LagreDokumentdataType;
  overlappendeYtelser?: OverlappendeYtelseType[];
  hentFritekstbrevHtmlCallback: () => void;
}

const VedtakPanels = ({
  readOnly,
  previewCallback,
  hentFritekstbrevHtmlCallback,
  submitCallback,
  behandlingTypeKode,
  behandlingresultat,
  sprakkode,
  behandlingStatus,
  behandlingPaaVent,
  behandlingArsaker,
  tilbakekrevingvalg,
  simuleringResultat,
  resultatstruktur,
  medlemskapFom,
  aksjonspunkter,
  ytelseTypeKode,
  alleKodeverk,
  personopplysninger,
  arbeidsgiverOpplysningerPerId,
  vilkar,
  beregningsgrunnlag,
  resultatstrukturOriginalBehandling,
  vedtakVarsel,
  tilgjengeligeVedtaksbrev,
  informasjonsbehovVedtaksbrev,
  dokumentdata,
  fritekstdokumenter,
  lagreDokumentdata,
  overlappendeYtelser,
}: VedtakPanelsProps) => {
  const bg = Array.isArray(beregningsgrunnlag) ? beregningsgrunnlag.filter(Boolean) : [];
  const bgYtelsegrunnlag = bg[0]?.ytelsesspesifiktGrunnlag;
  let bgPeriodeMedAvslagsårsak;
  if (ytelseTypeKode === fagsakYtelseType.FRISINN && bgYtelsegrunnlag?.avslagsårsakPrPeriode) {
    bgPeriodeMedAvslagsårsak = finnSistePeriodeMedAvslagsårsakBeregning(
      bgYtelsegrunnlag.avslagsårsakPrPeriode,
      bg[0].beregningsgrunnlagPeriode,
    );
  }

  const skalViseSjekkTilbakekreving = !!aksjonspunkter.find(
    ap =>
      ap.definisjon.kode === aksjonspunktCodes.SJEKK_TILBAKEKREVING &&
      ap.erAktivt &&
      ap.kanLoses &&
      ap.status.kode === aksjonspunktStatus.OPPRETTET,
  );

  if (skalViseSjekkTilbakekreving)
    return <VedtakSjekkTilbakekreving readOnly={readOnly} submitCallback={submitCallback} />;

  return (
    <VedtakForm
      submitCallback={submitCallback}
      readOnly={readOnly}
      previewCallback={previewCallback}
      hentFritekstbrevHtmlCallback={hentFritekstbrevHtmlCallback}
      behandlingresultat={behandlingresultat}
      behandlingStatus={behandlingStatus}
      sprakkode={sprakkode}
      behandlingPaaVent={behandlingPaaVent}
      tilbakekrevingvalg={tilbakekrevingvalg}
      simuleringResultat={simuleringResultat}
      resultatstruktur={resultatstruktur}
      behandlingArsaker={behandlingArsaker}
      aksjonspunkter={aksjonspunkter}
      ytelseTypeKode={ytelseTypeKode}
      alleKodeverk={alleKodeverk}
      personopplysninger={personopplysninger}
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      vilkar={vilkar}
      vedtakVarsel={vedtakVarsel}
      tilgjengeligeVedtaksbrev={tilgjengeligeVedtaksbrev}
      informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
      dokumentdata={dokumentdata}
      fritekstdokumenter={fritekstdokumenter}
      lagreDokumentdata={lagreDokumentdata}
      overlappendeYtelser={overlappendeYtelser}
      resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
      bgPeriodeMedAvslagsårsak={bgPeriodeMedAvslagsårsak}
      medlemskapFom={medlemskapFom}
      erRevurdering={!!(behandlingTypeKode === behandlingType.REVURDERING && bg.length)}
    />
  );
};

VedtakPanels.defaultProps = {
  tilbakekrevingvalg: undefined,
  simuleringResultat: undefined,
};

export default VedtakPanels;
