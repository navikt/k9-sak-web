import { Avslagsårsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Avslagsårsak.js';
import { formatDate } from '@k9-sak-web/gui/utils/formatters.js';
import { BodyLong, BodyShort, Label, VStack } from '@navikt/ds-react';
import type { ReactNode } from 'react';
import { LabelledContent } from '../../shared/labelled-content/LabelledContent';
import type { AndreLivsoppholdytelserFormData } from './andreLivsoppholdytelserFormData.js';

const avslagsårsakLabels: Record<string, string> = {
  [Avslagsårsak.SØKER_HAR_ANNEN_LIVSOPPHOLDSYTELSE]: 'Søker har annen livsoppholdytelse',
  fritekst: 'Fritekst',
};

interface Props {
  begrunnelseLabel: ReactNode;
  vurdering: AndreLivsoppholdytelserFormData['vurderinger'][string];
}

export const AndreLivsoppholdytelserLesevisning = ({ begrunnelseLabel, vurdering }: Props) => (
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
        Er søker uten andre livsoppholdsytelser?
      </Label>
      <BodyShort size="small">{vurdering.andreLivsoppholdytelser === 'oppfylt' ? 'Ja' : 'Nei'}</BodyShort>
    </VStack>
    {vurdering.andreLivsoppholdytelser === 'ikkeOppfylt' && vurdering.avslagsårsak && (
      <VStack gap="space-8">
        <Label size="small" as="p">
          Avslagsårsak
        </Label>
        <BodyShort size="small">{avslagsårsakLabels[vurdering.avslagsårsak]}</BodyShort>
      </VStack>
    )}
    {vurdering.andreLivsoppholdytelser === 'ikkeOppfylt' && vurdering.fritekst && (
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
    {vurdering.andreLivsoppholdytelser === 'oppfylt' && (
      <VStack gap="space-8">
        <Label size="small" as="p">
          Uten andre livsoppholdsytelser:
        </Label>
        <BodyShort size="small">{`${formatDate(vurdering.fom)} – ${formatDate(vurdering.tom)}`}</BodyShort>
      </VStack>
    )}
    {vurdering.andreLivsoppholdytelser === 'oppfylt' && vurdering.redigerMaksdato && (
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
