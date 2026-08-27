import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { Kilde } from '@k9-sak-web/backend/ungsak/kodeverk/bosatt/Kilde.js';
import { BostedsvilkårIkkeOppfyltÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/BostedsvilkårIkkeOppfyltÅrsak.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import { vilkarType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type {
  BostedGrunnlagResponseDto,
  VilkårBostedPeriodeVurderingDto,
} from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/bosted/BostedGrunnlagResponseDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import { formatDate } from '@k9-sak-web/gui/utils/formatters.js';
import { Alert, BodyShort, Box, Button, HStack, Label, Tag, VStack } from '@navikt/ds-react';
import { ISO_DATE_FORMAT } from '@navikt/ft-utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ProsessStegIkkeBehandlet } from '../../behandling/prosess/ProsessStegIkkeBehandlet';
import { Lovreferanse } from '../../shared/lovreferanse/Lovreferanse';
import {
  getPeriodStatus,
  VilkårSplittPanel,
  type VilkårSplittPanelPeriod,
} from '../../shared/vilkårSplittPanel/VilkårSplittPanel';
import { VurdertAv } from '../../shared/vurdert-av/VurdertAv';
import { sendTilBeslutter } from '../aktivitetspenger-felles/utils/sendTilBeslutter.js';
import { aksjonspunktErLøst, aksjonspunktErÅpent } from '../aktivitetspenger-felles/utils/utils.js';
import { byggVisningsperioder } from '../aktivitetspenger-felles/utils/visningsperioder.js';
import type { AktivitetspengerApi } from '../aktivitetspenger-prosess/AktivitetspengerApi';
import { perioderSomKanAvkortesQueryOptions } from '../aktivitetspenger-prosess/aktivitetspengerQueryOptions';
import { buildInitialValues, type BostedFormData } from './bostedFormData.js';
import { BostedLesevisning } from './BostedLesevisning';
import { BostedSkjema } from './BostedSkjema';

interface Props {
  bostedAp: AksjonspunktDto | undefined;
  lokalkontorForeslårVilkårAp: AksjonspunktDto | undefined;
  bostedVilkår: VilkårMedPerioderDto;
  readOnly: boolean;
  behandling: BehandlingDto;
  api: AktivitetspengerApi;
  onAksjonspunktBekreftet: () => Promise<void>;
  isPermanentlyReadOnly: boolean;
  bostedGrunnlag: BostedGrunnlagResponseDto;
}

export const Bosted = ({
  bostedVilkår,
  readOnly,
  api,
  behandling,
  onAksjonspunktBekreftet,
  bostedAp,
  lokalkontorForeslårVilkårAp,
  isPermanentlyReadOnly,
  bostedGrunnlag,
}: Props) => {
  const { data: avkortingsperioder } = useQuery(perioderSomKanAvkortesQueryOptions(api, behandling));
  const avkortingsperiodeBosted = avkortingsperioder?.resultat.find(v => v.vilkårType === vilkarType.BOSTEDSVILKÅR);
  const søknadsperioder = byggVisningsperioder(bostedVilkår, avkortingsperiodeBosted?.perioder ?? []);
  const periods: VilkårSplittPanelPeriod[] = søknadsperioder.map(periode => ({
    id: periode.periode.fom,
    status: getPeriodStatus(periode.vilkarStatus),
    label: `${formatDate(periode.periode.fom)}${periode.avkortetPeriodeInfo ? ` - ${formatDate(periode.periode.tom)}` : ''}`,
    periode: {
      fom: periode.periode.fom,
      tom: periode.periode.tom,
    },
  }));
  const formHook = useForm<BostedFormData>({
    defaultValues: buildInitialValues(søknadsperioder),
  });

  const [selectedId, setSelectedId] = useState(periods[0]?.id ?? '');
  useEffect(() => {
    if (!periods.some(period => period.id === selectedId)) {
      setSelectedId('');
    }
  }, [periods, selectedId]);

  const { mutateAsync: bekreftAksjonspunktMutation, isPending } = useMutation({
    mutationFn: async (data: BostedFormData) => {
      const vurdering = data.vurderinger[selectedId];
      const selectedItem = periods.find(period => period.id === selectedId);
      if (!selectedItem || !vurdering) {
        throw new Error('Kunne ikke finne valgt periode for bostedsvilkår');
      }
      const redigerMaksdatoAktiv =
        vurdering.bosatt === 'oppfylt' &&
        vurdering.redigerMaksdato &&
        vurdering.tom !== vurdering.muligAvkortingPeriode.tom;
      const begrunnelseInnvilget = vurdering.begrunnelse ?? '';
      const begrunnelseAvkortet = vurdering.begrunnelseKortereMaksdato ?? '';
      const vurdertePerioder: VilkårBostedPeriodeVurderingDto[] = [
        {
          avslagsårsak:
            vurdering.bosatt !== 'oppfylt' ? BostedsvilkårIkkeOppfyltÅrsak.IKKE_BOSATTADRESSE_I_TRONDHEIM : undefined,
          begrunnelse: begrunnelseInnvilget,
          erVilkårOppfylt: vurdering.bosatt === 'oppfylt',
          periode: {
            fom: vurdering.fom,
            tom: redigerMaksdatoAktiv ? vurdering.tom : vurdering.muligAvkortingPeriode.tom,
          },
          fritekstVurderingBrev:
            vurdering.avslagsårsak === BostedsvilkårIkkeOppfyltÅrsak.ANNET ? vurdering.fritekst : undefined,
        },
      ];
      if (redigerMaksdatoAktiv) {
        vurdertePerioder.push({
          avslagsårsak: BostedsvilkårIkkeOppfyltÅrsak.AVKORTET,
          begrunnelse: begrunnelseAvkortet,
          erVilkårOppfylt: false,
          periode: {
            fom: dayjs(vurdering.tom).add(1, 'day').format(ISO_DATE_FORMAT),
            tom: vurdering.muligAvkortingPeriode.tom,
          },
          fritekstVurderingBrev: undefined,
        });
      }

      const payload = {
        '@type': AksjonspunktDefinisjon.VURDER_BOSTEDVILKÅR,
        begrunnelse: redigerMaksdatoAktiv
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

  const isBostedApSolved = aksjonspunktErLøst(bostedAp);
  const selectedBostedGrunnlagPeriode = bostedGrunnlag.perioder.find(p => p.fom === selectedId);
  const vurdering = formHook.watch(`vurderinger.${selectedId}`);
  const begrunnelseLabel = (
    <span>
      Vurder om søker er bosatt i Trondheim kommune, jf.{' '}
      {bostedVilkår.lovReferanse && <Lovreferanse isUng>{bostedVilkår.lovReferanse}</Lovreferanse>}
    </span>
  );
  const harAvslagIBosted = bostedVilkår.perioder?.some(p => p.vilkarStatus === Utfall.IKKE_OPPFYLT);
  const skalViseSendTilBeslutter =
    !!harAvslagIBosted &&
    !!lokalkontorForeslårVilkårAp &&
    aksjonspunktErÅpent(lokalkontorForeslårVilkårAp) &&
    !readOnly;

  if (!bostedVilkår) {
    return null;
  }
  if (!bostedAp && !bostedVilkår.perioder?.some(p => p.vilkarStatus !== Utfall.IKKE_VURDERT)) {
    return <ProsessStegIkkeBehandlet />;
  }

  return (
    <VStack gap="space-20">
      {!isBostedApSolved && (
        <Alert variant="warning" size="small">
          Vurder om søker er bosatt i Trondheim kommune på søknadstidspunktet.
        </Alert>
      )}
      <VilkårSplittPanel
        periods={periods}
        selectedItemId={selectedId}
        onItemSelect={setSelectedId}
        detailHeading="Vurdering av bosatt i Trondheim kommune"
        lovreferanse={bostedVilkår.lovReferanse}
        defaultIsLocked={isBostedApSolved}
        readOnly={readOnly}
        lockedContent={isBostedApSolved ? <VurdertAv ident={bostedAp?.ansvarligSaksbehandler} /> : undefined}
        afterEditButton={
          skalViseSendTilBeslutter ? (
            <VStack gap="space-20">
              <Alert variant="info" size="small">
                Behandlingen vil gå videre til avslag. Øvrige inngangsvilkår vil ikke bli behandlet.
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
        isPermanentlyReadOnly={isPermanentlyReadOnly}
      >
        {(isFormLocked, setIsFormLocked, isDefaultLocked) => (
          <VStack gap="space-24">
            <VStack gap="space-8">
              <Label size="small" as="p">
                Bor søker i Trondheim kommune?
              </Label>
              {selectedBostedGrunnlagPeriode && (
                <HStack gap="space-8" align="center">
                  <BodyShort size="small">{selectedBostedGrunnlagPeriode.erBosattITrondheim ? 'Ja' : 'Nei'}</BodyShort>
                  <Tag variant="outline" size="small" data-color={!isFormLocked ? 'info' : undefined}>
                    {selectedBostedGrunnlagPeriode.kilde === Kilde.SØKNAD ? 'Fra søknad' : 'Saksbehandler'}
                  </Tag>
                </HStack>
              )}
            </VStack>
            {isFormLocked && vurdering ? (
              <BostedLesevisning begrunnelseLabel={begrunnelseLabel} vurdering={vurdering} />
            ) : (
              <BostedSkjema
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
            )}
          </VStack>
        )}
      </VilkårSplittPanel>
    </VStack>
  );
};
