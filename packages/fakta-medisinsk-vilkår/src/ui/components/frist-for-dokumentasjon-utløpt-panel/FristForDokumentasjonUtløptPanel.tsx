import { BodyShort, Button, Checkbox } from '@navikt/ds-react';
import { Box, InfoPanel, Margin } from '@navikt/ft-plattform-komponenter';
import React from 'react';
import styles from './fristForDokumentasjonUtløptPanel.css';

interface FristForDokumentasjonUtløptPanelProps {
  onProceedClick: () => void;
}

const FristForDokumentasjonUtløptPanel = ({ onProceedClick }: FristForDokumentasjonUtløptPanelProps): JSX.Element => {
  const [fristenErUtløpt, setFristenErUtløpt] = React.useState(false);
  return (
    <InfoPanel type="warning">
      <BodyShort size="small">
        Dersom du ikke får dokumentasjon innen fristen, kan du avslå vilkåret og gå videre til vedtaksbrev.
      </BodyShort>
      <div className={styles.fristForDokumentasjonUtløptPanel__formContainer}>
        <Box marginTop={Margin.small}>
          <Checkbox
            name="fristenErUtløpt"
            checked={fristenErUtløpt === true}
            onChange={() => setFristenErUtløpt(!fristenErUtløpt)}
          >
            Legeerklæring fra sykehus/spesialisthelsetjenesten etter §9-16 første ledd er ikke mottatt innen fristen
          </Checkbox>
        </Box>
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
    </InfoPanel>
  );
};

export default FristForDokumentasjonUtløptPanel;
