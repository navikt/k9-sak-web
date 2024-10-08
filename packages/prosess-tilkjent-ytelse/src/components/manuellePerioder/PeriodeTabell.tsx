import { FlexColumn, FlexContainer, FlexRow, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { ariaCheck } from '@fpsak-frontend/utils';
import { Button } from '@navikt/ds-react';
import { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { BeriketBeregningsresultatPeriode, NyArbeidsgiverFormState, TilkjentYtelseFormState } from './FormState';
import NyPeriode from './NyPeriode';
import PeriodeRad from './PeriodeRad';
import SlettPeriodeModal from './SlettPeriodeModal';

interface OwnProps {
  readOnly: boolean;
}

export const PeriodeTabell = ({ readOnly }: OwnProps) => {
  const {
    watch,
    setValue,
    formState: { isSubmitting },
    resetField,
  } = useFormContext<TilkjentYtelseFormState>();
  const { perioder, arbeidsgivere } = watch();
  const [isNyPeriodeFormOpen, setIsNyPeriodeFormOpen] = useState(false);
  const [showModalSlettPeriode, setShowModalSlettPeriode] = useState(false);
  const [periodeSlett, setPeriodeSlett] = useState<BeriketBeregningsresultatPeriode>(undefined);

  const hasOpenForm = perioder.some(periode => periode.openForm === true);
  const newPeriodeResetCallback = useCallback(() => {
    resetField('nyPeriodeForm', { defaultValue: { fom: '', tom: '', andeler: [] } });
    setIsNyPeriodeFormOpen(state => !state);
  }, []);

  const hideModal = useCallback(() => {
    setShowModalSlettPeriode(false);
  }, []);

  const newPeriodeCallback = useCallback(
    (nyPeriode: BeriketBeregningsresultatPeriode) => {
      const newPerioder = perioder.concat(nyPeriode).sort((a, b) => a.fom.localeCompare(b.fom));
      setValue('perioder', newPerioder);
      setIsNyPeriodeFormOpen(state => !state);
    },
    [perioder],
  );

  const newArbeidsgiverCallback = useCallback(
    (nyArbeidsgivere: NyArbeidsgiverFormState) => {
      setValue('arbeidsgivere', {
        ...(arbeidsgivere || {}),
        [nyArbeidsgivere.orgNr]: {
          identifikator: nyArbeidsgivere.orgNr,
          navn: nyArbeidsgivere.navn,
          erPrivatPerson: nyArbeidsgivere.erPrivatPerson,
          arbeidsforholdreferanser: nyArbeidsgivere.arbeidsforholdreferanser,
        },
      });
      resetField('nyArbeidsgiverForm', {
        defaultValue: {
          navn: '',
          orgNr: '',
          erPrivatPerson: false,
          arbeidsforholdreferanser: [],
          identifikator: '',
        },
      });
    },
    [arbeidsgivere],
  );

  const openSlettPeriodeModalCallback = useCallback(
    (id: string) => {
      setShowModalSlettPeriode(state => !state);
      setPeriodeSlett(perioder.find(periode => periode.id === id));
    },
    [perioder],
  );

  const removePeriode = useCallback(() => {
    setValue(
      'perioder',
      perioder.filter(periode => periode.id !== periodeSlett?.id),
    );

    hideModal();
  }, [periodeSlett, perioder]);

  const isAnyFormOpen = useCallback(() => perioder.some(p => p.openForm), [perioder]);

  const disableButtons = isSubmitting || hasOpenForm || isNyPeriodeFormOpen || readOnly;

  return (
    <>
      <VerticalSpacer twentyPx />
      <PeriodeRad
        arbeidsgivere={arbeidsgivere}
        openSlettPeriodeModalCallback={openSlettPeriodeModalCallback}
        isAnyFormOpen={isAnyFormOpen}
        isNyPeriodeFormOpen={isNyPeriodeFormOpen}
        readOnly={readOnly}
      />
      <VerticalSpacer twentyPx />
      <FlexContainer wrap>
        <FlexRow>
          <FlexColumn>
            <Button variant="primary" size="small" disabled={disableButtons} onClick={ariaCheck} loading={isSubmitting}>
              Bekreft og fortsett
            </Button>
          </FlexColumn>
          <FlexColumn>
            <Button
              variant="secondary"
              size="small"
              type="button"
              onClick={newPeriodeResetCallback}
              disabled={disableButtons}
            >
              Legg til ny periode
            </Button>
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
      <VerticalSpacer eightPx />

      {isNyPeriodeFormOpen && (
        <NyPeriode
          newPeriodeCallback={newPeriodeCallback}
          newArbeidsgiverCallback={newArbeidsgiverCallback}
          newPeriodeResetCallback={newPeriodeResetCallback}
          arbeidsgivere={arbeidsgivere}
          readOnly={readOnly}
        />
      )}

      {periodeSlett && (
        <SlettPeriodeModal
          showModal={showModalSlettPeriode}
          periode={periodeSlett}
          cancelEvent={hideModal}
          closeEvent={removePeriode}
        />
      )}
    </>
  );
};

export default PeriodeTabell;
