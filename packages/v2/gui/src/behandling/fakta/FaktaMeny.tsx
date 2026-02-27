import { LoadingPanelSuspense } from '@k9-sak-web/gui/shared/loading-panel/LoadingPanelSuspense.js';
import { SideMenuWrapper } from '@k9-sak-web/gui/shared/sideMenuWrapper/SideMenuWrapper.js';
import { useEffect, useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router';
import { FaktaPanelContext } from './FaktaPanelContext';

export interface FaktaMenyPanel {
  tekst: string;
  harAksjonspunkt: boolean;
  urlKode: string;
}

interface FaktaMenyProps {
  paneler: FaktaMenyPanel[];
  children: ReactNode;
}

export const FaktaMeny = ({ paneler, children }: FaktaMenyProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [valgtPanelUrlKode, setValgtPanelUrlKode] = useState<string | null>(null);
  const [sisteAktivtValgtePaneUrlKode, setSisteAktivtValgtePanelUrlKode] = useState<string | null>(null);
  const urlFaktaId = searchParams.get('fakta');

  useEffect(() => {
    const panelMedAksjonspunkt = paneler.find(panel => panel.harAksjonspunkt);
    if (panelMedAksjonspunkt && !sisteAktivtValgtePaneUrlKode) {
      setValgtPanelUrlKode(panelMedAksjonspunkt.urlKode);
      setSearchParams(forrige => {
        const neste = new URLSearchParams(forrige);
        neste.set('fakta', panelMedAksjonspunkt.urlKode);
        return neste;
      });
      return;
    }
    if (urlFaktaId === 'default') {
      setSisteAktivtValgtePanelUrlKode(null);
      const harPanelMedAksjonspunkt = paneler.some(panel => panel.harAksjonspunkt);
      const førstePanel = paneler[0];
      const defaultPanel = harPanelMedAksjonspunkt ? panelMedAksjonspunkt : førstePanel;

      if (defaultPanel) {
        setValgtPanelUrlKode(defaultPanel.urlKode);
        setSearchParams(forrige => {
          const neste = new URLSearchParams(forrige);
          neste.set('fakta', defaultPanel.urlKode);
          return neste;
        });
      }
    }
    if (sisteAktivtValgtePaneUrlKode) {
      return;
    }

    // Respekter gyldig URL-valg
    if (urlFaktaId && paneler.some(panel => panel.urlKode === urlFaktaId)) {
      setValgtPanelUrlKode(urlFaktaId);
      return;
    }
  }, [sisteAktivtValgtePaneUrlKode, setSearchParams, paneler, searchParams, urlFaktaId]);

  if (paneler.length === 0) {
    return null;
  }

  const handleKlikk = (indeks: number) => {
    const panel = paneler[indeks];
    if (panel) {
      setValgtPanelUrlKode(panel.urlKode);
      setSisteAktivtValgtePanelUrlKode(panel.urlKode);
      setSearchParams(forrige => {
        const neste = new URLSearchParams(forrige);
        neste.set('fakta', panel.urlKode);
        return neste;
      });
    }
  };

  const panelerMedAktivStatus = paneler.map(panel => ({
    tekst: panel.tekst,
    harAksjonspunkt: panel.harAksjonspunkt,
    erAktiv: panel.urlKode === urlFaktaId,
  }));

  return (
    <SideMenuWrapper paneler={panelerMedAktivStatus} onClick={handleKlikk}>
      <LoadingPanelSuspense>
        <FaktaPanelContext.Provider value={{ erValgt: urlKode => urlKode === valgtPanelUrlKode }}>
          {children}
        </FaktaPanelContext.Provider>
      </LoadingPanelSuspense>
    </SideMenuWrapper>
  );
};
