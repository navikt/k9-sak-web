import type { k9_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto as ArbeidsgiverOversiktDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import {
  ung_sak_kontrakt_kontroll_BrukKontrollertInntektValg as KontrollerInntektPeriodeDtoValg,
  type ung_sak_kontrakt_kontroll_KontrollerInntektPeriodeDto as KontrollerInntektPeriodeDto,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import { PersonFillIcon } from '@navikt/aksel-icons';
import { Bleed, BodyLong, Box, Button, Heading, HStack, Radio, VStack } from '@navikt/ds-react';
import { RhfRadioGroup, RhfTextarea, RhfTextField } from '@navikt/ft-form-hooks';
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
  arbeidsgivere: ArbeidsgiverOversiktDto | undefined;
}

export const AksjonspunktArbeidOgInntekt = ({
  harBrukerrapportertInntekt,
  isSubmitting,
  isReadOnly,
  periode,
  fieldIndex,
  inntektKontrollPeriode,
  arbeidsgivere,
}: AksjonspunktArbeidOgInntektProps) => {
  const formMethods = useFormContext();
  const valg = formMethods.watch(`perioder.${fieldIndex}.valg`);
  const radios = [
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
  ];
  return (
    <Bleed marginBlock="4 0">
      <Box.New
        marginInline="2 0"
        padding="6"
        borderWidth={isReadOnly ? undefined : '0 0 0 4'}
        borderRadius="0 medium medium 0"
        style={{ background: '#F5F6F7' }} // TODO: Bytt til token var(--ax-bg-neutral-soft) når tilgjengelig (neste versjon av Aksel)
      >
        <VStack gap="space-32">
          <DetaljerOmInntekt inntektKontrollPeriode={inntektKontrollPeriode} arbeidsgivere={arbeidsgivere} />
          {/** TODO: Bytt til token var(--ax-bg-info-moderate-hover) når tilgjengelig (neste versjon av Aksel) */}
          <Box.New borderRadius="medium" padding="4" style={{ background: '#D7E6F0' }}>
            <HStack gap="space-8" wrap={false}>
              <PersonFillIcon title="Deltaker" fontSize="1.5rem" className={styles.personIcon} />

              <VStack gap="space-8">
                <Heading size="xsmall" as="h3">
                  Beskrivelse fra deltaker for avvik i perioden{' '}
                  {periode?.fom && periode.tom && (
                    <PeriodLabel dateStringFom={periode?.fom} dateStringTom={periode?.tom} />
                  )}
                </Heading>
                <Box.New maxWidth="75ch">
                  <BodyLong size="small">{inntektKontrollPeriode?.uttalelseFraBruker}</BodyLong>
                </Box.New>
              </VStack>
            </HStack>
          </Box.New>
          <VStack gap="space-24">
            <Box.New maxWidth="70ch">
              <RhfTextarea
                control={formMethods.control}
                name={`perioder.${fieldIndex}.begrunnelse`}
                label="Vurder hvilken inntekt som skal gi reduksjon i perioden"
                validate={[required, minLength(3), maxLength(1500)]}
                maxLength={1500}
                readOnly={isReadOnly}
              />
            </Box.New>
            <VStack gap="space-8">
              <RhfRadioGroup
                control={formMethods.control}
                name={`perioder.${fieldIndex}.valg`}
                label="Hvilken inntekt skal benyttes?"
                validate={[required]}
                isReadOnly={isReadOnly}
              >
                {radios.map(radio => (
                  <Radio key={radio.value} value={radio.value}>
                    {radio.label}
                  </Radio>
                ))}
              </RhfRadioGroup>
              {valg === KontrollerInntektPeriodeDtoValg.MANUELT_FASTSATT && (
                <VStack gap="space-16">
                  <RhfTextField
                    control={formMethods.control}
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
              <HStack gap="space-8">
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
      </Box.New>
    </Bleed>
  );
};
