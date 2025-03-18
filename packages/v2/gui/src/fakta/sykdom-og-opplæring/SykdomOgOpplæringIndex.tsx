import { aksjonspunktCodes } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';
import { type InstitusjonAksjonspunktPayload } from '@k9-sak-web/gui/fakta/sykdom-og-opplæring/institusjon/components/institusjonDetails/InstitusjonForm.js';
import FaktaInstitusjonIndex from '@k9-sak-web/gui/fakta/sykdom-og-opplæring/institusjon/FaktaInstitusjonIndex.js';
import VurderSykdomUperiodisert from '@k9-sak-web/gui/fakta/sykdom-og-opplæring/sykdom/VurderSykdomUperiodisert.js';
import { Tabs } from '@navikt/ds-react';
import { createContext, useState } from 'react';

type payloads = InstitusjonAksjonspunktPayload;
type aksjonspunktPayload = { kode: string; begrunnelse: string } & payloads;
type SykdomOgOpplæringProps = {
  readOnly: boolean;
  submitCallback: (payload: aksjonspunktPayload[]) => void;
  behandlingUuid: string;
};

type SykdomOgOpplæringContext = {
  readOnly: boolean;
  løsAksjonspunkt9300: (payload: InstitusjonAksjonspunktPayload) => void;
  behandlingUuid: string;
};

export const SykdomOgOpplæringContext = createContext<SykdomOgOpplæringContext>({
  readOnly: true,
  løsAksjonspunkt9300: () => {},
  behandlingUuid: '',
});

const SykdomOgOpplæringIndex = ({ readOnly, submitCallback, behandlingUuid }: SykdomOgOpplæringProps) => {
  const løsAksjonspunkt9300 = (payload: InstitusjonAksjonspunktPayload) => {
    submitCallback([{ kode: aksjonspunktCodes.VURDER_INSTITUSJON, ...payload }]);
  };

  return (
    <SykdomOgOpplæringContext.Provider
      value={{
        readOnly,
        løsAksjonspunkt9300,
        behandlingUuid,
      }}
    >
      <SykdomOgOpplæring />
    </SykdomOgOpplæringContext.Provider>
  );
};

const SykdomOgOpplæring = () => {
  const [activeTab, setActiveTab] = useState('institusjon');
  return (
    <Tabs value={activeTab} onChange={setActiveTab}>
      <Tabs.List>
        <Tabs.Tab value="institusjon" label="Institusjon" />
        <Tabs.Tab value="sykdom" label="Sykdom" />
        <Tabs.Tab value="opplæring" label="Nødvendig opplæring" />
        <Tabs.Tab value="reisetid" label="Reisetid" />
      </Tabs.List>
      <Tabs.Panel value="institusjon">
        <FaktaInstitusjonIndex />
      </Tabs.Panel>
      <Tabs.Panel value="sykdom">
        <VurderSykdomUperiodisert />
      </Tabs.Panel>
      <Tabs.Panel value="opplæring">opplæring</Tabs.Panel>
      <Tabs.Panel value="reisetid">reisetid</Tabs.Panel>
    </Tabs>
  );
};

export default SykdomOgOpplæringIndex;
