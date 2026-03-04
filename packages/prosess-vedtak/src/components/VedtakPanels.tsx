import { useState } from 'react';

import { Alert, Button } from '@navikt/ds-react';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';

import { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingÅrsakDto } from '@k9-sak-web/backend/k9sak/kontrakt/behandling/BehandlingÅrsakDto.js';
import type { DokumentMedUstrukturerteDataDto } from '@k9-sak-web/backend/k9sak/kontrakt/vedtak/DokumentMedUstrukturerteDataDto.js';
import { ArbeidsgiverOversiktDto } from '@k9-sak-web/backend/combined/kontrakt/arbeidsgiver/ArbeidsgiverOversiktDto.js';
import { BehandlingDto } from '@k9-sak-web/backend/k9sak/kontrakt/behandling/BehandlingDto.js';
import type { OverlappendeYtelseDto } from '@k9-sak-web/backend/k9sak/kontrakt/ytelser/OverlappendeYtelseDto.js';
import type { PersonopplysningDto } from '@k9-sak-web/backend/k9sak/kontrakt/person/PersonopplysningDto.js';
import type { TilbakekrevingValgDto } from '@k9-sak-web/backend/k9sak/kontrakt/økonomi/tilbakekreving/TilbakekrevingValgDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/k9sak/kontrakt/vilkår/VilkårMedPerioderDto.js';
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
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOversiktDto['arbeidsgivere'];
  behandlingPåVent: BehandlingDto['behandlingPåVent'];
  behandlingresultat: BehandlingDto['behandlingsresultat'];
  behandlingStatus: string;
  behandlingTypeKode: string;
  behandlingÅrsaker?: BehandlingÅrsakDto[];
  beregningsgrunnlag: Beregningsgrunnlag[];
  dokumentdata: DokumentDataType;
  fritekstdokumenter: DokumentMedUstrukturerteDataDto[];
  hentFritekstbrevHtmlCallback: (parameters: any) => void;
  informasjonsbehovVedtaksbrev: InformasjonsbehovVedtaksbrev;
  lagreDokumentdata: LagreDokumentdataType;
  medlemskapFom: string | undefined;
  overlappendeYtelser: Array<OverlappendeYtelseDto>;
  personopplysninger: PersonopplysningDto;
  previewCallback: (data: any, aapneINyttVindu: boolean) => Promise<any>;
  readOnly: boolean;
  simuleringResultat: VedtakSimuleringResultat;
  språkkode: string;
  submitCallback: (data) => void;
  tilbakekrevingvalg: TilbakekrevingValgDto;
  tilgjengeligeVedtaksbrev: Vedtaksbrev;
  vedtakVarsel?: VedtakVarsel;
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
  språkkode,
  behandlingStatus,
  behandlingPåVent,
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
  if (ytelseTypeKode === fagsakYtelsesType.FRISINN && bgYtelsegrunnlag?.avslagsårsakPrPeriode) {
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
        språkkode={språkkode}
        behandlingPåVent={behandlingPåVent}
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
