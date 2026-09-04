import { BistandsvilkårIkkeOppfyltÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/BistandsvilkårIkkeOppfyltÅrsak.js';
import { formatDate } from '@k9-sak-web/gui/utils/formatters.js';
import { BodyShort, Label, VStack } from '@navikt/ds-react';
import type { ReactNode } from 'react';
import { LabelledContent } from '../../../shared/labelled-content/LabelledContent';
import type { BehovForBistandFormData } from './behovForBistandFormData.js';

const avslagsårsakLabels: Record<string, string> = {
  [BistandsvilkårIkkeOppfyltÅrsak.IKKE_14A_VEDTAK]: 'Søker har ikke oppfølgingsvedtak etter Nav-loven §14a.',
  fritekst: 'Fritekst',
};

interface Props {
  begrunnelseLabel: ReactNode;
  vurdering: BehovForBistandFormData['vurderinger'][string];
}

export const BehovForBistandLesevisning = ({ begrunnelseLabel, vurdering }: Props) => (
  <VStack gap="space-24" maxWidth="70ch" width="100%">
    <LabelledContent label={begrunnelseLabel} indentContent content={vurdering.begrunnelse} />
    <VStack gap="space-8">
      <Label size="small" as="p">
        Har søker behov for bistand?
      </Label>
      <BodyShort size="small">{vurdering.behovForBistand === 'oppfylt' ? 'Ja' : 'Nei'}</BodyShort>
    </VStack>
    {vurdering.behovForBistand === 'ikkeOppfylt' && vurdering.avslagsårsak && (
      <VStack gap="space-8">
        <Label size="small" as="p">
          Avslagsårsak
        </Label>
        <BodyShort size="small">{avslagsårsakLabels[vurdering.avslagsårsak]}</BodyShort>
      </VStack>
    )}
    {vurdering.behovForBistand === 'ikkeOppfylt' && vurdering.fritekst && (
      <LabelledContent label="Fritekst avslagsbrev" indentContent content={vurdering.fritekst} />
    )}
    {vurdering.behovForBistand === 'oppfylt' && (
      <VStack gap="space-8">
        <Label size="small" as="p">
          Behov for bistand:
        </Label>
        <BodyShort size="small">{`${formatDate(vurdering.fom)} – ${formatDate(vurdering.tom)}`}</BodyShort>
      </VStack>
    )}
    {vurdering.behovForBistand === 'oppfylt' && vurdering.redigerMaksdato && (
      <LabelledContent
        label="Begrunn kortere periode enn 260 dager"
        indentContent
        content={
          <BodyLong size="small" className="whitespace-pre-wrap">
            {vurdering.begrunnelseKortereMaksdato}
          </BodyLong>
        }
      />
    )}
  </VStack>
);
