import { aksjonspunktCodes } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';
import { type InstitusjonAksjonspunktPayload } from '@k9-sak-web/gui/fakta/sykdom-og-opplæring/institusjon/components/InstitusjonForm.js';
import { type LangvarigSykdomVurderingDto } from '@k9-sak-web/backend/k9sak/generated';
import FaktaInstitusjonIndex from '@k9-sak-web/gui/fakta/sykdom-og-opplæring/institusjon/FaktaInstitusjonIndex.js';
import VurderSykdomUperiodisert from '@k9-sak-web/gui/fakta/sykdom-og-opplæring/sykdom/VurderSykdomUperiodisert.js';
import { Tabs } from '@navikt/ds-react';
import { createContext, useState } from 'react';

type payloads = InstitusjonAksjonspunktPayload | { langvarigsykdomsvurderingUuid: string };
type aksjonspunktPayload = { kode: string; begrunnelse: string } & payloads;
type SykdomOgOpplæringProps = {
  readOnly: boolean;
  submitCallback: (payload: aksjonspunktPayload[]) => void;
  behandlingUuid: string;
};

type SykdomOgOpplæringContext = {
  readOnly: boolean;
  løsAksjonspunkt9300: (payload: InstitusjonAksjonspunktPayload) => void;
  løsAksjonspunkt9301: (payload: { langvarigsykdomsvurderingUuid: string; begrunnelse: string }) => void;
  behandlingUuid: string;
};

export const SykdomOgOpplæringContext = createContext<SykdomOgOpplæringContext>({
  readOnly: true,
  løsAksjonspunkt9300: () => {},
  løsAksjonspunkt9301: () => {},
  behandlingUuid: '',
});

const SykdomOgOpplæringIndex = ({ readOnly, submitCallback, behandlingUuid }: SykdomOgOpplæringProps) => {
  const løsAksjonspunkt9300 = (payload: InstitusjonAksjonspunktPayload) => {
    submitCallback([{ kode: aksjonspunktCodes.VURDER_INSTITUSJON, ...payload }]);
  };

  const løsAksjonspunkt9301 = (payload: { langvarigsykdomsvurderingUuid: string; begrunnelse: string }) => {
    submitCallback([
      {
        kode: aksjonspunktCodes.VURDER_LANGVARIG_SYK,
        begrunnelse: payload.begrunnelse,
        langvarigsykdomsvurderingUuid: payload.langvarigsykdomsvurderingUuid,
      },
    ]);
  };

  return (
    <SykdomOgOpplæringContext.Provider
      value={{
        readOnly,
        løsAksjonspunkt9300,
        løsAksjonspunkt9301,
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
        <div className="mt-4">
          <FaktaInstitusjonIndex />
        </div>
      </Tabs.Panel>
      <Tabs.Panel value="sykdom">
        <div className="mt-4">
          <VurderSykdomUperiodisert />
        </div>
      </Tabs.Panel>
      <Tabs.Panel value="opplæring">
        <div className="mt-4">opplæring</div>
      </Tabs.Panel>
      <Tabs.Panel value="reisetid">
        <div className="mt-4">reisetid</div>
      </Tabs.Panel>
    </Tabs>
  );
};

export default SykdomOgOpplæringIndex;
