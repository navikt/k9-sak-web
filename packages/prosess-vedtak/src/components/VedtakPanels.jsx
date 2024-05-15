import React, { useState } from 'react';
// eslint-disable-next-line import/no-duplicates
import PropTypes from 'prop-types';

import { Alert, Button } from '@navikt/ds-react';

// eslint-disable-next-line import/no-duplicates
import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';

import vedtakAksjonspunkterPropType from '../propTypes/vedtakAksjonspunkterPropType';
import vedtakVilkarPropType from '../propTypes/vedtakVilkarPropType';
import vedtakBeregningsresultatPropType from '../propTypes/vedtakBeregningsresultatPropType';
import VedtakForm from './VedtakForm';
import { finnSistePeriodeMedAvslagsårsakBeregning } from './VedtakHelper';
import vedtakBeregningsgrunnlagPropType from '../propTypes/vedtakBeregningsgrunnlagPropType';
import vedtakVarselPropType from '../propTypes/vedtakVarselPropType';
import VedtakSjekkTilbakekreving from './VedtakSjekkTilbakekreving';

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
  behandlingId,
  behandlingVersjon,
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
  employeeHasAccess,
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
}) => {
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
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
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
        kanOverstyre={employeeHasAccess}
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
    </>
  );
};

VedtakPanels.propTypes = {
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  behandlingresultat: PropTypes.shape().isRequired,
  sprakkode: PropTypes.string.isRequired,
  behandlingStatus: kodeverkObjektPropType.isRequired,
  behandlingPaaVent: PropTypes.bool.isRequired,
  behandlingArsaker: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  tilbakekrevingvalg: PropTypes.shape(),
  simuleringResultat: PropTypes.shape(),
  resultatstruktur: vedtakBeregningsresultatPropType,
  medlemskapFom: PropTypes.string,
  aksjonspunkter: PropTypes.arrayOf(vedtakAksjonspunkterPropType).isRequired,
  ytelseTypeKode: PropTypes.string.isRequired,
  employeeHasAccess: PropTypes.bool.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  personopplysninger: PropTypes.shape(),
  arbeidsgiverOpplysningerPerId: PropTypes.shape().isRequired,
  vilkar: PropTypes.arrayOf(vedtakVilkarPropType.isRequired),
  resultatstrukturOriginalBehandling: vedtakBeregningsresultatPropType,
  readOnly: PropTypes.bool.isRequired,
  previewCallback: PropTypes.func.isRequired,
  submitCallback: PropTypes.func.isRequired,
  behandlingTypeKode: PropTypes.string.isRequired,
  beregningsgrunnlag: PropTypes.arrayOf(vedtakBeregningsgrunnlagPropType),
  vedtakVarsel: vedtakVarselPropType,
  tilgjengeligeVedtaksbrev: PropTypes.oneOfType([PropTypes.shape(), PropTypes.arrayOf(PropTypes.string)]),
  informasjonsbehovVedtaksbrev: PropTypes.shape({
    informasjonsbehov: PropTypes.arrayOf(PropTypes.shape({ type: PropTypes.string })),
  }),
  dokumentdata: PropTypes.shape(),
  fritekstdokumenter: PropTypes.arrayOf(PropTypes.shape()),
  lagreDokumentdata: PropTypes.func.isRequired,
  overlappendeYtelser: PropTypes.arrayOf(PropTypes.shape()),
  hentFritekstbrevHtmlCallback: PropTypes.func.isRequired,
};

VedtakPanels.defaultProps = {
  tilbakekrevingvalg: undefined,
  simuleringResultat: undefined,
  resultatstruktur: undefined,
};

export default VedtakPanels;
