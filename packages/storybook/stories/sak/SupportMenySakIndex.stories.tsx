import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';

import SupportMenySakIndex, { SupportTabs } from '@fpsak-frontend/sak-support-meny';

export default {
  title: 'sak/sak-support-meny',
  component: SupportMenySakIndex,
  decorators: [withKnobs],
};

export const visMenyUtenBeslutterGodkjenningOgTilbakesending = () => {
  const [valgtPanelIndex, setPanelIndex] = React.useState<number>();
  return (
    <SupportMenySakIndex
      tilgjengeligeTabs={[SupportTabs.HISTORIKK, SupportTabs.MELDINGER, SupportTabs.DOKUMENTER]}
      valgbareTabs={[SupportTabs.HISTORIKK, SupportTabs.MELDINGER, SupportTabs.DOKUMENTER]}
      valgtIndex={valgtPanelIndex}
      onClick={setPanelIndex}
      antallUlesteNotater={0}
    />
  );
};

export const visMenyMedBeslutterGodkjenning = () => {
  const [valgtPanelIndex, setPanelIndex] = React.useState<number>();
  return (
    <SupportMenySakIndex
      tilgjengeligeTabs={[
        SupportTabs.TIL_BESLUTTER,
        SupportTabs.HISTORIKK,
        SupportTabs.MELDINGER,
        SupportTabs.DOKUMENTER,
      ]}
      valgbareTabs={[SupportTabs.TIL_BESLUTTER, SupportTabs.HISTORIKK, SupportTabs.MELDINGER, SupportTabs.DOKUMENTER]}
      valgtIndex={valgtPanelIndex}
      onClick={setPanelIndex}
      antallUlesteNotater={0}
    />
  );
};

export const visMenyEtterTilbakesendingFraBeslutter = () => {
  const [valgtPanelIndex, setPanelIndex] = React.useState<number>();
  return (
    <SupportMenySakIndex
      tilgjengeligeTabs={[
        SupportTabs.FRA_BESLUTTER,
        SupportTabs.HISTORIKK,
        SupportTabs.MELDINGER,
        SupportTabs.DOKUMENTER,
      ]}
      valgbareTabs={[SupportTabs.FRA_BESLUTTER, SupportTabs.HISTORIKK, SupportTabs.MELDINGER, SupportTabs.DOKUMENTER]}
      valgtIndex={valgtPanelIndex}
      onClick={setPanelIndex}
      antallUlesteNotater={0}
    />
  );
};

export const visSendMeldingSomIkkeValgbar = () => {
  const [valgtPanelIndex, setPanelIndex] = React.useState<number>();
  return (
    <SupportMenySakIndex
      tilgjengeligeTabs={[SupportTabs.HISTORIKK, SupportTabs.MELDINGER, SupportTabs.DOKUMENTER]}
      valgbareTabs={[SupportTabs.HISTORIKK, SupportTabs.DOKUMENTER]}
      valgtIndex={valgtPanelIndex}
      onClick={setPanelIndex}
      antallUlesteNotater={0}
    />
  );
};
