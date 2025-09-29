import { sortPeriodsByFomDate } from '@fpsak-frontend/utils';
import { LabelledContent } from '@k9-sak-web/gui/shared/labelled-content/LabelledContent.js';
import { MinusIcon, PersonFillIcon, PersonIcon, PlusCircleIcon } from '@navikt/aksel-icons';
import { Button, VStack } from '@navikt/ds-react';
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
        <PersonIcon fontSize="1.5rem" title="Annen part" />
      ) : (
        <PersonFillIcon fontSize="1.5rem" title="Søker" />
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
        <VStack gap="space-24">
          {sortertePeriodebeskrivelser
            .filter((periodebeskrivelse, index) => (visAlleBeskrivelser ? true : index <= 2))
            .map(periodebeskrivelse => (
              <LabelledContent
                label={getLabel(periodebeskrivelse)}
                content={<span className="whitespace-pre-wrap">{periodebeskrivelse.tekst}</span>}
                labelTag="div"
                key={periodebeskrivelse.tekst}
              />
            ))}
          {sortertePeriodebeskrivelser.length > 3 && (
            <div>
              <Button
                icon={visAlleBeskrivelser ? <MinusIcon /> : <PlusCircleIcon />}
                onClick={() => setVisAlleBeskrivelser(!visAlleBeskrivelser)}
                size="small"
                type="button"
                variant="secondary"
              >
                {visAlleBeskrivelser ? 'Skjul tidligere beskrivelser' : 'Vis tidligere beskrivelser'}
              </Button>
            </div>
          )}
        </VStack>
        <hr className={styles.beskrivelserForPerioden__separator} />
      </>
    );
  }
  return null;
};

export default BeskrivelserForPerioden;
