import { useFormContext } from 'react-hook-form';

import { Alert, Label, ReadMore } from '@navikt/ds-react';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { InputField, RadioGroupPanel } from '@navikt/ft-form-hooks';
import { maxValueFormatted, required } from '@navikt/ft-form-validators';
import { AktivitetStatus } from '@navikt/ft-kodeverk';
import { parseCurrencyInput } from '@navikt/ft-utils';

import type {
  TilkommetAktivitetFormValues,
  TilkommetInntektsforholdFieldValues,
} from '../../types/FordelBeregningsgrunnlagPanelValues';
import { getAktivitetNavnFraField } from './TilkommetAktivitetUtils';

import type { ArbeidsgiverOpplysningerPerId } from '../../types/ArbeidsgiverOpplysninger';
import type { Inntektsforhold } from '../../types/BeregningsgrunnlagFordeling';
import styles from './tilkommetAktivitet.module.css';

type Props = {
  formName: string;
  formFieldIndex: number;
  periodeFieldIndex: number;
  readOnly: boolean;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  inntektsforholdFieldIndex: number;
  field: TilkommetInntektsforholdFieldValues;
};

export const getInntektsforholdIdentifikator = (inntektsforhold: Inntektsforhold | undefined): string => {
  if (!inntektsforhold) {
    return '';
  }
  let result = inntektsforhold.aktivitetStatus;
  if (inntektsforhold.arbeidsgiverId) {
    result += inntektsforhold.arbeidsgiverId;
  }
  if (inntektsforhold.arbeidsforholdId) {
    result += inntektsforhold.arbeidsforholdId;
  }
  return result;
};

export const TilkommetInntektsforholdField = ({
  formName,
  formFieldIndex,
  periodeFieldIndex,
  readOnly,
  inntektsforholdFieldIndex,
  field,
  arbeidsgiverOpplysningerPerId,
}: Props) => {
  const formMethods = useFormContext<TilkommetAktivitetFormValues>();
  const skalRedusereValg = formMethods.watch(
    `${formName}.${formFieldIndex}.perioder.${periodeFieldIndex}.inntektsforhold.${inntektsforholdFieldIndex}.skalRedusereUtbetaling`,
  );

  const lagHjelpetekst = (): string => {
    switch (field.aktivitetStatus) {
      case AktivitetStatus.ARBEIDSTAKER:
        return `Kontakt bruker for å dokumentere inntekten i det nye arbeidsforholdet. 
          Enten ved å be arbeidsgiver sende inn inntektsmelding eller så kan bruker selv 
          dokumenterer inntekten med arbeidskontrakt, lønnsslipper eller lignende. 
          
          Dersom arbeidsforholdet har vart så lenge at utbetalt lønn er rapportert i a-ordningen, 
          kan § 8-28 filtret benyttes for å fastsette årsinntekten. 
          Hvis mulig, benytt de 3 siste månedene og regn om til årsinntekt. Dersom arbeidsforholdet har vart kortere, 
          kan du benytte en kortere periode.`;
      case AktivitetStatus.FRILANSER:
        return `Kontakt bruker for å dokumentere hva inntekten utgjør hvis det ikke er rapportert inntekt fra frilansoppdrag i a-ordningen. 
        
        Hvis oppdraget har vart så lenge at inntekten er rapportert i a-ordningen, kan § 8-28 filtret benyttes for å fastsette årsinntekten. 
        Benytt de 3 siste månedene hvis mulig og regn om til årsinntekt. Hvis oppdraget har vart kortere, kan du benytte en kortere periode.`;
      case AktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE:
        return `Benytt opplysninger oppgitt av bruker i søknaden, eller be bruker sannsynliggjøre forventet inntekt.`;
      default:
        return `Kontakt bruker for å dokumentere inntekten i det nye arbeidsforholdet. Enten ved å be arbeidsgiver sende inn inntektsmelding 
        eller så kan bruker selv dokumenterer inntekten med arbeidskontrakt, lønnsslipper eller lignende. 
        
        Dersom arbeidsforholdet har vart så lenge at utbetalt lønn er rapportert i a-ordningen, kan § 8-28 filtret benyttes for å fastsette 
        årsinntekten. Hvis mulig,  benytt de 3 siste månedene og regn om til årsinntekt. Dersom arbeidsforholdet har vart kortere, kan du 
        benytte en kortere periode.`;
    }
  };

  const getRadioGroupLabel = (): string => {
    if (field.aktivitetStatus === AktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE) {
      return 'Har søker inntekt fra den nye næringsaktiviteten som kan medføre gradering mot inntekt?';
    }
    if (field.aktivitetStatus === AktivitetStatus.FRILANSER) {
      return 'Har søker inntekt fra den nye frilanseraktiviteten som kan medføre gradering mot inntekt?';
    }
    return `Har søker inntekt fra ${getAktivitetNavnFraField(field, arbeidsgiverOpplysningerPerId)} som kan medføre gradering mot inntekt?`;
  };

  return (
    <>
      <RadioGroupPanel
        label={getRadioGroupLabel()}
        name={`${formName}.${formFieldIndex}.perioder.${periodeFieldIndex}.inntektsforhold.${inntektsforholdFieldIndex}.skalRedusereUtbetaling`}
        radios={[
          { value: 'true', label: 'Ja' },
          { value: 'false', label: 'Nei' },
        ]}
        isReadOnly={readOnly}
        validate={[required]}
        isTrueOrFalseSelection
      />
      {skalRedusereValg === false && (
        <>
          <VerticalSpacer sixteenPx />
          <Alert size="small" variant="info">
            Utgangspunktet er at alle nye inntektskilder som kommer etter skjæringstidspunktet skal kunne medføre
            gradering mot inntekt. Du skal derfor vanligvis velge "ja", som betyr at K9 vurderer om pleiepengene skal
            graderes mot denne inntekten. Hvis du velger "nei", vil ikke K9 bruke denne aktiviteten for å vurdere søkers
            inntektstap.
          </Alert>
        </>
      )}
      {skalRedusereValg && (
        <>
          <VerticalSpacer sixteenPx />
          <Label size="small">Fastsett årsinntekt</Label>
          <ReadMore header="Hvordan fastsette årsinntekten?">{lagHjelpetekst()}</ReadMore>
          <VerticalSpacer eightPx />
          <div className={styles.bruttoInntektContainer}>
            <InputField
              name={`${formName}.${formFieldIndex}.perioder.${periodeFieldIndex}.inntektsforhold.${inntektsforholdFieldIndex}.bruttoInntektPrÅr`}
              label="Fastsett årsinntekt"
              hideLabel
              readOnly={readOnly}
              className={styles.bruttoInntektInput}
              parse={parseCurrencyInput}
              validate={[required, maxValueFormatted(178956970)]}
            />
            <span className={styles.bruttoInntektCurrency}>kr</span>
          </div>
        </>
      )}
    </>
  );
};
