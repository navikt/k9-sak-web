import type React from 'react';
import { Component, type MouseEvent } from 'react';

import type TidslinjePeriode from '../../types/tidslinjePeriodeTsType';
import TilbakekrevingTimeline from './TilbakekrevingTimeline';

interface OwnProps {
  perioder: TidslinjePeriode[];
  valgtPeriode?: TidslinjePeriode;
  setPeriode: (periode: TidslinjePeriode) => void;
  toggleDetaljevindu: (event: MouseEvent) => void;
  kjonn: string;
  hjelpetekstKomponent: React.ReactNode;
}

interface OwnState {
  valgtPeriode?: TidslinjePeriode;
}

// TODO (TOR) Slå saman med TilbakekrevingTimeline.tsx

class TilbakekrevingTimelinePanel extends Component<OwnProps, OwnState> {
  constructor(props: OwnProps) {
    super(props);
    this.state = {
      valgtPeriode: null,
    };
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps: OwnProps) {
    const { valgtPeriode: vPeriode } = nextProps;
    const { valgtPeriode } = this.state;

    if (vPeriode !== valgtPeriode) {
      this.setState((state: any) => ({ ...state, valgtPeriode: vPeriode }));
    }
  }

  selectHandler = (eventProps: any) => {
    const { perioder, setPeriode } = this.props;
    const valgtPeriode = perioder.find((periode: TidslinjePeriode) => periode.id === eventProps.items[0]);
    if (valgtPeriode) {
      setPeriode(valgtPeriode);
      this.setState({ valgtPeriode });
    }
    eventProps.event.preventDefault();
  };

  render() {
    const { perioder, toggleDetaljevindu, hjelpetekstKomponent, kjonn } = this.props;
    const { valgtPeriode } = this.state;

    return (
      <TilbakekrevingTimeline
        key={perioder.length}
        perioder={perioder}
        selectedPeriod={valgtPeriode}
        selectPeriodCallback={this.selectHandler}
        toggleDetaljevindu={toggleDetaljevindu}
        hjelpetekstKomponent={hjelpetekstKomponent}
        kjonn={kjonn}
      />
    );
  }
}

export default TilbakekrevingTimelinePanel;
