import { EkspanderbartpanelBase } from 'nav-frontend-ekspanderbartpanel';
import React from 'react';

import risikoIkon from '@fpsak-frontend/assets/images/avslaatt_hover.svg?react';
import { Aksjonspunkt, Risikoklassifisering } from '@k9-sak-web/types';

import { VuderFaresignalerAp } from './AvklarFaresignalerForm';
import HoyRisikoPanel from './HoyRisikoPanel';
import TittelMedDivider from './TittelMedDivider';

import styles from './hoyRisikoTittel.module.css';

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
