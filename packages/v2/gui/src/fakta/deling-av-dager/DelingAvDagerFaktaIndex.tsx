import { formatDate } from '@k9-sak-web/gui/utils/formatters.js';
import { ArrowLeftIcon, ArrowRightIcon, ArrowRightLeftIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, HelpText, Heading, HStack, Table, VStack } from '@navikt/ds-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useRammevedtakOptions } from './api/DelingAvDagerQueries.js';
import { grupperOverføringer, type Overføringsgruppe, type Overføringstype, type Retning } from './overføringer.js';

const typeTekst: Record<Overføringstype, string> = {
  fordeling: 'Fordeling etter samværsavtale',
  overføring: 'Overføring',
  koronaoverføring: 'Koronaoverføring',
};

const retningTekst: Record<Retning, string> = {
  inn: 'Får',
  ut: 'Gir',
};

const motpartTekst: Record<Retning, string> = {
  inn: 'Fra',
  ut: 'Til',
};

const formaterPeriode = (fom?: string, tom?: string) => `${fom ? formatDate(fom) : ''} - ${tom ? formatDate(tom) : ''}`;

const Retningspil = ({ retning }: { retning: Retning }) =>
  retning === 'inn' ? <ArrowLeftIcon aria-hidden fontSize="2rem" /> : <ArrowRightIcon aria-hidden fontSize="2rem" />;

const Overføringsdetaljer = ({ gruppe }: { gruppe: Overføringsgruppe }) => (
  <Table size="small" style={{ width: 'fit-content', tableLayout: 'fixed' }}>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell scope="col" style={{ width: '9.5rem' }}>
          Antall dager
        </Table.HeaderCell>
        <Table.HeaderCell scope="col" style={{ width: '9.5rem' }}>
          {motpartTekst[gruppe.retning]}
        </Table.HeaderCell>
        <Table.HeaderCell scope="col" style={{ width: '11rem' }}>
          Gyldighetsperiode
        </Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {gruppe.overføringer.map((overføring, index) => (
        <Table.Row key={`${overføring.mottakerAvsenderFnr}-${overføring.fom}-${index}`}>
          <Table.DataCell>{overføring.antallDager}</Table.DataCell>
          <Table.DataCell>{overføring.mottakerAvsenderFnr}</Table.DataCell>
          <Table.DataCell>{formaterPeriode(overføring.fom, overføring.tom)}</Table.DataCell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
);

interface DelingAvDagerFaktaIndexProps {
  behandlingUuid: string;
}

const DelingAvDagerFaktaIndex = ({ behandlingUuid }: DelingAvDagerFaktaIndexProps) => {
  const { data: rammevedtak } = useSuspenseQuery(useRammevedtakOptions(behandlingUuid));
  const grupper = useMemo(() => grupperOverføringer(rammevedtak), [rammevedtak]);
  const harOverføringer = grupper.some(gruppe => gruppe.overføringer.length > 0);

  return (
    <Box background="neutral-soft" padding="space-16">
      <VStack gap="space-16">
        <HStack gap="space-8" align="center">
          <Heading size="small" level="4">
            <HStack gap="space-8" align="center">
              <ArrowRightLeftIcon aria-hidden fontSize="1.5rem" />
              Overføringer og fordelinger
            </HStack>
          </Heading>
          <HelpText title="Hvordan påvirker overførte og fordelte dager søkers dager?">
            Ved fordelte dager etter § 9-6 5. ledd eller overførte dager etter § 9-6 6. ledd, vil dagene ikke påvirke
            søkers opprinnelige dager dersom dagene ikke overstiger søkers egen grunnrett.
          </HelpText>
        </HStack>
        {harOverføringer ? (
          <Box style={{ overflowX: 'auto' }}>
            <Table style={{ width: 'max-content', maxWidth: '100%' }}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell style={{ width: '3rem' }} />
                  <Table.HeaderCell scope="col" style={{ width: '10rem' }}>
                    Totalt
                  </Table.HeaderCell>
                  <Table.HeaderCell scope="col" style={{ width: '3rem' }} />
                  <Table.HeaderCell scope="col" style={{ width: '14rem' }}>
                    Type
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {grupper.map(gruppe => (
                  <Table.ExpandableRow
                    key={`${gruppe.retning}-${gruppe.type}`}
                    content={<Overføringsdetaljer gruppe={gruppe} />}
                    expansionDisabled={gruppe.overføringer.length === 0}
                  >
                    <Table.DataCell>
                      {retningTekst[gruppe.retning]} {gruppe.totaltAntallDager} dager
                    </Table.DataCell>
                    <Table.DataCell>
                      <HStack justify="center">
                        <Retningspil retning={gruppe.retning} />
                      </HStack>
                    </Table.DataCell>
                    <Table.DataCell>{typeTekst[gruppe.type]}</Table.DataCell>
                  </Table.ExpandableRow>
                ))}
              </Table.Body>
            </Table>
          </Box>
        ) : (
          <BodyShort>Det er ikke registrert noen overføringer eller fordelinger av dager.</BodyShort>
        )}
      </VStack>
    </Box>
  );
};

export default DelingAvDagerFaktaIndex;
