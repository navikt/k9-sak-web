import React, { Component, RefObject } from 'react';
import moment from 'moment';
import { Column, Row } from 'nav-frontend-grid';
import { DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import { Timeline, TimeLineNavigation } from '@fpsak-frontend/tidslinje';
import opptjeningAktivitetKlassifisering from '@fpsak-frontend/prosess-vilkar-opptjening/src/kodeverk/opptjeningAktivitetKlassifisering';
import { FastsattOpptjeningAktivitet } from '@k9-sak-web/types';

import DateContainer from './DateContainer';
import TimeLineData from './TimeLineData';

import styles from './opptjeningTimeLineLight.less';

type Item = {
  id: number;
  start: Date;
  end: Date;
  className: string;
  content: string;
  data?: FastsattOpptjeningAktivitet;
  group?: number;
};

// Desse må alltid vare med for rett skala av tidslinjen
const standardItems = (opptjeningFomDate: string, opptjeningTomDate: string): Item[] => {
  const items = [
    {
      id: 1000,
      start: moment(opptjeningFomDate).startOf('month').toDate(),
      end: moment(opptjeningFomDate).startOf('month').toDate(),
      content: '',
      group: 1,
      className: styles.hiddenpast,
    },
    {
      id: 1001,
      start: moment(opptjeningTomDate).endOf('month').toDate(),
      end: moment(opptjeningTomDate).endOf('month').toDate(),
      content: '',
      group: 1,
      className: styles.hiddenpast,
    },
  ];
  return items;
};

const classNameGenerator = (klasseKode: string): string => {
  if (
    klasseKode === opptjeningAktivitetKlassifisering.BEKREFTET_AVVIST ||
    klasseKode === opptjeningAktivitetKlassifisering.ANTATT_AVVIST
  ) {
    return 'avvistPeriode';
  }
  if (
    klasseKode === opptjeningAktivitetKlassifisering.BEKREFTET_GODKJENT ||
    klasseKode === opptjeningAktivitetKlassifisering.ANTATT_GODKJENT
  ) {
    return 'godkjentPeriode';
  }
  return 'mellomliggendePeriode';
};

const createItems = (
  opptjeningPeriods: FastsattOpptjeningAktivitet[],
  opptjeningFomDate: string,
  opptjeningTomDate: string,
): Item[] => {
  const items = opptjeningPeriods.map(
    (ap, index): Item => ({
      id: parseInt(`${ap.fom}${ap.tom}${index}`.replace(/-|\/|\./g, ''), 10),
      start: moment(ap.fom).toDate(),
      end: moment(ap.tom).toDate(),
      className: classNameGenerator(ap.klasse.kode),
      content: '',
      data: ap,
    }),
  );
  return items.concat(standardItems(opptjeningFomDate, opptjeningTomDate));
};

const options = (opptjeningFomDate: string, opptjeningTomDate: string): any => ({
  end: moment(opptjeningTomDate).endOf('month').toDate(),
  locale: moment.locale('nb'),
  margin: { item: 10 },
  max: moment(opptjeningTomDate).endOf('month').toDate(),
  min: moment(opptjeningFomDate).startOf('month').toDate(),
  moment,
  moveable: false,
  orientation: { axis: 'top' },
  showCurrentTime: true,
  stack: false,
  start: moment(opptjeningFomDate).startOf('month').toDate(),
  verticalScroll: false,
  width: '100%',
  zoomable: false,
});

interface OwnProps {
  opptjeningPeriods: FastsattOpptjeningAktivitet[];
  opptjeningFomDate: string;
  opptjeningTomDate: string;
}

interface OwnState {
  items?: Item[];
  selectedPeriod?: Item;
}

class OpptjeningTimeLineLight extends Component<OwnProps, OwnState> {
  timelineRef: RefObject<any>;

  constructor(props: OwnProps) {
    super(props);

    this.state = {
      items: undefined,
      selectedPeriod: undefined,
    };

    this.selectHandler = this.selectHandler.bind(this);
    this.openPeriodInfo = this.openPeriodInfo.bind(this);
    this.selectNextPeriod = this.selectNextPeriod.bind(this);
    this.selectPrevPeriod = this.selectPrevPeriod.bind(this);

    this.timelineRef = React.createRef();
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount(): void {
    const { opptjeningPeriods, opptjeningFomDate, opptjeningTomDate } = this.props;
    const unsortedItems = opptjeningPeriods.sort((a, b) => moment(a.fom).diff(moment(b.fom)));
    const items = createItems(unsortedItems, opptjeningFomDate, opptjeningTomDate);
    this.setState({ items });
  }

  selectHandler(eventProps: { items: number[] }): void {
    const { items } = this.state;
    const selectedItem = items.find(item => item.id === eventProps.items[0]);
    if (selectedItem) {
      this.setState({
        selectedPeriod: selectedItem,
      });
    }
  }

  openPeriodInfo(event: React.MouseEvent): void {
    const { selectedPeriod, items } = this.state;
    event.preventDefault();
    const currentSelectedItem = selectedPeriod;
    if (currentSelectedItem) {
      this.setState({
        selectedPeriod: null,
      });
    } else {
      const selectedItem = items[0];
      this.setState({
        selectedPeriod: selectedItem,
      });
    }
  }

  selectNextPeriod(event: React.MouseEvent): void {
    const { selectedPeriod, items } = this.state;
    event.preventDefault();
    const newIndex = items.findIndex(oa => oa.id === selectedPeriod.id) + 1;
    if (newIndex < items.length - 2) {
      this.setState({
        selectedPeriod: items[newIndex],
      });
    }
  }

  selectPrevPeriod(event: React.MouseEvent): void {
    const { selectedPeriod, items } = this.state;
    event.preventDefault();
    const newIndex = items.findIndex(oa => oa.id === selectedPeriod.id) - 1;
    if (newIndex >= 0) {
      this.setState({
        selectedPeriod: items[newIndex],
      });
    }
  }

  render() {
    const { opptjeningFomDate, opptjeningTomDate } = this.props;
    const { selectedPeriod, items } = this.state;
    return (
      <div className="opptjening">
        <div className="timeLineLight">
          <Row>
            <Column xs="12">
              <DateContainer
                opptjeningFomDate={moment(opptjeningFomDate, ISO_DATE_FORMAT).format(DDMMYYYY_DATE_FORMAT)}
                opptjeningTomDate={moment(opptjeningTomDate, ISO_DATE_FORMAT).format(DDMMYYYY_DATE_FORMAT)}
              />
              <div className={styles.timelineContainer}>
                <div className={styles.timeLineWrapper}>
                  <div className={styles.timeLine}>
                    <Timeline
                      ref={this.timelineRef}
                      options={options(opptjeningFomDate, opptjeningTomDate)}
                      initialItems={items}
                      customTimes={{ currentDate: new Date(opptjeningTomDate) }}
                      selectHandler={this.selectHandler}
                      selection={[selectedPeriod ? selectedPeriod.id : undefined]}
                    />
                  </div>
                  <TimeLineNavigation openPeriodInfo={this.openPeriodInfo} />
                  {selectedPeriod && (
                    <TimeLineData
                      fastsattOpptjeningAktivitet={selectedPeriod.data}
                      selectNextPeriod={this.selectNextPeriod}
                      selectPrevPeriod={this.selectPrevPeriod}
                    />
                  )}
                </div>
              </div>
            </Column>
          </Row>
        </div>
      </div>
    );
  }
}

export default OpptjeningTimeLineLight;
