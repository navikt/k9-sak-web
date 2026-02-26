import mottakerTyper from '@fpsak-frontend/kodeverk/src/mottakerTyper';
import { getRangeOfMonths } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';
import { BodyShort, Button, Table } from '@navikt/ds-react';
import classnames from 'classnames/bind';
import styles from './avregningTable.module.css';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import type { DetaljertSimuleringResultatDto } from '@k9-sak-web/backend/k9oppdrag/kontrakt/simulering/v1/DetaljertSimuleringResultatDto.js';
import type { SimuleringForMottakerDto } from '@k9-sak-web/backend/k9oppdrag/kontrakt/simulering/v1/SimuleringForMottakerDto.js';
import type { SimuleringResultatPerFagområdeDto } from '@k9-sak-web/backend/k9oppdrag/kontrakt/simulering/v1/SimuleringResultatPerFagområdeDto.js';
import { type RangeOfMonths } from './avregningHelpers';
import FagområdeRad from './FagområdeRad';
import ResultatRader from './ResultatRader';

const classNames = classnames.bind(styles);

// fjern
const MONTH_LABELS: Record<string, string> = {
  januar: 'Jan',
  februar: 'Feb',
  mars: 'Mar',
  april: 'Apr',
  mai: 'Mai',
  juni: 'Jun',
  juli: 'Jul',
  august: 'Aug',
  september: 'Sep',
  oktober: 'Okt',
  november: 'Nov',
  desember: 'Des',
};

const isNextPeriod = (month: RangeOfMonths, nextPeriod: string) =>
  `${month.month}${month.year}` === (nextPeriod ? initializeDate(nextPeriod).format('MMMMYY') : false);

const getHeaderCodes = (
  showCollapseButton: boolean,
  collapseProps: { toggleDetails: AvregningTableProps['toggleDetails']; showDetails: boolean; mottakerIndex: number },
  rangeOfMonths: RangeOfMonths[],
  nextPeriod: string,
) => {
  const firstElement = showCollapseButton ? (
    <Button
      size="small"
      type="button"
      className="-ml-3 -mt-1"
      onClick={() => collapseProps.toggleDetails(collapseProps.mottakerIndex)}
      icon={collapseProps.showDetails ? <ChevronUpIcon title="Ekspandert" /> : <ChevronDownIcon title="Lukket" />}
      iconPosition="right"
      variant="tertiary"
    >
      {collapseProps.showDetails ? 'Vis færre detaljer' : 'Vis flere detaljer'}
    </Button>
  ) : (
    <div />
  );
  return [
    firstElement,
    ...rangeOfMonths.map(month => (
      <span
        className={classNames({
          nextPeriod: isNextPeriod(month, nextPeriod),
          normalPeriod: !isNextPeriod(month, nextPeriod),
        })}
        key={`${month.month}-${month.year}`}
      >
        {MONTH_LABELS[month.month] ?? month.month} {month.year}
      </span>
    )),
  ];
};

const showCollapseButton = (mottakerResultatPerFag: SimuleringResultatPerFagområdeDto[]) =>
  mottakerResultatPerFag.some(fag => fag.rader.length > 1);

const tableTitle = (mottaker: SimuleringForMottakerDto) =>
  mottaker.mottakerType === mottakerTyper.ARBG ? (
    <BodyShort
      size="small"
      className={styles['tableTitle']}
    >{`${mottaker.mottakerNavn} (${mottaker.mottakerNummer})`}</BodyShort>
  ) : null;

const avvikBruker = (ingenPerioderMedAvvik: boolean, mottakerTypeKode: string) =>
  !!(ingenPerioderMedAvvik && mottakerTypeKode === mottakerTyper.BRUKER);
const getPeriodeFom = (periodeFom: string, nesteUtbPeriodeFom: string) => periodeFom || nesteUtbPeriodeFom;

const getPeriod = (ingenPerioderMedAvvik: boolean, periodeFom: string, mottaker: SimuleringForMottakerDto) =>
  getRangeOfMonths(
    avvikBruker(ingenPerioderMedAvvik, mottaker.mottakerType)
      ? initializeDate(mottaker.nesteUtbPeriode?.tom ?? '')
          .subtract(1, 'months')
          .format('YYYY-MM')
      : getPeriodeFom(periodeFom, mottaker.nesteUtbPeriode?.fom ?? ''),
    mottaker.nesteUtbPeriode?.tom ?? '',
  );

interface AvregningTableProps {
  toggleDetails: (id: number) => void;
  showDetails: { id: number; show: boolean }[];
  simuleringResultat: DetaljertSimuleringResultatDto;
}

const AvregningTable = ({ simuleringResultat, toggleDetails, showDetails }: AvregningTableProps) => {
  return (
    <>
      {simuleringResultat.perioderPerMottaker?.map((mottaker: SimuleringForMottakerDto, mottakerIndex) => {
        const rangeOfMonths = getPeriod(
          simuleringResultat.ingenPerioderMedAvvik ?? false,
          simuleringResultat.periode?.fom ?? '', // Provide a fallback empty string
          mottaker,
        );
        const nesteMåned: string = mottaker.nesteUtbPeriode?.tom ?? '';
        const visDetaljer = showDetails.find(d => d.id === mottakerIndex);
        return (
          <div className={styles['tableWrapper']} key={`tableIndex${mottakerIndex + 1}`}>
            {tableTitle(mottaker)}
            <Table key={`tableIndex${mottakerIndex + 1}`} className={styles['simuleringTable']}>
              <Table.Header>
                <Table.Row>
                  {getHeaderCodes(
                    showCollapseButton(mottaker.resultatPerFagområde ?? []),
                    { toggleDetails, showDetails: visDetaljer ? visDetaljer.show : false, mottakerIndex },
                    rangeOfMonths,
                    nesteMåned,
                  ).map((heading, headerIndex) => (
                    <Table.HeaderCell key={`header-${headerIndex}`} scope="col" textSize="small">
                      {heading}
                    </Table.HeaderCell>
                  ))}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {mottaker.resultatPerFagområde?.map((fagOmråde, fagIndex) => (
                  <FagområdeRad
                    key={fagOmråde.fagOmrådeKode}
                    fagOmråde={fagOmråde}
                    fagIndex={fagIndex}
                    visDetaljer={visDetaljer ? visDetaljer : { id: 0, show: false }}
                    simuleringResultat={simuleringResultat}
                    rangeOfMonths={rangeOfMonths}
                    nesteMåned={nesteMåned}
                  />
                ))}
                <ResultatRader
                  ingenPerioderMedAvvik={simuleringResultat.ingenPerioderMedAvvik ?? false}
                  resultatPerFagområde={mottaker.resultatPerFagområde ?? []}
                  resultatOgMotregningRader={mottaker.resultatOgMotregningRader ?? []}
                  rangeOfMonths={rangeOfMonths}
                  nesteMåned={nesteMåned}
                />
              </Table.Body>
            </Table>
          </div>
        );
      })}
    </>
  );
};

export default AvregningTable;
