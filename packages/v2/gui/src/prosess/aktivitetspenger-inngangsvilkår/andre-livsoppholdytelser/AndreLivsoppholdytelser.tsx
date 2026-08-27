import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AndreLivsoppholdsytelserIkkeOppfyltÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/AndreLivsoppholdsytelserIkkeOppfyltÅrsak.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import { vilkarType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { VilkårLivsoppholdsytelserPeriodeVurderingDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/livsopphold/VilkårLivsoppholdsytelserPeriodeVurderingDto.js';
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
import { buildInitialValues, type AndreLivsoppholdytelserFormData } from './andreLivsoppholdytelserFormData.js';
import { AndreLivsoppholdytelserLesevisning } from './AndreLivsoppholdytelserLesevisning';
import { AndreLivsoppholdytelserSkjema } from './AndreLivsoppholdytelserSkjema';

interface Props {
  andreLivsoppholdytelserAp: AksjonspunktDto | undefined;
  lokalkontorForeslårVilkårAp: AksjonspunktDto | undefined;
  andreLivsoppholdytelserVilkår: VilkårMedPerioderDto;
  readOnly: boolean;
  behandling: BehandlingDto;
  api: AktivitetspengerApi;
  onAksjonspunktBekreftet: () => Promise<void>;
  isPermanentlyReadOnly: boolean;
}

export const AndreLivsoppholdytelser = ({
  andreLivsoppholdytelserAp,
  lokalkontorForeslårVilkårAp,
  andreLivsoppholdytelserVilkår,
  readOnly,
  api,
  behandling,
  onAksjonspunktBekreftet,
  isPermanentlyReadOnly,
}: Props) => {
  const { data: avkortingsperioder } = useQuery(perioderSomKanAvkortesQueryOptions(api, behandling));
  const avkortingsperiodeLivsopphold = avkortingsperioder?.resultat.find(
    v => v.vilkårType === vilkarType.ANDRE_LIVSOPPHOLDSYTELSER_VILKÅR,
  );
  const søknadsperioder = byggVisningsperioder(
    andreLivsoppholdytelserVilkår,
    avkortingsperiodeLivsopphold?.perioder ?? [],
  );
  const periods: VilkårSplittPanelPeriod[] = søknadsperioder.map(periode => ({
    id: periode.periode.fom,
    status: getPeriodStatus(periode.vilkarStatus),
    label: `${formatDate(periode.periode.fom)}${periode.avkortetPeriodeInfo ? ` - ${formatDate(periode.periode.tom)}` : ''}`,
    periode: periode.periode,
  }));
  const [selectedId, setSelectedId] = useState(periods[0]?.id ?? '');
  useEffect(() => {
    if (!periods.some(period => period.id === selectedId)) {
      setSelectedId('');
    }
  }, [periods, selectedId]);
  const isAndreLivsoppholdytelserApSolved = aksjonspunktErLøst(andreLivsoppholdytelserAp);
  const formHook = useForm<AndreLivsoppholdytelserFormData>({
    defaultValues: buildInitialValues(søknadsperioder),
  });

  const { mutateAsync: bekreftAksjonspunktMutation, isPending } = useMutation({
    mutationFn: async (data: AndreLivsoppholdytelserFormData) => {
      const vurdering = data.vurderinger[selectedId];
      const selectedItem = periods.find(period => period.id === selectedId);
      if (!selectedItem || selectedItem.periode === undefined || !vurdering) {
        throw new Error('Kunne ikke finne valgt periode for andre livsoppholdytelser vilkår');
      }
      const redigerMaksdatoAktiv =
        vurdering.andreLivsoppholdytelser === 'oppfylt' &&
        vurdering.redigerMaksdato &&
        vurdering.tom !== vurdering.muligAvkortingPeriode.tom;
      const begrunnelseInnvilget = vurdering.begrunnelse ?? '';
      const begrunnelseAvkortet = vurdering.begrunnelseKortereMaksdato ?? '';
      const vurdertePerioder: VilkårLivsoppholdsytelserPeriodeVurderingDto[] = [
        {
          avslagsårsak:
            vurdering.andreLivsoppholdytelser !== 'oppfylt'
              ? AndreLivsoppholdsytelserIkkeOppfyltÅrsak.HAR_ANNEN_LIVSOPPHOLDSYTELSE
              : undefined,
          begrunnelse: begrunnelseInnvilget,
          erVilkårOppfylt: vurdering.andreLivsoppholdytelser === 'oppfylt',
          periode: {
            fom: vurdering.fom,
            tom: redigerMaksdatoAktiv ? vurdering.tom : vurdering.muligAvkortingPeriode.tom,
          },
          fritekstVurderingBrev: vurdering.avslagsårsak === 'fritekst' ? vurdering.fritekst : undefined,
        },
      ];
      if (redigerMaksdatoAktiv) {
        vurdertePerioder.push({
          avslagsårsak: AndreLivsoppholdsytelserIkkeOppfyltÅrsak.AVKORTET,
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
        '@type': AksjonspunktDefinisjon.VURDER_ANDRE_LIVSOPPHOLDSYTELSER,
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

  const vurdering = formHook.watch(`vurderinger.${selectedId}`);
  const begrunnelseLabel = (
    <span>
      Vurder om søker mottar andre livsoppholdsytelser, jf.{' '}
      {andreLivsoppholdytelserVilkår.lovReferanse && (
        <Lovreferanse isUng>{andreLivsoppholdytelserVilkår.lovReferanse}</Lovreferanse>
      )}
    </span>
  );
  const harAvslagIAndreLivsoppholdytelser = andreLivsoppholdytelserVilkår.perioder?.some(
    p => p.vilkarStatus === Utfall.IKKE_OPPFYLT,
  );
  const skalViseSendTilBeslutter =
    !!harAvslagIAndreLivsoppholdytelser &&
    !!lokalkontorForeslårVilkårAp &&
    aksjonspunktErÅpent(lokalkontorForeslårVilkårAp) &&
    !readOnly;

  if (!andreLivsoppholdytelserVilkår) {
    return null;
  }
  if (
    !andreLivsoppholdytelserAp &&
    !andreLivsoppholdytelserVilkår.perioder?.some(p => p.vilkarStatus !== Utfall.IKKE_VURDERT)
  ) {
    return <ProsessStegIkkeBehandlet />;
  }

  if (andreLivsoppholdytelserVilkår.perioder?.every(p => p.vilkarStatus === Utfall.IKKE_RELEVANT)) {
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
      {!isAndreLivsoppholdytelserApSolved && (
        <Alert variant="warning" size="small">
          Vurder om søker har andre livsoppholdsytelser på søknadstidspunktet.
        </Alert>
      )}
      <VilkårSplittPanel
        periods={periods}
        selectedItemId={selectedId}
        onItemSelect={setSelectedId}
        detailHeading="Vurdering av andre livsoppholdsytelser"
        lovreferanse={andreLivsoppholdytelserVilkår.lovReferanse}
        defaultIsLocked={isAndreLivsoppholdytelserApSolved}
        readOnly={readOnly}
        isPermanentlyReadOnly={isPermanentlyReadOnly}
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
        lockedContent={
          isAndreLivsoppholdytelserApSolved ? (
            <VurdertAv ident={andreLivsoppholdytelserAp?.ansvarligSaksbehandler} />
          ) : undefined
        }
      >
        {(isFormLocked, setIsFormLocked, isDefaultLocked) =>
          isFormLocked && vurdering ? (
            <AndreLivsoppholdytelserLesevisning begrunnelseLabel={begrunnelseLabel} vurdering={vurdering} />
          ) : (
            <AndreLivsoppholdytelserSkjema
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
