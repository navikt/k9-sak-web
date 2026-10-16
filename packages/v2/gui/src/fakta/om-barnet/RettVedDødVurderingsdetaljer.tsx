import type { VurderingRettPleiepengerVedDødDto } from '@k9-sak-web/backend/k9sak/kontrakt/død/VurderingRettPleiepengerVedDødDto.js';
import { CheckmarkIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack, VStack } from '@navikt/ds-react';
import { LabelledContent } from '../../shared/labelled-content/LabelledContent.js';
import { VurdertAv } from '../../shared/vurdert-av/VurdertAv.js';
import { rettVedDødUtfallTekst } from './rettVedDødUtfallTekst.js';

interface RettVedDødVurderingsdetaljerProps {
  rettVedDød: VurderingRettPleiepengerVedDødDto;
}

export const RettVedDødVurderingsdetaljer = ({ rettVedDød }: RettVedDødVurderingsdetaljerProps) => {
  const utfallTekst = rettVedDødUtfallTekst(rettVedDød.rettVedDødType);

  return (
    <VStack gap="space-24">
      {utfallTekst && (
        <HStack gap="space-8" align="center" wrap={false}>
          <CheckmarkIcon aria-hidden />
          <BodyShort>{utfallTekst}</BodyShort>
        </HStack>
      )}
      <div>
        <LabelledContent label="Vurdering" content={rettVedDød.vurdering} indentContent />
        <VurdertAv ident={rettVedDød.vurdertAv} date={rettVedDød.vurdertTidspunkt} />
      </div>
    </VStack>
  );
};
