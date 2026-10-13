import { useFormContext } from 'react-hook-form';

import { Alert, BodyLong, Box, Detail, Heading, Label, List, Radio, ReadMore, VStack } from '@navikt/ds-react';

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
import { ytelseVisningsnavn } from '../../../../../utils/ytelseVisningsnavn';
import type { ArbeidsgiverOpplysningerPerId } from '../../types/ArbeidsgiverOpplysninger';
import type { Beregningsgrunnlag } from '../../types/Beregningsgrunnlag';
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
  beregningsgrunnlag: Beregningsgrunnlag;
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
  beregningsgrunnlag,
}: Props) => {
  const formMethods = useFormContext<TilkommetAktivitetFormValues>();
  const skalRedusereValg = formMethods.watch(
    `${formName}.${formFieldIndex}.perioder.${periodeFieldIndex}.inntektsforhold.${inntektsforholdFieldIndex}.skalRedusereUtbetaling`,
  );

  const lagHjelpetekst = (): ReactElement => {
    return (
      <VStack gap="space-24">
        <VStack gap="space-8">
          <Heading level="4" size="xsmall">
            Fullt arbeid i ny jobb
          </Heading>
          <BodyLong size="small">
            Hvis bruker jobber fullt i den nye jobben, skal du legge inn årsinntekten som bruker ville hatt ved fullt
            arbeid i sin normalarbeidstid. Bruk opplysninger fra A-inntekt, Aa-registeret og søknaden for å finne riktig
            arbeidstid og inntekt.
          </BodyLong>
          <BodyLong size="small">
            Du trenger ikke å endre årsinntekten ut fra søknadsperioder, så lenge forholdet mellom normalarbeidstid og
            årsinntekt er lik i perioden.
          </BodyLong>
          <BodyLong size="small">
            Eksempel:
            <br />
            Søker har fått en ny jobb med en normalarbeidstid på 30 timer i uken. Legg inn årsinntekten hun ville hatt
            dersom hun jobbet 30 timer hver uke. K9 beregner inntekten i perioden ut fra registrert inntekt og
            arbeidstid.
          </BodyLong>
        </VStack>
        <VStack gap="space-8">
          <Heading level="4" size="xsmall">
            Delvis arbeid i ny jobb
          </Heading>
          <BodyLong size="small">
            Hvis bruker jobber delvis i den nye jobben, må du regne ut hvilken årsinntekt bruker ville hatt ved fullt
            arbeid. Du kan derfor ikke bare gange faktisk utbetalt inntekt med 12.
          </BodyLong>
          <BodyLong size="small">
            Eksempel:
            <br />
            Søker har fått utbetalt 15 000 kroner i A-inntekt i juni.
          </BodyLong>
          <List size="small" as="ul">
            <List.Item>
              Har søker jobbet 100 prosent, tilsvarer dette en årsinntekt på 180 000 kroner (15 000 × 12).
            </List.Item>
            <List.Item>
              Har søker kun jobbet 40 prosent, tilsvarer 15 000 kroner bare 40 prosent av inntekten i en
              fulltidsstilling. Årsinntekten ved fullt arbeid blir da 450 000 kroner (15 000 ÷ 40 × 100).
            </List.Item>
          </List>
        </VStack>
        <BodyLong size="small">
          Er du usikker på arbeidstid eller inntekt, må du kontakte bruker. Du kan også be om dokumentasjon, for
          eksempel arbeidskontrakt eller foreløpig resultatregnskap.
        </BodyLong>
      </VStack>
    );
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
        legend={getRadioGroupLabel()}
        name={`${formName}.${formFieldIndex}.perioder.${periodeFieldIndex}.inntektsforhold.${inntektsforholdFieldIndex}.skalRedusereUtbetaling`}
        readOnly={readOnly}
        validate={[required]}
      >
        <Radio value={true}>Ja</Radio>
        <Radio value={false}>Nei</Radio>
      </RhfRadioGroup>
      {skalRedusereValg === false &&
        (() => {
          const ytelsetype = beregningsgrunnlag.ytelsesspesifiktGrunnlag?.ytelsetype;
          const ytelseTekst = ytelseVisningsnavn(ytelsetype);
          return (
            <Box marginBlock="space-16 space-0">
              <Alert size="small" variant="info">
                Utgangspunktet er at alle nye inntektskilder som kommer etter skjæringstidspunktet skal kunne medføre
                gradering mot inntekt. Du skal derfor vanligvis velge "ja", som betyr at K9 vurderer om{' '}
                {ytelseTekst.ytelseNavnBestemt} skal graderes mot denne inntekten. Hvis du velger "nei", vil ikke K9
                bruke denne aktiviteten for å vurdere søkers inntektstap.
              </Alert>
            </Box>
          );
        })()}
      {skalRedusereValg && (
        <>
          <Box marginBlock="space-16 space-8">
            <Label size="small">Fastsett årsinntekt</Label>
            <Detail>
              Legg inn årsinntekten søker vil ha hvis de jobber fullt i den nye stillingen sin. Hvis bruker jobber
              delvis i den nye stillingen, må du regne ut hvilken årsinntekt bruker vil ha ved fullt arbeid.
            </Detail>
          </Box>
          <Box className="mt-4 flex">
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
          </Box>
          <Box marginBlock="space-16 space-0">
            <ReadMore size="small" header="Hvordan fastsette årsinntekt?">
              {lagHjelpetekst()}
            </ReadMore>
          </Box>
        </>
      )}
    </>
  );
};
