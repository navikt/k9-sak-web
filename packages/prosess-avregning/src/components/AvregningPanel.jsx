import questionHoverUrl from '@fpsak-frontend/assets/images/question_hover.svg';
import questionNormalUrl from '@fpsak-frontend/assets/images/question_normal.svg';
import {
  RadioGroupField,
  RadioOption,
  TextAreaField,
  behandlingForm,
  behandlingFormValueSelector,
  getBehandlingFormPrefix,
} from '@fpsak-frontend/form';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import tilbakekrevingVidereBehandling from '@fpsak-frontend/kodeverk/src/tilbakekrevingVidereBehandling';
import { AksjonspunktHelpTextTemp, ArrowBox, Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { getLanguageCodeFromSprakkode, hasValidText, maxLength, minLength, required } from '@fpsak-frontend/utils';
import { BodyShort, Button, Detail, Heading, Label } from '@navikt/ds-react';
import { Column, Row } from 'nav-frontend-grid';
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
const simuleringAksjonspunkter = [aksjonspunktCodes.VURDER_FEILUTBETALING];
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
      sprakkode,
      featureVarseltekst,
      previewCallback,
      hasOpenTilbakekrevingsbehandling,
      ...formProps
    } = this.props;
    const simuleringResultatOption = getSimuleringResult(simuleringResultat, feilutbetaling);

    return (
      <>
        <Heading size="small" level="2">
          <FormattedMessage id="Avregning.Title" />
        </Heading>
        <VerticalSpacer twentyPx />
        {simuleringResultatOption && (
          <div>
            <Row>
              <Column xs="12">
                <AksjonspunktHelpTextTemp isAksjonspunktOpen={isApOpen}>
                  {[<FormattedMessage id="Avregning.AksjonspunktHelpText.5084" key="vurderFeilutbetaling" />]}
                </AksjonspunktHelpTextTemp>
                <VerticalSpacer twentyPx />
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
                <VerticalSpacer twentyPx />
                {hasOpenTilbakekrevingsbehandling && (
                  <Label size="small" as="p">
                    <FormattedMessage id="Avregning.ApenTilbakekrevingsbehandling" />
                  </Label>
                )}
              </Column>
            </Row>
          </div>
        )}
        {!simuleringResultat && <FormattedMessage id="Avregning.ingenData" />}
        {apCodes[0] && (
          <div>
            <Row>
              <Column xs="12">
                <form onSubmit={formProps.handleSubmit}>
                  <Row>
                    <Column sm="6">
                      <TextAreaField
                        name="begrunnelse"
                        label={{ id: 'Avregning.vurdering' }}
                        validate={[required, minLength3, maxLength1500, hasValidText]}
                        maxLength={1500}
                        readOnly={readOnly}
                        id="avregningVurdering"
                      />
                    </Column>
                    {apCodes[0] === aksjonspunktCodes.VURDER_FEILUTBETALING && (
                      <Column sm="6">
                        <Detail>
                          <FormattedMessage id="Avregning.videreBehandling" />
                        </Detail>
                        <VerticalSpacer eightPx />
                        <RadioGroupField
                          name="videreBehandling"
                          validate={[required]}
                          direction="vertical"
                          readOnly={readOnly}
                        >
                          {featureVarseltekst && (
                            <RadioOption
                              label={<FormattedMessage id="Avregning.gjennomfør" />}
                              value={tilbakekrevingVidereBehandling.TILBAKEKR_OPPRETT}
                            >
                              <div className={styles.varsel}>
                                <ArrowBox alignOffset={20}>
                                  <Row>
                                    <Column sm="10">
                                      <BodyShort size="small" className={styles.bold}>
                                        <FormattedMessage id="Avregning.varseltekst" />
                                      </BodyShort>
                                    </Column>
                                    <Column sm="2">
                                      <Image
                                        tabIndex="0"
                                        src={questionNormalUrl}
                                        srcHover={questionHoverUrl}
                                        alt={intl.formatMessage({ id: 'Avregning.HjelpetekstPleiepenger' })}
                                        tooltip={<FormattedMessage id="Avregning.HjelpetekstPleiepenger" />}
                                      />
                                    </Column>
                                  </Row>
                                  <VerticalSpacer eightPx />
                                  <TextAreaField
                                    name="varseltekst"
                                    label={{ id: 'Avregning.fritekst' }}
                                    validate={[required, minLength3, maxLength1500, hasValidText]}
                                    maxLength={1500}
                                    readOnly={readOnly}
                                    id="avregningFritekst"
                                    badges={[
                                      {
                                        type: 'fokus',
                                        textId: getLanguageCodeFromSprakkode(sprakkode),
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
                            </RadioOption>
                          )}
                          <RadioOption
                            label={
                              <FormattedMessage
                                id={featureVarseltekst ? 'Avregning.OpprettMenIkkeSendVarsel' : 'Avregning.Opprett'}
                              />
                            }
                            value={`${tilbakekrevingVidereBehandling.TILBAKEKR_OPPRETT}${IKKE_SEND}`}
                          />
                          <RadioOption
                            label={<FormattedMessage id="Avregning.avvent" />}
                            value={tilbakekrevingVidereBehandling.TILBAKEKR_IGNORER}
                          />
                        </RadioGroupField>
                      </Column>
                    )}
                  </Row>
                  <Row>
                    <Column xs="6">
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
                    </Column>
                  </Row>
                </form>
              </Column>
            </Row>
          </div>
        )}
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

AvregningPanelImpl.defaultProps = {
  simuleringResultat: null,
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
    };
  },
);

const mapStateToPropsFactory = (initialState, ownPropsStatic) => {
  const onSubmit = values => ownPropsStatic.submitCallback([transformValues(values, ownPropsStatic.apCodes[0])]);

  return (state, ownProps) => {
    const {
      sprakkode,
      behandlingId,
      behandlingVersjon,
      tilbakekrevingvalg,
      simuleringResultat,
      fagsak,
      featureToggles,
    } = ownProps;
    const erFrisinn = fagsakYtelseType.FRISINN === fagsak.sakstype?.kode;
    const hasOpenTilbakekrevingsbehandling =
      tilbakekrevingvalg !== undefined &&
      tilbakekrevingvalg.videreBehandling.kode === tilbakekrevingVidereBehandling.TILBAKEKR_OPPDATER;
    return {
      varseltekst: behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(state, 'varseltekst'),
      initialValues: buildInitialValues(state, ownProps),
      behandlingFormPrefix: getBehandlingFormPrefix(behandlingId, behandlingVersjon),
      featureVarseltekst: erFrisinn || featureToggles?.VARSELTEKST,
      saksnummer: fagsak.saksnummer,
      hasOpenTilbakekrevingsbehandling,
      sprakkode,
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
