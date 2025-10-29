import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import { DatepickerField, SelectField, TextAreaField } from '@fpsak-frontend/form';
import venteArsakType from '@fpsak-frontend/kodeverk/src/venteArsakType';
import { Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import {
  ariaCheck,
  dateAfterOrEqualToToday,
  dateBeforeToday,
  hasValidDate,
  hasValidText,
  maxLength,
  required,
} from '@fpsak-frontend/utils';
import { formatDate } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { goToLos } from '@k9-sak-web/sak-app/src/app/paths';
import { KodeverkMedNavn, Venteaarsak } from '@k9-sak-web/types';
import { BodyShort, Button, Label, Modal, Select } from '@navikt/ds-react';
import moment from 'moment';
import { useState } from 'react';
import { connect } from 'react-redux';
import { InjectedFormProps, formValueSelector, reduxForm } from 'redux-form';
import styles from './settPaVentModal.module.css';

const initFrist = (): string => {
  const date = moment().toDate();
  date.setDate(date.getDate() + 28);
  return date.toISOString().substr(0, 10);
};

const venterårsakerMedKommentarmulighet = [
  'ANNET',
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
      Behandlingen er satt på vent med frist:
    ) : (
      Behandlingen er satt på vent
    );
  }

  return hasManualPaVent || frist ? (
    Behandlingen settes på vent med frist
  ) : (
    Behandlingen settes på vent
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
  isSubmitting: boolean;
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
const maxLength200 = maxLength(200);
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
  isSubmitting,
}: PureOwnProps & Partial<MappedOwnProps> & WrappedComponentProps & InjectedFormProps) => {
  const venteArsakHasChanged = !(originalVentearsak === ventearsak || (!ventearsak && !originalVentearsak));
  const ventearsakVariantHasChanged =
    (!originalVentearsakVariant && !!ventearsakVariant) ||
    (originalVentearsakVariant && originalVentearsakVariant !== ventearsakVariant);

  const fristHasChanged = !(originalFrist === frist || (!frist && !originalFrist));
  const erVenterEtterlysInntektsmelding = originalVentearsak === venterEtterlysInntektsmeldingKode;
  const [showEndreFrist, setShowEndreFrist] = useState(
    erVenterEtterlysInntektsmelding ? false : hasManualPaVent || !!originalFrist,
  );

  const showAvbryt = !(originalFrist === frist && !venteArsakHasChanged && !ventearsakVariantHasChanged);
  const formHasChanges = fristHasChanged || venteArsakHasChanged || ventearsakVariantHasChanged;
  const erFristenUtløpt =
    erTilbakekreving &&
    ((frist !== undefined && dateBeforeToday(frist) === null) ||
      (originalFrist !== undefined && dateBeforeToday(originalFrist) === null));
  const erVenterPaKravgrunnlag = ventearsak === venteArsakType.VENT_PÅ_TILBAKEKREVINGSGRUNNLAG;
  const showFristenTekst = erTilbakekreving && erFristenUtløpt && erVenterPaKravgrunnlag;
  const showSelect = erVenterEtterlysInntektsmelding ? !showEndreFrist : true;
  const showKommentarInput = venterårsakerMedKommentarmulighet.includes(ventearsak);

  const toggleEndreFrist = () => setShowEndreFrist(!showEndreFrist);

  const getHovedknappTekst = () => {
    if (erVenterEtterlysInntektsmelding && !showEndreFrist) {
      return OK;
    }

    if (erVenterEtterlysInntektsmelding && showEndreFrist) {
      return Endre frist;
    }

    return Sett på vent;
  };

  const getHovedknappOnClick = () => {
    if (erVenterEtterlysInntektsmelding && showEndreFrist) {
      toggleEndreFrist();
    } else if (showAvbryt) {
      ariaCheck();
    } else {
      goToLos();
    }
  };

  return (
    <Modal
      className={`${styles.modal} ${styles.settPaVentModal}`}
      open={showModal}
      aria-label={intl.formatMessage({
        id: originalVentearsak ? 'SettPaVentModal.ModalDescriptionErPaVent' : 'SettPaVentModal.ModalDescription',
      })}
      onClose={cancelEvent}
      data-testid="SettPaVentModal"
    >
      <form onSubmit={handleSubmit} name="ventModalForm" data-testid="ventModalForm">
        <Modal.Header>
          <div className={styles.topContainer}>
            <Image
              className={styles.image}
              alt={"På vent"}
              src={innvilgetImageUrl}
            />
            <div className={styles.divider} />
            <div className={styles.calendarContainer}>
              <BodyShort size="small" className={styles.label}>
                {getPaVentText(originalVentearsak, hasManualPaVent, frist, originalFrist, showEndreFrist)}
              </BodyShort>
              {showEndreFrist && (
                <div className={styles.datePicker}>
                  <DatepickerField
                    name="frist"
                    validate={[required, hasValidDate, dateAfterOrEqualToToday]}
                    data-testid="datofelt"
                    label={getPaVentText(originalVentearsak, hasManualPaVent, frist, originalFrist, showEndreFrist)}
                    hideLabel
                  />
                </div>
              )}
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className={styles.contentContainer}>
            {showSelect && (
              <div className={styles.selectContainer}>
                {erVenterEtterlysInntektsmelding ? (
                  <Select
                    className={styles.disabledNavSelect}
                    disabled
                    label="Hva venter vi på?"
                    hideLabel
                    size="small"
                  >
                    <option value="">Inntektsmelding</option>
                  </Select>
                ) : (
                  <SelectField
                    name="ventearsak"
                    label={
                      <Label size="small" as="p">
                        {"Hva venter vi på?"}
                      </Label>
                    }
                    placeholder={"Velg årsak"}
                    validate={[required]}
                    selectValues={ventearsaker
                      .filter(va => (erTilbakekreving ? inkluderVentearsak(va, ventearsak) : va.kanVelges === 'true'))
                      .sort((v1, v2) => v1.navn.localeCompare(v2.navn))
                      .map(va => (
                        <option key={va.kode} value={va.kode}>
                          {va.navn}
                        </option>
                      ))}
                    bredde="xxl"
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
                validate={[hasValidText, maxLength200]}
                label={
                  <div className={styles.commentInputLabel}>
                    <Label size="small" as="p">
                      {"Kommentar"}
                    </Label>
                    <span>({"valgfritt"})</span>
                  </div>
                }
              />
            )}
            {visBrevErBestilt && (
              <BodyShort size="small">
                Brevet blir bestilt
              </BodyShort>
            )}
            <div className={styles.flexContainer}>
              {!hasManualPaVent && showFristenTekst && (
                <BodyShort size="small">
                  OBS! Fristen på denne behandlingen er utløpt!
                  <VerticalSpacer eightPx />
                  Kontroller hvorfor Økonomi ikke har dannet et kravgrunnlag.
 Dersom det feilutbetalte beløpet er bortfalt skal saken henlegges.
For mer informasjon, se rutine under tilbakekreving.
                </BodyShort>
              )}
            </div>
            <div className={showSelect ? `${styles.buttonContainer} mt-11` : styles.buttonContainer}>
              <Button
                variant="primary"
                size="small"
                type={
                  hovedKnappenType(venteArsakHasChanged, fristHasChanged, ventearsakVariantHasChanged)
                    ? 'submit'
                    : 'button'
                }
                className={styles.button}
                onClick={getHovedknappOnClick}
                disabled={isButtonDisabled(
                  frist,
                  showAvbryt,
                  hasManualPaVent,
                  erVenterEtterlysInntektsmelding,
                  formHasChanges,
                )}
                loading={isSubmitting}
              >
                {getHovedknappTekst()}
              </Button>
              {(!hasManualPaVent || showAvbryt || !visBrevErBestilt) && (
                <Button
                  variant="secondary"
                  type="button"
                  size="small"
                  onClick={!showEndreFrist ? toggleEndreFrist : cancelEvent}
                >
                  {showEndreFrist ? (
                    Lukk
                  ) : (
                    Endre frist
                  )}
                </Button>
              )}
            </div>
          </div>
        </Modal.Body>
      </form>
    </Modal>
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
