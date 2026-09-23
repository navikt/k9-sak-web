import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { BehandlingStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/BehandlingStatus.js';
import { BehandlingÅrsakType } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/BehandlingÅrsakType.js';
import { vilkarType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { BehandlingOperasjonerDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingOperasjonerDto.js';
import type { InnloggetAnsattUngV2Dto } from '@k9-sak-web/backend/ungsak/kontrakt/nav-ansatt/InnloggetAnsattUngV2Dto.js';
import type { TotrinnskontrollSkjermlenkeContextDto } from '@k9-sak-web/backend/ungsak/kontrakt/vedtak/TotrinnskontrollSkjermlenkeContextDto.js';
import type { BostedGrunnlagResponseDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/bosted/BostedGrunnlagResponseDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import { Box, Heading, Tabs, VStack } from '@navikt/ds-react';
import { useEffect, useMemo, useState } from 'react';
import { CustomCheckmarkIcon } from '../../shared/icons/CustomCheckmarkIcon.js';
import { CustomErrorIcon } from '../../shared/icons/CustomErrorIcon.js';
import { CustomWarningIcon } from '../../shared/icons/CustomWarningIcon.js';
import type { AktivitetspengerApi } from '../aktivitetspenger-prosess/AktivitetspengerApi.js';
import { AndreLivsoppholdytelserVilkårsvurdering } from './andre-livsoppholdytelser/AndreLivsoppholdytelserVilkårsvurdering.js';
import { AndreLivsoppholdytelserÅrsakOgVarsel } from './andre-livsoppholdytelser/AndreLivsoppholdytelserÅrsakOgVarsel.js';
import { BeslutterOpphør } from './beslutter/BeslutterOpphør.js';
import { BostedVilkårsvurdering } from './bosted/BostedVilkårsvurdering.js';
import { BostedÅrsakOgVarsel } from './bosted/BostedÅrsakOgVarsel.js';
import { OpphørTab } from './types.js';

interface OpphørData {
  vurderBostedFaktaAP?: AksjonspunktDto;
  vurderAndreLivsoppholdytelserFaktaAP?: AksjonspunktDto;
  vurderBostedVilkårAP?: AksjonspunktDto;
  vurderAndreLivsoppholdytelserVilkårAP?: AksjonspunktDto;
  lokalkontorForeslårVilkårAP?: AksjonspunktDto;
  lokalkontorBeslutterAP?: AksjonspunktDto;
  bostedVilkår?: VilkårMedPerioderDto;
  andreLivsoppholdytelserVilkår?: VilkårMedPerioderDto;
}

const samleOpphørData = (aksjonspunkter: AksjonspunktDto[], vilkår: VilkårMedPerioderDto[]): OpphørData => ({
  bostedVilkår: vilkår.find(v => v.vilkarType === vilkarType.BOSTEDSVILKÅR),
  vurderBostedFaktaAP: aksjonspunkter.find(ap => ap.definisjon === AksjonspunktDefinisjon.VURDER_FAKTA_OM_BOSTED),
  vurderBostedVilkårAP: aksjonspunkter.find(ap => ap.definisjon === AksjonspunktDefinisjon.VURDER_BOSTEDSVILKÅR_OPPHØR),
  andreLivsoppholdytelserVilkår: vilkår.find(v => v.vilkarType === vilkarType.ANDRE_LIVSOPPHOLDSYTELSER_VILKÅR),
  vurderAndreLivsoppholdytelserFaktaAP: aksjonspunkter.find(
    ap => ap.definisjon === AksjonspunktDefinisjon.VURDER_FAKTA_OM_ANDRE_LIVSOPPHOLDSYTELSER,
  ),
  vurderAndreLivsoppholdytelserVilkårAP: aksjonspunkter.find(
    ap => ap.definisjon === AksjonspunktDefinisjon.VURDER_ANDRE_LIVSOPPHOLDSYTELSER_OPPHØR,
  ),
  lokalkontorForeslårVilkårAP: aksjonspunkter.find(
    ap => ap.definisjon === AksjonspunktDefinisjon.LOKALKONTOR_FORESLÅR_VILKÅR,
  ),
  lokalkontorBeslutterAP: aksjonspunkter.find(
    ap => ap.definisjon === AksjonspunktDefinisjon.LOKALKONTOR_BESLUTTER_VILKÅR,
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

const erOpphørForBehandlingsårsak = (
  behandlingÅrsaker: BehandlingDto['behandlingÅrsaker'] | undefined,
  type: BehandlingÅrsakType,
): boolean => behandlingÅrsaker?.some(årsak => årsak.behandlingArsakType === type) ?? false;

export const utledAktivTab = (data: OpphørData): OpphørTab => {
  if (data.vurderBostedFaktaAP?.status === AksjonspunktStatus.OPPRETTET) {
    return OpphørTab.ÅRSAK_OG_VARSEL;
  }
  if (data.vurderAndreLivsoppholdytelserFaktaAP?.status === AksjonspunktStatus.OPPRETTET) {
    return OpphørTab.ÅRSAK_OG_VARSEL;
  }
  if (data.vurderBostedVilkårAP?.status === AksjonspunktStatus.OPPRETTET) {
    return OpphørTab.VILKÅRSVURDERING;
  }
  if (data.vurderAndreLivsoppholdytelserVilkårAP?.status === AksjonspunktStatus.OPPRETTET) {
    return OpphørTab.VILKÅRSVURDERING;
  }
  if (data.lokalkontorForeslårVilkårAP) {
    return OpphørTab.VILKÅRSVURDERING;
  }
  if (data.lokalkontorBeslutterAP?.status === AksjonspunktStatus.OPPRETTET) {
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
  bostedGrunnlag: BostedGrunnlagResponseDto;
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
  bostedGrunnlag,
}: Props) => {
  const kanSaksbehandle = !!innloggetBruker.aktivitetspengerDel1SaksbehandlerTilgang?.kanSaksbehandle;
  const kanBeslutte =
    !!innloggetBruker.aktivitetspengerDel1SaksbehandlerTilgang?.kanBeslutte &&
    !!lovligeBehandlingsoperasjoner.behandlingTilGodkjenningVedLokalkontor;
  const isBehandlingsårsakBosted = erOpphørForBehandlingsårsak(
    behandling.behandlingÅrsaker,
    BehandlingÅrsakType.ENDRET_BOSTED,
  );
  const isBehandlingsårsakAndreLivsoppholdytelser = erOpphørForBehandlingsårsak(
    behandling.behandlingÅrsaker,
    BehandlingÅrsakType.ENDRET_LIVSOPPHOLDSYTELSE,
  );

  const opphørData = useMemo(() => samleOpphørData(aksjonspunkter, vilkår), [aksjonspunkter, vilkår]);

  const {
    vurderBostedFaktaAP,
    vurderAndreLivsoppholdytelserFaktaAP,
    vurderBostedVilkårAP,
    lokalkontorForeslårVilkårAP,
    lokalkontorBeslutterAP,
    bostedVilkår,
    andreLivsoppholdytelserVilkår,
    vurderAndreLivsoppholdytelserVilkårAP,
  } = opphørData;
  const vilkårsvurderingAPForTab =
    lokalkontorForeslårVilkårAP ?? vurderBostedVilkårAP ?? vurderAndreLivsoppholdytelserVilkårAP;
  const harBeslutterAP = !!lokalkontorBeslutterAP;
  const visBeslutterTab = lokalkontorBeslutterAP?.status === AksjonspunktStatus.OPPRETTET;
  const behandlingErAvsluttet = behandling.status === BehandlingStatus.AVSLUTTET;
  const [aktivTab, setAktivTab] = useState<OpphørTab>(utledAktivTab(opphørData));
  const gjeldendeVilkår = vurderBostedFaktaAP ? bostedVilkår : andreLivsoppholdytelserVilkår;

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
            icon={tabIcon(vurderBostedFaktaAP ?? vurderAndreLivsoppholdytelserFaktaAP, gjeldendeVilkår)}
          />
          <Tabs.Tab
            value={OpphørTab.VILKÅRSVURDERING}
            label="Vilkårsvurdering"
            icon={tabIcon(vilkårsvurderingAPForTab, gjeldendeVilkår)}
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
            {isBehandlingsårsakBosted && bostedVilkår && (
              <BostedÅrsakOgVarsel
                vurderBostedAP={vurderBostedFaktaAP}
                bostedVilkår={bostedVilkår}
                bostedGrunnlag={bostedGrunnlag}
                api={api}
                behandling={behandling}
                onAksjonspunktBekreftet={onAksjonspunktBekreftet}
                readOnly={!kanSaksbehandle}
                isPermanentlyReadOnly={behandlingErAvsluttet || harBeslutterAP}
              />
            )}
            {isBehandlingsårsakAndreLivsoppholdytelser && andreLivsoppholdytelserVilkår && (
              <AndreLivsoppholdytelserÅrsakOgVarsel
                vurderAndreLivsoppholdytelserFaktaAP={vurderAndreLivsoppholdytelserFaktaAP}
                andreLivsoppholdytelserVilkår={andreLivsoppholdytelserVilkår}
                api={api}
                behandling={behandling}
                onAksjonspunktBekreftet={onAksjonspunktBekreftet}
                readOnly={!kanSaksbehandle}
                isPermanentlyReadOnly={behandlingErAvsluttet || harBeslutterAP}
              />
            )}
          </Tabs.Panel>
          <Tabs.Panel value={OpphørTab.VILKÅRSVURDERING}>
            {bostedVilkår && isBehandlingsårsakBosted && (
              <BostedVilkårsvurdering
                vurderBostedVilkårAP={vurderBostedVilkårAP}
                bostedVilkår={bostedVilkår}
                api={api}
                behandling={behandling}
                onAksjonspunktBekreftet={onAksjonspunktBekreftet}
                readOnly={!kanSaksbehandle}
                isPermanentlyReadOnly={behandlingErAvsluttet || harBeslutterAP}
                bostedGrunnlag={bostedGrunnlag}
                lokalkontorForeslårVilkårAP={lokalkontorForeslårVilkårAP}
              />
            )}
            {andreLivsoppholdytelserVilkår && isBehandlingsårsakAndreLivsoppholdytelser && (
              <AndreLivsoppholdytelserVilkårsvurdering
                vurderAndreLivsoppholdytelserVilkårAP={vurderAndreLivsoppholdytelserVilkårAP}
                lokalkontorForeslårVilkårAP={lokalkontorForeslårVilkårAP}
                andreLivsoppholdytelserVilkår={andreLivsoppholdytelserVilkår}
                api={api}
                behandling={behandling}
                onAksjonspunktBekreftet={onAksjonspunktBekreftet}
                readOnly={!kanSaksbehandle}
                isPermanentlyReadOnly={behandlingErAvsluttet || harBeslutterAP}
              />
            )}
          </Tabs.Panel>
          {lokalkontorBeslutterAP && (
            <Tabs.Panel value={OpphørTab.BESLUTTER}>
              <BeslutterOpphør
                lokalkontorBeslutterAP={lokalkontorBeslutterAP}
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
