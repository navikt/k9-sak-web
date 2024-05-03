import { useSaksbehandlerOppslag } from '@k9-sak-web/shared-components';
import { AssessedBy, Box, DetailView, LabelledContent, LinkButton, Margin } from '@navikt/ft-plattform-komponenter';
import React from 'react';
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
  const { hentSaksbehandlerNavn } = useSaksbehandlerOppslag();
  const { opprettetAv, opprettetTidspunkt } = beredskapsperiode;
  return (
    <DetailView
      title="Vurdering av beredskap"
      contentAfterTitleRenderer={() => (
        <WriteAccessBoundContent
          contentRenderer={() => (
            <LinkButton className={styles.endreLink} onClick={onEditClick}>
              Rediger vurdering
            </LinkButton>
          )}
        />
      )}
    >
      <Box marginTop={Margin.large}>
        <BeskrivelserForPerioden periodebeskrivelser={beskrivelser} />
      </Box>
      <Box marginTop={Margin.xLarge}>
        <LabelledContent
          label="Vurdering av om det er behov for beredskap"
          content={beredskapsperiode.begrunnelse}
          indentContent
        />
        <AssessedBy name={hentSaksbehandlerNavn(opprettetAv)} date={opprettetTidspunkt} />
      </Box>
      <Box marginTop={Margin.xLarge}>
        <LabelledContent
          label="Er det behov for beredskap?"
          content={beredskapsperiode.resultat === Vurderingsresultat.OPPFYLT ? 'Ja' : 'Nei'}
        />
      </Box>
      <Box marginTop={Margin.xLarge}>
        <LabelledContent label="Perioder vurdert" content={beredskapsperiode.periode.prettifyPeriod()} />
      </Box>
    </DetailView>
  );
};

export default BeredskapsperiodeVurderingsdetaljer;
