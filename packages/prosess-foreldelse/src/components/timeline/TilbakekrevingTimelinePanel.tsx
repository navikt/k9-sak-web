import React, { Component } from 'react';

import TilbakekrevingTimeline from './TilbakekrevingTimeline';

interface ValgtPeriode {
  fom: string;
  tom: string;
  isAksjonspunktOpen: boolean;
  isGodkjent: boolean;
}

interface TilbakekrevingTimelinePanelProps {
  perioder: {
    id: number;
    fom: string;
    tom: string;
    isAksjonspunktOpen: boolean;
    isGodkjent: boolean;
  }[];
  valgtPeriode?: ValgtPeriode;
  setPeriode(...args: unknown[]): unknown;
  toggleDetaljevindu(...args: unknown[]): unknown;
  kjonn: string;
  hjelpetekstKomponent: React.ReactNode;
}

interface TilbakekrevingTimelinePanelState {
  valgtPeriode: ValgtPeriode | null;
}

// TODO (TOR) Slå saman med TilbakekrevingTimeline.jsx

class TilbakekrevingTimelinePanel extends Component<
  TilbakekrevingTimelinePanelProps,
  TilbakekrevingTimelinePanelState
> {
  constructor(props) {
    super(props);
    this.state = {
      valgtPeriode: null,
    };
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { valgtPeriode: vPeriode } = nextProps;
    const { valgtPeriode } = this.state;

    if (vPeriode !== valgtPeriode) {
      this.setState(state => ({ ...state, valgtPeriode: vPeriode }));
    }
  }

  selectHandler = eventProps => {
    const { perioder, setPeriode } = this.props;
    const valgtPeriode = perioder.find(periode => periode.id === eventProps.items[0]);
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
