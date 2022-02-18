import React from 'react';
import { EkspanderbartpanelBase } from 'nav-frontend-ekspanderbartpanel';

import risikoIkon from '@fpsak-frontend/assets/images/avslaatt_hover.svg';
import { Risikoklassifisering, Aksjonspunkt } from '@k9-sak-web/types';

import HoyRisikoPanel from './HoyRisikoPanel';
import TittelMedDivider from './TittelMedDivider';
import { VuderFaresignalerAp } from './AvklarFaresignalerForm';

import styles from './hoyRisikoTittel.less';

interface OwnProps {
  risikoklassifisering: Risikoklassifisering;
  aksjonspunkt?: Aksjonspunkt;
  readOnly: boolean;
  submitCallback: (verdier: VuderFaresignalerAp) => Promise<any>;
  isRiskPanelOpen: boolean;
  toggleRiskPanel: () => void;
  behandlingId: number;
  behandlingVersjon: number;
}

/**
 * HoyRisikoTittel
 *
 * Presentasjonskomponent. Statisk visning av tittel i utvidbart panel dersom faresignaler er funnet.
 */
const HoyRisikoTittel = ({
  risikoklassifisering,
  aksjonspunkt,
  readOnly,
  submitCallback,
  isRiskPanelOpen,
  toggleRiskPanel,
  behandlingId,
  behandlingVersjon,
}: OwnProps) => (
  <EkspanderbartpanelBase
    data-testid="HoyRisikoTittel"
    className={styles.hoyRisikoPanelTittel}
    apen={isRiskPanelOpen}
    onClick={toggleRiskPanel}
    tittel={<TittelMedDivider imageSrc={risikoIkon} tittel="Risikopanel.Tittel.Faresignaler" />}
    border
  >
    <HoyRisikoPanel
      risikoklassifisering={risikoklassifisering}
      aksjonspunkt={aksjonspunkt}
      readOnly={readOnly}
      submitCallback={submitCallback}
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
    />
  </EkspanderbartpanelBase>
);

export default HoyRisikoTittel;
