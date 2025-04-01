import { BodyShort, Box } from '@navikt/ds-react';
import { InstitusjonVurderingDtoResultat } from '@k9-sak-web/backend/k9sak/generated';
import { LabelledContent } from '../../../../shared/LabelledContent/LabelledContent.js';
import { VurdertAv } from '../../../../shared/vurdert-av/VurdertAv.js';
import type { InstitusjonVurderingDtoMedPerioder } from '../types/InstitusjonVurderingDtoMedPerioder.js';

interface OwnProps {
  vurdering: InstitusjonVurderingDtoMedPerioder;
}

const InstitusjonFerdigVisning = ({ vurdering }: OwnProps) => (
  <>
    <Box className="mt-8">
      <LabelledContent
        label="Gjør en vurdering av om opplæringen gjennomgås ved en godkjent helseinstitusjon eller et offentlig spesialpedagogisk kompetansesenter etter § 9-14, første ledd."
        indentContent
        size="small"
      >
        <BodyShort size="small" className="whitespace-pre-wrap">
          {vurdering.begrunnelse}
        </BodyShort>
      </LabelledContent>
      <VurdertAv ident={vurdering?.vurdertAv} date={vurdering?.vurdertTidspunkt} />
    </Box>

    <Box className="mt-8">
      <LabelledContent label="Er opplæringen ved godkjent helseinstitusjon eller kompetansesenter?" size="small">
        {((vurdering.resultat === InstitusjonVurderingDtoResultat.GODKJENT_AUTOMATISK ||
          vurdering.resultat === InstitusjonVurderingDtoResultat.GODKJENT_MANUELT) &&
          'Ja') ||
          'Nei'}
      </LabelledContent>
    </Box>
  </>
);

export default InstitusjonFerdigVisning;
