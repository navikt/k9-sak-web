import { PeriodpickerListRHF, TextAreaRHF } from '@fpsak-frontend/form';
import { Period } from '@fpsak-frontend/utils';
import { FagsakYtelsesType, fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { hasValidText } from '@k9-sak-web/gui/utils/validation/validators.js';
import { FormWithButtons } from '@k9-sak-web/gui/shared/formWithButtons/FormWithButtons.js';
import { Personopplysninger } from '@k9-sak-web/types';
import { Alert, BodyShort, Box, Button, Label, Modal } from '@navikt/ds-react';
import dayjs from 'dayjs';
import React, { useRef, type JSX } from 'react';
import { FormProvider, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { InnleggelsesperiodeDryRunResponse } from '../../../api/api';
import { InnleggelsesperiodeBegrensning } from '../../../types/InnleggelsesperiodeBegrensning';
import AddButton from '../add-button/AddButton';
import DeleteButton from '../delete-button/DeleteButton';
import { byggEndringer, erRadNyEllerEndret, InnleggelsesperiodeRad } from './innleggelsesperiodeEndringer';
import styles from './innleggelsesperiodeFormModal.module.css';

export enum FieldName {
  INNLEGGELSESPERIODER = 'innleggelsesperioder',
  SLETTEDE_PERIODER = 'slettedePerioder',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyType = any;

interface InnleggelsesperiodeFormModal {
  defaultValues: {
    [FieldName.INNLEGGELSESPERIODER]: Period[];
  };
  setModalIsOpen: (isOpen: boolean) => void;
  onSubmit: (formState) => void;
  isLoading: boolean;
  endringerPåvirkerAndreBehandlinger: (innleggelsesperioder: Period[]) => Promise<InnleggelsesperiodeDryRunResponse>;
  pleietrengendePart: Personopplysninger['pleietrengendePart'];
  innleggelsesperiodeBegrensning?: InnleggelsesperiodeBegrensning | null;
  fagsakYtelseType?: FagsakYtelsesType;
}

const begrunnelseValidators = {
  påkrevd: (begrunnelse: string) => (begrunnelse?.trim() ? true : 'Du må oppgi begrunnelse'),
  maksLengde: (begrunnelse: string) =>
    !begrunnelse || begrunnelse.length <= 4000 ? true : 'Begrunnelse kan ikke være lengre enn 4000 tegn',
  hasValidText,
};

const BegrunnelseForRad = ({ index, disabled }: { index: number; disabled: boolean }): JSX.Element | null => {
  const [periode, opprinneligPeriode] = useWatch({
    name: [
      `${FieldName.INNLEGGELSESPERIODER}[${index}].period`,
      `${FieldName.INNLEGGELSESPERIODER}[${index}].opprinneligPeriode`,
    ],
  });

  if (!erRadNyEllerEndret(periode, opprinneligPeriode)) {
    return null;
  }

  return (
    <Box marginBlock="space-16 space-0">
      <TextAreaRHF
        id={`innleggelsesperiode-begrunnelse-${index}`}
        name={`${FieldName.INNLEGGELSESPERIODER}.${index}.begrunnelse`}
        label={
          opprinneligPeriode ? 'Begrunn endring av perioden' : 'Beskriv hvor opplysningene om innleggelse kommer fra'
        }
        disabled={disabled}
        validators={begrunnelseValidators}
      />
    </Box>
  );
};

const InnleggelsesperiodeFormModal = ({
  defaultValues,
  setModalIsOpen,
  onSubmit,
  isLoading,
  endringerPåvirkerAndreBehandlinger,
  pleietrengendePart,
  innleggelsesperiodeBegrensning,
  fagsakYtelseType,
}: InnleggelsesperiodeFormModal): JSX.Element => {
  const skalViseBegrunnelsefelt = fagsakYtelseType === fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE;

  const formMethods = useForm({
    defaultValues: {
      [FieldName.INNLEGGELSESPERIODER]: defaultValues[FieldName.INNLEGGELSESPERIODER].map(innleggelsesPeriode => ({
        period: innleggelsesPeriode,
        begrunnelse: '',
        opprinneligPeriode: innleggelsesPeriode.fom ? innleggelsesPeriode : null,
      })),
      [FieldName.SLETTEDE_PERIODER]: [] as InnleggelsesperiodeRad[],
    },
  });
  const modalRef = useRef<HTMLDialogElement>(undefined);

  const {
    formState: { isDirty },
    getValues,
  } = formMethods;

  const slettedeFieldArray = useFieldArray({ control: formMethods.control, name: FieldName.SLETTEDE_PERIODER });

  const [showWarningMessage, setShowWarningMessage] = React.useState(false);

  const datobegrensning = innleggelsesperiodeBegrensning
    ? {
        limitations: {
          minDate: innleggelsesperiodeBegrensning.søknadsperiode.fom,
          maxDate: innleggelsesperiodeBegrensning.søknadsperiode.tom,
          invalidDateRanges: innleggelsesperiodeBegrensning.hullIPeriode,
        },
      }
    : {};

  const slettRad = (index: number, fieldArrayMethods: { remove: (i: number) => void }) => {
    const opprinnelig = getValues(`${FieldName.INNLEGGELSESPERIODER}.${index}.opprinneligPeriode`);
    if (skalViseBegrunnelsefelt && opprinnelig) {
      slettedeFieldArray.append({ period: opprinnelig, opprinneligPeriode: opprinnelig, begrunnelse: '' });
    }
    fieldArrayMethods.remove(index);
  };

  const handleSubmit = formState => {
    const endringer = skalViseBegrunnelsefelt
      ? byggEndringer(formState[FieldName.INNLEGGELSESPERIODER], formState[FieldName.SLETTEDE_PERIODER])
      : [];
    onSubmit({ ...formState, endringer: endringer.length ? endringer : undefined });
    setModalIsOpen(false);
    setShowWarningMessage(false);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    setShowWarningMessage(false);
  };

  // eslint-disable-next-line no-alert
  const handleBeforeCloseModal = () => isDirty && window.confirm('Du vil miste alle endringer du har gjort');

  return (
    <Modal
      ref={modalRef}
      open
      onClose={handleCloseModal}
      onBeforeClose={handleBeforeCloseModal}
      header={{ heading: 'Innleggelsesperioder', closeButton: true }}
      className={styles.innleggelsesperiodeFormModal}
    >
      <Modal.Body>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <FormProvider {...formMethods}>
          <FormWithButtons
            onSubmit={formMethods.handleSubmit(handleSubmit)}
            shouldShowSubmitButton={false}
            smallButtons
          >
            <Box marginBlock="space-24 space-0">
              <PeriodpickerListRHF
                name="innleggelsesperioder"
                legend="Innleggelsesperioder"
                fromDatepickerProps={{
                  hideLabel: true,
                  label: 'Fra',
                  ...datobegrensning,
                }}
                toDatepickerProps={{
                  hideLabel: true,
                  label: 'Til',
                  ...datobegrensning,
                }}
                afterOnChange={async () => {
                  const initialiserteInnleggelsesperioder = getValues().innleggelsesperioder.map(
                    ({ period }: AnyType) => new Period(period.fom, period.tom),
                  );
                  const erAllePerioderGyldige = initialiserteInnleggelsesperioder.every(
                    periode => periode.isValid() && periode.fomIsBeforeOrSameAsTom(),
                  );
                  if (erAllePerioderGyldige) {
                    const { førerTilRevurdering } = await endringerPåvirkerAndreBehandlinger(
                      initialiserteInnleggelsesperioder,
                    );
                    setShowWarningMessage(førerTilRevurdering);
                  }
                }}
                defaultValues={defaultValues[FieldName.INNLEGGELSESPERIODER] || []}
                validators={{
                  overlaps: (periodValue: Period) => {
                    const innleggelsesperioderFormValue = getValues()
                      .innleggelsesperioder.filter((periodWrapper: AnyType) => periodWrapper.period !== periodValue)
                      .map(({ period }: AnyType) => new Period(period.fom, period.tom));
                    const { fom, tom } = periodValue;
                    const period = new Period(fom, tom);
                    if (period.overlapsWithSomePeriodInList(innleggelsesperioderFormValue)) {
                      return 'Innleggelsesperiodene kan ikke overlappe';
                    }
                    return null;
                  },
                  hasEmptyPeriodInputs: (periodValue: Period) => {
                    const { fom, tom } = periodValue;
                    if (!fom) {
                      return 'Fra-dato er påkrevd';
                    }
                    if (!tom) {
                      return 'Til-dato er påkrevd';
                    }
                    return null;
                  },
                  fomIsBeforeOrSameAsTom: (periodValue: Period) => {
                    const { fom, tom } = periodValue;
                    const period = new Period(fom, tom);

                    if (period.fomIsBeforeOrSameAsTom() === false) {
                      return 'Fra-dato må være tidligere eller samme som til-dato';
                    }
                    return null;
                  },
                  fomIsBeforeFødselsdato: (periodValue: Period) => {
                    const { fom } = periodValue;
                    if (fom) {
                      const fødselsdato = pleietrengendePart?.fodselsdato;
                      if (fødselsdato && dayjs(fom).isBefore(fødselsdato)) {
                        return 'Fra-dato kan ikke være før fødselsdato';
                      }
                    }
                    return null;
                  },
                  innenforSøknadsperiode: (periodValue: Period) => {
                    if (!innleggelsesperiodeBegrensning?.sammenhengendePerioder?.length) return null;
                    const { fom, tom } = periodValue;
                    if (!fom || !tom) return null;
                    const erEksisterendePeriode = defaultValues[FieldName.INNLEGGELSESPERIODER].some(
                      eksisterende => eksisterende.fom === fom && eksisterende.tom === tom,
                    );
                    if (erEksisterendePeriode) return null;
                    const period = new Period(fom, tom);
                    const erInnenfor = innleggelsesperiodeBegrensning.sammenhengendePerioder.some(sp =>
                      sp.covers(period),
                    );
                    if (!erInnenfor) {
                      return 'Innleggelsesperioden må være innenfor søknadsperioden';
                    }
                    return null;
                  },
                }}
                renderBeforeFieldArray={fieldArrayMethods => (
                  <>
                    <Box marginBlock="space-0 space-16">
                      <AddButton
                        label="Legg til innleggelsesperiode"
                        onClick={() =>
                          fieldArrayMethods.append({
                            period: new Period('', ''),
                            begrunnelse: '',
                            opprinneligPeriode: null,
                          })
                        }
                        id="leggTilInnleggelsesperiodeKnapp"
                      />
                    </Box>
                    <Box marginBlock="space-16 space-0">
                      <div className={styles.innleggelsesperiodeFormModal__pickerLabels}>
                        <Label size="small" className={styles.innleggelsesperiodeFormModal__firstLabel} aria-hidden>
                          Fra
                        </Label>
                        <Label size="small" aria-hidden>
                          Til
                        </Label>
                      </div>
                    </Box>
                  </>
                )}
                renderContentAfterElement={(index, numberOfItems, fieldArrayMethods) => (
                  <DeleteButton onClick={() => slettRad(index, fieldArrayMethods)} />
                )}
                renderContentBelowElement={index =>
                  skalViseBegrunnelsefelt ? <BegrunnelseForRad index={index} disabled={isLoading} /> : null
                }
              />
              {skalViseBegrunnelsefelt && slettedeFieldArray.fields.length > 0 && (
                <Box marginBlock="space-24 space-0">
                  <Label size="small">Slettede innleggelsesperioder</Label>
                  {slettedeFieldArray.fields.map((item, index) => (
                    <div key={item.id} className={styles.innleggelsesperiodeFormModal__slettetRad}>
                      <BodyShort size="small">
                        {`${dayjs(item.period.fom).format('DD.MM.YYYY')} – ${dayjs(item.period.tom).format('DD.MM.YYYY')}`}
                      </BodyShort>
                      <TextAreaRHF
                        id={`innleggelsesperiode-sletting-begrunnelse-${index}`}
                        name={`${FieldName.SLETTEDE_PERIODER}.${index}.begrunnelse`}
                        label="Begrunn sletting av perioden"
                        disabled={isLoading}
                        validators={begrunnelseValidators}
                      />
                    </div>
                  ))}
                </Box>
              )}
              {showWarningMessage && (
                <Box marginBlock="space-24 space-0">
                  <Alert size="small" variant="warning">
                    Endringene du har gjort på innleggelsesperiodene vil føre til en ny revurdering av en annen
                    behandling. Påvirker alle søkere.
                  </Alert>
                </Box>
              )}
            </Box>
            <Box marginBlock="space-32 space-0">
              <div style={{ display: 'flex' }}>
                <Button loading={isLoading} disabled={isLoading} size="small">
                  Bekreft
                </Button>
                <Button
                  type="button"
                  size="small"
                  style={{ marginLeft: '1rem' }}
                  variant="secondary"
                  onClick={() => modalRef.current?.close()}
                  disabled={isLoading}
                >
                  Avbryt
                </Button>
              </div>
            </Box>
          </FormWithButtons>
        </FormProvider>
      </Modal.Body>
    </Modal>
  );
};
export default InnleggelsesperiodeFormModal;
