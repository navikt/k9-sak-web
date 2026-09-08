import type { RelatertYtelseData } from '@k9-sak-web/backend/k9sak/kontrakt/arbeidsforhold/RelatertYtelseResponse.js';
import type { FagsakYtelseType } from '@k9-sak-web/backend/k9sak/kontrakt/fagsak/FagsakYtelseType.js';
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
  Label,
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
import { useContext, useState } from 'react';
import { formatDate } from '../../utils/formatters.js';
import { useYtelserOptions } from './api/YtelserQueries.js';
import { kanÅpneRelatertSak } from './relatertSakUtils.js';
import {
  grupperYtelserPåSak,
  lagYtelsePerioder,
  sorterYtelsePerioder,
  sorterYtelseSaker,
  type YtelsePeriode,
} from './ytelseSakUtils.js';
import styles from './YtelserFaktaIndex.module.css';

type ZoomLevel = '2' | '4' | '8';

interface YtelserFaktaIndexProps {
  behandlingUuid: string;
  gjeldendeSaksnummer: string;
}

const monthsForZoom = (zoom: ZoomLevel) => Number(zoom);

const statusTilTimelineStatus = (status: RelatertYtelseData['status']) => {
  switch (status) {
    case 'AVSLUTTET':
    case 'LØPENDE':
      return 'success';
    case 'ÅPEN':
    case 'IKKESTARTET':
      return 'warning';
    default:
      return 'neutral';
  }
};

const statusTilPeriodeIkon = (status: RelatertYtelseData['status']) => {
  switch (status) {
    case 'AVSLUTTET':
    case 'LØPENDE':
      return <CheckmarkCircleFillIcon aria-hidden />;
    case 'ÅPEN':
    case 'IKKESTARTET':
      return <PersonPencilIcon aria-hidden />;
    default:
      return undefined;
  }
};

const lagDetaljinnhold = (
  rad: YtelsePeriode,
  formatYtelseType: (ytelseType: FagsakYtelseType) => string,
  formatStatus: (status: YtelsePeriode['status']) => string,
) => (
  <VStack gap="space-4" className={styles['detaljerPopover']}>
    <Label size="small" as="p">
      {formatYtelseType(rad.ytelseType)}
    </Label>
    <BodyShort size="small">{`Periode: ${formatDate(rad.fom)} – ${formatDate(rad.tom)}`}</BodyShort>
    <BodyShort size="small">{`Status: ${formatStatus(rad.status)}`}</BodyShort>
    {rad.relatertSaksnummer && (
      <BodyShort size="small">
        Saksnr.{' '}
        {kanÅpneRelatertSak(rad.ytelseType) ? (
          <Link href={`/k9/web${pathToFagsak(rad.relatertSaksnummer)}`} target="_blank" rel="noreferrer">
            {rad.relatertSaksnummer}
          </Link>
        ) : (
          rad.relatertSaksnummer
        )}
      </BodyShort>
    )}
  </VStack>
);

const YtelserFaktaIndex = ({ behandlingUuid, gjeldendeSaksnummer }: YtelserFaktaIndexProps) => {
  const { data } = useSuspenseQuery(useYtelserOptions(behandlingUuid));
  const kodeverkoppslag = useContext(K9KodeverkoppslagContext);

  const formatYtelseType = (ytelseType: FagsakYtelseType) =>
    kodeverkoppslag.k9sak.fagsakYtelseTyper(ytelseType, OrUndefined)?.navn ?? ytelseType;

  const formatStatus = (status: RelatertYtelseData['status']) =>
    kodeverkoppslag.k9sak.relatertYtelseTilstander(status, OrUndefined)?.navn ?? status;

  const perioder = lagYtelsePerioder(data);
  const saker = sorterYtelseSaker(grupperYtelserPåSak(perioder, gjeldendeSaksnummer), formatYtelseType);
  const tabellRader = sorterYtelsePerioder(perioder, gjeldendeSaksnummer);

  const latestTom =
    perioder.length > 0
      ? perioder.reduce(
          (max, periode) => (dayjs(periode.tom).isAfter(max) ? dayjs(periode.tom) : max),
          dayjs(perioder[0]!.tom),
        )
      : dayjs();

  const [zoom, setZoom] = useState<ZoomLevel>('8');
  const [windowEnd, setWindowEnd] = useState<Date>(() => latestTom.add(1, 'month').toDate());
  const [valgtPeriodeId, setValgtPeriodeId] = useState<string>();
  const monthsToShow = monthsForZoom(zoom);

  if (perioder.length === 0) {
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
                  aria-label="Forrige periode"
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
                  aria-label="Neste periode"
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
              {saker.map(sak => (
                <Timeline.Row
                  key={sak.id}
                  label={
                    sak.erGjeldendeSak ? (
                      <span className={styles['rowLabelBold']}>
                        {`${formatYtelseType(sak.ytelseType)} (denne saken)`}
                      </span>
                    ) : (
                      formatYtelseType(sak.ytelseType)
                    )
                  }
                >
                  {sak.perioder.map(periode => (
                    <Timeline.Period
                      key={periode.rowId}
                      id={periode.rowId}
                      start={dayjs(periode.fom).toDate()}
                      end={dayjs(periode.tom).add(1, 'day').toDate()}
                      status={statusTilTimelineStatus(periode.status)}
                      statusLabel={formatStatus(periode.status)}
                      icon={statusTilPeriodeIkon(periode.status)}
                      isActive={valgtPeriodeId === periode.rowId}
                      onSelectPeriod={() => setValgtPeriodeId(periode.rowId)}
                    >
                      {lagDetaljinnhold(periode, formatYtelseType, formatStatus)}
                    </Timeline.Period>
                  ))}
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
                {tabellRader.map(rad => (
                  <Table.Row key={rad.rowId}>
                    <Table.HeaderCell scope="row">{formatYtelseType(rad.ytelseType)}</Table.HeaderCell>
                    <Table.DataCell>{`${formatDate(rad.fom)} – ${formatDate(rad.tom)}`}</Table.DataCell>
                    <Table.DataCell>{formatStatus(rad.status)}</Table.DataCell>
                    <Table.DataCell>
                      {rad.relatertSaksnummer ? (
                        kanÅpneRelatertSak(rad.ytelseType) ? (
                          <Link
                            href={`/k9/web${pathToFagsak(rad.relatertSaksnummer)}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {rad.relatertSaksnummer}
                          </Link>
                        ) : (
                          rad.relatertSaksnummer
                        )
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
