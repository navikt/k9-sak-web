import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { Fagsak, Behandling } from '@k9-sak-web/types';
import { SykdomOgOpplæringIndex } from '@k9-sak-web/fakta-sykdom-og-opplæring';
import { OpplaeringspengerBehandlingApiKeys } from '../../data/opplaeringspengerBehandlingApi';
import { createContext } from 'react';
import { FaktaInstitusjonProps } from '@k9-sak-web/gui/fakta/institusjon/FaktaInstitusjonIndex.js';
import { InstitusjonAksjonspunktPayload } from '@k9-sak-web/gui/fakta/institusjon/components/institusjonDetails/InstitusjonForm.js';

type payloads = InstitusjonAksjonspunktPayload;
type aksjonspunktPayload = { kode: string; begrunnelse: string } & payloads;
type SykdomOgOpplæringProps = {
  institusjon: Pick<FaktaInstitusjonProps, 'perioder' | 'vurderinger'>;
  readOnly: boolean;
  submitCallback: (payload: aksjonspunktPayload[]) => void;
};

type SykdomOgOpplæringContext = {
  institusjon: Pick<FaktaInstitusjonProps, 'perioder' | 'vurderinger'>;
  readOnly: boolean;
  løsAksjonspunkt9300: (payload: InstitusjonAksjonspunktPayload) => void;
};

export const SykdomOgOpplæringContext = createContext<SykdomOgOpplæringContext>({
  institusjon: {
    perioder: [],
    vurderinger: [],
  },
  readOnly: true,
  løsAksjonspunkt9300: () => {},
});

class SykdomOgOpplæringPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.SYKDOM_OG_OPPLAERING;

  getTekstKode = () => 'FaktaSykdomOgOpplaering.Title';

  getAksjonspunktKoder = () => [aksjonspunktCodes.MEDISINSK_VILKAAR, aksjonspunktCodes.VURDER_INSTITUSJON];

  getEndepunkter = () => [OpplaeringspengerBehandlingApiKeys.INSTITUSJON];

  getKomponent = ({ institusjon, readOnly, submitCallback }: SykdomOgOpplæringProps) => {
    const løsAksjonspunkt9300 = (payload: InstitusjonAksjonspunktPayload) => {
      submitCallback([{ kode: aksjonspunktCodes.VURDER_INSTITUSJON, ...payload }]);
    };
    const contextValue = { institusjon, readOnly, løsAksjonspunkt9300 };
    return (
      <SykdomOgOpplæringContext.Provider value={contextValue}>
        <SykdomOgOpplæringIndex />
      </SykdomOgOpplæringContext.Provider>
    );
  };

  getData = ({ fagsak, behandling }: { fagsak: Fagsak; behandling: Behandling }) => {
    return {
      fagsakYtelseType: fagsak.sakstype,
      behandlingType: behandling.type.kode,
    };
  };

  getOverstyrVisningAvKomponent = ({ behandling }: { fagsak: Fagsak; behandling: Behandling }) => {
    const søknadsfristErIkkeUnderVurdering = behandling.stegTilstand?.stegType?.kode !== 'VURDER_SØKNADSFRIST';
    return søknadsfristErIkkeUnderVurdering;
  };
}

export default SykdomOgOpplæringPanelDef;
