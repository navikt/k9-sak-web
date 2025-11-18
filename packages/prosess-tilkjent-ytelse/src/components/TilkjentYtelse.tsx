import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { TimeLineControl, Timeline } from '@fpsak-frontend/tidslinje';
import { calcDaysAndWeeksWithWeekends } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { DDMMYY_DATE_FORMAT, ISO_DATE_FORMAT } from '@k9-sak-web/lib/dateUtils/formats.js';
import { initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';
import { KodeverkType } from '@k9-sak-web/lib/kodeverk/types.js';
import { ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/types';
import { k9_sak_kontrakt_beregningsresultat_BeregningsresultatPeriodeDto as BeregningsresultatPeriodeDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import moment from 'moment';
import React, { Component, RefObject } from 'react';
import { createArbeidsgiverVisningsnavnForAndel } from './TilkjentYteleseUtils';
import TilkjentYtelseTimelineData from './TilkjentYtelseTimelineData';
import styles from './tilkjentYtelse.module.css';

export type PeriodeMedId = BeregningsresultatPeriodeDto & { id: number };

const parseDateString = (dateString: string) => initializeDate(dateString, ISO_DATE_FORMAT).toDate();

const getOptions = (nyePerioder: PeriodeMedId[]) => {
  const lastPeriod = nyePerioder[nyePerioder.length - 1];
  const FIVE_YEARS_IN_MS = 1000 * 60 * 60 * 24 * 365 * 5;
  const ONE_MONTH_IN_MS = 1000 * 60 * 60 * 24 * 30;

  return {
    end: moment(lastPeriod?.tom).add(1, 'days').toDate(),
    locale: moment.locale('nb'),
    margin: { item: 10 },
    moment,
    orientation: { axis: 'top' },
    showCurrentTime: false,
    stack: false,
    start: moment(lastPeriod?.fom).subtract(1, 'year').toDate(),
    tooltip: { followMouse: true },
    width: '100%',
    zoomMax: FIVE_YEARS_IN_MS,
    zoomMin: ONE_MONTH_IN_MS,
  };
};

const createTooltipContent = (
  item: PeriodeMedId,
  getKodeverknavn: (kode: string, kodeverkType: KodeverkType) => string,
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId,
) => {
  const periodeDato = `${initializeDate(item.fom).format(DDMMYY_DATE_FORMAT)} - ${initializeDate(item.tom).format(DDMMYY_DATE_FORMAT)}`;
  const getArbeidsgiverAndeler = () => {
    let arbeidsgiverAndeler = '';
    (item.andeler || []).forEach((andel, index) => {
      arbeidsgiverAndeler += `${index > 0 ? ', ' : ''}${createArbeidsgiverVisningsnavnForAndel(andel, getKodeverknavn, arbeidsgiverOpplysningerPerId)}: ${Number(andel.refusjon) + Number(andel.tilSoker)} kr`;
    });
    return arbeidsgiverAndeler;
  };
  return `${periodeDato}
${calcDaysAndWeeksWithWeekends(initializeDate(item.fom), initializeDate(item.tom))}
${`Dagsats: ${item.dagsats}kr`}
${getArbeidsgiverAndeler()}`;
};

const sumUtBetalingsgrad = (andeler: PeriodeMedId['andeler']) =>
  andeler.reduce((sum, andel) => sum + andel.utbetalingsgrad, 0);

const erTotalUtbetalingsgradOver100 = (periode: PeriodeMedId) => {
  const values = [
    periode.totalUtbetalingsgradEtterReduksjonVedTilkommetInntekt,
    periode.totalUtbetalingsgradFraUttak,
  ].filter(value => value !== null);

  if (values.length > 0) {
    const totalUtbetalingsgrad = Math.min(...values) * 100;
    return totalUtbetalingsgrad >= 100;
  }

  // Resten av koden i denne funksjonen kan fjernes når alle saker har totalUtbetalingsgradFraUttak.
  // Denne koden er kun for å støtte saker som er laget før totalUtbetalingsgradFraUttak ble lagt til.
  if (periode.andeler) {
    const totalUtbetalingsgrad = sumUtBetalingsgrad(periode.andeler);
    return totalUtbetalingsgrad >= 100;
  }
  return false;
};

const prepareTimelineData = (
  periode: PeriodeMedId,
  index: number,
  getKodeverknavn,
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId,
) => ({
  ...periode,
  className: erTotalUtbetalingsgradOver100(periode) ? 'innvilget' : 'gradert',
  group: 1,
  id: index,
  start: parseDateString(periode.fom),
  end: moment(parseDateString(periode.tom)).add(1, 'day').toDate(),
  title: createTooltipContent(periode, getKodeverknavn, arbeidsgiverOpplysningerPerId),
  content: '',
});

interface OwnProps {
  items: PeriodeMedId[];
  groups: {
    id: number;
    content: string;
  }[];
  kodeverkNavnFraKode: (kode: string, kodeverkType: KodeverkType) => string;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  isUngdomsytelseFagsak: boolean;
}

interface OwnState {
  selectedItem?: PeriodeMedId;
}

/**
 * TilkjentYtelse
 *
 * Presentationskomponent. Masserer data og populerer felten samt formatterar tidslinjen for tilkjent ytelse
 */

export class TilkjentYtelse extends Component<OwnProps, OwnState> {
  timelineRef: RefObject<any>;

  constructor(props: OwnProps) {
    super(props);

    this.state = {
      selectedItem: null,
    };

    this.selectHandler = this.selectHandler.bind(this);
    this.goForward = this.goForward.bind(this);
    this.goBackward = this.goBackward.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
    this.nextPeriod = this.nextPeriod.bind(this);
    this.prevPeriod = this.prevPeriod.bind(this);
    this.openPeriodInfo = this.openPeriodInfo.bind(this);

    this.timelineRef = React.createRef();
  }

  openPeriodInfo() {
    const {
      props: { items },
      state: { selectedItem },
    } = this;
    if (selectedItem) {
      this.setState({
        selectedItem: null,
      });
    } else {
      this.setState({
        selectedItem: items[0],
      });
    }
  }

  nextPeriod() {
    const {
      props: { items },
      state: { selectedItem: currentSelectedItem },
    } = this;
    const newIndex = items.findIndex(item => item.id === currentSelectedItem.id) + 1;
    if (newIndex < items.length) {
      const selectedItem = items[newIndex];
      this.setState({
        selectedItem,
      });
    }
  }

  prevPeriod() {
    const {
      props: { items },
      state: { selectedItem: currentSelectedItem },
    } = this;
    const newIndex = items.findIndex(item => item.id === currentSelectedItem.id) - 1;
    if (newIndex >= 0) {
      const selectedItem = items[newIndex];
      this.setState({
        selectedItem,
      });
    }
  }

  selectHandler(eventProps: { items: number[] }) {
    const {
      props: { items },
    } = this;
    const selectedItem = items.find(item => item.id === eventProps.items[0]);
    this.setState({
      selectedItem,
    });
  }

  zoomIn() {
    this.timelineRef.current.zoomIn(0.5);
  }

  zoomOut() {
    this.timelineRef.current.zoomOut(0.5);
  }

  goForward() {
    const timeline = this.timelineRef.current;
    const currentWindowTimes = timeline.getWindow();
    const newWindowTimes = {
      start: new Date(currentWindowTimes.start).setDate(currentWindowTimes.start.getDate() + 42),
      end: new Date(currentWindowTimes.end).setDate(currentWindowTimes.end.getDate() + 42),
    };

    timeline.setWindow(newWindowTimes.start, newWindowTimes.end);
  }

  goBackward() {
    const timeline = this.timelineRef.current;
    const currentWindowTimes = timeline.getWindow();
    const newWindowTimes = {
      start: new Date(currentWindowTimes.start).setDate(currentWindowTimes.start.getDate() - 42),
      end: new Date(currentWindowTimes.end).setDate(currentWindowTimes.end.getDate() - 42),
    };

    timeline.setWindow(newWindowTimes.start, newWindowTimes.end);
  }

  render() {
    const {
      nextPeriod,
      prevPeriod,
      goBackward,
      goForward,
      openPeriodInfo,
      props: { groups, items, kodeverkNavnFraKode, arbeidsgiverOpplysningerPerId, isUngdomsytelseFagsak },
      selectHandler,
      state: { selectedItem },
      zoomIn,
      zoomOut,
    } = this;

    const timelineData = items.map((periode, index) =>
      prepareTimelineData(periode, index, kodeverkNavnFraKode, arbeidsgiverOpplysningerPerId),
    );
    return (
      <div className={styles.timelineContainer}>
        <VerticalSpacer sixteenPx />
        <VerticalSpacer sixteenPx />
        <div className={styles.timeLineWrapper}>
          <Timeline
            ref={this.timelineRef}
            options={getOptions(items)}
            initialItems={timelineData}
            initialGroups={groups}
            selectHandler={selectHandler}
            selection={[selectedItem ? selectedItem.id : null]}
          />
        </div>

        <TimeLineControl
          goBackwardCallback={goBackward}
          goForwardCallback={goForward}
          zoomInCallback={zoomIn}
          zoomOutCallback={zoomOut}
          openPeriodInfo={openPeriodInfo}
        />
        {selectedItem && (
          <TilkjentYtelseTimelineData
            selectedItemStartDate={selectedItem.fom.toString()}
            selectedItemEndDate={selectedItem.tom.toString()}
            selectedItemData={selectedItem}
            callbackForward={nextPeriod}
            callbackBackward={prevPeriod}
            arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
            isUngdomsytelseFagsak={isUngdomsytelseFagsak}
          />
        )}
      </div>
    );
  }
}

export default TilkjentYtelse;
