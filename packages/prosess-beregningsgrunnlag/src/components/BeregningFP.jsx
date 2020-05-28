import aksjonspunktCodes, { isBeregningAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aktivitetStatus, {
  isStatusArbeidstakerOrKombinasjon,
  isStatusDagpengerOrAAP,
  isStatusFrilanserOrKombinasjon,
  isStatusKombinasjon,
  isStatusMilitaer,
  isStatusSNOrKombinasjon,
  isStatusTilstotendeYtelse,
} from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Column, Row } from 'nav-frontend-grid';
import { TabsPure } from 'nav-frontend-tabs';
import { Undertittel } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'redux-form';
import { BehandlingspunktSubmitButton } from '@fpsak-frontend/fp-felles';
import {
  behandlingForm,
  hasBehandlingFormErrorsOfType,
  isBehandlingFormDirty,
  isBehandlingFormSubmitting,
} from '@fpsak-frontend/form/src/behandlingForm';
import sammenligningType from '@fpsak-frontend/kodeverk/src/sammenligningType';
import { flattenArray } from 'less/lib/less/utils';
import beregningsgrunnlagAksjonspunkterPropType from '../propTypes/beregningsgrunnlagAksjonspunkterPropType';
import beregningsgrunnlagBehandlingPropType from '../propTypes/beregningsgrunnlagBehandlingPropType';
import beregningsgrunnlagPropType from '../propTypes/beregningsgrunnlagPropType';
import beregningsgrunnlagVilkarPropType from '../propTypes/beregningsgrunnlagVilkarPropType';
import BeregningForm2, { buildInitialValues, transformValues } from './beregningForm/BeregningForm';
import GraderingUtenBG2 from './gradering/GraderingUtenBG';
import beregningStyles from './beregningsgrunnlagPanel/beregningsgrunnlag.less';

const visningForManglendeBG = () => (
  <>
    <Undertittel>
      <FormattedMessage id="Beregningsgrunnlag.Title" />
    </Undertittel>
    <VerticalSpacer eightPx />
    <Row>
      <Column xs="6">
        <FormattedMessage id="Beregningsgrunnlag.HarIkkeBeregningsregler" />
      </Column>
    </Row>
  </>
);

const getAksjonspunkterForBeregning = aksjonspunkter =>
  aksjonspunkter ? aksjonspunkter.filter(ap => isBeregningAksjonspunkt(ap.definisjon.kode)) : [];
const getRelevanteStatuser = bg =>
  bg.aktivitetStatus
    ? {
        isArbeidstaker: bg.aktivitetStatus.some(({ kode }) => isStatusArbeidstakerOrKombinasjon(kode)),
        isFrilanser: bg.aktivitetStatus.some(({ kode }) => isStatusFrilanserOrKombinasjon(kode)),
        isSelvstendigNaeringsdrivende: bg.aktivitetStatus.some(({ kode }) => isStatusSNOrKombinasjon(kode)),
        harAndreTilstotendeYtelser: bg.aktivitetStatus.some(({ kode }) => isStatusTilstotendeYtelse(kode)),
        harDagpengerEllerAAP: bg.aktivitetStatus.some(({ kode }) => isStatusDagpengerOrAAP(kode)),
        isAAP: bg.aktivitetStatus.some(({ kode }) => kode === aktivitetStatus.ARBEIDSAVKLARINGSPENGER),
        isDagpenger: bg.aktivitetStatus.some(({ kode }) => kode === aktivitetStatus.DAGPENGER),
        skalViseBeregningsgrunnlag: bg.aktivitetStatus && bg.aktivitetStatus.length > 0,
        isKombinasjonsstatus:
          bg.aktivitetStatus.some(({ kode }) => isStatusKombinasjon(kode)) || bg.aktivitetStatus.length > 1,
        isMilitaer: bg.aktivitetStatus.some(({ kode }) => isStatusMilitaer(kode)),
      }
    : null;

const getBGVilkar = vilkar =>
  vilkar ? vilkar.find(v => v.vilkarType && v.vilkarType.kode === vilkarType.BEREGNINGSGRUNNLAGVILKARET) : undefined;

const getAksjonspunktForGraderingPaaAndelUtenBG = aksjonspunkter =>
  aksjonspunkter
    ? aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.VURDER_GRADERING_UTEN_BEREGNINGSGRUNNLAG)
    : undefined;

/**
 * BeregningFP
 *
 * Presentasjonskomponent. Holder på alle komponenter relatert til beregning av foreldrepenger.
 * Finner det gjeldende aksjonspunktet hvis vi har et.
 */

const formName = 'BeregningForm';

const BeregningFP = ({
  behandling,
  beregningsgrunnlag,
  aksjonspunkter,
  gjeldendeAksjonspunkter,
  submitCallback,
  readOnly,
  readOnlySubmitButton,
  vilkar,
  alleKodeverk,
  handleSubmit,
}) => {
  const harFlereBeregningsgrunnlag = Array.isArray(beregningsgrunnlag);
  const skalBrukeTabs = harFlereBeregningsgrunnlag && beregningsgrunnlag.length > 1;
  const [aktivtBeregningsgrunnlagIndeks, setAktivtBeregningsgrunnlagIndeks] = useState(0);
  const aktivtBeregningsrunnlag = harFlereBeregningsgrunnlag
    ? beregningsgrunnlag[aktivtBeregningsgrunnlagIndeks]
    : beregningsgrunnlag;
  if (!aktivtBeregningsrunnlag) {
    return visningForManglendeBG();
  }
  const relevanteStatuser = getRelevanteStatuser(aktivtBeregningsrunnlag);
  const vilkaarBG = getBGVilkar(vilkar);
  const sokerHarGraderingPaaAndelUtenBG = getAksjonspunktForGraderingPaaAndelUtenBG(aksjonspunkter);
  return (
    <>
      {skalBrukeTabs && (
        <TabsPure
          tabs={beregningsgrunnlag.map((currentBeregningsgrunnlag, currentBeregningsgrunnlagIndex) => ({
            aktiv: aktivtBeregningsgrunnlagIndeks === currentBeregningsgrunnlagIndex,
            label: `Beregningsgrunnlag ${currentBeregningsgrunnlagIndex + 1}`,
          }))}
          onChange={(e, clickedIndex) => setAktivtBeregningsgrunnlagIndeks(clickedIndex)}
        />
      )}
      <div style={{ paddingTop: skalBrukeTabs ? '16px' : '' }}>
        <form onSubmit={handleSubmit} className={beregningStyles.beregningForm}>
          <FieldArray
            name="beregningsgrunnlagListe"
            component={({ fields }) => {
              if (fields.length === 0) {
                if (harFlereBeregningsgrunnlag) {
                  beregningsgrunnlag.forEach(beregningsgrunnlagElement => {
                    fields.push(beregningsgrunnlagElement);
                  });
                } else {
                  fields.push(beregningsgrunnlag);
                }
              }
              return fields.map((fieldId, index) =>
                index === aktivtBeregningsgrunnlagIndeks ? (
                  <BeregningForm2
                    readOnly={readOnly}
                    fieldArrayID={fieldId}
                    beregningsgrunnlag={aktivtBeregningsrunnlag}
                    gjeldendeAksjonspunkter={gjeldendeAksjonspunkter}
                    relevanteStatuser={relevanteStatuser}
                    submitCallback={submitCallback}
                    readOnlySubmitButton={readOnlySubmitButton}
                    alleKodeverk={alleKodeverk}
                    behandlingId={behandling.id}
                    behandlingVersjon={behandling.versjon}
                    vilkaarBG={vilkaarBG}
                  />
                ) : null,
              );
            }}
          />
          <Row>
            <Column xs="12">
              <BehandlingspunktSubmitButton
                formName={formName}
                behandlingId={behandling.behandlingId}
                behandlingVersjon={behandling.behandlingVersjon}
                isReadOnly={readOnly}
                isSubmittable={!readOnlySubmitButton}
                isBehandlingFormSubmitting={isBehandlingFormSubmitting}
                isBehandlingFormDirty={isBehandlingFormDirty}
                hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
              />
            </Column>
          </Row>
        </form>

        {sokerHarGraderingPaaAndelUtenBG && (
          <GraderingUtenBG2
            submitCallback={submitCallback}
            readOnly={readOnly}
            behandlingId={behandling.id}
            behandlingVersjon={behandling.versjon}
            aksjonspunkter={aksjonspunkter}
            andelerMedGraderingUtenBG={aktivtBeregningsrunnlag.andelerMedGraderingUtenBG}
            alleKodeverk={alleKodeverk}
            venteaarsakKode={behandling.venteArsakKode}
          />
        )}
      </div>
    </>
  );
};

BeregningFP.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  submitCallback: PropTypes.func.isRequired,
  aksjonspunkter: PropTypes.arrayOf(beregningsgrunnlagAksjonspunkterPropType).isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  beregningsgrunnlag: PropTypes.oneOfType([beregningsgrunnlagPropType, PropTypes.arrayOf(beregningsgrunnlagPropType)]),
  vilkar: PropTypes.arrayOf(beregningsgrunnlagVilkarPropType).isRequired,
  behandling: beregningsgrunnlagBehandlingPropType,
  behandlingId: PropTypes.string.isRequired,
  behandlingVersjon: PropTypes.string.isRequired,
  // eslint-disable-next-line
  handleSubmit: PropTypes.any.isRequired,
  // eslint-disable-next-line
  gjeldendeAksjonspunkter: PropTypes.any.isRequired,
};

BeregningFP.defaultProps = {
  beregningsgrunnlag: undefined,
};

const getSammenligningsgrunnlagsPrStatus = bg =>
  bg.sammenligningsgrunnlagPrStatus ? bg.sammenligningsgrunnlagPrStatus : undefined;

const formaterAksjonspunkter = aksjonspunkter => {
  return flattenArray(aksjonspunkter).map(aksjonspunkt => {
    const { kode } = aksjonspunkt;
    return {
      '@type': kode,
      kode,
      grunnlag: [
        {
          '@type': kode,
          ...aksjonspunkt,
        },
      ],
    };
  });
};

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const { aksjonspunkter, submitCallback, beregningsgrunnlag } = initialOwnProps;
  const gjeldendeAksjonspunkter = getAksjonspunkterForBeregning(aksjonspunkter);

  const onSubmit = values => {
    const alleAksjonspunkter = values.beregningsgrunnlagListe.map(currentBeregningsgrunnlag => {
      const allePerioder = currentBeregningsgrunnlag ? currentBeregningsgrunnlag.beregningsgrunnlagPeriode : [];
      const alleAndelerIForstePeriode =
        allePerioder && allePerioder.length > 0 ? allePerioder[0].beregningsgrunnlagPrStatusOgAndel : [];
      const sammenligningsgrunnlagPrStatus = getSammenligningsgrunnlagsPrStatus(currentBeregningsgrunnlag);
      const relevanteStatuser = getRelevanteStatuser(currentBeregningsgrunnlag);
      const samletSammenligningsgrunnnlag =
        sammenligningsgrunnlagPrStatus &&
        sammenligningsgrunnlagPrStatus.find(
          sammenLigGr => sammenLigGr.sammenligningsgrunnlagType.kode === sammenligningType.ATFLSN,
        );
      const harNyttIkkeSamletSammenligningsgrunnlag = sammenligningsgrunnlagPrStatus && !samletSammenligningsgrunnnlag;
      return transformValues(
        currentBeregningsgrunnlag,
        relevanteStatuser,
        alleAndelerIForstePeriode,
        gjeldendeAksjonspunkter,
        allePerioder,
        harNyttIkkeSamletSammenligningsgrunnlag,
      );
    });
    return submitCallback(formaterAksjonspunkter(alleAksjonspunkter), beregningsgrunnlag);
  };
  return (state, ownProps) => ({
    onSubmit,
    initialValues: buildInitialValues(state, ownProps),
    fieldArrayID: ownProps.fieldArrayID,
    gjeldendeAksjonspunkter,
  });
};

const BeregningK9Form = connect(mapStateToPropsFactory)(
  behandlingForm({
    form: formName,
  })(BeregningFP),
);

export default BeregningK9Form;
