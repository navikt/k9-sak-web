import { KontrollerInntektPeriodeDtoValg } from '@k9-sak-web/backend/ungsak/generated';
import { PersonFillIcon } from '@navikt/aksel-icons';
import { Bleed, BodyLong, Box, Button, Heading, HStack, VStack } from '@navikt/ds-react';
import { InputField, RadioGroupPanel, TextAreaField } from '@navikt/ft-form-hooks';
import { maxLength, maxValue, minLength, minValue, required } from '@navikt/ft-form-validators';
import { useFormContext } from 'react-hook-form';
import styles from './aksjonspunktArbeidOgInntekt.module.css';
import { DetaljerOmInntekt } from './DetaljerOmInntekt';

interface AksjonspunktArbeidOgInntektProps {
  harBrukerrapportertInntekt: boolean;
  isSubmitting: boolean;
}

export const AksjonspunktArbeidOgInntekt = ({
  harBrukerrapportertInntekt,
  isSubmitting,
}: AksjonspunktArbeidOgInntektProps) => {
  const formMethods = useFormContext();
  const valg = formMethods.watch('valg');
  return (
    <Bleed marginBlock="4 0">
      <Box
        marginInline="2 0"
        padding="6"
        borderColor="border-warning"
        borderWidth="0 0 0 4"
        borderRadius="0 medium medium 0"
        style={{ background: '#F5F6F7' }} // TODO: Bytt til token var(--ax-bg-neutral-soft) når tilgjengelig (neste versjon av Aksel)
      >
        <VStack gap="8">
          <DetaljerOmInntekt />
          {/** TODO: Bytt til token var(--ax-bg-info-moderate-hover) når tilgjengelig (neste versjon av Aksel) */}
          <Box borderRadius="medium" padding="4" style={{ background: '#D7E6F0' }}>
            <HStack gap="2" wrap={false}>
              <PersonFillIcon title="Deltager" fontSize="1.5rem" className={styles.personIcon} />

              <VStack gap="2">
                <Heading size="xsmall" as="h3">
                  Beskrivelse fra deltaker for avvik i perioden xx.xx.xxxx - xx.xx.xxxx
                </Heading>
                <Box maxWidth="75ch">
                  <BodyLong size="small">
                    Jeg fikk forskuttert litt lønn av arbeidsgiver denne måneden fordi jeg har hatt økonomiske
                    utfordringer, så jeg rapporterte bare det jeg egentlig skulle fått utbetalt. Det var ikke meningen å
                    oppgi feil, bare å holde det riktig for denne måneden!
                  </BodyLong>
                </Box>
              </VStack>
            </HStack>
          </Box>
          <VStack gap="6">
            <Box maxWidth="70ch">
              <TextAreaField
                name="begrunnelse"
                label="Vurder hvilken inntekt som skal gi reduksjon i perioden"
                validate={[required, minLength(3), maxLength(1500)]}
                maxLength={1500}
              />
            </Box>
            <VStack gap="2">
              <RadioGroupPanel
                name="valg"
                label="Hvilken inntekt skal benyttes?"
                validate={[required]}
                radios={[
                  ...(harBrukerrapportertInntekt
                    ? [
                        {
                          value: KontrollerInntektPeriodeDtoValg.BRUK_BRUKERS_INNTEKT,
                          label: 'Rapportert inntekt fra deltager',
                        },
                      ]
                    : []),
                  {
                    value: KontrollerInntektPeriodeDtoValg.BRUK_REGISTER_INNTEKT,
                    label: 'Rapportert inntekt fra A-inntekt',
                  },
                  { value: KontrollerInntektPeriodeDtoValg.MANUELT_FASTSATT, label: 'Fastsett beløp' },
                ]}
              />
              {valg === KontrollerInntektPeriodeDtoValg.MANUELT_FASTSATT && (
                <VStack gap="4">
                  <InputField
                    name="fastsattArbeidsinntekt"
                    label="Inntekt fra arbeid"
                    type="text"
                    validate={[required, minValue(0), maxValue(1000000)]}
                    htmlSize={7}
                    size="small"
                  />
                  <InputField
                    name="fastsattYtelse"
                    label="Inntekt fra ytelse"
                    type="text"
                    validate={[required, minValue(0), maxValue(1000000)]}
                    htmlSize={7}
                    size="small"
                  />
                </VStack>
              )}
            </VStack>
            <HStack gap="2">
              <Button size="small" variant="primary" type="submit" loading={isSubmitting}>
                Bekreft og fortsett
              </Button>
              <Button size="small" variant="secondary" loading={isSubmitting}>
                Avbryt
              </Button>
            </HStack>
          </VStack>
        </VStack>
      </Box>
    </Bleed>
  );
};
