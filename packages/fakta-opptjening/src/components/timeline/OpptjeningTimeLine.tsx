import { DDMMYYYY_DATE_FORMAT, isEqual } from '@fpsak-frontend/utils';
import OpptjeningAktivitet from '@k9-sak-web/types/src/opptjening/opptjeningAktivitet';
import OpptjeningAktivitetType from '@k9-sak-web/types/src/opptjening/opptjeningAktivitetType';
import moment from 'moment';
import { Column, Row } from 'nav-frontend-grid';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Timeline from 'react-visjs-timeline';
import DateContainer from './DateContainer';
import styles from './opptjeningTimeLine.less';

// Desse må alltid vare med for rett skala av tidslinjen då den alltid skall vare 10 månader fra skjæringstidpunkten
const standardItems = (opptjeningFomDato: string, opptjeningTomDato: string): any[] => {
  const items = [
    {
      id: 1000,
      start: moment(opptjeningFomDato).subtract(1, 'months').startOf('month'),
      end: moment(opptjeningFomDato).subtract(1, 'months').startOf('month'),
      content: '',
      group: 1,
      className: styles.hiddenpast,
    },
    {
      id: 1001,
      start: moment(opptjeningTomDato).add(1, 'months').endOf('month'),
      end: moment(opptjeningTomDato).add(1, 'months').endOf('month'),
      content: '',
      group: 1,
      className: styles.hiddenpast,
    },
  ];
  return items;
};

const classNameGenerator = ap => {
  if (ap.erGodkjent === false) {
    return 'avvistPeriode';
  }
  if (ap.erGodkjent === true) {
    return 'godkjentPeriode';
  }
  return 'undefined';
};

const createItems = (
  opptjeningPeriods: OpptjeningAktivitet[],
  groups,
  opptjeningFomDato: string,
  opptjeningTomDato: string,
) => {
  const items = opptjeningPeriods.map(ap => ({
    id: ap.id,
    start: moment(ap.opptjeningFom),
    end: moment(`${ap.opptjeningTom} 23:59`),
    group: groups.find(
      g =>
        g.aktivitetTypeKode === ap.aktivitetType.kode &&
        g.arbeidsforholdRef === ap.arbeidsforholdRef &&
        g.oppdragsgiverOrg === ap.oppdragsgiverOrg,
    ).id,
    className: classNameGenerator(ap),
    content: '',
    data: ap,
  }));
  return items.concat(standardItems(opptjeningFomDato, opptjeningTomDato));
};

const createGroups = (opptjeningPeriods: OpptjeningAktivitet[], opptjeningAktivitetTypes) => {
  const duplicatesRemoved = opptjeningPeriods.reduce((accPeriods: OpptjeningAktivitet[], period) => {
    const hasPeriod = accPeriods.some(
      p =>
        p.aktivitetType.kode === period.aktivitetType.kode &&
        p.arbeidsforholdRef === period.arbeidsforholdRef &&
        p.oppdragsgiverOrg === period.oppdragsgiverOrg,
    );
    if (!hasPeriod) accPeriods.push(period);
    return accPeriods;
  }, []);
  return duplicatesRemoved.map((activity, index) => ({
    id: index + 1,
    content: opptjeningAktivitetTypes.find(oat => oat.kode === activity.aktivitetType.kode).navn,
    aktivitetTypeKode: activity.aktivitetType.kode,
    arbeidsforholdRef: activity.arbeidsforholdRef,
    oppdragsgiverOrg: activity.oppdragsgiverOrg,
  }));
};

const options = (opptjeningFomDato, opptjeningTomDato) => ({
  end: moment(opptjeningTomDato).add(1, 'months').endOf('month'),
  locale: moment.locale('nb'),
  margin: { item: 10 },
  max: moment(opptjeningTomDato).add(1, 'week').endOf('week'),
  min: moment(opptjeningFomDato).subtract(1, 'week').startOf('week'),
  moment,
  moveable: false,
  orientation: { axis: 'top' },
  showCurrentTime: false,
  stack: false,
  start: moment(opptjeningFomDato).subtract(1, 'months').startOf('month'),
  verticalScroll: false,
  width: '100%',
  zoomable: false,
});

interface OpptjeningTimeLineProps {
  opptjeningPeriods: OpptjeningAktivitet[];
  opptjeningAktivitetTypes: OpptjeningAktivitetType[];
  selectedPeriod: any;
  selectPeriodCallback: (data: any) => void;
  opptjeningFomDato: string;
  opptjeningTomDato: string;
}

interface OpptjeningTimeLineState {
  items?: any[];
  groups?: any[];
}

/**
 * OpptjeningTimeLine
 *
 * Presentationskomponent. Masserer data og populerer felten samt formatterar tidslinjen for fakta/opptjening
 */

class OpptjeningTimeLine extends Component<OpptjeningTimeLineProps, OpptjeningTimeLineState> {
  timelineRef: React.RefObject<any>;

  constructor(props: OpptjeningTimeLineProps) {
    super(props);

    this.state = {
      groups: undefined,
      items: undefined,
    };
    this.selectHandler = this.selectHandler.bind(this);
    this.timelineRef = React.createRef();
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    const { opptjeningAktivitetTypes, opptjeningPeriods, opptjeningFomDato, opptjeningTomDato } = this.props;
    const groups = createGroups(opptjeningPeriods, opptjeningAktivitetTypes);
    const items = createItems(opptjeningPeriods, groups, opptjeningFomDato, opptjeningTomDato);
    this.setState({
      groups,
      items,
    });
  }

  componentDidMount() {
    // TODO Fjern når denne er retta: https://github.com/Lighthouse-io/react-visjs-timeline/issues/40
    // eslint-disable-next-line react/no-find-dom-node
    const node = ReactDOM.findDOMNode(this.timelineRef.current);
    if (node) {
      node.children[0].style.visibility = 'visible';
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { opptjeningPeriods } = this.props;
    if (!isEqual(opptjeningPeriods, nextProps.opptjeningPeriods)) {
      const groups = createGroups(nextProps.opptjeningPeriods, nextProps.opptjeningAktivitetTypes);
      const items = createItems(
        nextProps.opptjeningPeriods,
        groups,
        nextProps.opptjeningFomDato,
        nextProps.opptjeningTomDato,
      );
      this.setState({
        groups,
        items,
      });
    }
  }

  selectHandler(eventProps) {
    const { selectPeriodCallback } = this.props;
    const { items } = this.state;
    const selectedItem = items.find(item => item.id === eventProps.items[0]);
    if (selectedItem) {
      selectPeriodCallback(selectedItem.data);
    }
  }

  render() {
    const { opptjeningFomDato, opptjeningTomDato, selectedPeriod } = this.props;
    const { items, groups } = this.state;
    return (
      <div className="opptjening">
        <Row>
          <Column xs="12">
            <DateContainer
              opptjeningFomDato={moment(opptjeningFomDato).format(DDMMYYYY_DATE_FORMAT)}
              opptjeningTomDato={moment(opptjeningTomDato).format(DDMMYYYY_DATE_FORMAT)}
            />
            <div className={styles.timelineContainer}>
              <div className={styles.timeLineWrapper}>
                <div className={styles.timeLine}>
                  <Timeline
                    ref={this.timelineRef}
                    options={options(opptjeningFomDato, opptjeningTomDato)}
                    items={items}
                    customTimes={{ currentDate: new Date(opptjeningTomDato) }}
                    selectHandler={this.selectHandler}
                    groups={groups}
                    selection={[selectedPeriod ? selectedPeriod.id : undefined]}
                  />
                </div>
              </div>
            </div>
          </Column>
        </Row>
      </div>
    );
  }
}

export default OpptjeningTimeLine;
