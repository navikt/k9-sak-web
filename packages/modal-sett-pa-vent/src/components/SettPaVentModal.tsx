import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import { DatepickerField, SelectField, TextAreaField } from '@fpsak-frontend/form';
import venteArsakType from '@fpsak-frontend/kodeverk/src/venteArsakType';
import { Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import {
  ariaCheck,
  dateAfterOrEqualToToday,
  dateBeforeToday,
  formatDate,
  hasValidDate,
  hasValidText,
  maxLength,
  required,
} from '@fpsak-frontend/utils';
import { getPathToFplos } from '@k9-sak-web/sak-app/src/app/paths';
import { KodeverkMedNavn, Venteaarsak } from '@k9-sak-web/types';
import moment from 'moment';
import { Container } from 'nav-frontend-grid';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import { Normaltekst, Element } from 'nav-frontend-typografi';
import React, { useState } from 'react';
import { Select as NavSelect } from 'nav-frontend-skjema';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { formValueSelector, InjectedFormProps, reduxForm } from 'redux-form';
import styles from './settPaVentModal.less';

const initFrist = (): string => {
  const date = moment().toDate();
  date.setDate(date.getDate() + 28);
  return date.toISOString().substr(0, 10);
};

const venterårsakerMedKommentarmulighet = [
  'VENTER_SVAR_PORTEN',
  'VENTER_SVAR_TEAMS',
  'VENT_MANGL_FUNKSJ_SAKSBEHANDLER',
];

const venterEtterlysInntektsmeldingKode = 'VENTER_ETTERLYS_IM';

const isButtonDisabled = (
  frist: string,
  showAvbryt: boolean,
  hasManualPaVent: boolean,
  erVenterEtterlysInntektsmelding: boolean,
  formHasChanges: boolean,
): boolean => {
  if (erVenterEtterlysInntektsmelding) {
    return false;
  }
  const dateNotValid = !!hasValidDate(frist) || !!dateAfterOrEqualToToday(frist);
  const defaultOptions = (!hasManualPaVent || showAvbryt) && !formHasChanges;
  return defaultOptions || dateNotValid;
};

const hovedKnappenType = (
  venteArsakHasChanged: boolean,
  fristHasChanged: boolean,
  ventearsakVariantHasChanged: boolean,
): boolean => venteArsakHasChanged || fristHasChanged || ventearsakVariantHasChanged;

const getPaVentText = (
  originalVentearsak: string,
  hasManualPaVent: boolean,
  frist: string,
  originalFrist: string,
  showEndreFrist: boolean,
) => {
  if (originalVentearsak) {
    if (originalVentearsak === venterEtterlysInntektsmeldingKode && originalFrist && !showEndreFrist) {
      return (
        <FormattedMessage
          id="SettPaVentModal.EtterlysningAvInntektsmeldingErSendt"
          values={{ date: formatDate(originalFrist) }}
        />
      );
    }

    return hasManualPaVent || frist ? (
      <FormattedMessage id="SettPaVentModal.ErSettPaVent" />
    ) : (
      <FormattedMessage id="SettPaVentModal.ErPaVentUtenFrist" />
    );
  }

  return hasManualPaVent || frist ? (
    <FormattedMessage id="SettPaVentModal.SettesPaVent" />
  ) : (
    <FormattedMessage id="SettPaVentModal.SettesPaVentUtenFrist" />
  );
};

const automatiskeVentearsakerForTilbakekreving = [
  venteArsakType.VENT_PÅ_BRUKERTILBAKEMELDING,
  venteArsakType.VENT_PÅ_TILBAKEKREVINGSGRUNNLAG,
];

const inkluderVentearsak = (ventearsak: KodeverkMedNavn, valgtVentearsak?: string): boolean =>
  automatiskeVentearsakerForTilbakekreving.includes(ventearsak.kode) ? ventearsak.kode === valgtVentearsak : true;

type FormValues = {
  frist?: string;
  ventearsak?: string;
  ventearsakVariant?: string;
};

interface PureOwnProps {
  cancelEvent: () => void;
  showModal: boolean;
  ventearsaker: Venteaarsak[];
  erTilbakekreving: boolean;
  visBrevErBestilt?: boolean;
  hasManualPaVent: boolean;
  frist?: string;
  ventearsak?: string;
  ventearsakVariant?: string;
}

interface MappedOwnProps {
  ventearsak?: string;
  frist?: string;
  originalFrist?: string;
  originalVentearsak?: string;
  initialValues: FormValues;
  ventearsakVariant?: string;
  originalVentearsakVariant?: string;
}

export const SettPaVentModal = ({
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
  ventearsakVariant,
  originalVentearsakVariant,
}: PureOwnProps & Partial<MappedOwnProps> & WrappedComponentProps & InjectedFormProps) => {
  const venteArsakHasChanged = !(originalVentearsak === ventearsak || (!ventearsak && !originalVentearsak));
  const ventearsakVariantHasChanged =
    (!originalVentearsakVariant && !!ventearsakVariant) ||
    (originalVentearsakVariant && originalVentearsakVariant !== ventearsakVariant);

  const fristHasChanged = !(originalFrist === frist || (!frist && !originalFrist));
  const [showEndreFrist, setShowEndreFrist] = useState(hasManualPaVent || !!frist);

  const showAvbryt = !(originalFrist === frist && !venteArsakHasChanged && !ventearsakVariantHasChanged);
  const formHasChanges = fristHasChanged || venteArsakHasChanged || ventearsakVariantHasChanged;
  const erFristenUtløpt =
    erTilbakekreving &&
    ((frist !== undefined && dateBeforeToday(frist) === null) ||
      (originalFrist !== undefined && dateBeforeToday(originalFrist) === null));
  const erVenterPaKravgrunnlag = ventearsak === venteArsakType.VENT_PÅ_TILBAKEKREVINGSGRUNNLAG;
  const showFristenTekst = erTilbakekreving && erFristenUtløpt && erVenterPaKravgrunnlag;
  const erVenterEtterlysInntektsmelding = originalVentearsak === venterEtterlysInntektsmeldingKode;
  const showSelect = erVenterEtterlysInntektsmelding ? !showEndreFrist : true;
  const showKommentarInput = venterårsakerMedKommentarmulighet.includes(ventearsak);

  const toggleEndreFrist = () => setShowEndreFrist(!showEndreFrist);

  Modal.setAppElement(document.body);

  const getHovedknappTekst = () => {
    if (erVenterEtterlysInntektsmelding && !showEndreFrist) {
      return <FormattedMessage id="SettPaVentModal.Ok" />;
    }

    if (erVenterEtterlysInntektsmelding && showEndreFrist) {
      return <FormattedMessage id="SettPaVentModal.EndreFrist" />;
    }

    return <FormattedMessage id="SettPaVentModal.SettPaVent" />;
  };

  const goToLos = () => {
    const path = getPathToFplos();
    window.location.assign(path);
  };

  const getHovedknappOnClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (erVenterEtterlysInntektsmelding) {
      toggleEndreFrist();
    }
    if (erVenterEtterlysInntektsmelding && !showEndreFrist) {
      event.stopPropagation();
      event.preventDefault();
      return goToLos();
    }
    if (showAvbryt) {
      return ariaCheck();
    }
    if (!erVenterEtterlysInntektsmelding) {
      return cancelEvent();
    }
    return null;
  };

  return (
    <>
      <Modal
        className={`${styles.modal} ${styles.settPaVentModal}`}
        isOpen={showModal}
        closeButton={false}
        contentLabel={intl.formatMessage({
          id: originalVentearsak ? 'SettPaVentModal.ModalDescriptionErPaVent' : 'SettPaVentModal.ModalDescription',
        })}
        onRequestClose={cancelEvent}
        shouldCloseOnOverlayClick={false}
      >
        <Container fluid data-testid="SettPaVentModal">
          <form onSubmit={handleSubmit} name="ventModalForm" data-testid="ventModalForm">
            <div className={styles.topContainer}>
              <Image
                className={styles.image}
                alt={intl.formatMessage({ id: 'SettPaVentModal.PaVent' })}
                src={innvilgetImageUrl}
              />
              <div className={styles.divider} />
              <div className={styles.calendarContainer}>
                <Normaltekst className={styles.label}>
                  {getPaVentText(originalVentearsak, hasManualPaVent, frist, originalFrist, showEndreFrist)}
                </Normaltekst>
                {showEndreFrist && (
                  <div className={styles.datePicker}>
                    <DatepickerField
                      name="frist"
                      validate={[required, hasValidDate, dateAfterOrEqualToToday]}
                      data-testid="datofelt"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className={styles.contentContainer}>
              {showSelect && (
                <div className={styles.selectContainer}>
                  {erVenterEtterlysInntektsmelding ? (
                    <NavSelect className={styles.disabledNavSelect} disabled>
                      <option value="">Inntektsmelding</option>
                    </NavSelect>
                  ) : (
                    <SelectField
                      name="ventearsak"
                      label={<Element>{intl.formatMessage({ id: 'SettPaVentModal.HvaVenterViPa' })}</Element>}
                      placeholder={intl.formatMessage({ id: 'SettPaVentModal.SelectPlaceholder' })}
                      validate={[required]}
                      selectValues={ventearsaker
                        .filter(va => (erTilbakekreving ? inkluderVentearsak(va, ventearsak) : va.kanVelges === 'true'))
                        .sort((v1, v2) => v1.navn.localeCompare(v2.navn))
                        .map(va => (
                          <option key={va.kode} value={va.kode}>
                            {va.navn}
                          </option>
                        ))}
                      bredde="xxxl"
                      readOnly={!hasManualPaVent}
                    />
                  )}
                </div>
              )}
              {showKommentarInput && (
                <TextAreaField
                  name="ventearsakVariant"
                  maxLength={200}
                  readOnly={!hasManualPaVent}
                  validate={[hasValidText, maxLength(200)]}
                  label={
                    <div className={styles.commentInputLabel}>
                      <Element>{intl.formatMessage({ id: 'SettPaVentModal.Kommentar' })}</Element>
                      <span>({intl.formatMessage({ id: 'SettPaVentModal.Valgfritt' })})</span>
                    </div>
                  }
                />
              )}
              {visBrevErBestilt && (
                <Normaltekst>
                  <FormattedMessage id="SettPaVentModal.BrevBlirBestilt" />
                </Normaltekst>
              )}
              <div className={styles.flexContainer}>
                {!hasManualPaVent && showFristenTekst && (
                  <Normaltekst>
                    <FormattedMessage id="SettPaVentModal.UtløptFrist" />
                    <VerticalSpacer eightPx />
                    <FormattedMessage id="SettPaVentModal.HenleggeSaken" />
                  </Normaltekst>
                )}
              </div>
              <div className={showSelect ? styles.buttonContainer : ''}>
                <Hovedknapp
                  mini
                  htmlType={
                    hovedKnappenType(venteArsakHasChanged, fristHasChanged, ventearsakVariantHasChanged)
                      ? 'submit'
                      : 'button'
                  }
                  className={styles.button}
                  onClick={event => getHovedknappOnClick(event)}
                  disabled={isButtonDisabled(
                    frist,
                    showAvbryt,
                    hasManualPaVent,
                    erVenterEtterlysInntektsmelding,
                    formHasChanges,
                  )}
                >
                  {getHovedknappTekst()}
                </Hovedknapp>
                {(!hasManualPaVent || showAvbryt || !visBrevErBestilt) && (
                  <Knapp
                    htmlType="button"
                    mini
                    onClick={!showEndreFrist ? toggleEndreFrist : cancelEvent}
                    className={styles.cancelButton}
                  >
                    {showEndreFrist ? (
                      <FormattedMessage id="SettPaVentModal.Lukk" />
                    ) : (
                      <FormattedMessage id="SettPaVentModal.EndreFrist" />
                    )}
                  </Knapp>
                )}
              </div>
            </div>
          </form>
        </Container>
      </Modal>
    </>
  );
};

const buildInitialValues = (initialProps: PureOwnProps): FormValues => ({
  ventearsak: initialProps.ventearsak,
  frist: initialProps.frist || initialProps.hasManualPaVent === false ? initialProps.frist : initFrist(),
  ventearsakVariant: initialProps.ventearsakVariant,
});

const mapStateToProps = (state, initialOwnProps: PureOwnProps): MappedOwnProps => ({
  initialValues: buildInitialValues(initialOwnProps),
  frist: formValueSelector('settPaVentModalForm')(state, 'frist'),
  ventearsak: formValueSelector('settPaVentModalForm')(state, 'ventearsak'),
  ventearsakVariant: formValueSelector('settPaVentModalForm')(state, 'ventearsakVariant'),
  originalFrist: initialOwnProps.frist,
  originalVentearsak: initialOwnProps.ventearsak,
  originalVentearsakVariant: initialOwnProps.ventearsakVariant,
});

export default connect(mapStateToProps)(
  reduxForm({
    form: 'settPaVentModalForm',
    enableReinitialize: true,
  })(injectIntl(SettPaVentModal)),
);
