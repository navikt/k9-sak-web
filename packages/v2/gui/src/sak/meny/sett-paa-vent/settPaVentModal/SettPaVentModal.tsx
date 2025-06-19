import { VenteÅrsakType } from '@k9-sak-web/backend/k9sak/kodeverk/VenteÅrsakType.js';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import { formatDate } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { type KodeverkObject, KodeverkType } from '@k9-sak-web/lib/kodeverk/types.js';
import { goToLos } from '@k9-sak-web/lib/paths/paths.js';
import { CheckmarkCircleFillIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, Label, Modal, Select } from '@navikt/ds-react';
import { Datepicker, Form, SelectField, TextAreaField } from '@navikt/ft-form-hooks';
import {
  ariaCheck,
  dateAfterOrEqualToToday,
  dateBeforeToday,
  hasValidDate,
  hasValidText,
  maxLength,
  required,
} from '@navikt/ft-form-validators';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import styles from './settPaVentModal.module.css';

const initFrist = (): string => {
  const date = new Date();
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
  frist: string | undefined,
  showAvbryt: boolean,
  hasManualPaVent: boolean,
  erVenterEtterlysInntektsmelding: boolean,
  formHasChanges: boolean,
): boolean => {
  if (erVenterEtterlysInntektsmelding) {
    return false;
  }
  const dateNotValid = !frist || !!hasValidDate(frist) || !!dateAfterOrEqualToToday(frist);
  const defaultOptions = (!hasManualPaVent || showAvbryt) && !formHasChanges;
  return defaultOptions || dateNotValid;
};

const hovedKnappenType = (
  venteArsakHasChanged: boolean,
  fristHasChanged: boolean,
  ventearsakVariantHasChanged: boolean,
): boolean => venteArsakHasChanged || fristHasChanged || ventearsakVariantHasChanged;

const getPaVentText = (
  originalVentearsak: string | undefined,
  hasManualPaVent: boolean,
  frist: string | undefined,
  originalFrist: string | undefined,
  showEndreFrist: boolean,
) => {
  if (originalVentearsak) {
    if (originalVentearsak === venterEtterlysInntektsmeldingKode && originalFrist && !showEndreFrist) {
      return `Etterlysning av inntektsmelding er sendt og behandlingen er satt på vent til ${formatDate(originalFrist)}. Du kommer nå tilbake til LOS.`;
    }
    return hasManualPaVent || frist ? 'Behandlingen er satt på vent med frist:' : 'Behandlingen er satt på vent';
  }

  return hasManualPaVent || frist ? 'Behandlingen settes på vent med frist' : 'Behandlingen settes på vent';
};

const automatiskeVentearsakerForTilbakekreving = [
  VenteÅrsakType.VENT_PÅ_BRUKERTILBAKEMELDING,
  VenteÅrsakType.VENT_PÅ_TILBAKEKREVINGSGRUNNLAG,
];

const inkluderVentearsak = (ventearsak: KodeverkObject, valgtVentearsak?: string): boolean =>
  automatiskeVentearsakerForTilbakekreving.includes(ventearsak.kode) ? ventearsak.kode === valgtVentearsak : true;

interface PureOwnProps {
  submitCallback: (formData: FormState) => void;
  cancelEvent: () => void;
  showModal: boolean;
  erTilbakekreving: boolean;
  visBrevErBestilt?: boolean;
  hasManualPaVent: boolean;
  frist?: string;
  ventearsak?: string;
  ventearsakVariant?: string;
}

export interface FormState {
  ventearsak: string;
  frist: string;
  ventearsakVariant: string | undefined;
}

interface UtvidetKodeverkObject extends KodeverkObject {
  kanVelges: string;
}

const maxLength200 = maxLength(200);
export const SettPaVentModal = ({
  submitCallback,
  cancelEvent,
  showModal,
  erTilbakekreving,
  frist: originalFrist,
  ventearsak: originalVentearsak,
  visBrevErBestilt = false,
  hasManualPaVent,
  ventearsakVariant: originalVentearsakVariant,
}: PureOwnProps) => {
  const formMethods = useForm<FormState>({
    defaultValues: buildInitialValues(originalVentearsak, originalFrist, hasManualPaVent, originalVentearsakVariant),
  });
  const frist = useWatch({ control: formMethods.control, name: 'frist' });
  const ventearsak = useWatch({ control: formMethods.control, name: 'ventearsak' });
  const ventearsakVariant = useWatch({ control: formMethods.control, name: 'ventearsakVariant' });
  const { hentKodeverkForKode } = useKodeverkContext();
  const ventearsaker = hentKodeverkForKode(KodeverkType.VENT_AARSAK) as UtvidetKodeverkObject[];

  const venteArsakHasChanged = !(originalVentearsak === ventearsak || (!ventearsak && !originalVentearsak));
  const ventearsakVariantHasChanged =
    (!originalVentearsakVariant && !!ventearsakVariant) ||
    (!!originalVentearsakVariant && originalVentearsakVariant !== ventearsakVariant);

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
  const erVenterPaKravgrunnlag = ventearsak === VenteÅrsakType.VENT_PÅ_TILBAKEKREVINGSGRUNNLAG;
  const showFristenTekst = erTilbakekreving && erFristenUtløpt && erVenterPaKravgrunnlag;
  const showSelect = erVenterEtterlysInntektsmelding ? !showEndreFrist : true;
  const showKommentarInput = venterårsakerMedKommentarmulighet.includes(ventearsak);

  const venteArsakerSomKanVelges = [...ventearsaker.filter(va => va.kanVelges === 'true').map(va => va.kode)];

  const toggleEndreFrist = () => setShowEndreFrist(!showEndreFrist);

  const getHovedknappTekst = () => {
    if (erVenterEtterlysInntektsmelding && !showEndreFrist) {
      return 'OK';
    }

    if (erVenterEtterlysInntektsmelding && showEndreFrist) {
      return 'Endre frist';
    }

    return 'Sett på vent';
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

  const handleSubmit = (data: FormState) => {
    submitCallback(data);
  };

  return (
    <Modal
      className={`${styles.modal} ${styles.settPaVentModal}`}
      open={showModal}
      aria-label={originalVentearsak ? 'Behandlingen er satt på vent' : 'Behandlingen settes på vent med frist'}
      onClose={cancelEvent}
      data-testid="SettPaVentModal"
    >
      <Form<FormState> formMethods={formMethods} onSubmit={handleSubmit} data-testid="ventModalForm">
        <Modal.Header>
          <div className={styles.topContainer}>
            <div>
              <CheckmarkCircleFillIcon fontSize={30} style={{ color: 'var(--a-surface-success)' }} />
            </div>
            <div className={styles.divider} />
            <div className={styles.calendarContainer}>
              <BodyShort size="small" className={styles.label}>
                {getPaVentText(originalVentearsak, hasManualPaVent, frist, originalFrist, showEndreFrist)}
              </BodyShort>
              {showEndreFrist && (
                <div className={styles.datePicker}>
                  <Datepicker
                    name="frist"
                    validate={[required, hasValidDate, dateAfterOrEqualToToday]}
                    data-testid="datofelt"
                    label={getPaVentText(originalVentearsak, hasManualPaVent, frist, originalFrist, showEndreFrist)}
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
                        Hva venter vi på?
                      </Label>
                    }
                    validate={[required]}
                    selectValues={
                      Array.isArray(ventearsaker)
                        ? ventearsaker
                            .filter(va =>
                              erTilbakekreving
                                ? inkluderVentearsak(va, ventearsak)
                                : venteArsakerSomKanVelges.includes(va.kode),
                            )
                            .sort((v1, v2) => v1.navn.localeCompare(v2.navn))
                            .map(va => (
                              <option key={va.kode} value={va.kode}>
                                {va.navn}
                              </option>
                            ))
                        : []
                    }
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
                      Kommentar
                    </Label>
                    <span>(valgfritt)</span>
                  </div>
                }
              />
            )}
            {visBrevErBestilt && <BodyShort size="small">Brevet blir bestilt</BodyShort>}
            <div className={styles.flexContainer}>
              {!hasManualPaVent && showFristenTekst && (
                <BodyShort size="small">
                  OBS! Fristen på denne behandlingen er utløpt!
                  <Box marginBlock={'2 0'}>
                    {`Kontroller hvorfor Økonomi ikke har dannet et kravgrunnlag.
                    Dersom det feilutbetalte beløpet er bortfalt skal saken henlegges.
                    For mer informasjon, se rutine under tilbakekreving.`}
                  </Box>
                </BodyShort>
              )}
            </div>
            <div className={showSelect ? `${styles.buttonContainer} mt-8` : styles.buttonContainer}>
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
                  {showEndreFrist ? 'Lukk' : 'Endre frist'}
                </Button>
              )}
            </div>
          </div>
        </Modal.Body>
      </Form>
    </Modal>
  );
};

const buildInitialValues = (
  ventearsak: string | undefined,
  frist: string | undefined,
  hasManualPaVent: boolean,
  ventearsakVariant: string | undefined,
): FormState => ({
  ventearsak: ventearsak ?? '',
  frist: frist ? frist : hasManualPaVent === false ? '' : initFrist(),
  ventearsakVariant: ventearsakVariant ?? undefined,
});

export default SettPaVentModal;
