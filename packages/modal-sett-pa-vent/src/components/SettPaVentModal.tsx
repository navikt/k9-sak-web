import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { formValueSelector, reduxForm, InjectedFormProps } from 'redux-form';
import { Column, Container, Row } from 'nav-frontend-grid';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import Modal from 'nav-frontend-modal';

import { Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import { DatepickerField, SelectField } from '@fpsak-frontend/form';
import { ariaCheck, dateAfterOrEqualToToday, hasValidDate, required, dateBeforeToday } from '@fpsak-frontend/utils';
import { KodeverkMedNavn } from '@k9-sak-web/types';
import venteArsakType from '@fpsak-frontend/kodeverk/src/venteArsakType';

import styles from './settPaVentModal.less';

const initFrist = (): string => {
  const date = moment().toDate();
  date.setDate(date.getDate() + 28);
  return date.toISOString().substr(0, 10);
};

const isButtonDisabled = (
  frist: string,
  showAvbryt: boolean,
  venteArsakHasChanged: boolean,
  fristHasChanged: boolean,
  hasManualPaVent: boolean,
): boolean => {
  const dateNotValid = !!hasValidDate(frist) || !!dateAfterOrEqualToToday(frist);
  const defaultOptions = (!hasManualPaVent || showAvbryt) && !venteArsakHasChanged && !fristHasChanged;
  return defaultOptions || dateNotValid;
};

const hovedKnappenType = (venteArsakHasChanged: boolean, fristHasChanged: boolean): boolean =>
  venteArsakHasChanged || fristHasChanged;

const getPaVentText = (originalVentearsak: string, hasManualPaVent: boolean, frist: string): string => {
  if (originalVentearsak) {
    return hasManualPaVent || frist ? 'SettPaVentModal.ErSettPaVent' : 'SettPaVentModal.ErPaVentUtenFrist';
  }
  return hasManualPaVent || frist ? 'SettPaVentModal.SettesPaVent' : 'SettPaVentModal.SettesPaVentUtenFrist';
};

const manuelleVenteArsaker = [
  venteArsakType.AVV_DOK,
  venteArsakType.AVV_FODSEL,
  venteArsakType.UTV_FRIST,
  venteArsakType.AVV_RESPONS_REVURDERING,
  venteArsakType.FOR_TIDLIG_SOKNAD,
  venteArsakType.VENT_PÅ_SISTE_AAP_ELLER_DP_MELDEKORT,
  venteArsakType.VENT_PÅ_NY_INNTEKTSMELDING_MED_GYLDIG_ARB_ID,
  venteArsakType.ANKE_VENTER_PAA_MERKNADER_FRA_BRUKER,
  venteArsakType.ANKE_OVERSENDT_TIL_TRYGDERETTEN,
  venteArsakType.VENT_OPDT_INNTEKTSMELDING,
  venteArsakType.VENT_OPPTJENING_OPPLYSNINGER,
  venteArsakType.UTVIDET_TILSVAR_FRIST,
  venteArsakType.ENDRE_TILKJENT_YTELSE,
  venteArsakType.VENT_PÅ_MULIG_MOTREGNING,
  venteArsakType.VENT_MANGL_FUNKSJ_SAKSBEHANDLER,
];

const automatiskeVentearsakerForTilbakekreving = [
  venteArsakType.VENT_PÅ_BRUKERTILBAKEMELDING,
  venteArsakType.VENT_PÅ_TILBAKEKREVINGSGRUNNLAG,
];

const inkluderVentearsak = (ventearsak: KodeverkMedNavn, valgtVentearsak?: string): boolean =>
  automatiskeVentearsakerForTilbakekreving.includes(ventearsak.kode) ? ventearsak.kode === valgtVentearsak : true;

type FormValues = {
  frist?: string;
  ventearsak?: string;
};

interface PureOwnProps {
  cancelEvent: () => void;
  showModal: boolean;
  ventearsaker: KodeverkMedNavn[];
  erTilbakekreving: boolean;
  visBrevErBestilt?: boolean;
  hasManualPaVent: boolean;
  frist?: string;
  ventearsak?: string;
}

interface MappedOwnProps {
  ventearsak?: string;
  frist?: string;
  originalFrist?: string;
  originalVentearsak?: string;
  initialValues: FormValues;
}

export const SettPaVentModal: FunctionComponent<
  PureOwnProps & MappedOwnProps & WrappedComponentProps & InjectedFormProps
> = ({
  intl,
  handleSubmit,
  cancelEvent,
  showModal,
  ventearsaker,
  erTilbakekreving,
  frist,
  originalFrist,
  ventearsak,
  originalVentearsak,
  visBrevErBestilt = false,
  hasManualPaVent,
}) => {
  const venteArsakHasChanged = !(originalVentearsak === ventearsak || (!ventearsak && !originalVentearsak));
  const fristHasChanged = !(originalFrist === frist || (!frist && !originalFrist));

  const showAvbryt = !(originalFrist === frist && !venteArsakHasChanged);
  const erFristenUtløpt =
    erTilbakekreving &&
    ((frist !== undefined && dateBeforeToday(frist) === null) ||
      (originalFrist !== undefined && dateBeforeToday(originalFrist) === null));
  const erVenterPaKravgrunnlag = ventearsak === venteArsakType.VENT_PÅ_TILBAKEKREVINGSGRUNNLAG;
  const showFristenTekst = erTilbakekreving && erFristenUtløpt && erVenterPaKravgrunnlag;

  return (
    <Modal
      className={styles.modal}
      isOpen={showModal}
      closeButton={false}
      contentLabel={intl.formatMessage({
        id: originalVentearsak ? 'SettPaVentModal.ModalDescriptionErPaVent' : 'SettPaVentModal.ModalDescription',
      })}
      onRequestClose={cancelEvent}
      shouldCloseOnOverlayClick={false}
    >
      <Container fluid>
        <form onSubmit={handleSubmit} name="ventModalForm">
          <Row>
            <Column xs="1">
              <Image
                className={styles.image}
                alt={intl.formatMessage({ id: 'SettPaVentModal.PaVent' })}
                src={innvilgetImageUrl}
              />
              <div className={styles.divider} />
            </Column>
            <Column xs="7">
              <div className={styles.label}>
                <Normaltekst className={styles.label}>
                  <FormattedMessage id={getPaVentText(originalVentearsak, hasManualPaVent, frist)} />
                </Normaltekst>
              </div>
            </Column>
            {(hasManualPaVent || frist) && (
              <Column xs="2">
                <div className={styles.datePicker}>
                  <DatepickerField name="frist" validate={[required, hasValidDate, dateAfterOrEqualToToday]} />
                </div>
              </Column>
            )}
          </Row>
          <Row className={styles.marginTop}>
            <Column xs="1" />
            <Column xs="11">
              <SelectField
                name="ventearsak"
                label={intl.formatMessage({ id: 'SettPaVentModal.Arsak' })}
                placeholder={intl.formatMessage({ id: 'SettPaVentModal.SelectPlaceholder' })}
                validate={[required]}
                selectValues={ventearsaker
                  .filter(va =>
                    erTilbakekreving ? inkluderVentearsak(va, ventearsak) : manuelleVenteArsaker.includes(va.kode),
                  )
                  .sort((v1, v2) => v1.navn.localeCompare(v2.navn))
                  .map(va => (
                    <option key={va.kode} value={va.kode}>
                      {va.navn}
                    </option>
                  ))}
                bredde="xxl"
                readOnly={!hasManualPaVent}
              />
            </Column>
          </Row>
          {visBrevErBestilt && (
            <Row>
              <Column xs="1" />
              <Column xs="11">
                <Normaltekst>
                  <FormattedMessage id="SettPaVentModal.BrevBlirBestilt" />
                </Normaltekst>
              </Column>
            </Row>
          )}
          <Row>
            <Column xs="1" />
            <Column xs="11">
              {hasManualPaVent && <Normaltekst>{intl.formatMessage({ id: 'SettPaVentModal.EndreFrist' })}</Normaltekst>}
              {!hasManualPaVent && showFristenTekst && (
                <Normaltekst>
                  <FormattedMessage id="SettPaVentModal.UtløptFrist" />
                  <VerticalSpacer eightPx />
                  <FormattedMessage id="SettPaVentModal.HenleggeSaken" />
                </Normaltekst>
              )}
            </Column>
          </Row>
          <VerticalSpacer eightPx />
          <Row>
            <Column xs="6" />
            <Column>
              <Hovedknapp
                mini
                htmlType={hovedKnappenType(venteArsakHasChanged, fristHasChanged) ? 'submit' : 'button'}
                className={styles.button}
                onClick={showAvbryt ? ariaCheck : cancelEvent}
                disabled={isButtonDisabled(frist, showAvbryt, venteArsakHasChanged, fristHasChanged, hasManualPaVent)}
              >
                <FormattedMessage id="SettPaVentModal.Ok" />
              </Hovedknapp>
              {(!hasManualPaVent || showAvbryt || !visBrevErBestilt) && (
                <Knapp htmlType="button" mini onClick={cancelEvent} className={styles.cancelButton}>
                  <FormattedMessage id={hasManualPaVent ? 'SettPaVentModal.Avbryt' : 'SettPaVentModal.Lukk'} />
                </Knapp>
              )}
            </Column>
          </Row>
        </form>
      </Container>
    </Modal>
  );
};

const buildInitialValues = (initialProps: PureOwnProps): FormValues => ({
  ventearsak: initialProps.ventearsak,
  frist: initialProps.frist || initialProps.hasManualPaVent === false ? initialProps.frist : initFrist(),
});

const mapStateToProps = (state, initialOwnProps: PureOwnProps): MappedOwnProps => ({
  initialValues: buildInitialValues(initialOwnProps),
  frist: formValueSelector('settPaVentModalForm')(state, 'frist'),
  ventearsak: formValueSelector('settPaVentModalForm')(state, 'ventearsak'),
  originalFrist: initialOwnProps.frist,
  originalVentearsak: initialOwnProps.ventearsak,
});

export default connect(mapStateToProps)(
  reduxForm({
    form: 'settPaVentModalForm',
    enableReinitialize: true,
  })(injectIntl(SettPaVentModal)),
);
