import { RadioGroupField, TextAreaField, behandlingForm, behandlingFormValueSelector } from '@fpsak-frontend/form';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { AksjonspunktHelpText, ArrowBox, VerticalSpacer } from '@fpsak-frontend/shared-components';
import {
  ISO_DATE_FORMAT,
  getLanguageCodeFromSprakkode,
  hasValidText,
  minLength,
  required,
} from '@fpsak-frontend/utils';
import SettPaVentModalIndex from '@k9-sak-web/modal-sett-pa-vent';
import { BodyShort, Button, Detail, Heading } from '@navikt/ds-react';
import classNames from 'classnames';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { formPropTypes, setSubmitFailed } from 'redux-form';
import { createSelector } from 'reselect';
import revurderingFamilieHendelsePropType from '../propTypes/revurderingFamilieHendelsePropType';
import revurderingSoknadPropType from '../propTypes/revurderingSoknadPropType';
import styles from './varselOmRevurderingForm.module.css';

const minLength3 = minLength(3);

/**
 * VarselOmRevurderingForm
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for avklaring av varsel om revurdering i søknad.
 */
export class VarselOmRevurderingFormImpl extends React.Component {
  constructor(props) {
    super(props);
    this.previewMessage = this.previewMessage.bind(this);
    this.bekreftOgFortsettClicked = this.bekreftOgFortsettClicked.bind(this);
    this.hideSettPaVentModal = this.hideSettPaVentModal.bind(this);
    this.handleSubmitFromModal = this.handleSubmitFromModal.bind(this);
    this.state = { showSettPaVentModal: false };
  }

  handleSubmitFromModal() {
    const { valid, handleSubmit } = this.props;
    handleSubmit();
    if (valid) {
      this.hideSettPaVentModal();
    }
  }

  bekreftOgFortsettClicked() {
    const { valid: validForm, touch, dispatchSubmitFailed, sendVarsel, handleSubmit } = this.props;
    touch('begrunnelse', 'sendVarsel', 'fritekst');
    if (!validForm) {
      dispatchSubmitFailed('VarselOmRevurderingForm');
    }
    if (validForm) {
      if (sendVarsel) {
        this.setState({ showSettPaVentModal: true });
      } else {
        handleSubmit();
      }
    }
  }

  previewMessage(e, previewCallback) {
    const { valid, pristine, fritekst, submit } = this.props;
    if (valid || pristine) {
      const data = {
        mottaker: '',
        dokumentMal: 'REVURD',
        dokumentdata: fritekst && { fritekst },
      };
      previewCallback(data);
    } else {
      submit();
    }
    e.preventDefault();
  }

  hideSettPaVentModal() {
    this.setState({ showSettPaVentModal: false });
  }

  render() {
    const {
      intl,
      previewCallback,
      languageCode,
      readOnly,
      sendVarsel,
      aksjonspunktStatus,
      begrunnelse,
      ventearsaker,
      behandlingTypeKode,
      ...formProps
    } = this.props;
    const { showSettPaVentModal } = this.state;

    return (
      <form>
        <Heading size="small" level="2">
          {intl.formatMessage({ id: 'VarselOmRevurderingForm.VarselOmRevurdering' })}
        </Heading>
        <VerticalSpacer eightPx />
        {!readOnly && isAksjonspunktOpen(aksjonspunktStatus) && (
          <div>
            <AksjonspunktHelpText isAksjonspunktOpen>
              {[<FormattedMessage key="1" id="VarselOmRevurderingForm.VarselOmRevurderingVurder" />]}
            </AksjonspunktHelpText>
            <VerticalSpacer twentyPx />
            <RadioGroupField
              name="sendVarsel"
              validate={[required]}
              radios={[
                {
                  value: true,
                  label: intl.formatMessage({ id: 'VarselOmRevurderingForm.SendVarsel' }),
                },
                {
                  value: false,
                  label: intl.formatMessage({ id: 'VarselOmRevurderingForm.IkkeSendVarsel' }),
                },
              ]}
            />
            {sendVarsel && (
              <ArrowBox>
                <TextAreaField
                  badges={[{ textId: languageCode, type: 'warning', title: 'Malform.Beskrivelse' }]}
                  name="fritekst"
                  label={intl.formatMessage({ id: 'VarselOmRevurderingForm.FritekstIBrev' })}
                  validate={[required, minLength3, hasValidText]}
                />
                <a
                  href=""
                  onClick={e => {
                    this.previewMessage(e, previewCallback);
                  }}
                  className={classNames(styles.previewLink, 'lenke lenke--frittstaende')}
                >
                  <FormattedMessage id="VarselOmRevurderingForm.Preview" />
                </a>
              </ArrowBox>
            )}

            <div className={styles.flexContainer}>
              <TextAreaField
                name="begrunnelse"
                label={intl.formatMessage({ id: 'VarselOmRevurderingForm.BegrunnelseForSvar' })}
                validate={[required, minLength3, hasValidText]}
              />
            </div>
            <VerticalSpacer sixteenPx />
            <Button
              variant="primary"
              size="small"
              type="button"
              onClick={this.bekreftOgFortsettClicked}
              loading={formProps.submitting}
              disabled={formProps.submitting}
            >
              <FormattedMessage id="VarselOmRevurderingForm.Bekreft" />
            </Button>
          </div>
        )}
        {(readOnly || !isAksjonspunktOpen(aksjonspunktStatus)) && (
          <div>
            <Detail>{intl.formatMessage({ id: 'VarselOmRevurderingForm.Begrunnelse' })}</Detail>
            <BodyShort size="small">{begrunnelse}</BodyShort>
          </div>
        )}
        <SettPaVentModalIndex
          showModal={showSettPaVentModal}
          frist={moment().add(28, 'days').format(ISO_DATE_FORMAT)}
          cancelEvent={this.hideSettPaVentModal}
          submitCallback={this.handleSubmitFromModal}
          ventearsaker={ventearsaker}
          visBrevErBestilt
          hasManualPaVent
          erTilbakekreving={
            behandlingTypeKode === BehandlingType.TILBAKEKREVING ||
            behandlingTypeKode === BehandlingType.TILBAKEKREVING_REVURDERING
          }
        />
      </form>
    );
  }
}

VarselOmRevurderingFormImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  handleSubmit: PropTypes.func.isRequired,
  previewCallback: PropTypes.func.isRequired,
  aksjonspunktStatus: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  dispatchSubmitFailed: PropTypes.func.isRequired,
  languageCode: PropTypes.string,
  erAutomatiskRevurdering: PropTypes.bool,
  sendVarsel: PropTypes.bool,
  fritekst: PropTypes.string,
  begrunnelse: PropTypes.string,
  ventearsaker: PropTypes.arrayOf(
    PropTypes.shape({
      kode: PropTypes.string,
      navn: PropTypes.string,
    }),
  ),
  avklartBarn: PropTypes.arrayOf(PropTypes.shape()),
  behandlingTypeKode: PropTypes.string.isRequired,
  soknad: revurderingSoknadPropType.isRequired,
  termindato: PropTypes.string,
  soknadOriginalBehandling: revurderingSoknadPropType.isRequired,
  familiehendelseOriginalBehandling: revurderingFamilieHendelsePropType.isRequired,
  ...formPropTypes,
};

VarselOmRevurderingFormImpl.defaultProps = {
  sendVarsel: false,
  fritekst: null,
  begrunnelse: null,
  languageCode: null,
  erAutomatiskRevurdering: false,
  ventearsaker: [],
  avklartBarn: undefined,
  termindato: undefined,
};

export const buildInitialValues = createSelector([(state, ownProps) => ownProps.aksjonspunkter], aksjonspunkter => ({
  kode: aksjonspunkter[0].definisjon.kode,
  frist: moment().add(28, 'days').format(ISO_DATE_FORMAT),
  ventearsak: null,
}));

const formName = 'VarselOmRevurderingForm';

const nullSafe = value => value || {};

const mapStateToPropsFactory = (initialState, ownProps) => {
  const {
    behandlingId,
    behandlingVersjon,
    behandlingType,
    behandlingArsaker,
    aksjonspunkter,
    submitCallback,
    sprakkode,
    familiehendelse,
  } = ownProps;
  const onSubmit = values => submitCallback([values]);
  const erAutomatiskRevurdering =
    Array.isArray(behandlingArsaker) &&
    behandlingArsaker.reduce((result, current) => result || current.erAutomatiskRevurdering, false);
  const aksjonspunkt = aksjonspunkter[0];
  const ventearsaker = ownProps.alleKodeverk[kodeverkTyper.VENT_AARSAK];
  const languageCode = getLanguageCodeFromSprakkode(sprakkode);

  return state => ({
    initialValues: buildInitialValues(state, ownProps),
    aksjonspunktStatus: aksjonspunkt.status.kode,
    begrunnelse: aksjonspunkt.begrunnelse,
    ...behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(state, 'sendVarsel', 'fritekst', 'frist'),
    avklartBarn: nullSafe(familiehendelse.register).avklartBarn,
    termindato: nullSafe(familiehendelse.gjeldende).termindato,
    vedtaksDatoSomSvangerskapsuke: nullSafe(familiehendelse.gjeldende).vedtaksDatoSomSvangerskapsuke,
    behandlingTypeKode: behandlingType.kode,
    languageCode,
    ventearsaker,
    erAutomatiskRevurdering,
    onSubmit,
  });
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      dispatchSubmitFailed: setSubmitFailed,
    },
    dispatch,
  ),
});

const VarselOmRevurderingForm = connect(
  mapStateToPropsFactory,
  mapDispatchToProps,
)(
  injectIntl(
    behandlingForm({
      form: formName,
      enableReinitialize: true,
    })(VarselOmRevurderingFormImpl),
  ),
);

export default VarselOmRevurderingForm;
