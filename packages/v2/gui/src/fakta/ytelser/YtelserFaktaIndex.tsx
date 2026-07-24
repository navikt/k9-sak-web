import type {
  RelatertYtelseData,
  RelatertYtelseResponse,
} from '@k9-sak-web/backend/k9sak/kontrakt/arbeidsforhold/RelatertYtelseResponse.js';
import { OrUndefined } from '@k9-sak-web/gui/kodeverk/oppslag/GeneriskKodeverkoppslag.js';
import { K9KodeverkoppslagContext } from '@k9-sak-web/gui/kodeverk/oppslag/K9KodeverkoppslagContext.js';
import { pathToFagsak } from '@k9-sak-web/gui/utils/paths.js';
import {
  CheckmarkCircleFillIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Density2Icon,
  PersonPencilIcon,
  TableIcon,
} from '@navikt/aksel-icons';
import {
  Alert,
  BodyShort,
  Button,
  Heading,
  HStack,
  Link,
  Table,
  Tabs,
  Timeline,
  ToggleGroup,
  Tooltip,
  VStack,
} from '@navikt/ds-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { type ReactNode, useContext, useState } from 'react';
import { formatDate } from '../../utils/formatters.js';
import { useYtelserOptions } from './api/YtelserQueries.js';
import styles from './YtelserFaktaIndex.module.css';

type FlatYtelseRad = RelatertYtelseData & {
  rowId: string;
  ytelseType: RelatertYtelseResponse['ytelseType'];
};

type ZoomLevel = '2' | '4' | '8';

interface YtelserFaktaIndexProps {
  behandlingUuid: string;
}

const sortByFom = <T extends { fom: string }>(a: T, b: T) => a.fom.localeCompare(b.fom);

const monthsForZoom = (zoom: ZoomLevel) => Number(zoom);

const statusTilTimelineStatus = (status: RelatertYtelseData['status']): 'success' | 'warning' | 'neutral' => {
  switch (status) {
    case 'AVSLUTTET':
      return 'success';
    case 'LØPENDE':
    case 'ÅPEN':
      return 'warning';
    default:
      return 'neutral';
  }
};

const statusTilPeriodeIkon = (status: RelatertYtelseData['status']): ReactNode => {
  switch (status) {
    case 'AVSLUTTET':
      return <CheckmarkCircleFillIcon aria-hidden />;
    case 'LØPENDE':
    case 'ÅPEN':
      return <PersonPencilIcon aria-hidden />;
    default:
      return undefined;
  }
};

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
    .sort((a, b) => {
      if (a.ytelseType === 'PSB') return -1;
      if (b.ytelseType === 'PSB') return 1;
      return formatYtelseType(a.ytelseType).localeCompare(formatYtelseType(b.ytelseType));
    });

  const rader = grupperteYtelser
    .flatMap(ytelse =>
      ytelse.data.map((periode, index) => ({
        ...periode,
        rowId: `${ytelse.ytelseType}-${periode.fom}-${periode.tom}-${index}`,
        ytelseType: ytelse.ytelseType,
      })),
    )
    .sort(sortByFom);

  const latestTom =
    rader.length > 0
      ? rader.reduce((max, r) => (r.tom > max ? r.tom : max), rader[0]!.tom)
      : dayjs().format('YYYY-MM-DD');

  const [zoom, setZoom] = useState<ZoomLevel>('8');
  const [windowEnd, setWindowEnd] = useState<Date>(() => dayjs(latestTom).add(1, 'month').toDate());
  const monthsToShow = monthsForZoom(zoom);

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

  return (
    <VStack gap="space-16">
      <Heading spacing size="small" level="4">
        Ytelser
      </Heading>

      <Tabs defaultValue="tidslinje">
        <Tabs.List className={styles['tabsList']} aria-label="Visning av ytelser">
          <Tabs.Tab value="tidslinje" label="Tidslinje" icon={<Density2Icon aria-hidden />} />
          <Tabs.Tab value="tabell" label="Tabell" icon={<TableIcon aria-hidden />} />
        </Tabs.List>
        <Tabs.Panel value="tidslinje" className={styles['tabPanel']}>
          <HStack justify="end" className={styles['controlsRow']}>
            <HStack className={styles['controlsButtonGroup']}>
              <Tooltip content="Forrige periode">
                <Button
                  type="button"
                  variant="secondary"
                  data-color="neutral"
                  size="xsmall"
                  className={styles['controlsIconButton']}
                  icon={<ChevronLeftIcon aria-hidden />}
                  onClick={() => setWindowEnd(prev => dayjs(prev).subtract(monthsToShow, 'month').toDate())}
                />
              </Tooltip>
              <Tooltip content="Neste periode">
                <Button
                  type="button"
                  variant="secondary"
                  data-color="neutral"
                  size="xsmall"
                  className={styles['controlsIconButton']}
                  icon={<ChevronRightIcon aria-hidden />}
                  onClick={() => setWindowEnd(prev => dayjs(prev).add(monthsToShow, 'month').toDate())}
                />
              </Tooltip>
            </HStack>
            <ToggleGroup
              value={zoom}
              onChange={v => setZoom(v as ZoomLevel)}
              size="small"
              data-color="neutral"
              aria-label="Velg antall måneder som skal vises"
            >
              <ToggleGroup.Item value="2">2 mnd</ToggleGroup.Item>
              <ToggleGroup.Item value="4">4 mnd</ToggleGroup.Item>
              <ToggleGroup.Item value="8">8 mnd</ToggleGroup.Item>
            </ToggleGroup>
          </HStack>
          <div className={styles['timelinePanelContent']}>
            <Timeline
              startDate={dayjs(windowEnd).subtract(monthsToShow, 'month').toDate()}
              endDate={windowEnd}
              className={styles['tidslinje']}
            >
              <Timeline.Pin date={new Date()} />
              {grupperteYtelser.map(ytelse => (
                <Timeline.Row
                  key={ytelse.ytelseType}
                  label={
                    ytelse.ytelseType === 'PSB' ? (
                      <span className={styles['rowLabelBold']}>{formatYtelseType(ytelse.ytelseType)}</span>
                    ) : (
                      formatYtelseType(ytelse.ytelseType)
                    )
                  }
                >
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
                        status={statusTilTimelineStatus(rad.status)}
                        title={lagTooltipTekst(rad, formatYtelseType, formatStatus)}
                        icon={statusTilPeriodeIkon(rad.status)}
                      />
                    );
                  })}
                </Timeline.Row>
              ))}
            </Timeline>
          </div>
          <Alert variant="info" size="small" className={styles['infoAlert']}>
            Her vises kun ytelser som er relevante for opptjeningsperioden og søknadsperioden.
          </Alert>
        </Tabs.Panel>
        <Tabs.Panel value="tabell" className={styles['tabellPanel']}>
          <div className={styles['tableWrapper']}>
            <Table size="small" className={styles['tabell']}>
              <colgroup>
                <col className={styles['kolonneYtelse']} />
                <col className={styles['kolonnePeriode']} />
                <col className={styles['kolonneStatus']} />
                <col className={styles['kolonneSaksnr']} />
              </colgroup>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell scope="col">Ytelse</Table.HeaderCell>
                  <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
                  <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                  <Table.HeaderCell scope="col">Saksnr.</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {rader.map(rad => (
                  <Table.Row key={rad.rowId}>
                    <Table.HeaderCell scope="row">{formatYtelseType(rad.ytelseType)}</Table.HeaderCell>
                    <Table.DataCell>{`${formatDate(rad.fom)} – ${formatDate(rad.tom)}`}</Table.DataCell>
                    <Table.DataCell>{formatStatus(rad.status)}</Table.DataCell>
                    <Table.DataCell>
                      {rad.relatertSaksnummer ? (
                        <Link href={`/k9/web${pathToFagsak(rad.relatertSaksnummer)}`}>{rad.relatertSaksnummer}</Link>
                      ) : (
                        '-'
                      )}
                    </Table.DataCell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </Tabs.Panel>
      </Tabs>
    </VStack>
  );
};

export default YtelserFaktaIndex;
