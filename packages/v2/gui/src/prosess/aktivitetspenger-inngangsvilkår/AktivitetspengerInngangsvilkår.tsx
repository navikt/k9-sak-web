import { ung_kodeverk_vilkår_VilkårType } from '@k9-sak-web/backend/ungsak/generated/types.js';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { InnloggetAnsattUngV2Dto } from '@k9-sak-web/backend/ungsak/kontrakt/nav-ansatt/InnloggetAnsattUngV2Dto.js';
import type { TotrinnskontrollSkjermlenkeContextDto } from '@k9-sak-web/backend/ungsak/kontrakt/vedtak/TotrinnskontrollSkjermlenkeContextDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import { CheckmarkIcon, ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { Box, Heading, Tabs, VStack } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import type { AktivitetspengerApi } from '../aktivitetspenger-prosess/AktivitetspengerApi';
import { Alder } from './Alder';
import { AndreLivsoppholdytelser } from './AndreLivsoppholdytelser';
import { BehovForBistand } from './BehovForBistand';
import { Beslutter } from './Beslutter';
import { Bosted } from './Bosted';
import { Søknadsfrist } from './Søknadsfrist';
import { InngangsvilkårTab } from './types';

const CustomCheckmarkIcon = () => <CheckmarkIcon style={{ color: 'var(--ax-text-accent-subtle)' }} />;
const CustomWarningIcon = () => (
  <ExclamationmarkTriangleFillIcon fontSize="1.5rem" color="var(--ax-text-warning-decoration)" />
);

const tabIcon = (ap?: AksjonspunktDto | undefined, vilkår?: VilkårMedPerioderDto) => {
  if (!ap && !vilkår) return undefined;
  if (ap) {
    return ap.status === AksjonspunktStatus.UTFØRT ? <CustomCheckmarkIcon /> : <CustomWarningIcon />;
  }
  return vilkår?.perioder?.every(periode => periode.vilkarStatus !== Utfall.IKKE_VURDERT) ? (
    <CustomCheckmarkIcon />
  ) : undefined;
};

const utledAktivTab = (aksjonspunkter: AksjonspunktDto[]) => {
  const bosattITrondheimAp = aksjonspunkter.find(ap => ap.definisjon === AksjonspunktDefinisjon.VURDER_BOSTED);
  if (bosattITrondheimAp && bosattITrondheimAp.status === AksjonspunktStatus.OPPRETTET) {
    return InngangsvilkårTab.BOSATT_I_TRONDHEIM;
  }
  const andreLivsoppholdytelserAp = aksjonspunkter.find(
    ap => ap.definisjon === AksjonspunktDefinisjon.VURDER_ANDRE_LIVSOPPHOLDSYTELSER,
  );
  if (andreLivsoppholdytelserAp && andreLivsoppholdytelserAp.status === AksjonspunktStatus.OPPRETTET) {
    return InngangsvilkårTab.ANDRE_LIVSOPPHOLDYTELSER;
  }
  const lokalkontorBeslutterAp = aksjonspunkter.find(
    ap => ap.definisjon === AksjonspunktDefinisjon.LOKALKONTOR_BESLUTTER_VILKÅR,
  );
  if (lokalkontorBeslutterAp && lokalkontorBeslutterAp.status === AksjonspunktStatus.OPPRETTET) {
    return InngangsvilkårTab.BESLUTTER;
  }
  return InngangsvilkårTab.BEHOV_FOR_BISTAND;
};

interface Props {
  aksjonspunkter: AksjonspunktDto[];
  innloggetBruker: InnloggetAnsattUngV2Dto;
  api: AktivitetspengerApi;
  behandling: BehandlingDto;
  onAksjonspunktBekreftet: () => void;
  vilkår: VilkårMedPerioderDto[];
  totrinnskontrollSkjermlenkeContext: TotrinnskontrollSkjermlenkeContextDto[];
}

export const AktivitetspengerInngangsvilkår = ({
  aksjonspunkter,
  innloggetBruker,
  api,
  behandling,
  onAksjonspunktBekreftet,
  vilkår,
  totrinnskontrollSkjermlenkeContext,
}: Props) => {
  const kanSaksbehandle = !!innloggetBruker.aktivitetspengerDel1SaksbehandlerTilgang?.kanSaksbehandle;

  const søknadsfristAp = aksjonspunkter.find(
    ap => ap.definisjon === AksjonspunktDefinisjon.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST,
  );
  const søknadsfristVilkår = vilkår.find(v => v.vilkarType === ung_kodeverk_vilkår_VilkårType.SØKNADSFRIST);
  const alderVilkår = vilkår.find(v => v.vilkarType === ung_kodeverk_vilkår_VilkårType.ALDERSVILKÅR);
  const vurderBistandsvilkårAp = aksjonspunkter.find(
    ap => ap.definisjon === AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR,
  );
  const vurderBistandsvilkårVilkår = vilkår.find(v => v.vilkarType === ung_kodeverk_vilkår_VilkårType.BISTANDSVILKÅR);
  const lokalkontorForeslårVilkårAp = aksjonspunkter.find(
    ap => ap.definisjon === AksjonspunktDefinisjon.LOKALKONTOR_FORESLÅR_VILKÅR,
  );
  const lokalkontorBeslutterAp = aksjonspunkter.find(
    ap => ap.definisjon === AksjonspunktDefinisjon.LOKALKONTOR_BESLUTTER_VILKÅR,
  );
  const bostedAp = aksjonspunkter.find(ap => ap.definisjon === AksjonspunktDefinisjon.VURDER_BOSTED);
  const bostedVilkår = vilkår.find(v => v.vilkarType === ung_kodeverk_vilkår_VilkårType.BOSTEDSVILKÅR);
  const andreLivsoppholdytelserAp = aksjonspunkter.find(
    ap => ap.definisjon === AksjonspunktDefinisjon.VURDER_ANDRE_LIVSOPPHOLDSYTELSER,
  );
  const andreLivsoppholdytelserVilkår = vilkår.find(
    v => v.vilkarType === ung_kodeverk_vilkår_VilkårType.ANDRE_LIVSOPPHOLDSYTELSER_VILKÅR,
  );

  const [aktivTab, setAktivTab] = useState<InngangsvilkårTab>(utledAktivTab(aksjonspunkter));

  useEffect(() => {
    setAktivTab(utledAktivTab(aksjonspunkter));
  }, [aksjonspunkter]);

  return (
    <VStack gap="space-20">
      <Heading size="medium" level="2">
        Inngangsvilkår
      </Heading>
      <Tabs value={aktivTab} onChange={value => setAktivTab(value as InngangsvilkårTab)}>
        <Tabs.List>
          <Tabs.Tab
            value={InngangsvilkårTab.SØKNADSFRIST}
            label="Søknadsfrist"
            icon={tabIcon(søknadsfristAp, søknadsfristVilkår)}
          />
          <Tabs.Tab value={InngangsvilkårTab.ALDER} label="Alder" icon={tabIcon(undefined, alderVilkår)} />
          <Tabs.Tab
            value={InngangsvilkårTab.BOSATT_I_TRONDHEIM}
            label="Bosatt i Trondheim"
            icon={tabIcon(bostedAp, bostedVilkår)}
          />
          <Tabs.Tab
            value={InngangsvilkårTab.ANDRE_LIVSOPPHOLDYTELSER}
            label="Andre livsoppholdytelser"
            icon={tabIcon(andreLivsoppholdytelserAp, andreLivsoppholdytelserVilkår)}
          />
          <Tabs.Tab
            value={InngangsvilkårTab.BEHOV_FOR_BISTAND}
            label="Behov for bistand"
            icon={tabIcon(vurderBistandsvilkårAp)}
          />
          {lokalkontorBeslutterAp && (
            <Tabs.Tab value={InngangsvilkårTab.BESLUTTER} label="Beslutter" icon={tabIcon(lokalkontorBeslutterAp)} />
          )}
        </Tabs.List>
        <Box marginBlock="space-20 space-0">
          <Tabs.Panel value={InngangsvilkårTab.SØKNADSFRIST}>
            {søknadsfristVilkår && <Søknadsfrist søknadsfristVilkår={søknadsfristVilkår} />}
          </Tabs.Panel>
          <Tabs.Panel value={InngangsvilkårTab.ALDER}>{alderVilkår && <Alder alderVilkår={alderVilkår} />}</Tabs.Panel>
          <Tabs.Panel value={InngangsvilkårTab.BOSATT_I_TRONDHEIM}>
            {bostedVilkår && (
              <Bosted
                bostedVilkår={bostedVilkår}
                bostedAp={bostedAp}
                readOnly={!kanSaksbehandle}
                api={api}
                behandling={behandling}
                onAksjonspunktBekreftet={onAksjonspunktBekreftet}
                isPermanentlyReadOnly={!!lokalkontorBeslutterAp}
              />
            )}
          </Tabs.Panel>
          <Tabs.Panel value={InngangsvilkårTab.ANDRE_LIVSOPPHOLDYTELSER}>
            {andreLivsoppholdytelserVilkår && (
              <AndreLivsoppholdytelser
                andreLivsoppholdytelserAp={andreLivsoppholdytelserAp}
                andreLivsoppholdytelserVilkår={andreLivsoppholdytelserVilkår}
                readOnly={!kanSaksbehandle}
                api={api}
                behandling={behandling}
                onAksjonspunktBekreftet={onAksjonspunktBekreftet}
                isPermanentlyReadOnly={!!lokalkontorBeslutterAp}
              />
            )}
          </Tabs.Panel>
          <Tabs.Panel value={InngangsvilkårTab.BEHOV_FOR_BISTAND}>
            {vurderBistandsvilkårVilkår && (
              <BehovForBistand
                vurderBistandsvilkårVilkår={vurderBistandsvilkårVilkår}
                vurderBistandsvilkårAp={vurderBistandsvilkårAp}
                lokalkontorForeslårVilkårAp={lokalkontorForeslårVilkårAp}
                api={api}
                behandling={behandling}
                onAksjonspunktBekreftet={onAksjonspunktBekreftet}
                readOnly={!kanSaksbehandle}
                isPermanentlyReadOnly={!!lokalkontorBeslutterAp}
              />
            )}
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
                totrinnskontrollSkjermlenkeContext={totrinnskontrollSkjermlenkeContext}
              />
            </Tabs.Panel>
          )}
        </Box>
      </Tabs>
    </VStack>
  );
};
