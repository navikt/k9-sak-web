import { DetailView } from '@k9-sak-web/gui/shared/detailView/DetailView.js';
import { LabelledContent } from '@k9-sak-web/gui/shared/labelled-content/LabelledContent.js';
import { VurdertAv } from '@k9-sak-web/gui/shared/vurdert-av/VurdertAv.js';
import WriteAccessBoundContent from '@k9-sak-web/gui/shared/write-access-bound-content/WriteAccessBoundContent.js';
import { Box, Button } from '@navikt/ds-react';
import Beskrivelse from '../../../../types/Beskrivelse';
import Vurderingsperiode from '../../../../types/Vurderingsperiode';
import Vurderingsresultat from '../../../../types/Vurderingsresultat';
import ContainerContext from '../../../context/ContainerContext';
import BeskrivelserForPerioden from '../../beskrivelser-for-perioden/BeskrivelserForPerioden';
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
  const { readOnly } = React.useContext(ContainerContext) || {};
  const { opprettetAv, opprettetTidspunkt } = nattevåksperiode;
  return (
    <DetailView
      title="Vurdering av nattevåk"
      contentAfterTitleRenderer={() => (
        <WriteAccessBoundContent
          contentRenderer={() => (
            <Button variant="tertiary" size="xsmall" className={styles.endreLink} onClick={onEditClick}>
              Rediger vurdering
            </Button>
          )}
          readOnly={!!readOnly}
        />
      )}
    >
      <Box marginBlock="6 0">
        <BeskrivelserForPerioden periodebeskrivelser={beskrivelser} />
      </Box>
      <Box marginBlock="8 0">
        <LabelledContent
          label="Vurdering av om det er behov for nattevåk"
          content={<span className="whitespace-pre-wrap">{nattevåksperiode.begrunnelse}</span>}
          indentContent
        />
        <VurdertAv ident={opprettetAv} date={opprettetTidspunkt} />
      </Box>
      <Box marginBlock="8 0">
        <LabelledContent
          label="Er det behov for nattevåk?"
          content={nattevåksperiode.resultat === Vurderingsresultat.OPPFYLT ? 'Ja' : 'Nei'}
        />
      </Box>
      <Box marginBlock="8 0">
        <LabelledContent label="Perioder vurdert" content={nattevåksperiode.periode.prettifyPeriod()} />
      </Box>
    </DetailView>
  );
};

export default NattevåksperiodeVurderingsdetaljer;
