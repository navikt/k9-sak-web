import { useFormContext } from 'react-hook-form';

import { Alert, Box, Label, Radio, ReadMore } from '@navikt/ds-react';

import AktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { maxValueFormatted, required } from '@navikt/ft-form-validators';
import { parseCurrencyInput, removeSpacesFromNumber } from '@navikt/ft-utils';

import type {
  TilkommetAktivitetFormValues,
  TilkommetInntektsforholdFieldValues,
} from '../../types/FordelBeregningsgrunnlagPanelValues';
import { getAktivitetNavnFraField } from './TilkommetAktivitetUtils';

import { RhfRadioGroup, RhfTextField } from '@navikt/ft-form-hooks';
import type { ReactElement } from 'react';
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

export const inntektStørreEnn0 = (inntekt: number) =>
  removeSpacesFromNumber(inntekt) > 0
    ? null
    : 'Du kan ikke registrere 0,- i inntekt, da dette ikke vil medføre gradering mot inntekt. Hvis arbeidsforholdet ikke medfører inntekter enda, men kanskje vil det senere, velger du nei. Informer også bruker om at de må melde fra hvis de begynner å jobbe for denne arbeidsgiveren.';

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

  const lagHjelpetekst = (): ReactElement => {
    switch (field.aktivitetStatus) {
      case AktivitetStatus.ARBEIDSTAKER:
        return (
          <>
            Her skal du fastsette den inntekten bruker ville hatt fremover ved fullt arbeid i sin «normalarbeidstid».
            Dette vurderes helhetlig ut fra opplysninger fra inntektsmelding, a-inntekt eller fra bruker selv. <br />
            <br />
            Det er viktig at det er samsvar mellom forventet inntekt sett opp mot den normalarbeidstiden bruker ville
            hatt hvis de jobbet fullt. Bruk opplysninger om arbeidstid i Aa-reg og fra søknaden.
            <br />
            <br /> Er du usikker på arbeidstid og/eller inntekt, må du kontakte bruker for avklaring. Spesielt ved
            varierende inntekt og arbeidstid, kan det være behov for å utrede inntektsforholdet. Du kan for eksempel be
            om arbeidskontrakt, innbetalt forskuddsskatt, foreløpig resultatregnskap og lignende.
            <br />
            <br /> Husk å begrunne fastsatt inntekt for alle periodene.
          </>
        );
      case AktivitetStatus.FRILANSER:
        return (
          <>
            Her skal du fastsette den inntekten bruker ville hatt fremover ved fullt arbeid i sin «normalarbeidstid».
            Dette vurderes helhetlig ut fra opplysninger fra a-inntekt eller fra bruker selv.
            <br />
            <br />
            Det er viktig at det er samsvar mellom forventet inntekt sett opp mot den normalarbeidstiden bruker ville
            hatt hvis de jobbet fullt. Bruk opplysninger om arbeidstid i Aa-reg og fra søknaden.
            <br />
            <br />
            Er du usikker på arbeidstid og/eller inntekt, må du kontakte bruker for avklaring. Spesielt ved varierende
            inntekt og arbeidstid, kan det være behov for å utrede inntektsforholdet. Du kan for eksempel be om
            arbeidskontrakt eller be bruker forklare hva som er avtalt.
            <br />
            <br />
            Husk å begrunne fastsatt inntekt for alle periodene.
          </>
        );
      case AktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE:
        return (
          <>
            Her skal du fastsette den inntekten bruker ville hatt fremover ved fullt arbeid i sin «normalarbeidstid».
            Bruk som hovedregel opplysninger fra søknaden.
            <br />
            <br />
            Er du usikker på arbeidstid og/eller inntekt, må du kontakte bruker for avklaring. Du kan for eksempel be om
            dokumentasjon på foreløpig resultatregnskap, innbetalt forskuddsskatt og lignende.
            <br />
            <br />
            Husk å begrunne fastsatt inntekt for alle periodene.
          </>
        );
      default:
        return (
          <>
            Her skal du fastsette den inntekten bruker ville hatt fremover ved fullt arbeid i sin «normalarbeidstid».
            Dette vurderes helhetlig ut fra opplysninger fra inntektsmelding, a-inntekt eller fra bruker selv. <br />
            <br />
            Det er viktig at det er samsvar mellom forventet inntekt sett opp mot den normalarbeidstiden bruker ville
            hatt hvis de jobbet fullt. Bruk opplysninger om arbeidstid i Aa-reg og fra søknaden.
            <br />
            <br /> Er du usikker på arbeidstid og/eller inntekt, må du kontakte bruker for avklaring. Spesielt ved
            varierende inntekt og arbeidstid, kan det være behov for å utrede inntektsforholdet. Du kan for eksempel be
            om arbeidskontrakt, innbetalt forskuddsskatt, foreløpig resultatregnskap og lignende.
            <br />
            <br /> Husk å begrunne fastsatt inntekt for alle periodene.
          </>
        );
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
      <RhfRadioGroup
        control={formMethods.control}
        label={getRadioGroupLabel()}
        name={`${formName}.${formFieldIndex}.perioder.${periodeFieldIndex}.inntektsforhold.${inntektsforholdFieldIndex}.skalRedusereUtbetaling`}
        isReadOnly={readOnly}
        validate={[required]}
      >
        <Radio value={true}>Ja</Radio>
        <Radio value={false}>Nei</Radio>
      </RhfRadioGroup>
      {skalRedusereValg === false && (
        <Box.New marginBlock="4 0">
          <Alert size="small" variant="info">
            Utgangspunktet er at alle nye inntektskilder som kommer etter skjæringstidspunktet skal kunne medføre
            gradering mot inntekt. Du skal derfor vanligvis velge "ja", som betyr at K9 vurderer om pleiepengene skal
            graderes mot denne inntekten. Hvis du velger "nei", vil ikke K9 bruke denne aktiviteten for å vurdere søkers
            inntektstap.
          </Alert>
        </Box.New>
      )}
      {skalRedusereValg && (
        <>
          <Box.New marginBlock="4 2">
            <Label size="small">Fastsett årsinntekt</Label>
            <ReadMore header="Hvordan fastsette årsinntekten?">{lagHjelpetekst()}</ReadMore>
          </Box.New>
          <div className={styles.bruttoInntektContainer}>
            <RhfTextField
              control={formMethods.control}
              name={`${formName}.${formFieldIndex}.perioder.${periodeFieldIndex}.inntektsforhold.${inntektsforholdFieldIndex}.bruttoInntektPrÅr`}
              label="Fastsett årsinntekt"
              hideLabel
              readOnly={readOnly}
              parse={parseCurrencyInput}
              validate={[required, maxValueFormatted(178956970), inntektStørreEnn0]}
              htmlSize={9}
            />
            <span className={styles.bruttoInntektCurrency}>kr</span>
          </div>
        </>
      )}
    </>
  );
};
