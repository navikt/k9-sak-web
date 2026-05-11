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
import { useEffect, useMemo, useState } from 'react';
import type { AktivitetspengerApi } from '../aktivitetspenger-prosess/AktivitetspengerApi';
import { Alder } from './Alder';
import { AndreLivsoppholdytelser } from './AndreLivsoppholdytelser';
import { BehovForBistand } from './BehovForBistand';
import { Beslutter } from './Beslutter';
import { Bosted } from './Bosted';
import { Søknadsfrist } from './Søknadsfrist';
import { InngangsvilkårTab } from './types';
import { aksjonspunktErÅpent } from './utils/utils';

interface InngangsvilkårData {
  søknadsfristAp?: AksjonspunktDto;
  søknadsfristVilkår?: VilkårMedPerioderDto;
  alderVilkår?: VilkårMedPerioderDto;
  vurderBistandsvilkårAp?: AksjonspunktDto;
  vurderBistandsvilkårVilkår?: VilkårMedPerioderDto;
  lokalkontorForeslårVilkårAp?: AksjonspunktDto;
  lokalkontorBeslutterAp?: AksjonspunktDto;
  bostedAp?: AksjonspunktDto;
  bostedVilkår?: VilkårMedPerioderDto;
  andreLivsoppholdytelserAp?: AksjonspunktDto;
  andreLivsoppholdytelserVilkår?: VilkårMedPerioderDto;
}

const samleInngangsvilkårData = (
  aksjonspunkter: AksjonspunktDto[],
  vilkår: VilkårMedPerioderDto[],
): InngangsvilkårData => ({
  søknadsfristAp: aksjonspunkter.find(
    ap => ap.definisjon === AksjonspunktDefinisjon.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST,
  ),
  søknadsfristVilkår: vilkår.find(v => v.vilkarType === vilkarType.SØKNADSFRIST),
  alderVilkår: vilkår.find(v => v.vilkarType === vilkarType.ALDERSVILKÅR),
  vurderBistandsvilkårAp: aksjonspunkter.find(ap => ap.definisjon === AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR),
  vurderBistandsvilkårVilkår: vilkår.find(v => v.vilkarType === vilkarType.BISTANDSVILKÅR),
  lokalkontorForeslårVilkårAp: aksjonspunkter.find(
    ap => ap.definisjon === AksjonspunktDefinisjon.LOKALKONTOR_FORESLÅR_VILKÅR,
  ),
  lokalkontorBeslutterAp: aksjonspunkter.find(
    ap => ap.definisjon === AksjonspunktDefinisjon.LOKALKONTOR_BESLUTTER_VILKÅR,
  ),
  bostedAp: aksjonspunkter.find(ap => ap.definisjon === AksjonspunktDefinisjon.VURDER_BOSTEDVILKÅR),
  bostedVilkår: vilkår.find(v => v.vilkarType === vilkarType.BOSTEDSVILKÅR),
  andreLivsoppholdytelserAp: aksjonspunkter.find(
    ap => ap.definisjon === AksjonspunktDefinisjon.VURDER_ANDRE_LIVSOPPHOLDSYTELSER,
  ),
  andreLivsoppholdytelserVilkår: vilkår.find(v => v.vilkarType === vilkarType.ANDRE_LIVSOPPHOLDSYTELSER_VILKÅR),
});

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

const utledAktivTab = (data: InngangsvilkårData) => {
  // Prioriter åpne aksjonspunkter som krever handling
  if (data.bostedAp?.status === AksjonspunktStatus.OPPRETTET) {
    return InngangsvilkårTab.BOSATT_I_TRONDHEIM;
  }
  if (data.andreLivsoppholdytelserAp?.status === AksjonspunktStatus.OPPRETTET) {
    return InngangsvilkårTab.ANDRE_LIVSOPPHOLDYTELSER;
  }
  if (data.lokalkontorBeslutterAp?.status === AksjonspunktStatus.OPPRETTET) {
    return InngangsvilkårTab.BESLUTTER;
  }

  // Håndter avslag-flow: hvis bosted eller andre livsoppholdytelser er avslått,
  // vis den sluttførte fanen hvis ingen videre vilkår skal behandles
  if (data.lokalkontorForeslårVilkårAp) {
    if (data.bostedAp?.status === AksjonspunktStatus.UTFØRT && !data.andreLivsoppholdytelserAp) {
      return InngangsvilkårTab.BOSATT_I_TRONDHEIM;
    }
    if (data.andreLivsoppholdytelserAp?.status === AksjonspunktStatus.UTFØRT && !data.vurderBistandsvilkårAp) {
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

  const inngangsvilkårdata = useMemo(() => samleInngangsvilkårData(aksjonspunkter, vilkår), [aksjonspunkter, vilkår]);

  const [aktivTab, setAktivTab] = useState<InngangsvilkårTab>(utledAktivTab(inngangsvilkårdata));

  useEffect(() => {
    setAktivTab(utledAktivTab(inngangsvilkårdata));
  }, [inngangsvilkårdata]);

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
            icon={tabIcon(inngangsvilkårdata.søknadsfristAp, inngangsvilkårdata.søknadsfristVilkår)}
          />
          <Tabs.Tab
            value={InngangsvilkårTab.ALDER}
            label="Alder"
            icon={tabIcon(undefined, inngangsvilkårdata.alderVilkår)}
          />
          <Tabs.Tab
            value={InngangsvilkårTab.BOSATT_I_TRONDHEIM}
            label="Bosatt i Trondheim"
            icon={tabIcon(inngangsvilkårdata.bostedAp, inngangsvilkårdata.bostedVilkår)}
          />
          <Tabs.Tab
            value={InngangsvilkårTab.ANDRE_LIVSOPPHOLDYTELSER}
            label="Andre livsoppholdytelser"
            icon={tabIcon(
              inngangsvilkårdata.andreLivsoppholdytelserAp,
              inngangsvilkårdata.andreLivsoppholdytelserVilkår,
            )}
          />
          <Tabs.Tab
            value={InngangsvilkårTab.BEHOV_FOR_BISTAND}
            label="Behov for bistand"
            icon={tabIcon(inngangsvilkårdata.vurderBistandsvilkårAp, inngangsvilkårdata.vurderBistandsvilkårVilkår)}
          />
          {inngangsvilkårdata.lokalkontorBeslutterAp &&
            aksjonspunktErÅpent(inngangsvilkårdata.lokalkontorBeslutterAp) && (
              <Tabs.Tab
                value={InngangsvilkårTab.BESLUTTER}
                label="Beslutter"
                icon={kanBeslutte ? tabIcon(inngangsvilkårdata.lokalkontorBeslutterAp) : undefined}
              />
            )}
        </Tabs.List>
        <Box marginBlock="space-20 space-0">
          <Tabs.Panel value={InngangsvilkårTab.SØKNADSFRIST}>
            {inngangsvilkårdata.søknadsfristVilkår && (
              <Søknadsfrist søknadsfristVilkår={inngangsvilkårdata.søknadsfristVilkår} />
            )}
          </Tabs.Panel>
          <Tabs.Panel value={InngangsvilkårTab.ALDER}>
            {inngangsvilkårdata.alderVilkår && <Alder alderVilkår={inngangsvilkårdata.alderVilkår} />}
          </Tabs.Panel>
          <Tabs.Panel value={InngangsvilkårTab.BOSATT_I_TRONDHEIM}>
            {inngangsvilkårdata.bostedVilkår && (
              <Bosted
                bostedVilkår={inngangsvilkårdata.bostedVilkår}
                bostedAp={inngangsvilkårdata.bostedAp}
                lokalkontorForeslårVilkårAp={inngangsvilkårdata.lokalkontorForeslårVilkårAp}
                readOnly={!kanSaksbehandle}
                api={api}
                behandling={behandling}
                onAksjonspunktBekreftet={onAksjonspunktBekreftet}
                isPermanentlyReadOnly={!!inngangsvilkårdata.lokalkontorBeslutterAp}
              />
            )}
          </Tabs.Panel>
          <Tabs.Panel value={InngangsvilkårTab.ANDRE_LIVSOPPHOLDYTELSER}>
            {inngangsvilkårdata.andreLivsoppholdytelserVilkår && (
              <AndreLivsoppholdytelser
                andreLivsoppholdytelserAp={inngangsvilkårdata.andreLivsoppholdytelserAp}
                lokalkontorForeslårVilkårAp={inngangsvilkårdata.lokalkontorForeslårVilkårAp}
                andreLivsoppholdytelserVilkår={inngangsvilkårdata.andreLivsoppholdytelserVilkår}
                readOnly={!kanSaksbehandle}
                api={api}
                behandling={behandling}
                onAksjonspunktBekreftet={onAksjonspunktBekreftet}
                isPermanentlyReadOnly={!!inngangsvilkårdata.lokalkontorBeslutterAp}
              />
            )}
          </Tabs.Panel>
          <Tabs.Panel value={InngangsvilkårTab.BEHOV_FOR_BISTAND}>
            {inngangsvilkårdata.vurderBistandsvilkårVilkår && (
              <BehovForBistand
                vurderBistandsvilkårVilkår={inngangsvilkårdata.vurderBistandsvilkårVilkår}
                vurderBistandsvilkårAp={inngangsvilkårdata.vurderBistandsvilkårAp}
                lokalkontorForeslårVilkårAp={inngangsvilkårdata.lokalkontorForeslårVilkårAp}
                api={api}
                behandling={behandling}
                onAksjonspunktBekreftet={onAksjonspunktBekreftet}
                readOnly={!kanSaksbehandle}
                isPermanentlyReadOnly={!!inngangsvilkårdata.lokalkontorBeslutterAp}
              />
            )}
          </Tabs.Panel>
          {inngangsvilkårdata.lokalkontorBeslutterAp && (
            <Tabs.Panel value={InngangsvilkårTab.BESLUTTER}>
              <Beslutter
                lokalkontorBeslutterAp={inngangsvilkårdata.lokalkontorBeslutterAp}
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
