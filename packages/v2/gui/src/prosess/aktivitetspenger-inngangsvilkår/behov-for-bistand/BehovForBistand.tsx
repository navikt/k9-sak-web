import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { BistandsvilkårIkkeOppfyltÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/BistandsvilkårIkkeOppfyltÅrsak.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import { vilkarType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { VilkårBistandPeriodeVurderingDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/bistand/VilkårBistandPeriodeVurderingDto.js';
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
import { buildInitialValues, type BehovForBistandFormData } from './behovForBistandFormData.js';
import { BehovForBistandLesevisning } from './BehovForBistandLesevisning';
import { BehovForBistandSkjema } from './BehovForBistandSkjema';

interface Props {
  vurderBistandsvilkårVilkår: VilkårMedPerioderDto;
  vurderBistandsvilkårAp: AksjonspunktDto | undefined;
  lokalkontorForeslårVilkårAp: AksjonspunktDto | undefined;
  api: AktivitetspengerApi;
  behandling: BehandlingDto;
  onAksjonspunktBekreftet: () => Promise<void>;
  readOnly: boolean;
  isPermanentlyReadOnly: boolean;
}

export const BehovForBistand = ({
  vurderBistandsvilkårVilkår,
  vurderBistandsvilkårAp,
  lokalkontorForeslårVilkårAp,
  api,
  behandling,
  onAksjonspunktBekreftet,
  readOnly,
  isPermanentlyReadOnly,
}: Props) => {
  const { data: avkortingsperioder } = useQuery(perioderSomKanAvkortesQueryOptions(api, behandling));
  const avkortingsperiodeBistand = avkortingsperioder?.resultat.find(v => v.vilkårType === vilkarType.BISTANDSVILKÅR);
  const søknadsperioder = byggVisningsperioder(vurderBistandsvilkårVilkår, avkortingsperiodeBistand?.perioder ?? []);
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
  const formHook = useForm<BehovForBistandFormData>({
    defaultValues: buildInitialValues(søknadsperioder),
  });

  const { mutateAsync: bekreftAksjonspunktMutation, isPending } = useMutation({
    mutationFn: async (data: BehovForBistandFormData) => {
      const vurdering = data.vurderinger[selectedId];
      if (!vurdering) {
        throw new Error('Kunne ikke finne valgt periode for bistandsvilkår');
      }
      const redigerMaksdatoAktiv =
        vurdering.behovForBistand === 'oppfylt' &&
        vurdering.redigerMaksdato &&
        vurdering.tom !== vurdering.muligAvkortingPeriode.tom;
      const begrunnelseInnvilget = vurdering.begrunnelse ?? '';
      const begrunnelseAvkortet = vurdering.begrunnelseKortereMaksdato ?? '';
      const vurdertePerioder: VilkårBistandPeriodeVurderingDto[] = [
        {
          avslagsårsak:
            vurdering.behovForBistand === 'ikkeOppfylt' && vurdering.avslagsårsak
              ? BistandsvilkårIkkeOppfyltÅrsak.IKKE_14A_VEDTAK
              : undefined,
          begrunnelse: begrunnelseInnvilget,
          erVilkårOppfylt: vurdering.behovForBistand === 'oppfylt',
          periode: {
            fom: vurdering.fom,
            tom: redigerMaksdatoAktiv ? vurdering.tom : vurdering.muligAvkortingPeriode.tom,
          },
          fritekstVurderingBrev: vurdering.avslagsårsak === 'fritekst' ? vurdering.fritekst : undefined,
        },
      ];
      if (redigerMaksdatoAktiv) {
        vurdertePerioder.push({
          avslagsårsak: BistandsvilkårIkkeOppfyltÅrsak.AVKORTET,
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
        '@type': AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR,
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
  const isVurderBistandsvilkårApSolved = aksjonspunktErLøst(vurderBistandsvilkårAp);
  const begrunnelseLabel = (
    <span>
      Vurder om søker har behov for bistand, jf.{' '}
      {vurderBistandsvilkårVilkår.lovReferanse && (
        <Lovreferanse isUng>{vurderBistandsvilkårVilkår.lovReferanse}</Lovreferanse>
      )}
    </span>
  );
  const lokalkontorKanSendeTilBeslutter =
    !readOnly && !!lokalkontorForeslårVilkårAp && aksjonspunktErÅpent(lokalkontorForeslårVilkårAp);

  if (!vurderBistandsvilkårVilkår) {
    return null;
  }

  if (
    !vurderBistandsvilkårAp &&
    !vurderBistandsvilkårVilkår.perioder?.some(p => p.vilkarStatus !== Utfall.IKKE_VURDERT)
  ) {
    return <ProsessStegIkkeBehandlet />;
  }

  if (vurderBistandsvilkårVilkår.perioder?.every(p => p.vilkarStatus === Utfall.IKKE_RELEVANT)) {
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
      {!isVurderBistandsvilkårApSolved && (
        <Alert variant="warning" size="small">
          Vurder behov for bistand på søknadstidspunktet.
        </Alert>
      )}
      <VilkårSplittPanel
        periods={periods}
        selectedItemId={selectedId}
        onItemSelect={setSelectedId}
        detailHeading="Vurdering av behov for bistand"
        lovreferanse={vurderBistandsvilkårVilkår.lovReferanse}
        defaultIsLocked={isVurderBistandsvilkårApSolved || lokalkontorKanSendeTilBeslutter}
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
          isVurderBistandsvilkårApSolved ? (
            <VurdertAv ident={vurderBistandsvilkårAp?.ansvarligSaksbehandler} />
          ) : undefined
        }
      >
        {(isFormLocked, setIsFormLocked, isDefaultLocked) =>
          isFormLocked && vurdering ? (
            <BehovForBistandLesevisning begrunnelseLabel={begrunnelseLabel} vurdering={vurdering} />
          ) : (
            <BehovForBistandSkjema
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
