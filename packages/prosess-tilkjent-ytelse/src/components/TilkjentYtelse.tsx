import kodeverkTyper from '@k9-sak-web/kodeverk/src/kodeverkTyper';
import { VerticalSpacer } from '@k9-sak-web/shared-components';
import { TimeLineControl, Timeline } from '@k9-sak-web/tidslinje';
import { ArbeidsgiverOpplysningerPerId, BeregningsresultatPeriode, KodeverkMedNavn } from '@k9-sak-web/types';
import {
  DDMMYY_DATE_FORMAT,
  ISO_DATE_FORMAT,
  calcDaysAndWeeksWithWeekends,
  getKodeverknavnFn,
} from '@k9-sak-web/utils';
import moment from 'moment';
import React, { Component, RefObject } from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl';
import { createVisningsnavnForAndel } from './TilkjentYteleseUtils';
import TilkjentYtelseTimelineData from './TilkjentYtelseTimelineData';

import styles from './tilkjentYtelse.module.css';

export type PeriodeMedId = BeregningsresultatPeriode & { id: number };

const parseDateString = dateString => moment(dateString, ISO_DATE_FORMAT).toDate();

const getOptions = (nyePerioder: PeriodeMedId[]) => {
  const firstPeriod = nyePerioder[0];
  const lastPeriod = nyePerioder[nyePerioder.length - 1];

  return {
    end: moment(lastPeriod?.tom).add(2, 'days').toDate(),
    locale: moment.locale('nb'),
    margin: { item: 10 },
    moment,
    orientation: { axis: 'top' },
    showCurrentTime: false,
    stack: false,
    start: moment(firstPeriod?.fom).subtract(1, 'days').toDate(),
    tooltip: { followMouse: true },
    width: '100%',
    zoomMax: 1000 * 60 * 60 * 24 * 31 * 40,
    zoomMin: 1000 * 60 * 60 * 24 * 30,
  };
};

const createTooltipContent = (intl, item, getKodeverknavn, arbeidsgiverOpplysningerPerId) => {
  const { formatMessage } = intl;
  const periodeDato = `${moment(item.fom).format(DDMMYY_DATE_FORMAT)} - ${moment(item.tom).format(DDMMYY_DATE_FORMAT)}`;
  return `
  <p>
    ${periodeDato}
     ${formatMessage(
       { id: calcDaysAndWeeksWithWeekends(moment(item.fom), moment(item.tom)).id },
       {
         weeks: calcDaysAndWeeksWithWeekends(moment(item.fom), moment(item.tom)).weeks,
         days: calcDaysAndWeeksWithWeekends(moment(item.fom), moment(item.tom)).days,
       },
     )}
    <br />
    ${formatMessage(
      { id: 'Timeline.tooltip.dagsats' },
      {
        dagsats: item.dagsats,
      },
    )}
    <br />
    ${
      (item.andeler || []).length > 1
        ? item.andeler
            .map(andel =>
              formatMessage(
                { id: 'Timeline.tooltip.dagsatsPerAndel' },
                {
                  arbeidsgiver: createVisningsnavnForAndel(andel, getKodeverknavn, arbeidsgiverOpplysningerPerId),
                  dagsatsPerAndel: Number(andel.refusjon) + Number(andel.tilSoker),
                },
              ),
            )
            .join('<br />')
        : ''
    }
   </p>
`;
};

const sumUtBetalingsgrad = (andeler: any) => andeler.reduce((sum, andel) => sum + andel.utbetalingsgrad, 0);

const erTotalUtbetalingsgradOver100 = periode => {
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

const prepareTimelineData = (periode, index, intl, getKodeverknavn, arbeidsgiverOpplysningerPerId) => ({
  ...periode,
  className: erTotalUtbetalingsgradOver100(periode) ? 'innvilget' : 'gradert',
  group: 1,
  id: index,
  start: parseDateString(periode.fom),
  end: moment(parseDateString(periode.tom)).add(1, 'day'),
  title: createTooltipContent(intl, periode, getKodeverknavn, arbeidsgiverOpplysningerPerId),
});

interface OwnProps {
  items: PeriodeMedId[];
  groups: {
    id: number;
    content: string;
  }[];
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
}

interface OwnState {
  selectedItem?: PeriodeMedId;
}

/**
 * TilkjentYtelse
 *
 * Presentationskomponent. Masserer data og populerer felten samt formatterar tidslinjen for tilkjent ytelse
 */

export class TilkjentYtelse extends Component<OwnProps & WrappedComponentProps, OwnState> {
  timelineRef: RefObject<any>;

  constructor(props: OwnProps & WrappedComponentProps) {
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
      props: { groups, items, intl, alleKodeverk, arbeidsgiverOpplysningerPerId },
      selectHandler,
      state: { selectedItem },
      zoomIn,
      zoomOut,
    } = this;
    const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);

    const timelineData = items.map((periode, index) =>
      prepareTimelineData(periode, index, intl, getKodeverknavn, arbeidsgiverOpplysningerPerId),
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
            alleKodeverk={alleKodeverk}
            selectedItemStartDate={selectedItem.fom.toString()}
            selectedItemEndDate={selectedItem.tom.toString()}
            selectedItemData={selectedItem}
            callbackForward={nextPeriod}
            callbackBackward={prevPeriod}
            arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
          />
        )}
      </div>
    );
  }
}

export default injectIntl(TilkjentYtelse);
