import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import { vilkarType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { BehandlingOperasjonerDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingOperasjonerDto.js';
import type { InnloggetAnsattUngV2Dto } from '@k9-sak-web/backend/ungsak/kontrakt/nav-ansatt/InnloggetAnsattUngV2Dto.js';
import type { TotrinnskontrollSkjermlenkeContextDto } from '@k9-sak-web/backend/ungsak/kontrakt/vedtak/TotrinnskontrollSkjermlenkeContextDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import { CheckmarkIcon, ExclamationmarkTriangleFillIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
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
import { aksjonspunktErÅpent } from './utils/utils';

const CustomCheckmarkIcon = () => <CheckmarkIcon style={{ color: 'var(--ax-text-accent-subtle)' }} />;
const CustomWarningIcon = () => (
  <ExclamationmarkTriangleFillIcon fontSize={24} color="var(--ax-text-warning-decoration)" />
);

const tabIcon = (ap?: AksjonspunktDto | undefined, vilkår?: VilkårMedPerioderDto) => {
  if (!ap && !vilkår) return undefined;
  if (ap) {
    if (aksjonspunktErÅpent(ap)) {
      return <CustomWarningIcon />;
    }
  }
  if (vilkår?.perioder?.every(p => p.vilkarStatus === Utfall.OPPFYLT)) {
    return <CustomCheckmarkIcon />;
  }
  if (vilkår?.perioder?.every(p => p.vilkarStatus === Utfall.IKKE_OPPFYLT)) {
    return <XMarkOctagonFillIcon fontSize={24} color="var(--ax-bg-danger-strong)" />;
  }
  return undefined;
};

const utledAktivTab = (aksjonspunkter: AksjonspunktDto[]) => {
  // Samle alle aksjonspunkter på toppen for effektivitet
  const bostedAp = aksjonspunkter.find(ap => ap.definisjon === AksjonspunktDefinisjon.VURDER_BOSTED);
  const andreLivsoppholdytelserAp = aksjonspunkter.find(
    ap => ap.definisjon === AksjonspunktDefinisjon.VURDER_ANDRE_LIVSOPPHOLDSYTELSER,
  );
  const vurderBistandsvilkårAp = aksjonspunkter.find(
    ap => ap.definisjon === AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR,
  );
  const lokalkontorForeslårVilkårAp = aksjonspunkter.find(
    ap => ap.definisjon === AksjonspunktDefinisjon.LOKALKONTOR_FORESLÅR_VILKÅR,
  );
  const lokalkontorBeslutterAp = aksjonspunkter.find(
    ap => ap.definisjon === AksjonspunktDefinisjon.LOKALKONTOR_BESLUTTER_VILKÅR,
  );

  // Prioriter åpne aksjonspunkter som krever handling
  if (bostedAp?.status === AksjonspunktStatus.OPPRETTET) {
    return InngangsvilkårTab.BOSATT_I_TRONDHEIM;
  }
  if (andreLivsoppholdytelserAp?.status === AksjonspunktStatus.OPPRETTET) {
    return InngangsvilkårTab.ANDRE_LIVSOPPHOLDYTELSER;
  }
  if (lokalkontorBeslutterAp?.status === AksjonspunktStatus.OPPRETTET) {
    return InngangsvilkårTab.BESLUTTER;
  }

  // Håndter avslag-flow: hvis bosted eller andre livsoppholdytelser er avslått,
  // vis den sluttførte fanen hvis ingen videre vilkår skal behandles
  if (lokalkontorForeslårVilkårAp) {
    if (bostedAp?.status === AksjonspunktStatus.UTFØRT && !andreLivsoppholdytelserAp) {
      return InngangsvilkårTab.BOSATT_I_TRONDHEIM;
    }
    if (andreLivsoppholdytelserAp?.status === AksjonspunktStatus.UTFØRT && !vurderBistandsvilkårAp) {
      return InngangsvilkårTab.ANDRE_LIVSOPPHOLDYTELSER;
    }
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
  lovligeBehandlingsoperasjoner: BehandlingOperasjonerDto;
}

export const AktivitetspengerInngangsvilkår = ({
  aksjonspunkter,
  innloggetBruker,
  api,
  behandling,
  onAksjonspunktBekreftet,
  vilkår,
  totrinnskontrollSkjermlenkeContext,
  lovligeBehandlingsoperasjoner,
}: Props) => {
  const kanSaksbehandle = !!innloggetBruker.aktivitetspengerDel1SaksbehandlerTilgang?.kanSaksbehandle;
  const kanBeslutte =
    !!innloggetBruker.aktivitetspengerDel1SaksbehandlerTilgang?.kanBeslutte &&
    !!lovligeBehandlingsoperasjoner.behandlingTilGodkjenningVedLokalkontor;
  const søknadsfristAp = aksjonspunkter.find(
    ap => ap.definisjon === AksjonspunktDefinisjon.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST,
  );
  const søknadsfristVilkår = vilkår.find(v => v.vilkarType === vilkarType.SØKNADSFRIST);
  const alderVilkår = vilkår.find(v => v.vilkarType === vilkarType.ALDERSVILKÅR);
  const vurderBistandsvilkårAp = aksjonspunkter.find(
    ap => ap.definisjon === AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR,
  );
  const vurderBistandsvilkårVilkår = vilkår.find(v => v.vilkarType === vilkarType.BISTANDSVILKÅR);
  const lokalkontorForeslårVilkårAp = aksjonspunkter.find(
    ap => ap.definisjon === AksjonspunktDefinisjon.LOKALKONTOR_FORESLÅR_VILKÅR,
  );
  const lokalkontorBeslutterAp = aksjonspunkter.find(
    ap => ap.definisjon === AksjonspunktDefinisjon.LOKALKONTOR_BESLUTTER_VILKÅR,
  );
  const bostedAp = aksjonspunkter.find(ap => ap.definisjon === AksjonspunktDefinisjon.VURDER_BOSTED);
  const bostedVilkår = vilkår.find(v => v.vilkarType === vilkarType.BOSTEDSVILKÅR);
  const andreLivsoppholdytelserAp = aksjonspunkter.find(
    ap => ap.definisjon === AksjonspunktDefinisjon.VURDER_ANDRE_LIVSOPPHOLDSYTELSER,
  );
  const andreLivsoppholdytelserVilkår = vilkår.find(v => v.vilkarType === vilkarType.ANDRE_LIVSOPPHOLDSYTELSER_VILKÅR);

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
            icon={tabIcon(vurderBistandsvilkårAp, vurderBistandsvilkårVilkår)}
          />
          {lokalkontorBeslutterAp && aksjonspunktErÅpent(lokalkontorBeslutterAp) && (
            <Tabs.Tab
              value={InngangsvilkårTab.BESLUTTER}
              label="Beslutter"
              icon={kanBeslutte ? tabIcon(lokalkontorBeslutterAp) : undefined}
            />
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
                lokalkontorForeslårVilkårAp={lokalkontorForeslårVilkårAp}
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
                lokalkontorForeslårVilkårAp={lokalkontorForeslårVilkårAp}
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
                api={api}
                behandling={behandling}
                onTabChange={setAktivTab}
                onAksjonspunktBekreftet={onAksjonspunktBekreftet}
                totrinnskontrollSkjermlenkeContext={totrinnskontrollSkjermlenkeContext}
                kanBeslutte={kanBeslutte}
              />
            </Tabs.Panel>
          )}
        </Box>
      </Tabs>
    </VStack>
  );
};
