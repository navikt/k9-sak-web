import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { LabelledContent } from '@k9-sak-web/gui/shared/labelled-content/LabelledContent.js';
import { BodyLong, InfoCard, VStack } from '@navikt/ds-react';

interface AvslåttAvInnleggelsesperiodeMeldingProps {
  begrunnelse?: string;
}

const AvslåttAvInnleggelsesperiodeMelding = ({ begrunnelse }: AvslåttAvInnleggelsesperiodeMeldingProps) => (
  <InfoCard data-color="warning" size="small">
    <InfoCard.Message icon={<ExclamationmarkTriangleFillIcon aria-hidden color="var(--ax-text-warning-decoration)" />}>
      <VStack gap="space-8">
        <BodyLong size="small">
          Hele eller deler av perioden er avslått som følge av innleggelse. Vurderingen som ligger til grunn blir dermed
          ikke brukt for disse dagene.
        </BodyLong>
        {begrunnelse && <LabelledContent label="Begrunnelse for innleggelsesperioden" content={begrunnelse} />}
      </VStack>
    </InfoCard.Message>
  </InfoCard>
);

export default AvslåttAvInnleggelsesperiodeMelding;
