import { isBeregningAvklaringsbehov } from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovCodes';
import aktivitetStatus, {
  isStatusArbeidstakerOrKombinasjon,
  isStatusDagpengerOrAAP,
  isStatusDagpenger,
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
import beregningsgrunnlagBehandlingPropType from '../propTypes/beregningsgrunnlagBehandlingPropType';
import beregningsgrunnlagPropType from '../propTypes/beregningsgrunnlagPropType';
import beregningsgrunnlagVilkarPropType from '../propTypes/beregningsgrunnlagVilkarPropType';
import { transformValues as transformBeregningsgrunnlagValues } from './beregningForm/BeregningForm';
import BeregningsgrunnlagFieldArrayComponent from './BeregningsgrunnlagFieldArrayComponent';
import styles from './beregningFP.less';
import beregningStyles from './beregningsgrunnlagPanel/beregningsgrunnlag.less';
import Beregningsgrunnlag from './beregningsgrunnlagPanel/Beregningsgrunnlag';
import AksjonspunktBehandlerTB from './arbeidstaker/AksjonspunktBehandlerTB';
import AksjonspunktBehandlerFL from './frilanser/AksjonspunktBehandlerFL';
import VurderOgFastsettSN from './selvstendigNaeringsdrivende/VurderOgFastsettSN';
import GrunnlagForAarsinntektPanelAT from './arbeidstaker/GrunnlagForAarsinntektPanelAT';
import beregningKoblingPropType from "../propTypes/beregningKoblingPropType";

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

const getRelevanteStatuser = bg =>
  bg && bg.aktivitetStatus
    ? {
      isArbeidstaker: bg.aktivitetStatus.some(({ kode }) => isStatusArbeidstakerOrKombinasjon(kode)),
      isFrilanser: bg.aktivitetStatus.some(({ kode }) => isStatusFrilanserOrKombinasjon(kode)),
      isSelvstendigNaeringsdrivende: bg.aktivitetStatus.some(({ kode }) => isStatusSNOrKombinasjon(kode)),
      harAndreTilstotendeYtelser: bg.aktivitetStatus.some(({ kode }) => isStatusTilstotendeYtelse(kode)),
      harDagpengerEllerAAP: bg.aktivitetStatus.some(({ kode }) => isStatusDagpengerOrAAP(kode)),
      isAAP: bg.aktivitetStatus.some(({ kode }) => kode === aktivitetStatus.ARBEIDSAVKLARINGSPENGER),
      isDagpenger: bg.aktivitetStatus.some(({ kode }) => isStatusDagpenger(kode)),
      skalViseBeregningsgrunnlag: bg.aktivitetStatus && bg.aktivitetStatus.length > 0,
      isKombinasjonsstatus:
        bg.aktivitetStatus.some(({ kode }) => isStatusKombinasjon(kode)) || bg.aktivitetStatus.length > 1,
      isMilitaer: bg.aktivitetStatus.some(({ kode }) => isStatusMilitaer(kode)),
    }
    : null;

const getBGVilkar = vilkar =>
  vilkar ? vilkar.find(v => v.vilkarType && v.vilkarType.kode === vilkarType.BEREGNINGSGRUNNLAGVILKARET) : undefined;

const erBGTilVurdering = (beregningreferanserTilVurdering, beregningsgrunnlag) => {
  const vilårsperiodeFom = beregningsgrunnlag.vilkårsperiodeFom;
  return beregningreferanserTilVurdering.some((kobling) => kobling.skjæringstidspunkt === vilårsperiodeFom && !kobling.erForlengelse)
};

const lagMenyProps = (kronologiskeGrunnlag, beregningreferanserTilVurdering) => {
  const menyProps = {};
  kronologiskeGrunnlag.forEach((gr, index) => {
    menyProps[index] = {
      skalVurderes: erBGTilVurdering(beregningreferanserTilVurdering, gr),
      stp: moment(gr.skjæringstidspunkt).format(DDMMYYYY_DATE_FORMAT),
    };
  });
  return menyProps;
};

const finnAvklaringsbehov = (beregningsgrunnlag) => beregningsgrunnlag.avklaringsbehov.filter(ab => isBeregningAvklaringsbehov(ab.definisjon.kode))

const harAvklaringsbehovSomkanLøses = (beregningsgrunnlag) =>
  beregningsgrunnlag.avklaringsbehov.some(ab => isBeregningAvklaringsbehov(ab.definisjon.kode) && ab.kanLoses)

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
    beregningreferanserTilVurdering,
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

  const avklaringsbehov = finnAvklaringsbehov(aktivtBeregningsgrunnlag);
  const menyProps = lagMenyProps(kronologiskeGrunnlag, beregningreferanserTilVurdering);

  const mainContainerClassnames = cx('mainContainer', { 'mainContainer--withSideMenu': skalBrukeSidemeny });
  const harAvklaringsbehov = avklaringsbehov.length > 0;

  return (
    <div className={mainContainerClassnames}>
      {skalBrukeSidemeny && (
        <div className={styles.sideMenuContainer}>
          <SideMenu
            links={kronologiskeGrunnlag.map((currentBeregningsgrunnlag, currentBeregningsgrunnlagIndex) => ({
              iconSrc: menyProps[currentBeregningsgrunnlagIndex].skalVurderes &&
                harAvklaringsbehovSomkanLøses(beregningsgrunnlag[currentBeregningsgrunnlagIndex]) ? advarselIcon : null,
              active: aktivtBeregningsgrunnlagIndeks === currentBeregningsgrunnlagIndex,
              label: `${intl.formatMessage({ id: 'Sidemeny.Beregningsgrunnlag' })} ${menyProps[currentBeregningsgrunnlagIndex].stp
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
              beregningsgrunnlag,
              submitCallback,
              readOnlySubmitButton,
              behandling,
              readOnly: readOnly || !erBGTilVurdering(beregningreferanserTilVurdering, aktivtBeregningsgrunnlag),
              vilkaarBG,
              alleKodeverk,
              arbeidsgiverOpplysningerPerId,
            }}
          />
          {harAvklaringsbehov && (
            <Row>
              <Column xs="12">
                <ProsessStegSubmitButton
                  formName={formName}
                  behandlingId={behandling.id}
                  behandlingVersjon={behandling.versjon}
                  isReadOnly={readOnly || !avklaringsbehov.some(ap => ap.kanLoses !== false)}
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
  handleSubmit: PropTypes.any.isRequired,
  intl: PropTypes.shape().isRequired,
  beregningreferanserTilVurdering: PropTypes.arrayOf(PropTypes.shape(beregningKoblingPropType)).isRequired,
};

BeregningFP.defaultProps = {
  beregningsgrunnlag: undefined,
};

const initAksjonspunktData = (aksjonspunktData) => ({
  '@type': aksjonspunktData.kode,
  kode: aksjonspunktData.kode,
  begrunnelse: aksjonspunktData.begrunnelse,
  grunnlag: [],
});

const mapTilSubmitGrunnlagsdata = (aksjonspunktData, perioder) => ({
  ...aksjonspunktData,
  periode: perioder.find(p => p.periode.fom === aksjonspunktData.skjæringstidspunkt).periode,
});

const formaterAksjonspunkter = (aksjonspunkter, perioder) => {
  const gruppertPrKode = aksjonspunkter.reduce((gruppert, aksjonspunktData) => {
    gruppert[aksjonspunktData.kode] = gruppert[aksjonspunktData.kode] ?? initAksjonspunktData(aksjonspunktData);
    gruppert[aksjonspunktData.kode].grunnlag.push(mapTilSubmitGrunnlagsdata(aksjonspunktData, perioder));
    return gruppert;
  }, {});
  return Object.values(gruppertPrKode);
}

const harAvklaringsbehovIPanel = (avklaringsbehov) => avklaringsbehov.some(ab => isBeregningAvklaringsbehov(ab.definisjon.kode));

export const buildInitialValuesForBeregningrunnlag = (beregningsgrunnlag, beregningreferanserTilVurdering) => {
  if (!beregningsgrunnlag || !beregningsgrunnlag.beregningsgrunnlagPeriode) {
    return undefined;
  }
  const avklaringsbehov = finnAvklaringsbehov(beregningsgrunnlag);
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
    relevanteStatuser: getRelevanteStatuser(beregningsgrunnlag),
    avklaringsbehov,
    erTilVurdering: erBGTilVurdering(beregningreferanserTilVurdering, beregningsgrunnlag) && harAvklaringsbehovIPanel(avklaringsbehov),
    skjæringstidspunkt: beregningsgrunnlag.skjæringstidspunkt,
    ...Beregningsgrunnlag.buildInitialValues(avklaringsbehov),
    ...AksjonspunktBehandlerTB.buildInitialValues(allePerioder, avklaringsbehov),
    ...AksjonspunktBehandlerFL.buildInitialValues(frilanserAndeler),
    ...VurderOgFastsettSN.buildInitialValues(selvstendigNaeringAndeler, avklaringsbehov),
    ...GrunnlagForAarsinntektPanelAT.buildInitialValues(arbeidstakerAndeler),
  };
  return initialValues;
};

export const buildInitialValues = (beregningsgrunnlag, beregningreferanserTilVurdering) =>
  beregningsgrunnlag.map(currentBeregningsgrunnlag =>
    buildInitialValuesForBeregningrunnlag(currentBeregningsgrunnlag, beregningreferanserTilVurdering),
  );

// Kun eksportert for test
export const transformValues = (values, alleBeregningsgrunnlag, vilkar) => {
  const fieldArrayValuesList = values.beregningsgrunnlagListe;
  const alleAksjonspunkter = fieldArrayValuesList
    .flatMap((currentBeregningsgrunnlagSkjemaverdier, currentBeregningsgrunnlagIndex) => {
      // Indeks i visning må vere lik indeks i array alleBeregningsgrunnlag
      const opprinneligBeregningsgrunnlag = alleBeregningsgrunnlag[currentBeregningsgrunnlagIndex];
      const allePerioder = opprinneligBeregningsgrunnlag
        ? opprinneligBeregningsgrunnlag.beregningsgrunnlagPeriode
        : [];
      const alleAndelerIForstePeriode =
        allePerioder && allePerioder.length > 0 ? allePerioder[0].beregningsgrunnlagPrStatusOgAndel : [];
      if (!currentBeregningsgrunnlagSkjemaverdier.erTilVurdering) {
        return [];
      }
      const transformedValues = transformBeregningsgrunnlagValues(
        currentBeregningsgrunnlagSkjemaverdier,
        alleAndelerIForstePeriode,
        allePerioder,
      );

      return transformedValues;
    });
  return formaterAksjonspunkter(alleAksjonspunkter, getBGVilkar(vilkar).perioder);
}

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const { submitCallback, beregningsgrunnlag, vilkar, beregningreferanserTilVurdering } = initialOwnProps;
  const onSubmit = values => submitCallback(transformValues(values, beregningsgrunnlag, vilkar));
  return (state, ownProps) => ({
    onSubmit,
    initialValues: {
      beregningsgrunnlagListe: buildInitialValues(
        ownProps.beregningsgrunnlag,
        beregningreferanserTilVurdering
        ),
    },
    fieldArrayID: ownProps.fieldArrayID,
  });
};

const BeregningK9Form = connect(mapStateToPropsFactory)(
  behandlingForm({
    form: formName,
  })(injectIntl(BeregningFP)),
);

export default BeregningK9Form;
