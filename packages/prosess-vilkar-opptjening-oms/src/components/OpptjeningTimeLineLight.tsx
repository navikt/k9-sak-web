import opptjeningAktivitetKlassifisering from '@fpsak-frontend/prosess-vilkar-opptjening-oms/src/kodeverk/opptjeningAktivitetKlassifisering';
import { TimeLineNavigation } from '@fpsak-frontend/tidslinje';
import { DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import { FastsattOpptjeningAktivitet } from '@k9-sak-web/types';
import moment from 'moment';
import { Column, Row } from 'nav-frontend-grid';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import Timeline from 'react-visjs-timeline';
import DateContainer from './DateContainer';
import styles from './opptjeningTimeLineLight.less';
import TimeLineData from './TimeLineData';

// Desse må alltid vare med for rett skala av tidslinjen
const standardItems = (opptjeningFomDate: string, opptjeningTomDate: string) => {
  const items = [
    {
      id: 1000,
      start: moment(opptjeningFomDate).startOf('month'),
      end: moment(opptjeningFomDate).startOf('month'),
      content: '',
      group: 1,
      className: styles.hiddenpast,
    },
    {
      id: 1001,
      start: moment(opptjeningTomDate).endOf('month'),
      end: moment(opptjeningTomDate).endOf('month'),
      content: '',
      group: 1,
      className: styles.hiddenpast,
    },
  ];
  return items;
};

const classNameGenerator = (klasseKode: string) => {
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
) => {
  const items = opptjeningPeriods.map(ap => ({
    id: ap.id,
    start: moment(ap.fom),
    end: moment(ap.tom),
    className: classNameGenerator(ap.klasse.kode),
    content: '',
    data: ap,
  }));
  return items.concat(standardItems(opptjeningFomDate, opptjeningTomDate));
};

const options = (opptjeningFomDate, opptjeningTomDate) => ({
  end: moment(opptjeningTomDate).endOf('month'),
  locale: moment.locale('nb'),
  margin: { item: 10 },
  max: moment(opptjeningTomDate).endOf('month'),
  min: moment(opptjeningFomDate).startOf('month'),
  moment,
  moveable: false,
  orientation: { axis: 'top' },
  showCurrentTime: true,
  stack: false,
  start: moment(opptjeningFomDate).startOf('month'),
  verticalScroll: false,
  width: '100%',
  zoomable: false,
});

interface OpptjeningTimeLineLightProps {
  opptjeningPeriods: FastsattOpptjeningAktivitet[];
  opptjeningFomDate: string;
  opptjeningTomDate: string;
}

export interface TimelineItem {
  id: string;
  start: moment.Moment;
  end: moment.Moment;
  className: string;
  content: string;
  data: FastsattOpptjeningAktivitet;
}

interface OpptjeningTimeLineLightState {
  items?: TimelineItem[];
  selectedPeriod?: TimelineItem;
}

const OpptjeningTimeLineLight = ({
  opptjeningPeriods,
  opptjeningFomDate,
  opptjeningTomDate,
}: OpptjeningTimeLineLightProps) => {
  const unsortedItems = opptjeningPeriods.sort((a, b) => new Date(a.fom) - new Date(b.fom));
  const items = createItems(unsortedItems, opptjeningFomDate, opptjeningTomDate);
  const [selectedPeriod, setSelectedPeriod] = useState<TimelineItem | undefined>(undefined);
  const timelineRef = useRef();

  useEffect(() => {
    // TODO Fjern når denne er retta: https://github.com/Lighthouse-io/react-visjs-timeline/issues/40
    // eslint-disable-next-line react/no-find-dom-node
    const node = ReactDOM.findDOMNode(timelineRef.current);
    if (node) {
      node.children[0].style.visibility = 'visible';
    }
  }, []);

  const selectHandler = eventProps => {
    const selectedItem = items.find(item => item.id === eventProps.items[0]);
    if (selectedItem) {
      setSelectedPeriod(selectedItem);
    }
  };

  const openPeriodInfo = event => {
    event.preventDefault();
    const currentSelectedItem = selectedPeriod;
    if (currentSelectedItem) {
      setSelectedPeriod(null);
    } else {
      const selectedItem = items[0];

      setSelectedPeriod(selectedItem);
    }
  };

  const selectNextPeriod = (event: React.FormEvent) => {
    event.preventDefault();
    const newIndex = items.findIndex(oa => oa.id === selectedPeriod.id) + 1;
    if (newIndex < items.length - 2) {
      setSelectedPeriod(items[newIndex]);
    }
  };

  const selectPrevPeriod = (event: React.FormEvent) => {
    event.preventDefault();
    const newIndex = items.findIndex(oa => oa.id === selectedPeriod.id) - 1;
    if (newIndex >= 0) {
      setSelectedPeriod(items[newIndex]);
    }
  };

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
                    ref={timelineRef}
                    options={options(opptjeningFomDate, opptjeningTomDate)}
                    items={items}
                    customTimes={{ currentDate: new Date(opptjeningTomDate) }}
                    selectHandler={selectHandler}
                    selection={[selectedPeriod ? selectedPeriod.id : undefined]}
                  />
                </div>
                <TimeLineNavigation openPeriodInfo={openPeriodInfo} />
                {selectedPeriod && (
                  <TimeLineData
                    selectedPeriod={selectedPeriod}
                    selectNextPeriod={selectNextPeriod}
                    selectPrevPeriod={selectPrevPeriod}
                  />
                )}
              </div>
            </div>
          </Column>
        </Row>
      </div>
    </div>
  );
};

export default OpptjeningTimeLineLight;
