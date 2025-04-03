import { sortPeriodsByFomDate } from '@fpsak-frontend/utils';
import { LabelledContent } from '@k9-sak-web/gui/shared/labelledContent/LabelledContent.js';
import { MinusIcon, PlusCircleIcon } from '@navikt/aksel-icons';
import { Box, Button } from '@navikt/ds-react';
import { ContentWithTooltip, OnePersonIconGray, OnePersonOutlineGray } from '@navikt/ft-plattform-komponenter';
import { useState, type JSX } from 'react';
import Beskrivelse from '../../../types/Beskrivelse';
import Kilde from '../../../types/Kilde';
import { prettifyDate } from '../../../util/formats';
import styles from './beskrivelserForPerioden.module.css';

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
  const [visAlleBeskrivelser, setVisAlleBeskrivelser] = useState(periodebeskrivelser?.length <= 3);
  if (periodebeskrivelser?.length > 0) {
    const sortertePeriodebeskrivelser = [
      ...periodebeskrivelser
        .sort((periode1, periode2) => sortPeriodsByFomDate(periode1.periode, periode2.periode))
        .reverse(),
    ];
    return (
      <>
        {sortertePeriodebeskrivelser
          .filter((periodebeskrivelse, index) => (visAlleBeskrivelser ? true : index <= 2))
          .map(periodebeskrivelse => (
            <Box marginBlock="0 6" key={periodebeskrivelse.tekst}>
              <LabelledContent
                label={getLabel(periodebeskrivelse)}
                content={<span className="whitespace-pre-wrap">{periodebeskrivelse.tekst}</span>}
                labelTag="div"
              />
            </Box>
          ))}
        {sortertePeriodebeskrivelser.length > 3 && (
          <Button
            icon={visAlleBeskrivelser ? <MinusIcon /> : <PlusCircleIcon />}
            onClick={() => setVisAlleBeskrivelser(!visAlleBeskrivelser)}
            size="small"
            type="button"
            variant="secondary"
          >
            {visAlleBeskrivelser ? 'Skjul tidligere beskrivelser' : 'Vis tidligere beskrivelser'}
          </Button>
        )}
        <hr className={styles.beskrivelserForPerioden__separator} />
      </>
    );
  }
  return null;
};

export default BeskrivelserForPerioden;
