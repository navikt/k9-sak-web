import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import type { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import type { BarnDto } from '@k9-sak-web/backend/k9sak/kontrakt/omsorgspenger/BarnDto.js';
import type { RammevedtakDto } from '@k9-sak-web/backend/k9sak/kontrakt/omsorgspenger/RammevedtakDto.js';
import { ExclamationmarkTriangleFillIcon, PersonGroupIcon, PersonIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Heading, HStack, InfoCard, Label, VStack } from '@navikt/ds-react';
import type { ReactNode } from 'react';
import { BarnKort } from './BarnKort.js';
import {
  finnMidlertidigAleneomsorg,
  finnUidentifiserteRammevedtak,
  formaterDatoEllerStrek,
  koblBarnOgRammevedtak,
  utolkbarTekst,
} from './barnOgRammevedtak.js';

const overskriftForBarn = (fagsakYtelseType: FagsakYtelsesType | undefined): string => {
  switch (fagsakYtelseType) {
    case fagsakYtelsesType.OMSORGSPENGER_KS:
      return 'Barnet søknaden gjelder for';
    case fagsakYtelsesType.OMSORGSPENGER_MA:
      return 'Disse barna er søkerens folkeregistrerte barn';
    default:
      return 'Disse barna er søkerens folkeregistrerte barn slik det var ved tidspunktet for beregning av dager';
  }
};

const Seksjonstittel = ({ ikon, children }: { ikon: ReactNode; children: string }) => (
  <Heading size="small" level="3">
    <HStack gap="space-8" align="center" as="span">
      {ikon}
      {children}
    </HStack>
  </Heading>
);

export interface BarnOmsFaktaProps {
  barn: BarnDto[];
  rammevedtak: RammevedtakDto[];
  fagsakYtelseType?: FagsakYtelsesType;
}

export const BarnOmsFakta = ({ barn, rammevedtak, fagsakYtelseType }: BarnOmsFaktaProps) => {
  const barnMedRammevedtak = koblBarnOgRammevedtak(barn, rammevedtak);
  const uidentifiserte = finnUidentifiserteRammevedtak(rammevedtak).filter(gruppe => gruppe.rammevedtak.length > 0);
  const midlertidigAleneomsorg = finnMidlertidigAleneomsorg(rammevedtak);

  return (
    <VStack gap="space-16">
      {uidentifiserte.map(gruppe => {
        const utolkbareTekster = gruppe.rammevedtak.map(utolkbarTekst).filter(tekst => tekst !== undefined);
        return (
          <InfoCard key={gruppe.type} data-color="warning" size="small">
            <InfoCard.Message icon={<ExclamationmarkTriangleFillIcon aria-hidden />}>
              {gruppe.tekst(gruppe.rammevedtak.length)}
              {utolkbareTekster.length > 0 && (
                <ol>
                  {utolkbareTekster.map((tekst, index) => (
                    <li key={index}>Utolkbar tekst: &quot;{tekst}&quot;</li>
                  ))}
                </ol>
              )}
            </InfoCard.Message>
          </InfoCard>
        );
      })}

      <VStack as="section" gap="space-16">
        <Seksjonstittel ikon={<PersonGroupIcon aria-hidden />}>Barn</Seksjonstittel>
        {barn.length === 0 ? (
          <BodyShort size="small">Det er ikke registrert noen barn på søkeren</BodyShort>
        ) : (
          <VStack gap="space-16">
            <Label size="small" as="p">
              {overskriftForBarn(fagsakYtelseType)}
            </Label>
            {barnMedRammevedtak.map((barnet, index) => (
              <BarnKort key={index} barnMedRammevedtak={barnet} nummer={index + 1} />
            ))}
          </VStack>
        )}
      </VStack>

      <Box as="section" background="neutral-soft" padding="space-16">
        <VStack gap="space-8">
          <Seksjonstittel ikon={<PersonIcon aria-hidden />}>Midlertidig aleneomsorg</Seksjonstittel>
          {midlertidigAleneomsorg ? (
            <BodyShort size="small">
              Brukeren har midlertidig aleneomsorg for alle barn.
              <br />
              Gyldig fra og med <strong>{formaterDatoEllerStrek(midlertidigAleneomsorg.gyldigFraOgMed)}</strong> til og
              med <strong>{formaterDatoEllerStrek(midlertidigAleneomsorg.gyldigTilOgMed)}</strong>.
            </BodyShort>
          ) : (
            <BodyShort size="small">Det er ikke registrert midlertidig aleneomsorg</BodyShort>
          )}
        </VStack>
      </Box>
    </VStack>
  );
};
