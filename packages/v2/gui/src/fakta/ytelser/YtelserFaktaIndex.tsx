import type {
  RelatertYtelseData,
  RelatertYtelseResponse,
} from '@k9-sak-web/backend/k9sak/kontrakt/arbeidsforhold/RelatertYtelseResponse.js';
import { OrUndefined } from '@k9-sak-web/gui/kodeverk/oppslag/GeneriskKodeverkoppslag.js';
import { K9KodeverkoppslagContext } from '@k9-sak-web/gui/kodeverk/oppslag/K9KodeverkoppslagContext.js';
import { BodyShort, Heading, ReadMore, Table, Tag, Timeline, VStack } from '@navikt/ds-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useContext } from 'react';
import { formatDate } from '../../utils/formatters.js';
import { useYtelserOptions } from './api/YtelserQueries.js';

type FlatYtelseRad = RelatertYtelseData & {
  rowId: string;
  ytelseType: RelatertYtelseResponse['ytelseType'];
};

interface YtelserFaktaIndexProps {
  behandlingUuid: string;
}

const sortByFom = <T extends { fom: string }>(a: T, b: T) => a.fom.localeCompare(b.fom);

const formatSaksnummer = (saksnummer?: string) => saksnummer ?? '-';

const lagTooltipTekst = (
  rad: FlatYtelseRad,
  formatYtelseType: (ytelseType: FlatYtelseRad['ytelseType']) => string,
  formatStatus: (status: FlatYtelseRad['status']) => string,
) =>
  [
    formatYtelseType(rad.ytelseType),
    `${formatDate(rad.fom)} - ${formatDate(rad.tom)}`,
    `Status: ${formatStatus(rad.status)}`,
    rad.relatertSaksnummer ? `Saksnummer: ${rad.relatertSaksnummer}` : undefined,
  ]
    .filter(Boolean)
    .join('\n');

const YtelserFaktaIndex = ({ behandlingUuid }: YtelserFaktaIndexProps) => {
  const { data } = useSuspenseQuery(useYtelserOptions(behandlingUuid));
  const kodeverkoppslag = useContext(K9KodeverkoppslagContext);

  const formatYtelseType = (ytelseType: FlatYtelseRad['ytelseType']) =>
    kodeverkoppslag.k9sak.fagsakYtelseTyper(ytelseType, OrUndefined)?.navn ?? ytelseType;

  const formatStatus = (status: FlatYtelseRad['status']) =>
    kodeverkoppslag.k9sak.relatertYtelseTilstander(status, OrUndefined)?.navn ?? status;

  const grupperteYtelser = data
    .map(ytelse => ({
      ...ytelse,
      data: [...ytelse.data].sort(sortByFom),
    }))
    .sort((a, b) => formatYtelseType(a.ytelseType).localeCompare(formatYtelseType(b.ytelseType)));

  const rader = grupperteYtelser
    .flatMap(ytelse =>
      ytelse.data.map((periode, index) => ({
        ...periode,
        rowId: `${ytelse.ytelseType}-${periode.fom}-${periode.tom}-${index}`,
        ytelseType: ytelse.ytelseType,
      })),
    )
    .sort(sortByFom);

  if (rader.length === 0) {
    return (
      <VStack gap="space-16">
        <Heading spacing size="small" level="4">
          Ytelser
        </Heading>
        <BodyShort size="small">Søker har ingen relaterte ytelser å vise.</BodyShort>
      </VStack>
    );
  }

  const førsteDato = rader[0]!.fom;
  const sisteDato = rader.reduce((senesteTom, rad) => (rad.tom > senesteTom ? rad.tom : senesteTom), rader[0]!.tom);

  return (
    <VStack gap="space-16">
      <Heading spacing size="small" level="4">
        Ytelser
      </Heading>

      <Timeline startDate={dayjs(førsteDato).toDate()} endDate={dayjs(sisteDato).add(1, 'day').toDate()}>
        {grupperteYtelser.map(ytelse => (
          <Timeline.Row key={ytelse.ytelseType} label={formatYtelseType(ytelse.ytelseType)}>
            {ytelse.data.map((periode, index) => {
              const rad: FlatYtelseRad = {
                ...periode,
                rowId: `${ytelse.ytelseType}-${periode.fom}-${periode.tom}-${index}`,
                ytelseType: ytelse.ytelseType,
              };

              return (
                <Timeline.Period
                  key={rad.rowId}
                  id={rad.rowId}
                  start={dayjs(rad.fom).toDate()}
                  end={dayjs(rad.tom).add(1, 'day').toDate()}
                  title={lagTooltipTekst(rad, formatYtelseType, formatStatus)}
                />
              );
            })}
          </Timeline.Row>
        ))}
      </Timeline>

      <ReadMore header="Vis detaljer" size="small">
        <Table size="small">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell scope="col">Ytelse</Table.HeaderCell>
              <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
              <Table.HeaderCell scope="col">Status</Table.HeaderCell>
              <Table.HeaderCell scope="col">Relatert saksnummer</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rader.map(rad => (
              <Table.Row key={rad.rowId}>
                <Table.DataCell>{formatYtelseType(rad.ytelseType)}</Table.DataCell>
                <Table.DataCell>{`${formatDate(rad.fom)} - ${formatDate(rad.tom)}`}</Table.DataCell>
                <Table.DataCell>
                  <Tag size="small" variant="neutral">
                    {formatStatus(rad.status)}
                  </Tag>
                </Table.DataCell>
                <Table.DataCell>{formatSaksnummer(rad.relatertSaksnummer)}</Table.DataCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </ReadMore>
    </VStack>
  );
};

export default YtelserFaktaIndex;
