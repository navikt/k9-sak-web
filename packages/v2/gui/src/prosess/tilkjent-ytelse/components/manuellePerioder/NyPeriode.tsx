import type { FeatureToggles } from '@k9-sak-web/gui/featuretoggles/FeatureToggles.js';
import { calcDaysAndWeeks } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';
import { Button, ErrorMessage, HStack, Label, VStack } from '@navikt/ds-react';
import { Datepicker } from '@navikt/ft-form-hooks';
import { dateAfterOrEqual, hasValidDate, required } from '@navikt/ft-form-validators';
import { guid } from '@navikt/ft-utils';
import { useFormContext } from 'react-hook-form';
import type { ArbeidsgiverOpplysningerPerId } from '../../types/arbeidsgiverOpplysningerType';
import type {
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

const validateForm = (perioder: BeriketBeregningsresultatPeriode[], nyPeriodeFom?: string, nyPeriodeTom?: string) => {
  let feilmelding = '';

  if (!nyPeriodeFom || !nyPeriodeTom) {
    return feilmelding;
  }

  const kombinertePerioder = [...perioder, { fom: nyPeriodeFom, tom: nyPeriodeTom }];

  kombinertePerioder.forEach((periode, index: number) => {
    const forrigePeriode = perioder[index - 1];
    const nestePeriode = periode;

    if (forrigePeriode && sjekkOverlappendePerioder(index, nestePeriode, forrigePeriode)) {
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
  newPeriodeCallback: (nyPeriode: BeriketBeregningsresultatPeriode) => void;
  featureToggles?: FeatureToggles;
}

export const TilkjentYtelseNyPeriode = ({
  newPeriodeResetCallback,
  newArbeidsgiverCallback,
  newPeriodeCallback,
  readOnly,
  arbeidsgivere,
  featureToggles,
}: OwnProps) => {
  const formMethods = useFormContext<TilkjentYtelseFormState>();
  const formState = formMethods.watch('nyPeriodeForm');
  const numberOfDaysAndWeeks = calcDaysAndWeeks(formState?.fom, formState?.tom);

  const perioder = formMethods.watch('perioder');

  const feilmelding = validateForm(perioder, formState?.fom, formState?.tom);

  const handleSubmit = async () => {
    const valid = await formMethods.trigger(['nyPeriodeForm']);
    if (valid && !feilmelding && formState) {
      newPeriodeCallback(transformValues(formState));
    }
  };

  return (
    <div className={styles['periodeContainer']}>
      <VStack gap="space-20">
        <VStack gap="space-20">
          <Label size="small" as="p">
            Ny periode
          </Label>
          <HStack gap="space-8">
            <Datepicker name="nyPeriodeForm.fom" label="Fra" validate={[required, hasValidDate]} />
            <Datepicker
              name="nyPeriodeForm.tom"
              label="Til"
              validate={[required, hasValidDate, dateAfterOrEqual(formState?.fom ?? '')]}
            />
            <div className={styles['suffix']}>
              <div id="antallDager">{formState?.fom && numberOfDaysAndWeeks}</div>
            </div>
          </HStack>
          <NyAndel
            readOnly={readOnly}
            arbeidsgivere={arbeidsgivere}
            newArbeidsgiverCallback={newArbeidsgiverCallback}
            featureToggles={featureToggles}
          />
        </VStack>
        <div>
          {feilmelding && <ErrorMessage className="my-2">{feilmelding}</ErrorMessage>}
          <Button
            variant="primary"
            className={styles['oppdaterMargin']}
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
      </VStack>
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
