import questionHoverUrl from '@fpsak-frontend/assets/images/question_hover.svg';
import questionNormalUrl from '@fpsak-frontend/assets/images/question_normal.svg';
import {
  RadioGroupField,
  TextAreaField,
  behandlingForm,
  behandlingFormValueSelector,
  getBehandlingFormPrefix,
} from '@fpsak-frontend/form';
import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import tilbakekrevingVidereBehandling from '@fpsak-frontend/kodeverk/src/tilbakekrevingVidereBehandling';
import { AksjonspunktHelpText, ArrowBox, Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { getLanguageCodeFromspråkkode, hasValidText, maxLength, minLength, required } from '@fpsak-frontend/utils';
import { BodyShort, Button, Detail, HGrid, Heading, Label, VStack } from '@navikt/ds-react';
import KontrollerEtterbetalingAlert from '@k9-sak-web/gui/prosess/avregning/kontroller-etterbetaling/KontrollerEtterbetalingAlert';
import KontrollerEtterbetalingIndex from '@k9-sak-web/gui/prosess/avregning/kontroller-etterbetaling/KontrollerEtterbetalingIndex';
import { AksjonspunktDtoDefinisjon } from '@navikt/k9-sak-typescript-client';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { clearFields, formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';
import avregningSimuleringResultatPropType from '../propTypes/avregningSimuleringResultatPropType';
import AvregningSummary from './AvregningSummary';
import AvregningTable from './AvregningTable';

import styles from './avregningPanel.module.css';

// TODO Denne komponenten må refaktorerast! Er frykteleg stor

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);
const maxLength12000 = maxLength(12000);
const simuleringAksjonspunkter = [
  AksjonspunktDtoDefinisjon.VURDER_FEILUTBETALING,
  AksjonspunktDtoDefinisjon.SJEKK_HØY_ETTERBETALING,
];
const formName = 'AvregnigForm';
const IKKE_SEND = 'IKKE_SEND';

const getSimuleringResult = (simuleringResultat, feilutbetaling) => {
  if (!simuleringResultat) {
    return simuleringResultat;
  }
  return feilutbetaling === undefined || feilutbetaling
    ? simuleringResultat.simuleringResultat
    : simuleringResultat.simuleringResultatUtenInntrekk;
};

export class AvregningPanelImpl extends Component {
  static defaultProps = {
    simuleringResultat: null,
  };

  constructor() {
    super();
    this.toggleDetails = this.toggleDetails.bind(this);
    this.resetFields = this.resetFields.bind(this);
    this.previewMessage = this.previewMessage.bind(this);

    this.state = {
      showDetails: [],
      feilutbetaling: undefined,
    };
  }

  toggleDetails(id) {
    const { showDetails } = this.state;
    const tableIndex = showDetails.findIndex(table => table.id === id);
    let newShowDetailsArray = [];

    if (tableIndex !== -1) {
      const updatedTable = {
        id,
        show: !showDetails[tableIndex].show,
      };

      newShowDetailsArray = [
        ...showDetails.slice(0, tableIndex),
        updatedTable,
        ...showDetails.slice(tableIndex + 1, showDetails.length - 1),
      ];
    } else {
      newShowDetailsArray = showDetails.concat({
        id,
        show: true,
      });
    }
    this.setState({ showDetails: newShowDetailsArray });
  }

  resetFields() {
    const { behandlingFormPrefix, clearFields: clearFormFields } = this.props;
    const fields = ['videreBehandling'];
    clearFormFields(`${behandlingFormPrefix}.${formName}`, false, false, ...fields);
  }

  previewMessage(e, previewCallback) {
    const { varseltekst, saksnummer } = this.props;
    previewCallback('', dokumentMalType.TBKVAR, varseltekst || ' ', saksnummer);
    e.preventDefault();
  }

  render() {
    const { showDetails, feilutbetaling } = this.state;
    const {
      intl,
      simuleringResultat,
      isApOpen,
      apCodes,
      readOnly,
      språkkode,
      featureUtvidetVarselfelt,
      previewCallback,
      hasOpenTilbakekrevingsbehandling,
      aksjonspunkter,
      harVurderFeilutbetalingAP,
      harSjekkHøyEtterbetalingAP,
      behandling,
      ...formProps
    } = this.props;
    const simuleringResultatOption = getSimuleringResult(simuleringResultat, feilutbetaling);

    return (
      <>
        <VStack gap="8">
          <Heading size="small" level="2">
            <FormattedMessage id="Avregning.Title" />
          </Heading>
          {harSjekkHøyEtterbetalingAP && <KontrollerEtterbetalingAlert />}
          {simuleringResultatOption && (
            <VStack gap="2">
              <AksjonspunktHelpText isAksjonspunktOpen={harVurderFeilutbetalingAP}>
                {[<FormattedMessage id="Avregning.AksjonspunktHelpText.5084" key="vurderFeilutbetaling" />]}
              </AksjonspunktHelpText>

              <AvregningSummary
                fom={simuleringResultatOption.periode?.fom}
                tom={simuleringResultatOption.periode?.tom}
                feilutbetaling={simuleringResultatOption.sumFeilutbetaling}
                etterbetaling={simuleringResultatOption.sumEtterbetaling}
                inntrekk={simuleringResultatOption.sumInntrekk}
                ingenPerioderMedAvvik={simuleringResultatOption.ingenPerioderMedAvvik}
              />

              <AvregningTable
                showDetails={showDetails}
                toggleDetails={this.toggleDetails}
                simuleringResultat={simuleringResultatOption}
                ingenPerioderMedAvvik={simuleringResultatOption.ingenPerioderMedAvvik}
              />
              {hasOpenTilbakekrevingsbehandling && (
                <Label size="small" as="p">
                  <FormattedMessage id="Avregning.ApenTilbakekrevingsbehandling" />
                </Label>
              )}
            </VStack>
          )}
          {!simuleringResultat && <FormattedMessage id="Avregning.ingenData" />}
          {harVurderFeilutbetalingAP && (
            <VStack gap="2">
              <form onSubmit={formProps.handleSubmit}>
                <HGrid gap="1" columns={{ xs: '6fr 6fr' }}>
                  <TextAreaField
                    name="begrunnelse"
                    label={{ id: 'Avregning.vurdering' }}
                    validate={[required, minLength3, maxLength1500, hasValidText]}
                    maxLength={1500}
                    readOnly={readOnly}
                    id="avregningVurdering"
                  />
                  {harVurderFeilutbetalingAP && (
                    <div>
                      <Detail>
                        <FormattedMessage id="Avregning.videreBehandling" />
                      </Detail>
                      <VerticalSpacer eightPx />
                      <RadioGroupField
                        name="videreBehandling"
                        validate={[required]}
                        isVertical
                        readOnly={readOnly}
                        radios={[
                          {
                            value: tilbakekrevingVidereBehandling.TILBAKEKR_OPPRETT,
                            label: <FormattedMessage id="Avregning.gjennomfør" />,
                            element: (
                              <div className={styles.varsel}>
                                <ArrowBox alignOffset={20}>
                                  <HGrid gap="1" columns={{ xs: '10fr 2fr' }}>
                                    <BodyShort size="small" className={styles.bold}>
                                      <FormattedMessage id="Avregning.varseltekst" />
                                    </BodyShort>
                                    <div>
                                      <Image
                                        tabIndex="0"
                                        src={questionNormalUrl}
                                        srcHover={questionHoverUrl}
                                        alt={intl.formatMessage({ id: 'Avregning.HjelpetekstPleiepenger' })}
                                        tooltip={<FormattedMessage id="Avregning.HjelpetekstPleiepenger" />}
                                      />
                                    </div>
                                  </HGrid>
                                  <VerticalSpacer eightPx />
                                  <TextAreaField
                                    name="varseltekst"
                                    label={{ id: 'Avregning.fritekst' }}
                                    validate={[
                                      required,
                                      minLength3,
                                      featureUtvidetVarselfelt ? maxLength12000 : maxLength1500,
                                      hasValidText,
                                    ]}
                                    maxLength={featureUtvidetVarselfelt ? 12000 : 1500}
                                    readOnly={readOnly}
                                    id="avregningFritekst"
                                    badges={[
                                      {
                                        type: 'warning',
                                        textId: getLanguageCodeFromspråkkode(språkkode),
                                        title: 'Malform.Beskrivelse',
                                      },
                                    ]}
                                  />
                                  <VerticalSpacer fourPx />
                                  <a
                                    href=""
                                    onClick={e => {
                                      this.previewMessage(e, previewCallback);
                                    }}
                                    className={styles.previewLink}
                                  >
                                    <FormattedMessage id="Messages.PreviewText" />
                                  </a>
                                </ArrowBox>
                              </div>
                            ),
                          },
                          {
                            value: `${tilbakekrevingVidereBehandling.TILBAKEKR_OPPRETT}${IKKE_SEND}`,
                            label: <FormattedMessage id={'Avregning.OpprettMenIkkeSendVarsel'} />,
                          },
                          {
                            value: tilbakekrevingVidereBehandling.TILBAKEKR_IGNORER,
                            label: <FormattedMessage id="Avregning.avvent" />,
                          },
                        ]}
                      />
                    </div>
                  )}
                </HGrid>
                <HGrid className="mt-4" gap="1" columns={{ xs: '6fr 6fr' }}>
                  <div>
                    <Button
                      variant="primary"
                      size="small"
                      type="button"
                      onClick={formProps.handleSubmit}
                      disabled={formProps.invalid || formProps.pristine || formProps.submitting}
                      loading={formProps.submitting}
                    >
                      <FormattedMessage id="SubmitButton.ConfirmInformation" />
                    </Button>
                  </div>
                </HGrid>
              </form>
            </VStack>
          )}
          {harSjekkHøyEtterbetalingAP && (
            <KontrollerEtterbetalingIndex
              aksjonspunkt={aksjonspunkter.find(
                ap => ap.definisjon.kode === AksjonspunktDtoDefinisjon.SJEKK_HØY_ETTERBETALING,
              )}
              behandling={behandling}
              readOnly={readOnly}
            />
          )}
        </VStack>
      </>
    );
  }
}

AvregningPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  isApOpen: PropTypes.bool.isRequired,
  simuleringResultat: avregningSimuleringResultatPropType,
  previewCallback: PropTypes.func.isRequired,
  hasOpenTilbakekrevingsbehandling: PropTypes.bool.isRequired,
  ...formPropTypes,
};

export const transformValues = (values, ap) => {
  const { videreBehandling, varseltekst, begrunnelse } = values;
  const info = {
    kode: ap,
    begrunnelse,
    videreBehandling,
  };

  return videreBehandling.endsWith(IKKE_SEND)
    ? {
        ...info,
        videreBehandling: tilbakekrevingVidereBehandling.TILBAKEKR_OPPRETT,
      }
    : {
        ...info,
        varseltekst,
      };
};

const buildInitialValues = createSelector(
  [(state, ownProps) => ownProps.tilbakekrevingvalg, (state, ownProps) => ownProps.aksjonspunkter],
  (tilbakekrevingvalg, aksjonspunkter) => {
    const aksjonspunkt = aksjonspunkter.find(ap => simuleringAksjonspunkter.includes(ap.definisjon.kode));
    if (!aksjonspunkt || !tilbakekrevingvalg) {
      return undefined;
    }

    const harTypeIkkeSendt =
      !tilbakekrevingvalg.varseltekst &&
      tilbakekrevingvalg.videreBehandling.kode === tilbakekrevingVidereBehandling.TILBAKEKR_OPPRETT;

    return {
      videreBehandling: harTypeIkkeSendt
        ? tilbakekrevingvalg.videreBehandling.kode + IKKE_SEND
        : tilbakekrevingvalg.videreBehandling.kode,
      varseltekst: tilbakekrevingvalg.varseltekst,
      begrunnelse: aksjonspunkt.begrunnelse,
      aksjonspunkter,
    };
  },
);

const mapStateToPropsFactory = (initialState, ownPropsStatic) => {
  const onSubmit = values => ownPropsStatic.submitCallback([transformValues(values, ownPropsStatic.apCodes[0])]);

  return (state, ownProps) => {
    const { språkkode, tilbakekrevingvalg, simuleringResultat, fagsak, featureToggles, behandling } = ownProps;
    const hasOpenTilbakekrevingsbehandling =
      tilbakekrevingvalg !== undefined &&
      tilbakekrevingvalg.videreBehandling.kode === tilbakekrevingVidereBehandling.TILBAKEKR_OPPDATER;
    return {
      harVurderFeilutbetalingAP: ownProps.apCodes.includes(AksjonspunktDtoDefinisjon.VURDER_FEILUTBETALING),
      harSjekkHøyEtterbetalingAP: ownProps.apCodes.includes(AksjonspunktDtoDefinisjon.SJEKK_HØY_ETTERBETALING),
      behandling,
      varseltekst: behandlingFormValueSelector(formName, behandling.id, behandling.versjon)(state, 'varseltekst'),
      initialValues: buildInitialValues(state, ownProps),
      behandlingFormPrefix: getBehandlingFormPrefix(behandling.id, behandling.versjon),
      featureUtvidetVarselfelt: featureToggles?.UTVIDET_VARSELFELT,
      saksnummer: fagsak.saksnummer,
      hasOpenTilbakekrevingsbehandling,
      språkkode,
      simuleringResultat,
      onSubmit,
    };
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      clearFields,
    },
    dispatch,
  ),
});

export default connect(
  mapStateToPropsFactory,
  mapDispatchToProps,
)(
  behandlingForm({
    form: formName,
    enableReinitialize: true,
  })(injectIntl(AvregningPanelImpl)),
);
