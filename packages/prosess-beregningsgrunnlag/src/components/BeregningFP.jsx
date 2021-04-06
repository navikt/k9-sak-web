import { isBeregningAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
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
import SideMenu from '@navikt/nap-side-menu';
import classNames from 'classnames/bind';
import { Column, Row } from 'nav-frontend-grid';
import { Undertittel } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { FieldArray } from 'redux-form';
import { ProsessStegSubmitButton } from '@k9-sak-web/prosess-felles';
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
import { transformValues } from './beregningForm/BeregningForm';
import BeregningsgrunnlagFieldArrayComponent from './BeregningsgrunnlagFieldArrayComponent';
import styles from './beregningFP.less';
import beregningStyles from './beregningsgrunnlagPanel/beregningsgrunnlag.less';
import Beregningsgrunnlag from './beregningsgrunnlagPanel/Beregningsgrunnlag';
import AksjonspunktBehandlerTB from './arbeidstaker/AksjonspunktBehandlerTB';
import AksjonspunktBehandlerFL from './frilanser/AksjonspunktBehandlerFL';
import VurderOgFastsettSN from './selvstendigNaeringsdrivende/VurderOgFastsettSN';
import SkjeringspunktOgStatusPanel from './fellesPaneler/SkjeringspunktOgStatusPanel';
import GrunnlagForAarsinntektPanelAT from './arbeidstaker/GrunnlagForAarsinntektPanelAT';

const cx = classNames.bind(styles);

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
  bg && bg.aktivitetStatus
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

/**
 * BeregningFP
 *
 * Presentasjonskomponent. Holder på alle komponenter relatert til beregning av foreldrepenger.
 * Finner det gjeldende aksjonspunktet hvis vi har et.
 */

const formName = 'BeregningForm';

export const BeregningFP = props => {
  const {
    behandling,
    beregningsgrunnlag,
    aksjonspunkter,
    gjeldendeAksjonspunkter,
    submitCallback,
    readOnly,
    readOnlySubmitButton,
    vilkar,
    alleKodeverk,
    arbeidsgiverOpplysningerPerId,
    handleSubmit,
    // eslint-disable-next-line
    initialValues,
    intl,
  } = props;
  const skalBrukeSidemeny = beregningsgrunnlag.length > 1;
  const [aktivtBeregningsgrunnlagIndeks, setAktivtBeregningsgrunnlagIndeks] = useState(0);
  const aktivtBeregningsgrunnlag = beregningsgrunnlag[aktivtBeregningsgrunnlagIndeks];
  const vilkaarBG = getBGVilkar(vilkar);
  if (!aktivtBeregningsgrunnlag || vilkaarBG === undefined) {
    return visningForManglendeBG();
  }
  const relevanteStatuser = getRelevanteStatuser(aktivtBeregningsgrunnlag);

  const mainContainerClassnames = cx('mainContainer', { 'mainContainer--withSideMenu': skalBrukeSidemeny });

  return (
    <div className={mainContainerClassnames}>
      {skalBrukeSidemeny && (
        <div className={styles.sideMenuContainer}>
          <SideMenu
            links={beregningsgrunnlag.map((currentBeregningsgrunnlag, currentBeregningsgrunnlagIndex) => ({
              active: aktivtBeregningsgrunnlagIndeks === currentBeregningsgrunnlagIndex,
              label: `${intl.formatMessage({ id: 'Sidemeny.Beregningsgrunnlag' })} ${
                currentBeregningsgrunnlagIndex + 1
              }`,
            }))}
            onClick={clickedIndex => {
              setAktivtBeregningsgrunnlagIndeks(clickedIndex);
            }}
            theme="arrow"
          />
        </div>
      )}
      <div className={styles.contentContainer}>
        <form onSubmit={handleSubmit} className={beregningStyles.beregningForm}>
          <FieldArray
            name="beregningsgrunnlagListe"
            component={BeregningsgrunnlagFieldArrayComponent}
            props={{
              initialValues,
              aktivtBeregningsgrunnlagIndeks,
              aktivtBeregningsgrunnlag,
              gjeldendeAksjonspunkter,
              relevanteStatuser,
              submitCallback,
              readOnlySubmitButton,
              behandling,
              readOnly,
              vilkaarBG,
              alleKodeverk,
              arbeidsgiverOpplysningerPerId,
            }}
          />
          {aksjonspunkter.length > 0 && (
            <Row>
              <Column xs="12">
                <ProsessStegSubmitButton
                  formName={formName}
                  behandlingId={behandling.id}
                  behandlingVersjon={behandling.versjon}
                  isReadOnly={readOnly}
                  isSubmittable={!readOnlySubmitButton}
                  isBehandlingFormSubmitting={isBehandlingFormSubmitting}
                  isBehandlingFormDirty={isBehandlingFormDirty}
                  hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
                />
              </Column>
            </Row>
          )}
        </form>
      </div>
    </div>
  );
};

BeregningFP.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  submitCallback: PropTypes.func.isRequired,
  aksjonspunkter: PropTypes.arrayOf(beregningsgrunnlagAksjonspunkterPropType).isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  arbeidsgiverOpplysningerPerId: PropTypes.shape().isRequired,
  beregningsgrunnlag: PropTypes.arrayOf(beregningsgrunnlagPropType),
  vilkar: PropTypes.arrayOf(beregningsgrunnlagVilkarPropType).isRequired,
  behandling: beregningsgrunnlagBehandlingPropType,
  // eslint-disable-next-line
  handleSubmit: PropTypes.any.isRequired,
  // eslint-disable-next-line
  gjeldendeAksjonspunkter: PropTypes.any.isRequired,
  intl: PropTypes.shape().isRequired,
};

BeregningFP.defaultProps = {
  beregningsgrunnlag: undefined,
};

const getSammenligningsgrunnlagsPrStatus = bg =>
  bg && bg.sammenligningsgrunnlagPrStatus ? bg.sammenligningsgrunnlagPrStatus : undefined;

const formaterAksjonspunkter = (aksjonspunkter, perioder) =>
  flattenArray(aksjonspunkter).map(aksjonspunkt => {
    const { kode } = aksjonspunkt;
    return {
      '@type': kode,
      kode,
      begrunnelse: aksjonspunkt.begrunnelse,
      grunnlag: [
        {
          ...aksjonspunkt,
          periode: perioder.find(p => p.periode.fom === aksjonspunkt.skjæringstidspunkt).periode,
        },
      ],
    };
  });

export const buildInitialValuesForBeregningrunnlag = (beregningsgrunnlag, gjeldendeAksjonspunkter) => {
  if (!beregningsgrunnlag || !beregningsgrunnlag.beregningsgrunnlagPeriode) {
    return undefined;
  }
  const allePerioder = beregningsgrunnlag.beregningsgrunnlagPeriode;
  const gjeldendeDekningsgrad = beregningsgrunnlag.dekningsgrad;
  const alleAndelerIForstePeriode = beregningsgrunnlag.beregningsgrunnlagPeriode[0].beregningsgrunnlagPrStatusOgAndel;
  const arbeidstakerAndeler = alleAndelerIForstePeriode.filter(
    andel => andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER,
  );
  const frilanserAndeler = alleAndelerIForstePeriode.filter(
    andel => andel.aktivitetStatus.kode === aktivitetStatus.FRILANSER,
  );
  const selvstendigNaeringAndeler = alleAndelerIForstePeriode.filter(
    andel => andel.aktivitetStatus.kode === aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
  );
  const initialValues = {
    ...Beregningsgrunnlag.buildInitialValues(gjeldendeAksjonspunkter),
    ...AksjonspunktBehandlerTB.buildInitialValues(allePerioder),
    ...AksjonspunktBehandlerFL.buildInitialValues(frilanserAndeler),
    ...VurderOgFastsettSN.buildInitialValues(selvstendigNaeringAndeler, gjeldendeAksjonspunkter),
    ...GrunnlagForAarsinntektPanelAT.buildInitialValues(arbeidstakerAndeler),
    ...SkjeringspunktOgStatusPanel.buildInitialValues(gjeldendeDekningsgrad, gjeldendeAksjonspunkter),
  };
  return initialValues;
};

export const buildInitialValues = (beregningsgrunnlag, gjeldendeAksjonspunkter) =>
  beregningsgrunnlag.map(currentBeregningsgrunnlag =>
    buildInitialValuesForBeregningrunnlag(currentBeregningsgrunnlag, gjeldendeAksjonspunkter),
  );

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const { aksjonspunkter, submitCallback, beregningsgrunnlag, vilkar } = initialOwnProps;
  const gjeldendeAksjonspunkter = getAksjonspunkterForBeregning(aksjonspunkter);

  const onSubmit = values => {
    const fieldArrayValuesList = values.beregningsgrunnlagListe;
    const alleAksjonspunkter = fieldArrayValuesList.map(
      (currentBeregningsgrunnlagSkjemaverdier, currentBeregningsgrunnlagIndex) => {
        const opprinneligBeregningsgrunnlag = beregningsgrunnlag[currentBeregningsgrunnlagIndex];
        const allePerioder = opprinneligBeregningsgrunnlag
          ? opprinneligBeregningsgrunnlag.beregningsgrunnlagPeriode
          : [];
        const alleAndelerIForstePeriode =
          allePerioder && allePerioder.length > 0 ? allePerioder[0].beregningsgrunnlagPrStatusOgAndel : [];
        const sammenligningsgrunnlagPrStatus = getSammenligningsgrunnlagsPrStatus(opprinneligBeregningsgrunnlag);
        const relevanteStatuser = getRelevanteStatuser(opprinneligBeregningsgrunnlag);
        const samletSammenligningsgrunnnlag =
          sammenligningsgrunnlagPrStatus &&
          sammenligningsgrunnlagPrStatus.find(
            sammenLigGr => sammenLigGr.sammenligningsgrunnlagType.kode === sammenligningType.ATFLSN,
          );
        const harNyttIkkeSamletSammenligningsgrunnlag =
          sammenligningsgrunnlagPrStatus && !samletSammenligningsgrunnnlag;

        const transformedValues = transformValues(
          {
            ...currentBeregningsgrunnlagSkjemaverdier,
            skjæringstidspunkt:
              (typeof beregningsgrunnlag === 'object' && beregningsgrunnlag.skjæringstidspunkt) ||
              beregningsgrunnlag[currentBeregningsgrunnlagIndex].skjæringstidspunkt,
          },
          relevanteStatuser,
          alleAndelerIForstePeriode,
          gjeldendeAksjonspunkter,
          allePerioder,
          harNyttIkkeSamletSammenligningsgrunnlag,
        );

        return transformedValues;
      },
    );
    return submitCallback(formaterAksjonspunkter(alleAksjonspunkter, getBGVilkar(vilkar).perioder));
  };

  return (state, ownProps) => ({
    onSubmit,
    initialValues: {
      beregningsgrunnlagListe: buildInitialValues(ownProps.beregningsgrunnlag, ownProps.aksjonspunkter),
    },
    fieldArrayID: ownProps.fieldArrayID,
    gjeldendeAksjonspunkter,
  });
};

const BeregningK9Form = connect(mapStateToPropsFactory)(
  behandlingForm({
    form: formName,
  })(injectIntl(BeregningFP)),
);

export default BeregningK9Form;
