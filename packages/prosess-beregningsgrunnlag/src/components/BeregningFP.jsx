import { isBeregningAvklaringsbehov } from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovCodes';
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
import { SideMenu } from '@navikt/k9-react-components';
import classNames from 'classnames/bind';
import { Column, Row } from 'nav-frontend-grid';
import { Undertittel } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import moment from 'moment';
import { FieldArray } from 'redux-form';
import { ProsessStegSubmitButton } from '@k9-sak-web/prosess-felles';
import {
  behandlingForm,
  hasBehandlingFormErrorsOfType,
  isBehandlingFormDirty,
  isBehandlingFormSubmitting,
} from '@fpsak-frontend/form/src/behandlingForm';
import advarselIcon from '@fpsak-frontend/assets/images/advarsel.svg';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
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
  aksjonspunkter ? aksjonspunkter.filter(ap => isBeregningAvklaringsbehov(ap.definisjon.kode)) : [];
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

const erBGTilVurdering = (bgVilkar, beregningsgrunnlag) => {
  const stp = beregningsgrunnlag.skjæringstidspunkt;
  const perioderTilVurdering =
    bgVilkar && bgVilkar.perioder ? bgVilkar.perioder.filter(periode => !!periode.vurdersIBehandlingen) : [];
  return perioderTilVurdering.some(
    vkp => !moment(stp).isBefore(vkp.periode.fom) && !moment(stp).isAfter(vkp.periode.tom),
  );
};

const lagMenyProps = (kronologiskeGrunnlag, bgVilkår) => {
  const menyProps = {};
  kronologiskeGrunnlag.forEach((gr, index) => {
    menyProps[index] = {
      skalVurderes: erBGTilVurdering(bgVilkår, gr),
      stp: moment(gr.skjæringstidspunkt).format(DDMMYYYY_DATE_FORMAT),
    };
  });
  return menyProps;
};

const finnAvklaringsbehov = (aksjonspunkter, beregningsgrunnlag) => {
  if (beregningsgrunnlag.avklaringsbehov && beregningsgrunnlag.avklaringsbehov.length > 0) {
    return beregningsgrunnlag.avklaringsbehov;
  }
  return aksjonspunkter;
}

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
  const kronologiskeGrunnlag = beregningsgrunnlag.sort(
    (a, b) => moment(a.skjæringstidspunkt) - moment(b.skjæringstidspunkt),
  );
  const [aktivtBeregningsgrunnlagIndeks, setAktivtBeregningsgrunnlagIndeks] = useState(0);
  const aktivtBeregningsgrunnlag = kronologiskeGrunnlag[aktivtBeregningsgrunnlagIndeks];
  const vilkaarBG = getBGVilkar(vilkar);
  if (!aktivtBeregningsgrunnlag || vilkaarBG === undefined) {
    return visningForManglendeBG();
  }

  const avklaringsbehov = finnAvklaringsbehov(gjeldendeAksjonspunkter, aktivtBeregningsgrunnlag);
  const menyProps = lagMenyProps(kronologiskeGrunnlag, vilkaarBG);
  const relevanteStatuser = getRelevanteStatuser(aktivtBeregningsgrunnlag);

  const mainContainerClassnames = cx('mainContainer', { 'mainContainer--withSideMenu': skalBrukeSidemeny });
  const bgSkalVurderes = erBGTilVurdering(vilkaarBG, aktivtBeregningsgrunnlag);
  const harAvklaringsbehov = avklaringsbehov.length > 0;

  return (
    <div className={mainContainerClassnames}>
      {skalBrukeSidemeny && (
        <div className={styles.sideMenuContainer}>
          <SideMenu
            links={kronologiskeGrunnlag.map((currentBeregningsgrunnlag, currentBeregningsgrunnlagIndex) => ({
              iconSrc: menyProps[currentBeregningsgrunnlagIndex].skalVurderes && harAvklaringsbehov ? advarselIcon : null,
              active: aktivtBeregningsgrunnlagIndeks === currentBeregningsgrunnlagIndex,
              label: `${intl.formatMessage({ id: 'Sidemeny.Beregningsgrunnlag' })} ${
                menyProps[currentBeregningsgrunnlagIndex].stp
              }`,
            }))}
            onClick={setAktivtBeregningsgrunnlagIndeks}
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
              avklaringsbehov,
              relevanteStatuser,
              submitCallback,
              readOnlySubmitButton,
              behandling,
              readOnly,
              vilkaarBG,
              alleKodeverk,
              arbeidsgiverOpplysningerPerId,
              bgSkalVurderes,
            }}
          />
          {harAvklaringsbehov && (
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
  readOnlySubmitButton: PropTypes.bool.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  arbeidsgiverOpplysningerPerId: PropTypes.shape().isRequired,
  beregningsgrunnlag: PropTypes.arrayOf(beregningsgrunnlagPropType),
  vilkar: PropTypes.arrayOf(beregningsgrunnlagVilkarPropType).isRequired,
  behandling: beregningsgrunnlagBehandlingPropType,
  // eslint-disable-next-line
  handleSubmit: PropTypes.any.isRequired,
  // eslint-disable-next-line
  gjeldendeAksjonspunkter: PropTypes.arrayOf(beregningsgrunnlagAksjonspunkterPropType).isRequired,
  intl: PropTypes.shape().isRequired,
};

BeregningFP.defaultProps = {
  beregningsgrunnlag: undefined,
};

const formaterAksjonspunkter = (aksjonspunkter, perioder) =>
  aksjonspunkter.map((aksjonspunkt) => {
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

const harAvklaringsbehovIPanel = (avklaringsbehov) => avklaringsbehov.some(ab => isBeregningAvklaringsbehov(ab.definisjon.kode));

export const buildInitialValuesForBeregningrunnlag = (beregningsgrunnlag, gjeldendeAksjonspunkter, bgVilkar) => {
  if (!beregningsgrunnlag || !beregningsgrunnlag.beregningsgrunnlagPeriode) {
    return undefined;
  }
  const avklaringsbehov = finnAvklaringsbehov(gjeldendeAksjonspunkter, beregningsgrunnlag);
  const allePerioder = beregningsgrunnlag.beregningsgrunnlagPeriode;
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
    erTilVurdering: erBGTilVurdering(bgVilkar, beregningsgrunnlag) && harAvklaringsbehovIPanel(avklaringsbehov),
    skjæringstidspunkt: beregningsgrunnlag.skjæringstidspunkt,
    ...Beregningsgrunnlag.buildInitialValues(avklaringsbehov),
    ...AksjonspunktBehandlerTB.buildInitialValues(allePerioder),
    ...AksjonspunktBehandlerFL.buildInitialValues(frilanserAndeler),
    ...VurderOgFastsettSN.buildInitialValues(selvstendigNaeringAndeler, avklaringsbehov),
    ...GrunnlagForAarsinntektPanelAT.buildInitialValues(arbeidstakerAndeler),
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
    const alleAksjonspunkter = fieldArrayValuesList
      .filter(val => val.erTilVurdering)
      .flatMap((currentBeregningsgrunnlagSkjemaverdier, currentBeregningsgrunnlagIndex) => {
        const opprinneligBeregningsgrunnlag = beregningsgrunnlag[currentBeregningsgrunnlagIndex];
        const avklaringsbehov = finnAvklaringsbehov(gjeldendeAksjonspunkter, beregningsgrunnlag);
        const allePerioder = opprinneligBeregningsgrunnlag
          ? opprinneligBeregningsgrunnlag.beregningsgrunnlagPeriode
          : [];
        const alleAndelerIForstePeriode =
          allePerioder && allePerioder.length > 0 ? allePerioder[0].beregningsgrunnlagPrStatusOgAndel : [];
        const relevanteStatuser = getRelevanteStatuser(opprinneligBeregningsgrunnlag);
        const transformedValues = transformValues(
          currentBeregningsgrunnlagSkjemaverdier,
          relevanteStatuser,
          alleAndelerIForstePeriode,
          avklaringsbehov,
          allePerioder,
        );

        return transformedValues;
      });
    return submitCallback(formaterAksjonspunkter(alleAksjonspunkter, getBGVilkar(vilkar).perioder));
  };

  return (state, ownProps) => ({
    onSubmit,
    initialValues: {
      beregningsgrunnlagListe: buildInitialValues(
        ownProps.beregningsgrunnlag,
        ownProps.aksjonspunkter      ),
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
