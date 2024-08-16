import { FlexColumn, FlexContainer, FlexRow, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { calcDaysAndWeeks, guid } from '@fpsak-frontend/utils';
import { ArbeidsgiverOpplysningerPerId, KodeverkMedNavn } from '@k9-sak-web/types';
import { Button, Label } from '@navikt/ds-react';
import { Datepicker, Form } from '@navikt/ft-form-hooks';
import { dateAfterOrEqual, hasValidDate, required } from '@navikt/ft-form-validators';
import { useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { BeriketBeregningsresultatPeriode, NyArbeidsgiverFormState, NyPeriodeFormState } from './FormState';
import NyAndel from './NyAndel';
import styles from './periode.module.css';

interface OwnProps {
  newPeriodeResetCallback: (values: any) => any;
  newArbeidsgiverCallback: (values: NyArbeidsgiverFormState) => void;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  arbeidsgivere: ArbeidsgiverOpplysningerPerId;
  readOnly: boolean;
  newPeriodeCallback: (nyPeriode: Partial<BeriketBeregningsresultatPeriode>) => void;
}

export const TilkjentYtelseNyPeriode = ({
  newPeriodeResetCallback,
  newArbeidsgiverCallback,
  newPeriodeCallback,
  readOnly,
  alleKodeverk,
  arbeidsgivere,
}: OwnProps) => {
  const formMethods = useForm<NyPeriodeFormState>({
    defaultValues: { fom: null, tom: null, andeler: [] },
  });
  const fom = formMethods.watch('fom');
  const tom = formMethods.watch('tom');
  const numberOfDaysAndWeeks = calcDaysAndWeeks(fom, tom);

  const handleSubmit = (formState: NyPeriodeFormState) => {
    newPeriodeCallback(transformValues(formState));
  };

  return (
    <Form formMethods={formMethods} onSubmit={handleSubmit}>
      <div className={styles.periodeContainer}>
        <div className={styles.periodeType}>
          <div className={styles.headerWrapper}>
            <Label size="small" as="p">
              <FormattedMessage id="TilkjentYtelse.NyPeriode" />
            </Label>
          </div>
        </div>
        <div className={styles.periodeInnhold}>
          <VerticalSpacer eightPx />
          <FlexContainer wrap>
            <FlexRow wrap>
              <FlexColumn>
                <FlexRow>
                  <FlexColumn>
                    <Datepicker
                      name="fom"
                      label={{ id: 'TilkjentYtelse.NyPeriode.Fom' }}
                      validate={[required, hasValidDate]}
                    />
                  </FlexColumn>
                  <FlexColumn>
                    <Datepicker
                      name="tom"
                      label={{ id: 'TilkjentYtelse.NyPeriode.Tom' }}
                      validate={[required, hasValidDate, dateAfterOrEqual(fom)]}
                    />
                  </FlexColumn>
                  <FlexColumn className={styles.suffix}>
                    <div id="antallDager">
                      {fom && (
                        <FormattedMessage
                          id={numberOfDaysAndWeeks.id.toString()}
                          values={{
                            weeks: numberOfDaysAndWeeks.weeks.toString(),
                            days: numberOfDaysAndWeeks.days.toString(),
                          }}
                        />
                      )}
                    </div>
                  </FlexColumn>
                </FlexRow>
                <VerticalSpacer twentyPx />
                <FlexRow>
                  <FlexColumn>
                    <NyAndel
                      readOnly={readOnly}
                      alleKodeverk={alleKodeverk}
                      arbeidsgivere={arbeidsgivere}
                      newArbeidsgiverCallback={newArbeidsgiverCallback}
                    />
                  </FlexColumn>
                </FlexRow>
              </FlexColumn>
            </FlexRow>
          </FlexContainer>
          <VerticalSpacer twentyPx />

          <Button
            variant="primary"
            className={styles.oppdaterMargin}
            type="button"
            size="small"
            loading={formMethods.formState.isSubmitting}
          >
            <FormattedMessage id="TilkjentYtelse.LeggTilPeriode" />
          </Button>
          <Button variant="secondary" type="button" size="small" onClick={newPeriodeResetCallback}>
            <FormattedMessage id="TilkjentYtelse.Avbryt" />
          </Button>
        </div>
      </div>
    </Form>
  );
};

const transformValues = (values: NyPeriodeFormState): BeriketBeregningsresultatPeriode => ({
  id: guid(),
  fom: values.fom,
  tom: values.tom,
  andeler: values.andeler.map(andel => ({
    ...andel,
    inntektskategori: {
      kode: andel.inntektskategori,
      kodeverk: 'INNTEKTSKATEGORI',
    },
    arbeidsgiverOrgnr: andel.arbeidsgiverOrgnr,
    tilSoker: andel.tilSoker,
    refusjon: andel.refusjon || 0,
    utbetalingsgrad: andel.utbetalingsgrad || 100,
  })),
});

// const mapStateToPropsFactory = (_initialState: any, ownProps: PureOwnProps) => {
//   const { newPeriodeCallback, behandlingId, behandlingVersjon } = ownProps;
//   const onSubmit = (values: any) => newPeriodeCallback(transformValues(values));

//   return (state: any) => ({
//     initialValues: {
//       fom: null,
//       tom: null,
//     },
//     nyPeriode: behandlingFormValueSelector('nyPeriodeForm', behandlingId, behandlingVersjon)(state, 'fom', 'tom'),
//     andeler: behandlingFormValueSelector('andeler', behandlingId, behandlingVersjon)(
//       state,
//       'tilSoker',
//       'refusjon',
//       'arbeidsgiver',
//       'inntektskategori',
//       'utbetalingsgrad',
//     ),
//     onSubmit,
//   });
// };

export default TilkjentYtelseNyPeriode;
