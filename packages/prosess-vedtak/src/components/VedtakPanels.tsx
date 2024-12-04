import { useState } from 'react';

import { Alert, Button } from '@navikt/ds-react';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

import { ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/gui/utils/formidling.js';
import {
  AksjonspunktDto,
  BehandlingsresultatDto,
  BehandlingÅrsakDto,
  DokumentMedUstrukturerteDataDto,
  OverlappendeYtelseDto,
  PersonopplysningDto,
  TilbakekrevingValgDto,
  VilkårMedPerioderDto,
} from '@navikt/k9-sak-typescript-client';
import { Beregningsgrunnlag } from '../types/Beregningsgrunnlag';
import { DokumentDataType, LagreDokumentdataType } from '../types/Dokumentdata';
import { VedtakSimuleringResultat } from '../types/VedtakSimuleringResultat';
import { VedtakVarsel } from '../types/VedtakVarsel';
import { Vedtaksbrev } from '../types/Vedtaksbrev';
import VedtakForm from './VedtakForm';
import { finnSistePeriodeMedAvslagsårsakBeregning } from './VedtakHelper';
import VedtakSjekkTilbakekreving from './VedtakSjekkTilbakekreving';
import { InformasjonsbehovVedtaksbrev } from './brev/InformasjonsbehovAutomatiskVedtaksbrev';

interface VedtakPanelsProps {
  aksjonspunkter: AksjonspunktDto[];
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  behandlingPaaVent: boolean;
  behandlingresultat: BehandlingsresultatDto;
  behandlingStatus: string;
  behandlingTypeKode: string;
  behandlingÅrsaker?: BehandlingÅrsakDto[];
  beregningsgrunnlag: Beregningsgrunnlag[];
  dokumentdata: DokumentDataType;
  fritekstdokumenter: DokumentMedUstrukturerteDataDto[];
  hentFritekstbrevHtmlCallback: () => void;
  informasjonsbehovVedtaksbrev: InformasjonsbehovVedtaksbrev;
  lagreDokumentdata: LagreDokumentdataType;
  medlemskapFom: string | undefined;
  overlappendeYtelser: Array<OverlappendeYtelseDto>;
  personopplysninger: PersonopplysningDto;
  previewCallback: () => void;
  readOnly: boolean;
  simuleringResultat: VedtakSimuleringResultat;
  sprakkode: string;
  submitCallback: (data) => void;
  tilbakekrevingvalg: TilbakekrevingValgDto;
  tilgjengeligeVedtaksbrev: Vedtaksbrev;
  vedtakVarsel: VedtakVarsel;
  vilkar: VilkårMedPerioderDto[];
  ytelseTypeKode: string;
}

/*
 * VedtakPanels
 *
 * Presentasjonskomponent.
 */
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
  tilbakekrevingvalg,
  simuleringResultat,
  medlemskapFom,
  aksjonspunkter,
  ytelseTypeKode,
  personopplysninger,
  arbeidsgiverOpplysningerPerId,
  vilkar,
  beregningsgrunnlag,
  vedtakVarsel,
  tilgjengeligeVedtaksbrev,
  informasjonsbehovVedtaksbrev,
  dokumentdata,
  fritekstdokumenter,
  lagreDokumentdata,
  overlappendeYtelser,
  behandlingÅrsaker,
}: VedtakPanelsProps) => {
  const [redigerSjekkTilbakekreving, setRedigerSjekkTilbakekreving] = useState(false);
  const toggleSjekkTilbakekreving = () => setRedigerSjekkTilbakekreving(!redigerSjekkTilbakekreving);

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
      ap.definisjon === aksjonspunktCodes.SJEKK_TILBAKEKREVING &&
      ap.erAktivt &&
      ap.kanLoses &&
      ap.status === aksjonspunktStatus.OPPRETTET,
  );

  const skalKunneRedigereSjekkTilbakekreving = !!aksjonspunkter.find(
    ap =>
      ap.definisjon === aksjonspunktCodes.SJEKK_TILBAKEKREVING &&
      ap.erAktivt &&
      ap.kanLoses &&
      ap.status === aksjonspunktStatus.UTFORT,
  );

  if (skalViseSjekkTilbakekreving || redigerSjekkTilbakekreving)
    return (
      <VedtakSjekkTilbakekreving
        readOnly={readOnly}
        redigerSjekkTilbakekreving={redigerSjekkTilbakekreving}
        submitCallback={submitCallback}
        toggleSjekkTilbakekreving={toggleSjekkTilbakekreving}
      />
    );

  return (
    <>
      {skalKunneRedigereSjekkTilbakekreving && (
        <Alert variant="info" className="mb-8 w-fit">
          Det finnes aksjonspunkt for å sjekke tilbakekreving med status utført. Aksjonspunktet kan fortsatt løses ved å
          aktivere det igjen.
          <Button className="block mt-2" size="small" variant="primary" onClick={() => toggleSjekkTilbakekreving()}>
            Aktiver aksjonspunkt for å sjekke tilbakekreving
          </Button>
        </Alert>
      )}

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
        aksjonspunkter={aksjonspunkter}
        ytelseTypeKode={ytelseTypeKode}
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
        bgPeriodeMedAvslagsårsak={bgPeriodeMedAvslagsårsak}
        medlemskapFom={medlemskapFom}
        erRevurdering={!!(behandlingTypeKode === behandlingType.REVURDERING && bg.length)}
        behandlingÅrsaker={behandlingÅrsaker}
      />
    </>
  );
};

export default VedtakPanels;
