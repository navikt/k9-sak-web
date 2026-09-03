import { formatDate } from '@k9-sak-web/gui/utils/formatters.js';
import { BodyShort, Label, VStack } from '@navikt/ds-react';
import type { ReactNode } from 'react';
import { LabelledContent } from '../../../shared/labelled-content/LabelledContent';
import type { AktivitetFormData } from './aktivitetFormData.js';

interface Props {
  begrunnelseLabel: ReactNode;
  vurdering: AktivitetFormData['vurderinger'][string];
}

export const AktivitetLesevisning = ({ begrunnelseLabel, vurdering }: Props) => (
  <VStack gap="space-24" maxWidth="70ch" width="100%">
    <LabelledContent label={begrunnelseLabel} indentContent content={vurdering.begrunnelse} />
    <VStack gap="space-8">
      <Label size="small" as="p">
        Er søker i aktivitet?
      </Label>
      <BodyShort size="small">{vurdering.erSøkerIAktivitet === 'oppfylt' ? 'Ja' : 'Nei'}</BodyShort>
    </VStack>
    {vurdering.erSøkerIAktivitet === 'ikkeOppfylt' && vurdering.fritekst && (
      <LabelledContent label="Fritekst avslagsbrev" indentContent content={vurdering.fritekst} />
    )}
    {vurdering.erSøkerIAktivitet === 'oppfylt' && (
      <VStack gap="space-8">
        <Label size="small" as="p">
          I aktivitet:
        </Label>
        <BodyShort size="small">{`${formatDate(vurdering.fom)} – ${formatDate(vurdering.tom)}`}</BodyShort>
      </VStack>
    )}
    {vurdering.erSøkerIAktivitet === 'oppfylt' && vurdering.redigerTomDato && (
      <LabelledContent
        label="Begrunn kortere periode enn 260 dager"
        indentContent
        content={vurdering.begrunnelseKortereMaksdato}
      />
    )}
  </VStack>
);
