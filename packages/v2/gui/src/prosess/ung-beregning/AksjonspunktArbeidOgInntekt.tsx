import {
  KontrollerInntektPeriodeDtoValg,
  type KontrollerInntektPeriodeDto,
} from '@k9-sak-web/backend/ungsak/generated';
import { PersonFillIcon } from '@navikt/aksel-icons';
import { Bleed, BodyLong, Box, Button, Heading, HStack, VStack } from '@navikt/ds-react';
import { InputField, RadioGroupPanel, TextAreaField } from '@navikt/ft-form-hooks';
import { maxLength, maxValueFormatted, minLength, required } from '@navikt/ft-form-validators';
import { parseCurrencyInput } from '@navikt/ft-utils';
import { useFormContext } from 'react-hook-form';
import PeriodLabel from '../../shared/periodLabel/PeriodLabel';
import styles from './aksjonspunktArbeidOgInntekt.module.css';
import { DetaljerOmInntekt } from './DetaljerOmInntekt';

interface AksjonspunktArbeidOgInntektProps {
  harBrukerrapportertInntekt: boolean;
  isSubmitting: boolean;
  isReadOnly: boolean;
  periode: KontrollerInntektPeriodeDto['periode'];
  fieldIndex: number;
  inntektKontrollPeriode: KontrollerInntektPeriodeDto;
}

export const AksjonspunktArbeidOgInntekt = ({
  harBrukerrapportertInntekt,
  isSubmitting,
  isReadOnly,
  periode,
  fieldIndex,
  inntektKontrollPeriode,
}: AksjonspunktArbeidOgInntektProps) => {
  const formMethods = useFormContext();
  const valg = formMethods.watch(`perioder.${fieldIndex}.valg`);
  return (
    <Bleed marginBlock="4 0">
      <Box
        marginInline="2 0"
        padding="6"
        borderColor={isReadOnly ? undefined : 'border-warning'}
        borderWidth={isReadOnly ? undefined : '0 0 0 4'}
        borderRadius="0 medium medium 0"
        style={{ background: '#F5F6F7' }} // TODO: Bytt til token var(--ax-bg-neutral-soft) når tilgjengelig (neste versjon av Aksel)
      >
        <VStack gap="8">
          <DetaljerOmInntekt inntektKontrollPeriode={inntektKontrollPeriode} />
          {/** TODO: Bytt til token var(--ax-bg-info-moderate-hover) når tilgjengelig (neste versjon av Aksel) */}
          <Box borderRadius="medium" padding="4" style={{ background: '#D7E6F0' }}>
            <HStack gap="2" wrap={false}>
              <PersonFillIcon title="Deltaker" fontSize="1.5rem" className={styles.personIcon} />

              <VStack gap="2">
                <Heading size="xsmall" as="h3">
                  Beskrivelse fra deltaker for avvik i perioden{' '}
                  {periode?.fom && periode.tom && (
                    <PeriodLabel dateStringFom={periode?.fom} dateStringTom={periode?.tom} />
                  )}
                </Heading>
                <Box maxWidth="75ch">
                  <BodyLong size="small">{inntektKontrollPeriode?.uttalelseFraBruker}</BodyLong>
                </Box>
              </VStack>
            </HStack>
          </Box>
          <VStack gap="6">
            <Box maxWidth="70ch">
              <TextAreaField
                name={`perioder.${fieldIndex}.begrunnelse`}
                label="Vurder hvilken inntekt som skal gi reduksjon i perioden"
                validate={[required, minLength(3), maxLength(1500)]}
                maxLength={1500}
                readOnly={isReadOnly}
              />
            </Box>
            <VStack gap="2">
              <RadioGroupPanel
                name={`perioder.${fieldIndex}.valg`}
                label="Hvilken inntekt skal benyttes?"
                validate={[required]}
                isReadOnly={isReadOnly}
                radios={[
                  ...(harBrukerrapportertInntekt
                    ? [
                        {
                          value: KontrollerInntektPeriodeDtoValg.BRUK_BRUKERS_INNTEKT,
                          label: 'Rapportert inntekt fra deltaker',
                        },
                      ]
                    : []),
                  {
                    value: KontrollerInntektPeriodeDtoValg.BRUK_REGISTER_INNTEKT,
                    label: 'Rapportert inntekt fra A-ordningen',
                  },
                  { value: KontrollerInntektPeriodeDtoValg.MANUELT_FASTSATT, label: 'Fastsett beløp' },
                ]}
              />
              {valg === KontrollerInntektPeriodeDtoValg.MANUELT_FASTSATT && (
                <VStack gap="4">
                  <InputField
                    name={`perioder.${fieldIndex}.fastsattInntekt`}
                    label="Oppgi samlet arbeidsinntekt og ytelse"
                    type="text"
                    validate={[required, maxValueFormatted(1000000)]}
                    htmlSize={7}
                    size="small"
                    readOnly={isReadOnly}
                    parse={parseCurrencyInput}
                  />
                </VStack>
              )}
            </VStack>
            {!isReadOnly && (
              <HStack gap="2">
                <Button size="small" variant="primary" type="submit" loading={isSubmitting}>
                  Bekreft og fortsett
                </Button>
                <Button size="small" variant="secondary" loading={isSubmitting}>
                  Avbryt
                </Button>
              </HStack>
            )}
          </VStack>
        </VStack>
      </Box>
    </Bleed>
  );
};
