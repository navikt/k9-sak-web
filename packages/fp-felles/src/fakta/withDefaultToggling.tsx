import React from 'react';

import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { Aksjonspunkt } from '@fpsak-frontend/types';

const isInfoPanelOpen = (aksjonspunkter: Aksjonspunkt[]) =>
  aksjonspunkter.filter(ap => isAksjonspunktOpen(ap.status.kode)).length > 0;

const checkIfAksjonspunkterIsSolveable = (aksjonspunkter: Aksjonspunkt[]) => aksjonspunkter.some(ap => ap.kanLoses);

const isInactiv = (aksjonspunkter: Aksjonspunkt[]) => !aksjonspunkter.some(a => a.erAktivt);

const withDefaultToggling = (infoPanelId, aksjonspunktCodes, skalKunneOverstyre = false) => WrappedComponent => {
  class InfoPanel extends React.Component<InfoPanelProps> {
    static displayName = `InfoPanel(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    static defaultProps: Partial<InfoPanelProps> = {
      aksjonspunkter: [],
    };

    constructor(props: InfoPanelProps) {
      super(props);
      this.toggleOnDefault = this.toggleOnDefault.bind(this);
    }

    componentDidMount() {
      this.toggleOnDefault();
    }

    componentDidUpdate() {
      this.toggleOnDefault();
    }

    toggleOnDefault() {
      const { aksjonspunkter, shouldOpenDefaultInfoPanels, toggleInfoPanelCallback } = this.props;
      const filteredAps = aksjonspunkter.filter(ap => aksjonspunktCodes.includes(ap.definisjon.kode));
      if (
        shouldOpenDefaultInfoPanels &&
        isInfoPanelOpen(filteredAps) &&
        checkIfAksjonspunkterIsSolveable(filteredAps)
      ) {
        toggleInfoPanelCallback(infoPanelId);
      }
    }

    render() {
      const { aksjonspunkter, readOnly, erOverstyrer } = this.props;
      const filteredAps = aksjonspunkter.filter(ap => aksjonspunktCodes.includes(ap.definisjon.kode));
      const hasOpenAksjonspunkter = isInfoPanelOpen(filteredAps);
      const canSolveAksjonspunkter = checkIfAksjonspunkterIsSolveable(filteredAps);

      const newProps = {
        readOnly: readOnly || (!(skalKunneOverstyre && erOverstyrer) && isInactiv(filteredAps)),
        submittable: !hasOpenAksjonspunkter || canSolveAksjonspunkter,
        hasOpenAksjonspunkter: hasOpenAksjonspunkter && canSolveAksjonspunkter,
        aksjonspunkter: filteredAps,
      };
      return <WrappedComponent {...this.props} {...newProps} />;
    }
  }

  interface InfoPanelProps {
    aksjonspunkter?: Aksjonspunkt[];
    toggleInfoPanelCallback: (infoPanelId: string) => void;
    shouldOpenDefaultInfoPanels: boolean;
    readOnly: boolean;
    erOverstyrer?: boolean;
  }

  return InfoPanel;
};

export default withDefaultToggling;
