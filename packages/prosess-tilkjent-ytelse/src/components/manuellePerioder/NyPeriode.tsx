import { FlexColumn, FlexContainer, FlexRow, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { guid } from '@fpsak-frontend/utils';
import { calcDaysAndWeeks } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';
import { ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/types';
import { Button, ErrorMessage, Label } from '@navikt/ds-react';
import { Datepicker } from '@navikt/ft-form-hooks';
import { dateAfterOrEqual, hasValidDate, required } from '@navikt/ft-form-validators';
import { useFormContext } from 'react-hook-form';
import {
  BeriketBeregningsresultatPeriode,
  NyArbeidsgiverFormState,
  NyPeriodeFormState,
  TilkjentYtelseFormState,
} from './FormState';
import NyAndel from './NyAndel';
import styles from './periode.module.css';

interface Periode {
  fom: string;
  tom: string;
}

export const sjekkOverlappendePerioder = (index: number, nestePeriode: Periode, forrigePeriode: Periode) =>
  index !== 0 && initializeDate(nestePeriode.fom).isSameOrBefore(initializeDate(forrigePeriode.tom));

const validateForm = (perioder: BeriketBeregningsresultatPeriode[], nyPeriodeFom: string, nyPeriodeTom: string) => {
  let feilmelding = '';

  if (!nyPeriodeFom || !nyPeriodeTom) {
    return feilmelding;
  }

  const kombinertePerioder = [...perioder, { fom: nyPeriodeFom, tom: nyPeriodeTom }];

  kombinertePerioder.forEach((periode, index: number) => {
    const forrigePeriode = perioder[index - 1];
    const nestePeriode = periode;

    if (sjekkOverlappendePerioder(index, nestePeriode, forrigePeriode)) {
      feilmelding = 'Perioden overlapper med en annen periode';
    }
  });

  return feilmelding;
};

interface OwnProps {
  newPeriodeResetCallback: (values: any) => any;
  newArbeidsgiverCallback: (values: NyArbeidsgiverFormState) => void;
  arbeidsgivere: ArbeidsgiverOpplysningerPerId;
  readOnly: boolean;
  newPeriodeCallback: (nyPeriode: Partial<BeriketBeregningsresultatPeriode>) => void;
}

export const TilkjentYtelseNyPeriode = ({
  newPeriodeResetCallback,
  newArbeidsgiverCallback,
  newPeriodeCallback,
  readOnly,
  arbeidsgivere,
}: OwnProps) => {
  const formMethods = useFormContext<TilkjentYtelseFormState>();
  const formState = formMethods.watch('nyPeriodeForm');
  const numberOfDaysAndWeeks = calcDaysAndWeeks(formState.fom, formState.tom);

  const perioder = formMethods.watch('perioder');

  const feilmelding = validateForm(perioder, formState.fom, formState.fom);

  const handleSubmit = () => {
    formMethods.trigger(['nyPeriodeForm']).then(valid => {
      if (valid && !feilmelding) {
        newPeriodeCallback(transformValues(formState));
      }
    });
  };

  return (
    <div className={styles.periodeContainer}>
      <div className={styles.periodeType}>
        <div className={styles.headerWrapper}>
          <Label size="small" as="p">
            Ny periode
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
                  <Datepicker name="nyPeriodeForm.fom" label="Fra" validate={[required, hasValidDate]} />
                </FlexColumn>
                <FlexColumn>
                  <Datepicker
                    name="nyPeriodeForm.tom"
                    label="Til"
                    validate={[required, hasValidDate, dateAfterOrEqual(formState.fom)]}
                  />
                </FlexColumn>
                <FlexColumn className={styles.suffix}>
                  <div id="antallDager">{formState.fom && numberOfDaysAndWeeks}</div>
                </FlexColumn>
              </FlexRow>
              <VerticalSpacer twentyPx />
              <FlexRow>
                <FlexColumn>
                  <NyAndel
                    readOnly={readOnly}
                    arbeidsgivere={arbeidsgivere}
                    newArbeidsgiverCallback={newArbeidsgiverCallback}
                  />
                </FlexColumn>
              </FlexRow>
            </FlexColumn>
          </FlexRow>
        </FlexContainer>
        <VerticalSpacer twentyPx />
        {feilmelding && <ErrorMessage className="my-2">{feilmelding}</ErrorMessage>}
        <Button
          variant="primary"
          className={styles.oppdaterMargin}
          type="button"
          size="small"
          loading={formMethods.formState.isSubmitting}
          onClick={handleSubmit}
        >
          Legg til ny periode
        </Button>
        <Button variant="secondary" type="button" size="small" onClick={newPeriodeResetCallback}>
          Avbryt
        </Button>
      </div>
    </div>
  );
};

const transformValues = (values: NyPeriodeFormState): BeriketBeregningsresultatPeriode => ({
  id: guid(),
  fom: values.fom,
  tom: values.tom,
  dagsats: null,
  andeler: values.andeler.map(andel => ({
    ...andel,
    inntektskategori: andel.inntektskategori,
    arbeidsgiverOrgnr: andel.arbeidsgiverOrgnr,
    arbeidsgiverPersonIdent: andel.arbeidsgiverPersonIdent,
    tilSoker: andel.tilSoker,
    refusjon: andel.refusjon || 0,
    utbetalingsgrad: andel.utbetalingsgrad || 100,
  })),
});

export default TilkjentYtelseNyPeriode;
