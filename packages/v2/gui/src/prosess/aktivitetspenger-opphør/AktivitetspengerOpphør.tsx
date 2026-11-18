import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { BehandlingStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/BehandlingStatus.js';
import type { BehandlingÅrsakType } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/BehandlingÅrsakType.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { BehandlingOperasjonerDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingOperasjonerDto.js';
import type { InnloggetAnsattUngV2Dto } from '@k9-sak-web/backend/ungsak/kontrakt/nav-ansatt/InnloggetAnsattUngV2Dto.js';
import type { TotrinnskontrollSkjermlenkeContextDto } from '@k9-sak-web/backend/ungsak/kontrakt/vedtak/TotrinnskontrollSkjermlenkeContextDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import { Box, Heading, Tabs, VStack } from '@navikt/ds-react';
import { useEffect, useMemo, useState } from 'react';
import { CustomCheckmarkIcon } from '../../shared/icons/CustomCheckmarkIcon.js';
import { CustomErrorIcon } from '../../shared/icons/CustomErrorIcon.js';
import { CustomWarningIcon } from '../../shared/icons/CustomWarningIcon.js';
import type { AktivitetspengerApi } from '../aktivitetspenger-prosess/AktivitetspengerApi.js';
import { BeslutterOpphør } from './beslutter/BeslutterOpphør.js';
import { OpphørVilkårsvurdering } from './OpphørVilkårsvurdering.js';
import { opphørsvilkår, type OpphørsvilkårOppsett } from './opphørsvilkår.js';
import { OpphørTab } from './types.js';

interface Opphørsvilkår {
  oppsett: OpphørsvilkårOppsett;
  vilkår?: VilkårMedPerioderDto;
  vurderFaktaAP?: AksjonspunktDto;
  vurderVilkårAP?: AksjonspunktDto;
}

interface OpphørData {
  /** Bare opphørsvilkårene som gjelder behandlingsårsakene. */
  opphørsvilkår: Opphørsvilkår[];
  lokalkontorForeslårVilkårAP?: AksjonspunktDto;
  lokalkontorBeslutterAP?: AksjonspunktDto;
}

const erOpphørForBehandlingsårsak = (
  behandlingÅrsaker: BehandlingDto['behandlingÅrsaker'] | undefined,
  type: BehandlingÅrsakType,
): boolean => behandlingÅrsaker?.some(årsak => årsak.behandlingArsakType === type) ?? false;

export const samleOpphørData = (
  aksjonspunkter: AksjonspunktDto[],
  vilkår: VilkårMedPerioderDto[],
  behandlingÅrsaker: BehandlingDto['behandlingÅrsaker'] | undefined,
): OpphørData => ({
  opphørsvilkår: opphørsvilkår
    .filter(oppsett => erOpphørForBehandlingsårsak(behandlingÅrsaker, oppsett.behandlingÅrsak))
    .map(oppsett => ({
      oppsett,
      vilkår: vilkår.find(v => v.vilkarType === oppsett.vilkårsvurdering.vilkårType),
      vurderFaktaAP: aksjonspunkter.find(ap => ap.definisjon === oppsett.faktaAksjonspunktKode),
      vurderVilkårAP: aksjonspunkter.find(ap => ap.definisjon === oppsett.vilkårsvurdering.aksjonspunktKode),
    })),
  lokalkontorForeslårVilkårAP: aksjonspunkter.find(
    ap => ap.definisjon === AksjonspunktDefinisjon.NAV_KONTOR_FORESLÅR_VILKÅR,
  ),
  lokalkontorBeslutterAP: aksjonspunkter.find(
    ap => ap.definisjon === AksjonspunktDefinisjon.NAV_KONTOR_BESLUTTER_VILKÅR,
  ),
});

const tabIcon = (ap?: AksjonspunktDto, vilkår?: VilkårMedPerioderDto) => {
  if (!ap) return undefined;
  if (ap.status === AksjonspunktStatus.OPPRETTET) {
    return <CustomWarningIcon />;
  }
  if (ap.status === AksjonspunktStatus.UTFØRT) {
    return <CustomCheckmarkIcon />;
  }
  if (vilkår?.perioder?.every(p => p.vilkarStatus === 'OPPFYLT')) {
    return <CustomCheckmarkIcon />;
  }
  if (vilkår?.perioder?.every(p => p.vilkarStatus === 'IKKE_OPPFYLT')) {
    return <CustomErrorIcon />;
  }
  return undefined;
};

export const utledVilkårForBehandlingsårsak = (data: OpphørData): VilkårMedPerioderDto | undefined =>
  data.opphørsvilkår.find(({ vilkår }) => vilkår)?.vilkår;

export const utledAktivTab = (data: OpphørData): OpphørTab => {
  if (data.opphørsvilkår.some(({ vurderFaktaAP }) => vurderFaktaAP?.status === AksjonspunktStatus.OPPRETTET)) {
    return OpphørTab.ÅRSAK_OG_VARSEL;
  }
  if (data.opphørsvilkår.some(({ vurderVilkårAP }) => vurderVilkårAP?.status === AksjonspunktStatus.OPPRETTET)) {
    return OpphørTab.VILKÅRSVURDERING;
  }
  if (data.lokalkontorBeslutterAP?.status === AksjonspunktStatus.OPPRETTET) {
    return OpphørTab.BESLUTTER;
  }
  if (data.lokalkontorForeslårVilkårAP) {
    return OpphørTab.VILKÅRSVURDERING;
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
    !!lovligeBehandlingsoperasjoner.behandlingTilGodkjenningVedNavKontor;

  const opphørData = useMemo(
    () => samleOpphørData(aksjonspunkter, vilkår, behandling.behandlingÅrsaker),
    [aksjonspunkter, vilkår, behandling.behandlingÅrsaker],
  );
  const {
    opphørsvilkår: opphørsvilkårForBehandlingen,
    lokalkontorForeslårVilkårAP,
    lokalkontorBeslutterAP,
  } = opphørData;
  const faktaAPForTab = opphørsvilkårForBehandlingen.find(({ vurderFaktaAP }) => vurderFaktaAP)?.vurderFaktaAP;
  const vilkårsvurderingAPForTab =
    lokalkontorForeslårVilkårAP ??
    opphørsvilkårForBehandlingen.find(({ vurderVilkårAP }) => vurderVilkårAP)?.vurderVilkårAP;
  const harBeslutterAP = !!lokalkontorBeslutterAP;
  const visBeslutterTab = lokalkontorBeslutterAP?.status === AksjonspunktStatus.OPPRETTET;
  const behandlingErAvsluttet = behandling.status === BehandlingStatus.AVSLUTTET;
  const [aktivTab, setAktivTab] = useState<OpphørTab>(utledAktivTab(opphørData));
  const vilkårForBehandlingsårsak = utledVilkårForBehandlingsårsak(opphørData);
  const vurdertVilkårsperiodeFom = vilkårForBehandlingsårsak?.perioder?.find(p => p.vurderesIBehandlingen)?.periode.fom;

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
            icon={tabIcon(faktaAPForTab, vilkårForBehandlingsårsak)}
          />
          <Tabs.Tab
            value={OpphørTab.VILKÅRSVURDERING}
            label="Vilkårsvurdering"
            icon={tabIcon(vilkårsvurderingAPForTab, vilkårForBehandlingsårsak)}
          />
          {visBeslutterTab && (
            <Tabs.Tab
              value={OpphørTab.BESLUTTER}
              label="Beslutter"
              icon={kanBeslutte ? tabIcon(lokalkontorBeslutterAP) : undefined}
            />
          )}
        </Tabs.List>
        <Box marginBlock="space-20 space-0">
          <Tabs.Panel value={OpphørTab.ÅRSAK_OG_VARSEL}>
            {opphørsvilkårForBehandlingen.map(
              ({ oppsett, vilkår: vilkårForOppsett, vurderFaktaAP }) =>
                vilkårForOppsett && (
                  <oppsett.årsakOgVarsel
                    key={oppsett.faktaAksjonspunktKode}
                    vurderFaktaAP={vurderFaktaAP}
                    vilkår={vilkårForOppsett}
                    api={api}
                    behandling={behandling}
                    onAksjonspunktBekreftet={onAksjonspunktBekreftet}
                    readOnly={!kanSaksbehandle}
                    isPermanentlyReadOnly={behandlingErAvsluttet || harBeslutterAP}
                  />
                ),
            )}
          </Tabs.Panel>
          <Tabs.Panel value={OpphørTab.VILKÅRSVURDERING}>
            {opphørsvilkårForBehandlingen.map(
              ({ oppsett, vilkår: vilkårForOppsett, vurderVilkårAP }) =>
                vilkårForOppsett && (
                  <OpphørVilkårsvurdering
                    key={oppsett.faktaAksjonspunktKode}
                    oppsett={oppsett.vilkårsvurdering}
                    vurderVilkårAP={vurderVilkårAP}
                    api={api}
                    behandling={behandling}
                    onAksjonspunktBekreftet={onAksjonspunktBekreftet}
                    readOnly={!kanSaksbehandle || !!behandling.behandlingPåVent}
                    isPermanentlyReadOnly={behandlingErAvsluttet || harBeslutterAP}
                    lokalkontorForeslårVilkårAP={lokalkontorForeslårVilkårAP}
                    lokalkontorBeslutterAP={lokalkontorBeslutterAP}
                  />
                ),
            )}
          </Tabs.Panel>
          {visBeslutterTab && lokalkontorBeslutterAP && (
            <Tabs.Panel value={OpphørTab.BESLUTTER}>
              <BeslutterOpphør
                lokalkontorBeslutterAP={lokalkontorBeslutterAP}
                api={api}
                behandling={behandling}
                onTabChange={setAktivTab}
                onAksjonspunktBekreftet={onAksjonspunktBekreftet}
                totrinnskontrollSkjermlenkeContext={totrinnskontrollSkjermlenkeContext}
                kanBeslutte={kanBeslutte}
                vilkårsperiodeFom={vurdertVilkårsperiodeFom}
              />
            </Tabs.Panel>
          )}
        </Box>
      </Tabs>
    </VStack>
  );
};
