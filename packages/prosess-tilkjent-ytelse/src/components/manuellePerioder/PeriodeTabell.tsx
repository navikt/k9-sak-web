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

// const createNewPerioder = (perioder, id: string, values: Partial<SlettetPeriode>) => {
//   const updatedIndex = perioder.findIndex(p => p.id === id);
//   const updatedPeriode = perioder.find(p => p.id === id);

//   return [
//     ...perioder.slice(0, updatedIndex),
//     {
//       ...updatedPeriode,
//       ...values,
//     },
//     ...perioder.slice(updatedIndex + 1),
//   ];
// };

interface OwnProps {
  readOnly: boolean;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
}

export const PeriodeTabell = ({ alleKodeverk, readOnly }: OwnProps) => {
  const {
    watch,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = useFormContext<TilkjentYtelseFormState>();
  const initialValues = getValues(); // OBS!!! Sjekk om dette er riktig
  const { perioder, arbeidsgivere, slettedePerioder } = watch();
  const [isNyPeriodeFormOpen, setIsNyPeriodeFormOpen] = useState(false);
  const [showModalSlettPeriode, setShowModalSlettPeriode] = useState(false);
  const [periodeSlett, setPeriodeSlett] = useState<BeriketBeregningsresultatPeriode>(undefined);

  const hasOpenForm = perioder.some(periode => periode.openForm === true);
  const newPeriodeResetCallback = useCallback(() => {
    // formReset(`${behandlingFormPrefix}.nyPeriodeForm`);
    setIsNyPeriodeFormOpen(state => !state);
  }, []);

  const hideModal = useCallback(() => {
    setShowModalSlettPeriode(false);
  }, []);

  const newPeriodeCallback = useCallback(
    (nyPeriode: BeriketBeregningsresultatPeriode) => {
      const newPerioder = perioder.concat(nyPeriode).sort((a, b) => a.fom.localeCompare(b.fom));
      setValue('perioder', newPerioder);
      // formChange(`${behandlingFormPrefix}.${FORM_NAME}`, 'perioder', newPerioder);
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

      // formReset(`${behandlingFormPrefix}.nyArbeidsgiverForm`);
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

  const removePeriode = useCallback(
    (values: any) => {
      const hasOriginalPeriode = initialValues.perioder.find((p: any) => p.id === periodeSlett?.id);

      if (hasOriginalPeriode) {
        setValue(
          'slettedePerioder',
          slettedePerioder.concat([
            {
              ...periodeSlett,
              begrunnelse: values.begrunnelse,
            },
          ]),
        );
      }

      setValue(
        'perioder',
        perioder.filter(periode => periode.id !== periodeSlett?.id),
      );

      hideModal();
    },
    [initialValues, periodeSlett, perioder],
  );

  // const cleaningUpForm = useCallback(
  //   (id: string) => {
  //     setValue(
  //       'perioder',
  //       perioder
  //         .map(periode => {
  //           if (periode.id === id) {
  //             return {
  //               ...periode,
  //               begrunnelse: undefined,
  //               resultat: undefined,
  //             };
  //           }
  //           return { ...periode };
  //         })
  //         .sort((a, b) => a.fom.localeCompare(b.fom)),
  //     );
  //   },
  //   [perioder],
  // );

  // const editPeriode = useCallback(
  //   (id: string) => {
  //     const newPerioder = createNewPerioder(perioder, id, { openForm: true });
  //     setValue('perioder', newPerioder);
  //   },
  //   [perioder],
  // );

  // const cancelEditPeriode = useCallback(
  //   (id: string) => {
  //     const newPerioder = createNewPerioder(perioder, id, { openForm: false });
  //     setValue('perioder', newPerioder);
  //   },
  //   [perioder],
  // );

  // const updatePeriode = useCallback(
  //   ({ id, begrunnelse, nyFom, nyTom }: { id: string; begrunnelse: string; nyFom: string; nyTom: string }) => {
  //     const updatedPeriode = perioder.find(p => p.id === id);
  //     const newPerioder = createNewPerioder(perioder, id, {
  //       id,
  //       tom: nyTom || updatedPeriode.tom,
  //       fom: nyFom || updatedPeriode.fom,
  //       begrunnelse,
  //       openForm: !updatedPeriode.openForm,
  //       // isFromSøknad: updatedPeriode.isFromSøknad, // finner ikke isFromSøknad noe sted i løsningen
  //       updated: true,
  //     });
  //     setValue(
  //       'perioder',
  //       newPerioder.sort((a, b) => a.fom.localeCompare(b.fom)),
  //     );
  //   },
  //   [perioder],
  // );

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
