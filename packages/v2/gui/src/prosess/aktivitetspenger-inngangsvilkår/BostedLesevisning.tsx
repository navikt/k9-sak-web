import { formatDate } from '@k9-sak-web/gui/utils/formatters.js';
import { BodyLong, BodyShort, Label, VStack } from '@navikt/ds-react';
import type { ReactNode } from 'react';
import { LabelledContent } from '../../shared/labelled-content/LabelledContent';
import { opphørsårsakLabels } from '../aktivitetspenger-prosess/types.js';
import type { BostedFormData } from './bostedFormData.js';

const finnOpphørsårsakLabel = (kode: string | undefined): string | undefined =>
  Object.entries(opphørsårsakLabels).find(([årsak]) => årsak === kode)?.[1];

interface Props {
  begrunnelseLabel: ReactNode;
  vurdering: BostedFormData['vurderinger'][string];
}

export const BostedLesevisning = ({ begrunnelseLabel, vurdering }: Props) => (
  <VStack gap="space-24" maxWidth="70ch" width="100%">
    <LabelledContent
      label={begrunnelseLabel}
      indentContent
      content={
        <BodyLong size="small" className="whitespace-pre-wrap">
          {vurdering.begrunnelse}
        </BodyLong>
      }
    />
    <VStack gap="space-8">
      <Label size="small" as="p">
        Er søker bosatt i Trondheim kommune?
      </Label>
      <BodyShort size="small">{vurdering.bosatt === 'oppfylt' ? 'Ja' : 'Nei'}</BodyShort>
    </VStack>
    {vurdering.bosatt === 'ikkeOppfylt' && vurdering.avslagsårsak && (
      <VStack gap="space-8">
        <Label size="small" as="p">
          Avslagsårsak
        </Label>
        <BodyShort size="small">{finnOpphørsårsakLabel(vurdering.avslagsårsak)}</BodyShort>
      </VStack>
    )}
    {vurdering.bosatt === 'ikkeOppfylt' && vurdering.fritekst && (
      <LabelledContent
        label="Fritekst avslagsbrev"
        indentContent
        content={
          <BodyLong size="small" className="whitespace-pre-wrap">
            {vurdering.fritekst}
          </BodyLong>
        }
      />
    )}
    {vurdering.bosatt === 'oppfylt' && (
      <VStack gap="space-8">
        <Label size="small" as="p">
          Bosatt i Trondheim kommune:
        </Label>
        <BodyShort size="small">{`${formatDate(vurdering.fom)} – ${formatDate(vurdering.tom)}`}</BodyShort>
      </VStack>
    )}
    {vurdering.bosatt === 'oppfylt' && vurdering.redigerMaksdato && (
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
