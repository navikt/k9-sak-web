import { SykdomOgOpplæringContext } from '@k9-sak-web/behandling-opplaeringspenger/src/panelDefinisjoner/faktaPaneler/SykdomOgOpplæringPanelDef';
import FaktaInstitusjonIndex from '@k9-sak-web/gui/fakta/institusjon/FaktaInstitusjonIndex.js';
import { Tabs } from '@navikt/ds-react';
import { useContext, useState } from 'react';

export const SykdomOgOpplæringIndex = () => {
  const [activeTab, setActiveTab] = useState('institusjon');
  const { institusjon, readOnly } = useContext(SykdomOgOpplæringContext);
  const { perioder, vurderinger } = institusjon;
  return (
    <Tabs value={activeTab} onChange={setActiveTab}>
      <Tabs.List>
        <Tabs.Tab value="institusjon" label="Institusjon" />
        <Tabs.Tab value="sykdom" label="Sykdom" />
        <Tabs.Tab value="opplæring" label="Nødvendig opplæring" />
        <Tabs.Tab value="reisetid" label="Reisetid" />
      </Tabs.List>
      <Tabs.Panel value="institusjon">
        <FaktaInstitusjonIndex perioder={perioder} vurderinger={vurderinger} readOnly={readOnly} />
      </Tabs.Panel>
      <Tabs.Panel value="sykdom">sykdom</Tabs.Panel>
      <Tabs.Panel value="opplæring">opplæring</Tabs.Panel>
      <Tabs.Panel value="reisetid">reisetid</Tabs.Panel>
    </Tabs>
  );
};
