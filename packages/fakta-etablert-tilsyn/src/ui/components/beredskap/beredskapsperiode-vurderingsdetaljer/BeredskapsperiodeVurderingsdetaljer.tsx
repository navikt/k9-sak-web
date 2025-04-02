import { LabelledContent } from '@k9-sak-web/gui/shared/labelledContent/LabelledContent.js';
import { Box, Link } from '@navikt/ds-react';
import { AssessedBy, DetailView } from '@navikt/ft-plattform-komponenter';
import { type JSX } from 'react';
import Beskrivelse from '../../../../types/Beskrivelse';
import Vurderingsperiode from '../../../../types/Vurderingsperiode';
import Vurderingsresultat from '../../../../types/Vurderingsresultat';
import BeskrivelserForPerioden from '../../beskrivelser-for-perioden/BeskrivelserForPerioden';
import WriteAccessBoundContent from '../../write-access-bound-content/WriteAccessBoundContent';
import styles from './beredskapsperiodeVurderingsdetaljer.module.css';

interface BeredskapsperiodeVurderingsdetaljerProps {
  beredskapsperiode: Vurderingsperiode;
  onEditClick: () => void;
  beskrivelser: Beskrivelse[];
}

const BeredskapsperiodeVurderingsdetaljer = ({
  beredskapsperiode,
  onEditClick,
  beskrivelser,
}: BeredskapsperiodeVurderingsdetaljerProps): JSX.Element => {
  const { opprettetAv, opprettetTidspunkt } = beredskapsperiode;
  return (
    <DetailView
      title="Vurdering av beredskap"
      contentAfterTitleRenderer={() => (
        <WriteAccessBoundContent
          contentRenderer={() => (
            <Link as="button" className={styles.endreLink} onClick={onEditClick}>
              Rediger vurdering
            </Link>
          )}
        />
      )}
    >
      <Box marginBlock="6 0">
        <BeskrivelserForPerioden periodebeskrivelser={beskrivelser} />
      </Box>
      <Box marginBlock="8 0">
        <LabelledContent
          label="Vurdering av om det er behov for beredskap"
          content={<span className="whitespace-pre-wrap">{beredskapsperiode.begrunnelse}</span>}
          indentContent
        />
        <AssessedBy ident={opprettetAv} date={opprettetTidspunkt} />
      </Box>
      <Box marginBlock="8 0">
        <LabelledContent
          label="Er det behov for beredskap?"
          content={beredskapsperiode.resultat === Vurderingsresultat.OPPFYLT ? 'Ja' : 'Nei'}
        />
      </Box>
      <Box marginBlock="8 0">
        <LabelledContent label="Perioder vurdert" content={beredskapsperiode.periode.prettifyPeriod()} />
      </Box>
    </DetailView>
  );
};

export default BeredskapsperiodeVurderingsdetaljer;
