import {
  k9_kodeverk_person_NavBrukerKjønn as navBrukerKjonn,
  k9_kodeverk_person_PersonstatusType as personstatus,
  type k9_sak_kontrakt_infotrygd_DirekteOvergangDto as DirekteOvergangDto,
  type k9_sak_kontrakt_fagsak_RelatertSakDto as RelatertSakDto,
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
  hideVisittkortDetaljerPopup?: boolean;
  ungdomsytelseDeltakerStatus?: {
    deltakerErUtmeldt: boolean;
    deltakerErIProgrammet: boolean;
  };
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
  hideVisittkortDetaljerPopup,
  ungdomsytelseDeltakerStatus,
}: VisittkortPanelProps) => {
  if (!personopplysninger && !harTilbakekrevingVerge) {
    return (
      <div className={styles.container}>
        <PersonCard
          name={fagsakPerson.navn}
          fodselsnummer={fagsakPerson.personnummer}
          gender={fagsakPerson.erKvinne ? Gender.female : Gender.male}
          showPersonAge={isUngWeb()}
          age={fagsakPerson.alder}
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
          age={fagsakPerson.alder}
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
      <HStack gap="space-16">
        <HStack>
          <PersonCard
            name={søker.navn}
            fodselsnummer={søker.fnr}
            gender={utledKjonn(søker.navBrukerKjonn)}
            renderMenuContent={
              hideVisittkortDetaljerPopup
                ? undefined
                : () => <VisittkortDetaljerPopup personopplysninger={søker} språkkode={språkkode} />
            }
            renderLabelContent={() => <VisittkortLabels personopplysninger={søker} />}
            showPersonAge={isUngWeb()}
            age={fagsakPerson.alder}
          />
          <div>
            {ungdomsytelseDeltakerStatus?.deltakerErIProgrammet && (
              <TagContainer tagVariant="success">I programmet</TagContainer>
            )}
            {ungdomsytelseDeltakerStatus?.deltakerErUtmeldt && <TagContainer tagVariant="error">Utmeldt</TagContainer>}
          </div>
        </HStack>
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
          <HStack gap="space-8">
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
          <div>
            <HStack gap="space-8">
              {erDirekteOvergangFraInfotrygd && <TagContainer tagVariant="info">Fra Infotrygd</TagContainer>}
              {erPbSak && <TagContainer tagVariant="warning">PB-sak</TagContainer>}
              {erUtenlandssak && <TagContainer tagVariant="success">Utenlandssak</TagContainer>}
              {erHastesak && <TagContainer tagVariant="error">Hastesak</TagContainer>}
            </HStack>
          </div>
        </div>
      </HStack>
    </div>
  );
};

export default VisittkortPanel;
