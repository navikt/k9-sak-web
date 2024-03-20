import { Button } from '@navikt/ds-react';
import moment from 'moment';
import { Column, Row } from 'nav-frontend-grid';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { change, clearFields, formPropTypes, getFormValues } from 'redux-form';
import { createSelector } from 'reselect';

import {
  CheckboxField,
  TextAreaField,
  behandlingForm,
  behandlingFormValueSelector,
  getBehandlingFormName,
  getBehandlingFormPrefix,
} from '@fpsak-frontend/form';
import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { AksjonspunktHelpTextTemp, FaktaGruppe, VerticalSpacer } from '@fpsak-frontend/shared-components';
import {
  DDMMYYYY_DATE_FORMAT,
  decodeHtmlEntity,
  getKodeverknavnFn,
  hasValidText,
  maxLength,
  minLength,
  required,
} from '@fpsak-frontend/utils';

import FeilutbetalingPerioderTable from './FeilutbetalingPerioderTable';

import styles from './feilutbetalingInfoPanel.module.css';

const formName = 'FaktaFeilutbetalingForm';
const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);
const feilutbetalingAksjonspunkter = [aksjonspunktCodesTilbakekreving.AVKLAR_FAKTA_FOR_FEILUTBETALING];

export class FeilutbetalingInfoPanelImpl extends Component {
  constructor(props) {
    super(props);
    this.onChangeÅrsak = this.onChangeÅrsak.bind(this);
    this.onChangeUnderÅrsak = this.onChangeUnderÅrsak.bind(this);
  }

  onChangeÅrsak(event, elementId, årsak) {
    const {
      behandlingFormPrefix,
      clearFields: clearFormFields,
      change: changeValue,
      formValues,
      behandlePerioderSamlet,
    } = this.props;

    if (behandlePerioderSamlet) {
      const { perioder } = formValues;
      const { value: nyÅrsak } = event.target;

      for (let i = 0; i < perioder.length; i += 1) {
        if (i !== elementId) {
          const { årsak: periodeÅrsak } = perioder[i];
          const periodeÅrsaker = [`perioder.${i}.${periodeÅrsak}`];
          clearFormFields(`${behandlingFormPrefix}.${formName}`, false, false, ...periodeÅrsaker);
          changeValue(`perioder.${i}.årsak`, nyÅrsak, true, false);
        }
      }
    }

    const fields = [`perioder.${elementId}.${årsak}`];
    clearFormFields(`${behandlingFormPrefix}.${formName}`, false, false, ...fields);
  }

  onChangeUnderÅrsak(event, elementId, årsak) {
    const { change: changeValue, formValues, behandlePerioderSamlet } = this.props;

    if (behandlePerioderSamlet) {
      const { perioder } = formValues;
      const { value: nyUnderÅrsak } = event.target;

      for (let i = 0; i < perioder.length; i += 1) {
        const { årsak: elementÅrsak } = perioder[i];
        /*
          Passer på at man endrer bare for perioder med samme årsak.
          Just in case noen har klikket av behandlePerioderSamlet, endret årsak og underÅrsak på element, og så klikket på behandlePerioderSamlet igjen.
        */
        if (i !== elementId && elementÅrsak === årsak) {
          changeValue(`perioder.${i}.${årsak}.underÅrsak`, nyUnderÅrsak, true, false);
        }
      }
    }
  }

  render() {
    const {
      hasOpenAksjonspunkter,
      feilutbetaling,
      årsaker,
      readOnly,
      merknaderFraBeslutter,
      behandlingId,
      behandlingVersjon,
      alleKodeverk,
      fpsakKodeverk,
      ...formProps
    } = this.props;

    const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
    const getFpsakKodeverknavn = getKodeverknavnFn(fpsakKodeverk, kodeverkTyper);

    return (
      <>
        <AksjonspunktHelpTextTemp isAksjonspunktOpen={hasOpenAksjonspunkter}>
          {[<FormattedMessage key="1" id="FeilutbetalingInfoPanel.Aksjonspunkt" />]}
        </AksjonspunktHelpTextTemp>
        <VerticalSpacer sixteenPx />
        <form onSubmit={formProps.handleSubmit}>
          <Row className={styles.smallMarginBottom}>
            <Column xs="12" md="6">
              <Row className={styles.smallMarginBottom}>
                <Column xs="12">
                  <Element>
                    <FormattedMessage id="FeilutbetalingInfoPanel.Feilutbetaling" />
                  </Element>
                </Column>
              </Row>
              <Row>
                <Column xs="12" md="4">
                  <Row>
                    <Column xs="12">
                      <Undertekst className={styles.undertekstMarginBottom}>
                        <FormattedMessage id="FeilutbetalingInfoPanel.PeriodeMedFeilutbetaling" />
                      </Undertekst>
                      <Normaltekst className={styles.smallPaddingRight}>
                        {`${moment(feilutbetaling.totalPeriodeFom).format(DDMMYYYY_DATE_FORMAT)} - ${moment(
                          feilutbetaling.totalPeriodeTom,
                        ).format(DDMMYYYY_DATE_FORMAT)}`}
                      </Normaltekst>
                    </Column>
                  </Row>
                </Column>
                <Column xs="12" md="4">
                  <Row>
                    <Column xs="12">
                      <Undertekst className={styles.undertekstMarginBottom}>
                        <FormattedMessage id="FeilutbetalingInfoPanel.FeilutbetaltBeløp" />
                      </Undertekst>
                      <Normaltekst className={styles.redText}>{feilutbetaling.aktuellFeilUtbetaltBeløp}</Normaltekst>
                    </Column>
                  </Row>
                </Column>
                <Column xs="12" md="4">
                  <Row>
                    <Column xs="12">
                      <Undertekst className={styles.undertekstMarginBottom}>
                        <FormattedMessage id="FeilutbetalingInfoPanel.TidligereVarseltBeløp" />
                      </Undertekst>
                      <Normaltekst className={styles.smallPaddingRight}>
                        {feilutbetaling.tidligereVarseltBeløp ? (
                          feilutbetaling.tidligereVarseltBeløp
                        ) : (
                          <FormattedMessage id="FeilutbetalingInfoPanel.IkkeVarslet" />
                        )}
                      </Normaltekst>
                    </Column>
                  </Row>
                </Column>
              </Row>
              <Row className={styles.smallMarginTop}>
                <Column xs="11">
                  <CheckboxField
                    name="behandlePerioderSamlet"
                    label={{ id: 'FeilutbetalingInfoPanel.BehandlePerioderSamlet' }}
                    readOnly={readOnly}
                  />
                </Column>
              </Row>
              <Row className={styles.smallMarginTop}>
                <Column xs="11">
                  <FaktaGruppe merknaderFraBeslutter={merknaderFraBeslutter} withoutBorder>
                    <FeilutbetalingPerioderTable
                      behandlingId={behandlingId}
                      behandlingVersjon={behandlingVersjon}
                      perioder={feilutbetaling.perioder}
                      formName={formName}
                      årsaker={årsaker}
                      readOnly={readOnly}
                      onChangeÅrsak={this.onChangeÅrsak}
                      onChangeUnderÅrsak={this.onChangeUnderÅrsak}
                    />
                  </FaktaGruppe>
                </Column>
              </Row>
            </Column>
            <Column xs="12" md="6">
              <Row className={styles.smallMarginBottom}>
                <Column xs="12">
                  <Element>
                    <FormattedMessage id="FeilutbetalingInfoPanel.Revurdering" />
                  </Element>
                </Column>
              </Row>
              <Row>
                <Column xs="6">
                  <Undertekst className={styles.undertekstMarginBottom}>
                    <FormattedMessage id="FeilutbetalingInfoPanel.Årsaker" />
                  </Undertekst>
                  {feilutbetaling.behandlingÅrsaker && (
                    <Normaltekst className={styles.smallPaddingRight}>
                      {feilutbetaling.behandlingÅrsaker
                        .map(ba => getFpsakKodeverknavn(ba.behandlingArsakType))
                        .join(', ')}
                    </Normaltekst>
                  )}
                </Column>
                {feilutbetaling.datoForRevurderingsvedtak && (
                  <Column xs="6">
                    <Undertekst className={styles.undertekstMarginBottom}>
                      <FormattedMessage id="FeilutbetalingInfoPanel.DatoForRevurdering" />
                    </Undertekst>
                    <Normaltekst className={styles.smallPaddingRight}>
                      {moment(feilutbetaling.datoForRevurderingsvedtak).format(DDMMYYYY_DATE_FORMAT)}
                    </Normaltekst>
                  </Column>
                )}
              </Row>
              <Row className={styles.smallMarginTop}>
                <Column xs="6">
                  <Undertekst className={styles.undertekstMarginBottom}>
                    <FormattedMessage id="FeilutbetalingInfoPanel.Resultat" />
                  </Undertekst>
                  {feilutbetaling.behandlingsresultat && (
                    <Normaltekst className={styles.smallPaddingRight}>
                      {getFpsakKodeverknavn(feilutbetaling.behandlingsresultat.type)}
                    </Normaltekst>
                  )}
                </Column>
                <Column xs="6">
                  <Undertekst className={styles.undertekstMarginBottom}>
                    <FormattedMessage id="FeilutbetalingInfoPanel.Konsekvens" />
                  </Undertekst>
                  {feilutbetaling.behandlingsresultat && (
                    <Normaltekst className={styles.smallPaddingRight}>
                      {feilutbetaling.behandlingsresultat.konsekvenserForYtelsen &&
                        feilutbetaling.behandlingsresultat.konsekvenserForYtelsen
                          .map(ba => getFpsakKodeverknavn(ba))
                          .join(', ')}
                    </Normaltekst>
                  )}
                </Column>
              </Row>
              <Row className={styles.smallMarginTop}>
                <Column xs="6">
                  <Undertekst className={styles.undertekstMarginBottom}>
                    <FormattedMessage id="FeilutbetalingInfoPanel.Tilbakekrevingsvalg" />
                  </Undertekst>
                  {feilutbetaling.tilbakekrevingValg && (
                    <Normaltekst className={styles.smallPaddingRight}>
                      {getKodeverknavn(feilutbetaling.tilbakekrevingValg.videreBehandling)}
                    </Normaltekst>
                  )}
                </Column>
              </Row>
            </Column>
          </Row>
          <Row>
            <Column md="6">
              <TextAreaField
                name="begrunnelse"
                label={{ id: 'FeilutbetalingInfoPanel.Begrunnelse' }}
                validate={[required, minLength3, maxLength1500, hasValidText]}
                maxLength={1500}
                readOnly={readOnly}
                id="begrunnelse"
              />
            </Column>
          </Row>
          <VerticalSpacer eightPx />
          <Row>
            <Column md="6">
              <Button
                variant="primary"
                size="small"
                type="button"
                onClick={formProps.handleSubmit}
                disabled={formProps.pristine || formProps.submitting}
                loading={formProps.submitting}
              >
                <FormattedMessage id="FeilutbetalingInfoPanel.Confirm" />
              </Button>
            </Column>
          </Row>
        </form>
      </>
    );
  }
}

FeilutbetalingInfoPanelImpl.propTypes = {
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  feilutbetaling: PropTypes.shape().isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  fpsakKodeverk: PropTypes.shape().isRequired,
  submitCallback: PropTypes.func.isRequired,
  årsaker: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  merknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool,
  }),
  ...formPropTypes,
};

const buildInitialValues = createSelector([ownProps => ownProps.feilutbetalingFakta], feilutbetalingFakta => {
  const { perioder, begrunnelse } = feilutbetalingFakta;
  return {
    begrunnelse: decodeHtmlEntity(begrunnelse),
    perioder: Array.isArray(perioder)
      ? perioder
          .sort((a, b) => moment(a.fom) - moment(b.fom))
          .map(p => {
            const { fom, tom, feilutbetalingÅrsakDto } = p;

            const period = { fom, tom };

            if (!feilutbetalingÅrsakDto) {
              return period;
            }

            const { hendelseType, hendelseUndertype } = feilutbetalingÅrsakDto;

            return {
              ...period,
              årsak: hendelseType.kode,
              [hendelseType.kode]: {
                underÅrsak: hendelseUndertype ? hendelseUndertype.kode : null,
              },
            };
          })
      : [],
  };
});

const getSortedFeilutbetalingArsaker = createSelector(
  [ownProps => ownProps.feilutbetalingAarsak],
  feilutbetalingArsaker => {
    const { hendelseTyper } = feilutbetalingArsaker;
    return Array.isArray(hendelseTyper)
      ? hendelseTyper.sort((ht1, ht2) => {
          const hendelseType1 = ht1.hendelseType.navn;
          const hendelseType2 = ht2.hendelseType.navn;
          const hendelseType1ErParagraf = hendelseType1.startsWith('§');
          const hendelseType2ErParagraf = hendelseType2.startsWith('§');
          const ht1v = hendelseType1ErParagraf ? hendelseType1.replace(/\D/g, '') : hendelseType1;
          const ht2v = hendelseType2ErParagraf ? hendelseType2.replace(/\D/g, '') : hendelseType2;
          return hendelseType1ErParagraf && hendelseType2ErParagraf ? ht1v - ht2v : ht1v.localeCompare(ht2v);
        })
      : [];
  },
);

const transformValues = (values, aksjonspunkter, årsaker) => {
  const apCode = aksjonspunkter.find(ap => ap.definisjon.kode === feilutbetalingAksjonspunkter[0]);

  const feilutbetalingFakta = values.perioder.map(periode => {
    const feilutbetalingÅrsak = årsaker.find(el => el.hendelseType.kode === periode.årsak);
    const findUnderÅrsakObjekt = underÅrsak =>
      feilutbetalingÅrsak.hendelseUndertyper.find(el => el.kode === underÅrsak);
    const feilutbetalingUnderÅrsak = periode[periode.årsak]
      ? findUnderÅrsakObjekt(periode[periode.årsak].underÅrsak)
      : false;

    return {
      fom: periode.fom,
      tom: periode.tom,
      årsak: {
        hendelseType: feilutbetalingÅrsak.hendelseType,
        hendelseUndertype: feilutbetalingUnderÅrsak,
      },
    };
  });

  return [
    {
      kode: apCode.definisjon.kode,
      begrunnelse: values.begrunnelse,
      feilutbetalingFakta,
    },
  ];
};
const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const årsaker = getSortedFeilutbetalingArsaker(initialOwnProps);
  const submitCallback = values =>
    initialOwnProps.submitCallback(transformValues(values, initialOwnProps.aksjonspunkter, årsaker));
  return (state, ownProps) => ({
    årsaker,
    feilutbetaling: initialOwnProps.feilutbetalingFakta,
    initialValues: buildInitialValues(ownProps),
    behandlingFormPrefix: getBehandlingFormPrefix(ownProps.behandlingId, ownProps.behandlingVersjon),
    merknaderFraBeslutter:
      ownProps.alleMerknaderFraBeslutter[aksjonspunktCodesTilbakekreving.AVKLAR_FAKTA_FOR_FEILUTBETALING],
    behandlePerioderSamlet: behandlingFormValueSelector(
      formName,
      ownProps.behandlingId,
      ownProps.behandlingVersjon,
    )(state, 'behandlePerioderSamlet'),
    formValues:
      getFormValues(getBehandlingFormName(ownProps.behandlingId, ownProps.behandlingVersjon, formName))(state) || {},
    onSubmit: submitCallback,
  });
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      clearFields,
      change,
    },
    dispatch,
  ),
});

const FeilutbetalingForm = behandlingForm({
  form: formName,
})(FeilutbetalingInfoPanelImpl);
export default connect(mapStateToPropsFactory, mapDispatchToProps)(FeilutbetalingForm);
