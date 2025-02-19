import { Box } from '@navikt/ds-react';
import { AssessedBy, LabelledContent } from '@navikt/ft-plattform-komponenter';
import type { InstitusjonVurderingMedPerioder } from '../../InstitusjonTypes';
import Vurderingsresultat from '../../Vurderingsresultat';

interface OwnProps {
  vurdering: InstitusjonVurderingMedPerioder;
  readOnly: boolean;
  rediger: () => void;
}

const InstitusjonFerdigVisning = ({ vurdering }: OwnProps) => (
  <>
    <Box className="mt-8">
      <LabelledContent
        label="Gjør en vurdering av om opplæringen gjennomgås ved en godkjent helseinstitusjon eller et offentlig spesialpedagogisk kompetansesenter etter § 9-14, første ledd."
        content={<span className="whitespace-pre-wrap">{vurdering.begrunnelse}</span>}
        indentContent
      />
      <AssessedBy ident={vurdering?.vurdertAv} date={vurdering?.vurdertTidspunkt} />
    </Box>
    <Box className="mt-8">
      <LabelledContent
        label="Er opplæringen ved godkjent helseinstitusjon eller kompetansesenter?"
        content={
          [Vurderingsresultat.GODKJENT_AUTOMATISK, Vurderingsresultat.GODKJENT_MANUELT].includes(vurdering.resultat)
            ? 'Ja'
            : 'Nei'
        }
      />
    </Box>
  </>
);

export default InstitusjonFerdigVisning;
