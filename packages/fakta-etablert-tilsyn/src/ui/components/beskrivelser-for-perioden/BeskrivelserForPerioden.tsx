import {
  Box,
  Margin,
  ContentWithTooltip,
  LabelledContent,
  OnePersonIconGray,
  OnePersonOutlineGray,
} from '@navikt/ft-plattform-komponenter';
import * as React from 'react';
import Beskrivelse from '../../../types/Beskrivelse';
import Kilde from '../../../types/Kilde';
import { prettifyDate } from '../../../util/formats';
import styles from './beskrivelserForPerioden.css';

interface BeskrivelserForPeriodenProps {
  periodebeskrivelser: Beskrivelse[];
}

const getLabel = (periodebeskrivelse: Beskrivelse) => {
  const kilde = periodebeskrivelse.kilde === Kilde.ANDRE ? 'annen part' : 'søker';
  return (
    <div className={styles.beskrivelserForPerioden__label}>
      {periodebeskrivelse.kilde === Kilde.ANDRE ? (
        <ContentWithTooltip tooltipText="Annen part">
          <OnePersonOutlineGray />
        </ContentWithTooltip>
      ) : (
        <ContentWithTooltip tooltipText="Søker">
          <OnePersonIconGray />
        </ContentWithTooltip>
      )}
      <p className={styles.beskrivelserForPerioden__labelText}>
        {`Beskrivelse fra ${kilde}
                 for perioden ${periodebeskrivelse.periode.prettifyPeriod()} (mottatt ${prettifyDate(
                   periodebeskrivelse.mottattDato,
                 )}):`}
      </p>
    </div>
  );
};

const BeskrivelserForPerioden = ({ periodebeskrivelser }: BeskrivelserForPeriodenProps): JSX.Element | null => {
  if (periodebeskrivelser?.length > 0) {
    return (
      <>
        {periodebeskrivelser.map((periodebeskrivelse, index) => (
          <Box marginBottom={Margin.large} key={periodebeskrivelse.tekst}>
            <LabelledContent label={getLabel(periodebeskrivelse)} content={periodebeskrivelse.tekst} labelTag="div" />
          </Box>
        ))}
        <hr className={styles.beskrivelserForPerioden__separator} />
      </>
    );
  }
  return null;
};

export default BeskrivelserForPerioden;
