import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AktivitetsvilkåretIkkeOppfyltÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/AktivitetsvilkåretIkkeOppfyltÅrsak.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import { vilkarType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { VilkårAktivitetPeriodeVurderingDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/aktivitet/VilkårAktivitetPeriodeVurderingDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import { formatDate } from '@k9-sak-web/gui/utils/formatters.js';
import { Alert, Box, Button, VStack } from '@navikt/ds-react';
import { ISO_DATE_FORMAT } from '@navikt/ft-utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ProsessStegIkkeBehandlet } from '../../../behandling/prosess/ProsessStegIkkeBehandlet';
import { Lovreferanse } from '../../../shared/lovreferanse/Lovreferanse';
import {
  getPeriodStatus,
  VilkårSplittPanel,
  type VilkårSplittPanelPeriod,
} from '../../../shared/vilkårSplittPanel/VilkårSplittPanel';
import { VurdertAv } from '../../../shared/vurdert-av/VurdertAv';
import { sendTilBeslutter } from '../../aktivitetspenger-felles/utils/sendTilBeslutter';
import { aksjonspunktErLøst, aksjonspunktErÅpent } from '../../aktivitetspenger-felles/utils/utils';
import { byggVisningsperioder } from '../../aktivitetspenger-felles/utils/visningsperioder.js';
import type { AktivitetspengerApi } from '../../aktivitetspenger-prosess/AktivitetspengerApi';
import { perioderSomKanAvkortesQueryOptions } from '../../aktivitetspenger-prosess/aktivitetspengerQueryOptions';
import { AktivitetLesevisning } from './AktivitetLesevisning';
import { buildInitialValues, type AktivitetFormData } from './aktivitetFormData.js';
import { AktivitetSkjema } from './AktivitetSkjema';

interface Props {
  vurderAktivitetsvilkårVilkår: VilkårMedPerioderDto;
  vurderAktivitetsvilkårAp: AksjonspunktDto | undefined;
  lokalkontorForeslårVilkårAp: AksjonspunktDto | undefined;
  api: AktivitetspengerApi;
  behandling: BehandlingDto;
  onAksjonspunktBekreftet: () => Promise<void>;
  readOnly: boolean;
  isPermanentlyReadOnly: boolean;
}

export const Aktivitet = ({
  vurderAktivitetsvilkårVilkår,
  vurderAktivitetsvilkårAp,
  lokalkontorForeslårVilkårAp,
  api,
  behandling,
  onAksjonspunktBekreftet,
  readOnly,
  isPermanentlyReadOnly,
}: Props) => {
  const { data: avkortingsperioder } = useQuery(perioderSomKanAvkortesQueryOptions(api, behandling));
  const avkortingsperiodeAktivitet = avkortingsperioder?.resultat.find(
    v => v.vilkårType === vilkarType.AKTIVITETSVILKÅR,
  );
  const søknadsperioder = byggVisningsperioder(
    vurderAktivitetsvilkårVilkår,
    avkortingsperiodeAktivitet?.perioder ?? [],
  );
  const periods: VilkårSplittPanelPeriod[] = søknadsperioder.map(periode => ({
    id: periode.periode.fom,
    status: getPeriodStatus(periode.vilkarStatus),
    label: `${formatDate(periode.periode.fom)}${periode.avkortetPeriodeInfo ? ` - ${formatDate(periode.periode.tom)}` : ''}`,
    periode: periode.periode,
  }));
  const [selectedId, setSelectedId] = useState(
    () =>
      søknadsperioder.find(periode => periode.vilkarStatus === Utfall.IKKE_VURDERT)?.periode.fom ??
      periods[0]?.id ??
      '',
  );
  useEffect(() => {
    if (!periods.some(period => period.id === selectedId)) {
      setSelectedId('');
    }
  }, [periods, selectedId]);
  const formHook = useForm<AktivitetFormData>({
    defaultValues: buildInitialValues(søknadsperioder),
  });

  const { mutateAsync: bekreftAksjonspunktMutation, isPending } = useMutation({
    mutationFn: async (data: AktivitetFormData) => {
      const vurdering = data.vurderinger[selectedId];
      if (!vurdering) {
        throw new Error('Kunne ikke finne valgt periode for aktivitetsvilkår');
      }
      const muligAvkorting = vurdering.muligAvkortingPeriode;
      const redigerTomDatoAktiv =
        vurdering.erSøkerIAktivitet === 'oppfylt' &&
        vurdering.redigerTomDato &&
        muligAvkorting !== undefined &&
        vurdering.tom !== muligAvkorting.tom;
      const begrunnelseInnvilget = vurdering.begrunnelse ?? '';
      const begrunnelseAvkortet = vurdering.begrunnelseKortereMaksdato ?? '';
      const vurdertePerioder: VilkårAktivitetPeriodeVurderingDto[] = [
        {
          avslagsårsak:
            vurdering.erSøkerIAktivitet === 'ikkeOppfylt' ? AktivitetsvilkåretIkkeOppfyltÅrsak.ANNET : undefined,
          begrunnelse: begrunnelseInnvilget,
          erVilkårOppfylt: vurdering.erSøkerIAktivitet === 'oppfylt',
          periode: {
            fom: vurdering.fom,
            tom: redigerTomDatoAktiv ? vurdering.tom : (muligAvkorting?.tom ?? vurdering.tom),
          },
          fritekstVurderingBrev: vurdering.erSøkerIAktivitet === 'ikkeOppfylt' ? vurdering.fritekst : undefined,
        },
      ];
      if (redigerTomDatoAktiv && muligAvkorting) {
        vurdertePerioder.push({
          avslagsårsak: AktivitetsvilkåretIkkeOppfyltÅrsak.AVKORTET,
          begrunnelse: begrunnelseAvkortet,
          erVilkårOppfylt: false,
          periode: {
            fom: dayjs(vurdering.tom).add(1, 'day').format(ISO_DATE_FORMAT),
            tom: muligAvkorting.tom,
          },
          fritekstVurderingBrev: undefined,
        });
      }

      const payload = {
        '@type': AksjonspunktDefinisjon.VURDER_AKTIVITETSVILKÅR,
        begrunnelse: redigerTomDatoAktiv
          ? `${begrunnelseInnvilget}\n\n${begrunnelseAvkortet}`.trim()
          : begrunnelseInnvilget,
        vurdertePerioder,
      };

      await api.bekreftAksjonspunkt(behandling.uuid, behandling.versjon, [payload]);
    },
    onSuccess: async () => {
      await onAksjonspunktBekreftet();
    },
  });

  const { mutateAsync: sendTilBeslutterMutation, isPending: isSendingTilBeslutter } = useMutation({
    mutationFn: async () => sendTilBeslutter(api, behandling),
    onSuccess: async () => {
      await onAksjonspunktBekreftet();
    },
  });

  const vurdering = formHook.watch(`vurderinger.${selectedId}`);
  const isVurderAktivitetsvilkårApSolved = aksjonspunktErLøst(vurderAktivitetsvilkårAp);
  const begrunnelseLabel = (
    <span>
      Vurder om søker oppfyller krav til aktivitet, jf.{' '}
      {vurderAktivitetsvilkårVilkår.lovReferanse && (
        <Lovreferanse isUng>{vurderAktivitetsvilkårVilkår.lovReferanse}</Lovreferanse>
      )}
    </span>
  );
  const lokalkontorKanSendeTilBeslutter =
    !readOnly && !!lokalkontorForeslårVilkårAp && aksjonspunktErÅpent(lokalkontorForeslårVilkårAp);

  if (!vurderAktivitetsvilkårVilkår) {
    return null;
  }

  if (
    !vurderAktivitetsvilkårAp &&
    !vurderAktivitetsvilkårVilkår.perioder?.some(p => p.vilkarStatus !== Utfall.IKKE_VURDERT)
  ) {
    return <ProsessStegIkkeBehandlet />;
  }

  if (vurderAktivitetsvilkårVilkår.perioder?.every(p => p.vilkarStatus === Utfall.IKKE_RELEVANT)) {
    return (
      <Box width="fit-content">
        <Alert variant="info" size="small">
          Ingen perioder å vurdere.
        </Alert>
      </Box>
    );
  }

  return (
    <VStack gap="space-20">
      {!isVurderAktivitetsvilkårApSolved && (
        <Alert variant="warning" size="small">
          Vurder om søker er i aktivitet på søknadstidspunktet.
        </Alert>
      )}
      <VilkårSplittPanel
        periods={periods}
        selectedItemId={selectedId}
        onItemSelect={setSelectedId}
        detailHeading="Vurdering av aktivitet"
        lovreferanse={vurderAktivitetsvilkårVilkår.lovReferanse}
        defaultIsLocked={isVurderAktivitetsvilkårApSolved || lokalkontorKanSendeTilBeslutter}
        readOnly={readOnly}
        isPermanentlyReadOnly={isPermanentlyReadOnly}
        afterEditButton={
          lokalkontorKanSendeTilBeslutter ? (
            <VStack gap="space-20">
              <Alert variant="success" size="small">
                Alle inngangsvilkår for Nav-kontor er ferdig vurdert.
              </Alert>
              <Box>
                <Button
                  variant="primary"
                  data-color="accent"
                  size="small"
                  type="button"
                  loading={isSendingTilBeslutter}
                  onClick={() => void sendTilBeslutterMutation()}
                >
                  Send til beslutter
                </Button>
              </Box>
            </VStack>
          ) : null
        }
        lockedContent={
          isVurderAktivitetsvilkårApSolved ? (
            <VurdertAv ident={vurderAktivitetsvilkårAp?.ansvarligSaksbehandler} />
          ) : undefined
        }
      >
        {(isFormLocked, setIsFormLocked, isDefaultLocked) =>
          isFormLocked && vurdering ? (
            <AktivitetLesevisning begrunnelseLabel={begrunnelseLabel} vurdering={vurdering} />
          ) : (
            <AktivitetSkjema
              formHook={formHook}
              selectedId={selectedId}
              begrunnelseLabel={begrunnelseLabel}
              isPending={isPending}
              visAvbryt={isDefaultLocked}
              onSubmit={async data => {
                await bekreftAksjonspunktMutation(data);
                setIsFormLocked(true);
              }}
              onAvbryt={() => {
                formHook.reset(buildInitialValues(søknadsperioder));
                setIsFormLocked(true);
              }}
            />
          )
        }
      </VilkårSplittPanel>
    </VStack>
  );
};
