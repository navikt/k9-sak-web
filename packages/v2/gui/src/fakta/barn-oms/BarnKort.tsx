import { BarnType } from '@k9-sak-web/backend/k9sak/kontrakt/omsorgspenger/BarnDto.js';
import { formatereLukketPeriode } from '@k9-sak-web/gui/utils/formatters.js';
import { BodyShort, Box, Heading, HStack, Table, VStack } from '@navikt/ds-react';
import {
  beregnAlder,
  formaterDatoEllerStrek,
  type BarnMedRammevedtak,
  type Gyldighetsperiode,
  type RammevedtakForBarn,
} from './barnOgRammevedtak.js';

interface Rammevedtaksrad {
  etikett: string;
  periode: Gyldighetsperiode;
  skjulTom?: boolean;
}

const tilRader = (rammevedtak: RammevedtakForBarn): Rammevedtaksrad[] => {
  const { kroniskSykdom = [], aleneomsorg, fosterbarn, utenlandskBarn, deltBosted } = rammevedtak;
  return [
    ...kroniskSykdom.map(periode => ({ etikett: 'Utvidet rett', periode })),
    // Tidenes ende vises ikke for aleneomsorg, som i v1
    ...(aleneomsorg
      ? [{ etikett: 'Alene om omsorgen', periode: aleneomsorg, skjulTom: aleneomsorg.tom?.includes('9999') }]
      : []),
    ...(fosterbarn ? [{ etikett: 'Fosterbarn', periode: fosterbarn }] : []),
    ...(utenlandskBarn ? [{ etikett: 'Utenlandsk barn', periode: utenlandskBarn }] : []),
    ...(deltBosted ? [{ etikett: 'Delt bosted', periode: deltBosted }] : []),
  ];
};

const Bostedsperioder = ({ tittel, perioder }: { tittel: string; perioder: string[] | undefined }) =>
  perioder && perioder.length > 0 ? (
    <div>
      <BodyShort size="small">{tittel}</BodyShort>
      {perioder.map((periode, index) => (
        <BodyShort key={`${periode}-${index}`} size="small">
          {formatereLukketPeriode(periode)}
        </BodyShort>
      ))}
    </div>
  ) : null;

interface BarnKortProps {
  barnMedRammevedtak: BarnMedRammevedtak;
  nummer: number;
}

export const BarnKort = ({ barnMedRammevedtak: { barn, rammevedtak }, nummer }: BarnKortProps) => {
  const alder = beregnAlder(barn.fødselsdato);
  const identOgAlder = [barn.personIdent, alder !== undefined ? `(${alder} år)` : undefined].filter(Boolean).join(' ');

  return (
    <Box padding="space-16" borderWidth="1" borderRadius="4" maxWidth="550px">
      <VStack gap="space-16">
        <HStack gap="space-16" align="baseline">
          <Heading size="xsmall" level="4">
            Barn #{nummer}
          </Heading>
          {identOgAlder && (
            <BodyShort size="small">
              <i>{identOgAlder}</i>
            </BodyShort>
          )}
        </HStack>
        <Bostedsperioder
          tittel="Barnet har delt bosted med søker i følgende perioder:"
          perioder={barn.deltBostedPerioder}
        />
        <Bostedsperioder
          tittel="Barnet har samme bosted med søker i følgende perioder:"
          perioder={barn.sammeBostedPerioder}
        />
        {(barn.dødsdato || barn.barnType === BarnType.FOSTERBARN || barn.barnType === BarnType.UTENLANDSK_BARN) && (
          <div>
            {barn.dødsdato && (
              <BodyShort size="small">Barnet døde den {formaterDatoEllerStrek(barn.dødsdato)}</BodyShort>
            )}
            {barn.barnType === BarnType.FOSTERBARN && <BodyShort size="small">Barnet er fosterbarn</BodyShort>}
            {barn.barnType === BarnType.UTENLANDSK_BARN && <BodyShort size="small">Barnet bor i utlandet</BodyShort>}
          </div>
        )}
        {rammevedtak && (
          <Table size="small" aria-label={`Rammevedtak for barn #${nummer}`}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell scope="col" textSize="small">
                  Rammevedtak
                </Table.HeaderCell>
                <Table.HeaderCell scope="col" textSize="small">
                  Gyldig fra og med
                </Table.HeaderCell>
                <Table.HeaderCell scope="col" textSize="small">
                  Gyldig til og med
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {tilRader(rammevedtak).map(({ etikett, periode, skjulTom }, index) => (
                <Rad key={`${etikett}-${index}`} etikett={etikett} periode={periode} skjulTom={skjulTom} />
              ))}
            </Table.Body>
          </Table>
        )}
      </VStack>
    </Box>
  );
};

const Rad = ({ etikett, periode, skjulTom }: Rammevedtaksrad) => (
  <Table.Row>
    <Table.HeaderCell scope="row" textSize="small">
      {etikett}
    </Table.HeaderCell>
    <Table.DataCell textSize="small">{formaterDatoEllerStrek(periode.fom)}</Table.DataCell>
    <Table.DataCell textSize="small">{skjulTom ? '' : formaterDatoEllerStrek(periode.tom)}</Table.DataCell>
  </Table.Row>
);
