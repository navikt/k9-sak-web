import { FlexColumn, FlexContainer, FlexRow, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { ariaCheck } from '@fpsak-frontend/utils';
import { KodeverkMedNavn } from '@k9-sak-web/types';
import { Button } from '@navikt/ds-react';
import { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { BeriketBeregningsresultatPeriode, NyArbeidsgiverFormState, TilkjentYtelseFormState } from './FormState';
import NyPeriode from './NyPeriode';
import PeriodeRad from './PeriodeRad';
import SlettPeriodeModal from './SlettPeriodeModal';

interface OwnProps {
  readOnly: boolean;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
}

export const PeriodeTabell = ({ alleKodeverk, readOnly }: OwnProps) => {
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
        alleKodeverk={alleKodeverk}
      />
      <VerticalSpacer twentyPx />
      <FlexContainer wrap>
        <FlexRow>
          <FlexColumn>
            <Button variant="primary" size="small" disabled={disableButtons} onClick={ariaCheck} loading={isSubmitting}>
              <FormattedMessage id="TilkjentYtelse.BekreftOgFortsett" />
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
              <FormattedMessage id="TilkjentYtelse.LeggTilPeriode" />
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
          alleKodeverk={alleKodeverk}
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
