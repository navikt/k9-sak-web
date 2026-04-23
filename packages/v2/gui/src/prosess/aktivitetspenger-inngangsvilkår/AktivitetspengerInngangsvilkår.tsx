import { AksjonspunktDefinisjon, BostedAksjonspunktKode } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { ung_kodeverk_vilkår_VilkårType } from '@k9-sak-web/backend/ungsak/generated/types.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { InnloggetAnsattUngV2Dto } from '@k9-sak-web/backend/ungsak/kontrakt/nav-ansatt/InnloggetAnsattUngV2Dto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import { CheckmarkIcon, ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { Box, Heading, Tabs, VStack } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import type { AktivitetspengerApi } from '../aktivitetspenger-prosess/AktivitetspengerApi.js';
import { Alder } from './Alder.js';
import { AndreLivsoppholdytelser } from './AndreLivsoppholdytelser.js';
import { BehovForBistand } from './BehovForBistand.js';
import { Beslutter } from './Beslutter.js';
import { BosattITrondheim } from './BosattITrondheim.js';
import { Søknadsfrist } from './Søknadsfrist.js';
import { InngangsvilkårTab } from './types.js';
import type { UngSakVilkårMedPerioderDto } from '@k9-sak-web/backend/combined/kontrakt/vilkår/VilkårMedPerioderDto.js';

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
  BostedAksjonspunktKode.VURDER_BOSTED,
  BostedAksjonspunktKode.FASTSETT_BOSTED,
] as string[];

interface Props {
  aksjonspunkter: AksjonspunktDto[];
  innloggetBruker: InnloggetAnsattUngV2Dto;
  api: AktivitetspengerApi;
  behandling: BehandlingDto;
  vilkår?: VilkårMedPerioderDto[];
  onAksjonspunktBekreftet: () => void;
}

export const AktivitetspengerInngangsvilkår = ({
  aksjonspunkter,
  innloggetBruker,
  api,
  behandling,
  vilkår,
  onAksjonspunktBekreftet,
}: Props) => {
  const kanSaksbehandle = !!innloggetBruker.aktivitetspengerDel1SaksbehandlerTilgang?.kanSaksbehandle;
  const relevanteAksjonspunkter = aksjonspunkter.filter(ap =>
    relevanteAksjonspunktDefinisjoner.some(def => def === (ap.definisjon as string)),
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
  const vurderBostedAp = relevanteAksjonspunkter.find(
    ap => (ap.definisjon as string) === BostedAksjonspunktKode.VURDER_BOSTED,
  );
  const fastsettBostedAp = relevanteAksjonspunkter.find(
    ap => (ap.definisjon as string) === BostedAksjonspunktKode.FASTSETT_BOSTED,
  );

  const bostedsvilkår = vilkår?.find(
    v => v.vilkarType === ung_kodeverk_vilkår_VilkårType.BOSTEDSVILKÅR,
  ) as UngSakVilkårMedPerioderDto | undefined;

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
          <Tabs.Tab value={InngangsvilkårTab.BOSATT_I_TRONDHEIM} label="Bosatt i Trondheim" icon={tabIkon(vurderBostedAp ?? fastsettBostedAp)} />
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
            <BosattITrondheim
              aksjonspunkter={aksjonspunkter}
              vilkår={bostedsvilkår}
              api={api}
              behandling={behandling}
              kanSaksbehandle={kanSaksbehandle}
              onAksjonspunktBekreftet={onAksjonspunktBekreftet}
            />
          </Tabs.Panel>
          <Tabs.Panel value={InngangsvilkårTab.ANDRE_LIVSOPPHOLDYTELSER}>
            <AndreLivsoppholdytelser />
          </Tabs.Panel>
          <Tabs.Panel value={InngangsvilkårTab.BEHOV_FOR_BISTAND}>
            <BehovForBistand
              vurderBistandsvilkårAp={vurderBistandsvilkårAp}
              lokalkontorForeslårVilkårAp={lokalkontorForeslårVilkårAp}
              kanSaksbehandle={kanSaksbehandle}
              api={api}
              behandling={behandling}
              onAksjonspunktBekreftet={onAksjonspunktBekreftet}
            />
          </Tabs.Panel>
          {lokalkontorBeslutterAp && (
            <Tabs.Panel value={InngangsvilkårTab.BESLUTTER}>
              <Beslutter
                lokalkontorBeslutterAp={lokalkontorBeslutterAp}
                vurderBistandsvilkårAp={vurderBistandsvilkårAp}
                innloggetBruker={innloggetBruker}
                api={api}
                behandling={behandling}
                onTabChange={setAktivTab}
                onAksjonspunktBekreftet={onAksjonspunktBekreftet}
              />
            </Tabs.Panel>
          )}
        </Box>
      </Tabs>
    </VStack>
  );
};
