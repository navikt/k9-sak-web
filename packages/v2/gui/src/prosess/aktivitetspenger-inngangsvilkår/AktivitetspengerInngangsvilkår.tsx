import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { InnloggetAnsattUngV2Dto } from '@k9-sak-web/backend/ungsak/kontrakt/nav-ansatt/InnloggetAnsattUngV2Dto.js';
import { CheckmarkIcon, ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { Box, Heading, Tabs, VStack } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { Alder } from './Alder';
import { AndreLivsoppholdytelser } from './AndreLivsoppholdytelser';
import { BehovForBistand } from './BehovForBistand';
import { Beslutter } from './Beslutter';
import { BosattITrondheim } from './BosattITrondheim';
import { Søknadsfrist } from './Søknadsfrist';
import type { SubmitCallback } from './types';
import { InngangsvilkårTab } from './types';

const CustomCheckmarkIcon = () => <CheckmarkIcon style={{ color: 'var(--ax-text-accent-subtle)' }} />;
const CustomWarningIcon = () => (
  <ExclamationmarkTriangleFillIcon fontSize="1.5rem" color="var(--ax-text-warning-decoration)" />
);

const tabIkon = (ap?: AksjonspunktDto) => {
  if (!ap) return undefined;
  return ap.status === AksjonspunktStatus.UTFØRT ? <CustomCheckmarkIcon /> : <CustomWarningIcon />;
};

const relevanteAksjonspunktDefinisjoner = [
  AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR,
  AksjonspunktDefinisjon.LOKALKONTOR_FORESLÅR_VILKÅR,
  AksjonspunktDefinisjon.LOKALKONTOR_BESLUTTER_VILKÅR,
];

interface Props {
  aksjonspunkter: AksjonspunktDto[];
  innloggetBruker: InnloggetAnsattUngV2Dto;
  submitCallback: SubmitCallback;
}

export const AktivitetspengerInngangsvilkår = ({ aksjonspunkter, innloggetBruker, submitCallback }: Props) => {
  const kanSaksbehandle = !!innloggetBruker.aktivitetspengerDel1SaksbehandlerTilgang?.kanSaksbehandle;
  const relevanteAksjonspunkter = aksjonspunkter.filter(ap =>
    relevanteAksjonspunktDefinisjoner.some(def => def === ap.definisjon),
  );
  const vurderBistandsvilkårAp = relevanteAksjonspunkter.find(
    ap => ap.definisjon === AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR,
  );
  const lokalkontorForeslårVilkårAp = relevanteAksjonspunkter.find(
    ap => ap.definisjon === AksjonspunktDefinisjon.LOKALKONTOR_FORESLÅR_VILKÅR,
  );
  const lokalkontorBeslutterAp = relevanteAksjonspunkter.find(
    ap => ap.definisjon === AksjonspunktDefinisjon.LOKALKONTOR_BESLUTTER_VILKÅR,
  );

  const utledAktivTab = () => {
    if (lokalkontorBeslutterAp && lokalkontorBeslutterAp.status !== AksjonspunktStatus.UTFØRT) {
      return InngangsvilkårTab.BESLUTTER;
    }
    return InngangsvilkårTab.BEHOV_FOR_BISTAND;
  };

  const [aktivTab, setAktivTab] = useState<InngangsvilkårTab>(utledAktivTab);

  useEffect(() => {
    setAktivTab(utledAktivTab());
  }, [aksjonspunkter]);

  return (
    <VStack gap="space-20">
      <Heading size="medium" level="2">
        Inngangsvilkår
      </Heading>
      <Tabs value={aktivTab} onChange={value => setAktivTab(value as InngangsvilkårTab)}>
        <Tabs.List>
          <Tabs.Tab value={InngangsvilkårTab.SØKNADSFRIST} label="Søknadsfrist" icon={tabIkon()} />
          <Tabs.Tab value={InngangsvilkårTab.ALDER} label="Alder" icon={tabIkon()} />
          <Tabs.Tab value={InngangsvilkårTab.BOSATT_I_TRONDHEIM} label="Bosatt i Trondheim" icon={tabIkon()} />
          <Tabs.Tab
            value={InngangsvilkårTab.ANDRE_LIVSOPPHOLDYTELSER}
            label="Andre livsoppholdytelser"
            icon={tabIkon()}
          />
          <Tabs.Tab
            value={InngangsvilkårTab.BEHOV_FOR_BISTAND}
            label="Behov for bistand"
            icon={tabIkon(vurderBistandsvilkårAp)}
          />
          {lokalkontorBeslutterAp && (
            <Tabs.Tab value={InngangsvilkårTab.BESLUTTER} label="Beslutter" icon={tabIkon(lokalkontorBeslutterAp)} />
          )}
        </Tabs.List>
        <Box marginBlock="space-20 space-0">
          <Tabs.Panel value={InngangsvilkårTab.SØKNADSFRIST}>
            <Søknadsfrist />
          </Tabs.Panel>
          <Tabs.Panel value={InngangsvilkårTab.ALDER}>
            <Alder />
          </Tabs.Panel>
          <Tabs.Panel value={InngangsvilkårTab.BOSATT_I_TRONDHEIM}>
            <BosattITrondheim />
          </Tabs.Panel>
          <Tabs.Panel value={InngangsvilkårTab.ANDRE_LIVSOPPHOLDYTELSER}>
            <AndreLivsoppholdytelser />
          </Tabs.Panel>
          <Tabs.Panel value={InngangsvilkårTab.BEHOV_FOR_BISTAND}>
            <BehovForBistand
              vurderBistandsvilkårAp={vurderBistandsvilkårAp}
              lokalkontorForeslårVilkårAp={lokalkontorForeslårVilkårAp}
              kanSaksbehandle={kanSaksbehandle}
              submitCallback={submitCallback}
            />
          </Tabs.Panel>
          {lokalkontorBeslutterAp && (
            <Tabs.Panel value={InngangsvilkårTab.BESLUTTER}>
              <Beslutter
                lokalkontorBeslutterAp={lokalkontorBeslutterAp}
                vurderBistandsvilkårAp={vurderBistandsvilkårAp}
                innloggetBruker={innloggetBruker}
                submitCallback={submitCallback}
                onTabChange={setAktivTab}
              />
            </Tabs.Panel>
          )}
        </Box>
      </Tabs>
    </VStack>
  );
};
