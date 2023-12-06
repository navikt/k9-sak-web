import { Box, Margin, DetailView, LabelledContent, LinkButton, AssessedBy } from '@navikt/ft-plattform-komponenter';
import React, { useContext } from 'react';
import Beskrivelse from '../../../../types/Beskrivelse';
import Vurderingsperiode from '../../../../types/Vurderingsperiode';
import Vurderingsresultat from '../../../../types/Vurderingsresultat';
import ContainerContext from '../../../context/ContainerContext';
import BeskrivelserForPerioden from '../../beskrivelser-for-perioden/BeskrivelserForPerioden';
import WriteAccessBoundContent from '../../write-access-bound-content/WriteAccessBoundContent';
import styles from './nattevåksperiodeVurderingsdetaljer.module.css';

interface NattevåksperiodeVurderingsdetaljerProps {
  nattevåksperiode: Vurderingsperiode;
  onEditClick: () => void;
  beskrivelser: Beskrivelse[];
}

const NattevåksperiodeVurderingsdetaljer = ({
  nattevåksperiode,
  onEditClick,
  beskrivelser,
}: NattevåksperiodeVurderingsdetaljerProps) => {
  const { saksbehandlere } = useContext(ContainerContext);
  const { opprettetAv, opprettetTidspunkt } = nattevåksperiode;
  return (
    <DetailView
      title="Vurdering av nattevåk"
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
          label="Vurdering av om det er behov for nattevåk"
          content={nattevåksperiode.begrunnelse}
          indentContent
        />
        <AssessedBy name={saksbehandlere[opprettetAv] || opprettetAv} date={opprettetTidspunkt} />
      </Box>
      <Box marginTop={Margin.xLarge}>
        <LabelledContent
          label="Er det behov for nattevåk?"
          content={nattevåksperiode.resultat === Vurderingsresultat.OPPFYLT ? 'Ja' : 'Nei'}
        />
      </Box>
      <Box marginTop={Margin.xLarge}>
        <LabelledContent label="Perioder vurdert" content={nattevåksperiode.periode.prettifyPeriod()} />
      </Box>
    </DetailView>
  );
};

export default NattevåksperiodeVurderingsdetaljer;
