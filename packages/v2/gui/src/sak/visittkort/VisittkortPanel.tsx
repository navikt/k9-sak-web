import {
  PersonopplysningDtoNavBrukerKjonn as navBrukerKjonn,
  PersonDtoPersonstatusType as personstatus,
  type DirekteOvergangDto,
  type RelatertSakDto,
} from '@k9-sak-web/backend/k9sak/generated';
import { dateToday, initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';
import { HStack } from '@navikt/ds-react';
import { Gender, PersonCard } from '@navikt/ft-plattform-komponenter';
import { prettifyDateString } from '@navikt/ft-utils';
import { isUngWeb } from '../../utils/urlUtils';
import RelatertFagsak from './relatert-fagsak/RelatertFagsak';
import TagContainer from './TagContainer';
import type { FagsakPerson } from './types/FagsakPerson';
import type { Personopplysninger } from './types/Personopplysninger';
import VisittkortDetaljerPopup from './VisittkortDetaljerPopup';
import VisittkortLabels from './VisittkortLabels';
import styles from './visittkortPanel.module.css';

const utledKjonn = (kjonn: string): Gender => {
  if (kjonn === navBrukerKjonn.KVINNE) {
    return Gender.female;
  }
  return kjonn === navBrukerKjonn.MANN ? Gender.male : Gender.unknown;
};

export interface VisittkortPanelProps {
  fagsakPerson: FagsakPerson;
  språkkode?: string;
  personopplysninger?: Personopplysninger;
  harTilbakekrevingVerge?: boolean;
  relaterteFagsaker?: RelatertSakDto;
  direkteOvergangFraInfotrygd?: DirekteOvergangDto;
  erPbSak?: boolean;
  erHastesak?: boolean;
}

const VisittkortPanel = ({
  fagsakPerson,
  personopplysninger,
  språkkode,
  harTilbakekrevingVerge,
  relaterteFagsaker,
  direkteOvergangFraInfotrygd,
  erPbSak,
  erHastesak,
}: VisittkortPanelProps) => {
  if (!personopplysninger && !harTilbakekrevingVerge) {
    return (
      <div className={styles.container}>
        <PersonCard
          name={fagsakPerson.navn}
          fodselsnummer={fagsakPerson.personnummer}
          gender={fagsakPerson.erKvinne ? Gender.female : Gender.male}
          showPersonAge={isUngWeb()}
        />
      </div>
    );
  }
  if (harTilbakekrevingVerge) {
    return (
      <div className={styles.container}>
        <PersonCard
          name={fagsakPerson.navn}
          fodselsnummer={fagsakPerson.personnummer}
          gender={fagsakPerson.erKvinne ? Gender.female : Gender.male}
          showPersonAge={isUngWeb()}
          renderLabelContent={() => (
            <VisittkortLabels personopplysninger={personopplysninger} harTilbakekrevingVerge={harTilbakekrevingVerge} />
          )}
        />
      </div>
    );
  }
  if (!personopplysninger) {
    return (
      <div className={styles.container}>
        <PersonCard
          name={fagsakPerson.navn}
          fodselsnummer={fagsakPerson.personnummer}
          gender={fagsakPerson.erKvinne ? Gender.female : Gender.male}
        />
      </div>
    );
  }

  const søker = personopplysninger;
  const annenPart = typeof personopplysninger?.annenPart !== 'undefined' ? personopplysninger.annenPart : null;
  const barnSoktFor =
    personopplysninger?.barnSoktFor && personopplysninger.barnSoktFor?.length > 0
      ? personopplysninger.barnSoktFor
      : null;
  const erDirekteOvergangFraInfotrygd =
    direkteOvergangFraInfotrygd && direkteOvergangFraInfotrygd?.skjæringstidspunkter?.length > 0;
  const erUtenlandssak = personopplysninger?.pleietrengendePart?.personstatus === personstatus.ADNR;

  const beregnAlderPåBarn = (fødselsdato: string) => {
    const iDag = dateToday();
    const formatertFødselsdato = initializeDate(fødselsdato);
    if (iDag.diff(formatertFødselsdato, 'year') > 0) {
      return `${iDag.diff(formatertFødselsdato, 'year')} år`;
    }
    return `${iDag.diff(formatertFødselsdato, 'months')} mnd`;
  };

  return (
    <div className={styles.container}>
      <HStack gap="4">
        <PersonCard
          name={søker.navn}
          fodselsnummer={søker.fnr}
          gender={utledKjonn(søker.navBrukerKjonn)}
          renderMenuContent={() => <VisittkortDetaljerPopup personopplysninger={søker} språkkode={språkkode} />}
          renderLabelContent={() => <VisittkortLabels personopplysninger={søker} />}
          showPersonAge={isUngWeb()}
        />

        {annenPart?.aktoerId && (
          <PersonCard
            name={annenPart.navn}
            fodselsnummer={annenPart.fnr}
            gender={utledKjonn(annenPart.navBrukerKjonn)}
            renderMenuContent={() => <VisittkortDetaljerPopup personopplysninger={annenPart} språkkode={språkkode} />}
            isActive={false}
          />
        )}

        <RelatertFagsak relaterteFagsaker={relaterteFagsaker} />
        <div className={styles.pushRight}>
          <HStack gap="2">
            {barnSoktFor?.map(barn => (
              <div className={styles.flexContainer} key={barn.aktoerId}>
                <PersonCard
                  name={barn.navn}
                  fodselsnummer={barn.fnr}
                  gender={utledKjonn(barn.navBrukerKjonn)}
                  isChild
                  childAge={`Født ${prettifyDateString(barn.fodselsdato)}, ${beregnAlderPåBarn(barn.fodselsdato)}`}
                />
                {barn.dodsdato && <p className={styles.dødsdatoLabel}>{`Død ${prettifyDateString(barn.dodsdato)}`}</p>}
              </div>
            ))}
          </HStack>
          {erDirekteOvergangFraInfotrygd && <TagContainer tagVariant="info">Fra Infotrygd</TagContainer>}
          {erPbSak && <TagContainer tagVariant="warning">PB-sak</TagContainer>}
          {erUtenlandssak && <TagContainer tagVariant="success">Utenlandssak</TagContainer>}
          {erHastesak && <TagContainer tagVariant="error">Hastesak</TagContainer>}
        </div>
      </HStack>
    </div>
  );
};

export default VisittkortPanel;
