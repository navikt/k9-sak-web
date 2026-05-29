import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
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
import type { AktivitetspengerApi } from '../aktivitetspenger-prosess/AktivitetspengerApi.js';
import { BeslutterOpphør } from './BeslutterOpphør.js';
import { OpphørTab } from './types.js';
import { AarsakOgVarsel as ÅrsakOgVarsel } from './ÅrsakOgVarsel.js';

interface OpphørData {
  vurderBostedAp?: AksjonspunktDto;
  lokalkontorForeslårVilkårAp?: AksjonspunktDto;
  lokalkontorBeslutterAp?: AksjonspunktDto;
  bostedVilkår?: VilkårMedPerioderDto;
}

const samleOpphørData = (aksjonspunkter: AksjonspunktDto[], vilkår: VilkårMedPerioderDto[]): OpphørData => ({
  vurderBostedAp: aksjonspunkter.find(ap => ap.definisjon === AksjonspunktDefinisjon.VURDER_FAKTA_OM_BOSTED),
  lokalkontorForeslårVilkårAp: aksjonspunkter.find(
    ap => ap.definisjon === AksjonspunktDefinisjon.LOKALKONTOR_FORESLÅR_VILKÅR,
  ),
  lokalkontorBeslutterAp: aksjonspunkter.find(
    ap => ap.definisjon === AksjonspunktDefinisjon.LOKALKONTOR_BESLUTTER_VILKÅR,
  ),
  bostedVilkår: vilkår.find(v => v.vilkarType === vilkarType.BOSTEDSVILKÅR),
});

const CustomCheckmarkIcon = () => <CheckmarkIcon style={{ color: 'var(--ax-text-accent-subtle)' }} />;
const CustomWarningIcon = () => (
  <ExclamationmarkTriangleFillIcon fontSize={24} color="var(--ax-text-warning-decoration)" />
);

const tabIcon = (ap?: AksjonspunktDto, vilkår?: VilkårMedPerioderDto) => {
  if (!ap && !vilkår) return undefined;
  if (ap?.status === AksjonspunktStatus.OPPRETTET) {
    return <CustomWarningIcon />;
  }
  if (ap?.status === AksjonspunktStatus.UTFØRT) {
    return <CustomCheckmarkIcon />;
  }
  if (vilkår?.perioder?.every(p => p.vilkarStatus === 'OPPFYLT')) {
    return <CustomCheckmarkIcon />;
  }
  if (vilkår?.perioder?.every(p => p.vilkarStatus === 'IKKE_OPPFYLT')) {
    return <XMarkOctagonFillIcon fontSize={24} color="var(--ax-bg-danger-strong)" />;
  }
  return undefined;
};

const utledAktivTab = (data: OpphørData): OpphørTab => {
  if (data.vurderBostedAp?.status === AksjonspunktStatus.OPPRETTET) {
    return OpphørTab.ÅRSAK_OG_VARSEL;
  }
  if (data.lokalkontorBeslutterAp?.status === AksjonspunktStatus.OPPRETTET) {
    return OpphørTab.BESLUTTER;
  }
  return OpphørTab.ÅRSAK_OG_VARSEL;
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

export const AktivitetspengerOpphør = ({
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

  const opphørData = useMemo(() => samleOpphørData(aksjonspunkter, vilkår), [aksjonspunkter, vilkår]);

  const [aktivTab, setAktivTab] = useState<OpphørTab>(utledAktivTab(opphørData));

  useEffect(() => {
    setAktivTab(utledAktivTab(opphørData));
  }, [opphørData]);

  return (
    <VStack gap="space-20">
      <Heading size="medium" level="2">
        Opphør
      </Heading>
      <Tabs value={aktivTab} onChange={value => setAktivTab(value as OpphørTab)}>
        <Tabs.List>
          <Tabs.Tab
            value={OpphørTab.ÅRSAK_OG_VARSEL}
            label="Årsak og varsel"
            icon={tabIcon(opphørData.vurderBostedAp, opphørData.bostedVilkår)}
          />
          <Tabs.Tab value={OpphørTab.VILKÅRSVURDERING} label="Vilkårsvurdering" />
          {opphørData.lokalkontorBeslutterAp &&
            opphørData.lokalkontorBeslutterAp.status === AksjonspunktStatus.OPPRETTET && (
              <Tabs.Tab
                value={OpphørTab.BESLUTTER}
                label="Beslutter"
                icon={kanBeslutte ? tabIcon(opphørData.lokalkontorBeslutterAp) : undefined}
              />
            )}
        </Tabs.List>
        <Box marginBlock="space-20 space-0">
          <Tabs.Panel value={OpphørTab.ÅRSAK_OG_VARSEL}>
            {opphørData.bostedVilkår && (
              <ÅrsakOgVarsel
                vurderBostedAp={opphørData.vurderBostedAp}
                bostedVilkår={opphørData.bostedVilkår}
                api={api}
                behandling={behandling}
                onAksjonspunktBekreftet={onAksjonspunktBekreftet}
                readOnly={!kanSaksbehandle}
                isPermanentlyReadOnly={!!opphørData.lokalkontorBeslutterAp}
              />
            )}
          </Tabs.Panel>
          <Tabs.Panel value={OpphørTab.VILKÅRSVURDERING}>
            <Box padding="space-16">
              <Heading size="small" level="3">
                Vilkårsvurdering
              </Heading>
            </Box>
          </Tabs.Panel>
          {opphørData.lokalkontorBeslutterAp && (
            <Tabs.Panel value={OpphørTab.BESLUTTER}>
              <BeslutterOpphør
                lokalkontorBeslutterAp={opphørData.lokalkontorBeslutterAp}
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
