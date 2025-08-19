import { BodyShort, Box, Button, Checkbox } from '@navikt/ds-react';
import React, { type JSX } from 'react';
import styles from './fristForDokumentasjonUtløptPanel.module.css';

interface FristForDokumentasjonUtløptPanelProps {
  onProceedClick: () => void;
}

const FristForDokumentasjonUtløptPanel = ({ onProceedClick }: FristForDokumentasjonUtløptPanelProps): JSX.Element => {
  const [fristenErUtløpt, setFristenErUtløpt] = React.useState(false);
  return (
    <Box.New padding="4" borderWidth="2">
      <BodyShort size="small">
        Dersom du ikke får dokumentasjon innen fristen, kan du avslå vilkåret og gå videre til vedtaksbrev.
      </BodyShort>
      <div className={styles.fristForDokumentasjonUtløptPanel__formContainer}>
        <Box.New marginBlock="2 0">
          <Checkbox
            name="fristenErUtløpt"
            checked={fristenErUtløpt === true}
            onChange={() => setFristenErUtløpt(!fristenErUtløpt)}
          >
            Legeerklæring fra sykehus/spesialisthelsetjenesten etter §9-16 første ledd er ikke mottatt innen fristen
          </Checkbox>
        </Box.New>
        {fristenErUtløpt === true && (
          <Button
            onClick={onProceedClick}
            size="small"
            className={styles.fristForDokumentasjonUtløptPanel__formContainer__gåVidereKnapp}
          >
            Gå videre
          </Button>
        )}
      </div>
    </Box.New>
  );
};

export default FristForDokumentasjonUtløptPanel;
