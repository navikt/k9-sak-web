import type { FeatureToggles } from '@k9-sak-web/lib/types/FeatureTogglesType.js';
import { Button, HStack, VStack } from '@navikt/ds-react';
import { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import type { BeriketBeregningsresultatPeriode, NyArbeidsgiverFormState, TilkjentYtelseFormState } from './FormState';
import NyPeriode from './NyPeriode';
import PeriodeRad from './PeriodeRad';
import SlettPeriodeModal from './SlettPeriodeModal';

interface OwnProps {
  readOnly: boolean;
  featureToggles?: FeatureToggles;
}

export const PeriodeTabell = ({ readOnly, featureToggles }: OwnProps) => {
  const {
    watch,
    setValue,
    formState: { isSubmitting },
    resetField,
  } = useFormContext<TilkjentYtelseFormState>();
  const { perioder, arbeidsgivere } = watch();
  const [isNyPeriodeFormOpen, setIsNyPeriodeFormOpen] = useState(false);
  const [showModalSlettPeriode, setShowModalSlettPeriode] = useState(false);
  const [periodeSlett, setPeriodeSlett] = useState<BeriketBeregningsresultatPeriode | undefined>(undefined);

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
        },
      });
      resetField('nyArbeidsgiverForm', {
        defaultValue: {
          navn: '',
          orgNr: '',
          erPrivatPerson: false,
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
      <VStack gap="5">
        <PeriodeRad
          arbeidsgivere={arbeidsgivere}
          openSlettPeriodeModalCallback={openSlettPeriodeModalCallback}
          isAnyFormOpen={isAnyFormOpen}
          isNyPeriodeFormOpen={isNyPeriodeFormOpen}
          readOnly={readOnly}
        />
        <HStack gap="2">
          <Button variant="primary" size="small" disabled={disableButtons} loading={isSubmitting}>
            Bekreft og fortsett
          </Button>
          <Button
            variant="secondary"
            size="small"
            type="button"
            onClick={newPeriodeResetCallback}
            disabled={disableButtons}
          >
            Legg til ny periode
          </Button>
        </HStack>
      </VStack>
      <div className="mt-2">
        {isNyPeriodeFormOpen && (
          <NyPeriode
            newPeriodeCallback={newPeriodeCallback}
            newArbeidsgiverCallback={newArbeidsgiverCallback}
            newPeriodeResetCallback={newPeriodeResetCallback}
            arbeidsgivere={arbeidsgivere}
            readOnly={readOnly}
            featureToggles={featureToggles}
          />
        )}

        {periodeSlett && (
          <SlettPeriodeModal showModal={showModalSlettPeriode} cancelEvent={hideModal} closeEvent={removePeriode} />
        )}
      </div>
    </>
  );
};

export default PeriodeTabell;
