import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { PersonCard, Gender, OtherPartCard } from '@navikt/k9-react-components';
import { pathToFagsak } from '@k9-sak-web/sak-app/src/app/paths';

import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils/src/formats';
import { FlexColumn, FlexContainer, FlexRow } from '@fpsak-frontend/shared-components';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import { Kodeverk, KodeverkMedNavn, Personopplysninger, FagsakPerson, RelatertFagsak } from '@k9-sak-web/types';

import VisittkortDetaljerPopup from './VisittkortDetaljerPopup';
import VisittkortLabels from './VisittkortLabels';

import styles from './visittkortPanel.less';

const utledKjonn = (kjonn: Kodeverk): Gender => {
  if (kjonn.kode === navBrukerKjonn.KVINNE) {
    return Gender.female;
  }
  return kjonn.kode === navBrukerKjonn.MANN ? Gender.male : Gender.unknown;
};

interface OwnProps {
  fagsakPerson: FagsakPerson;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  sprakkode?: Kodeverk;
  personopplysninger?: Personopplysninger;
  harTilbakekrevingVerge?: boolean;
  relaterteFagsaker: RelatertFagsak;
}

const VisittkortPanel: FunctionComponent<OwnProps> = ({
  fagsakPerson,
  personopplysninger,
  alleKodeverk,
  sprakkode,
  harTilbakekrevingVerge,
  relaterteFagsaker,
}) => {
  if (!personopplysninger && !harTilbakekrevingVerge) {
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
  if (harTilbakekrevingVerge) {
    return (
      <div className={styles.container}>
        <PersonCard
          name={fagsakPerson.navn}
          fodselsnummer={fagsakPerson.personnummer}
          gender={fagsakPerson.erKvinne ? Gender.female : Gender.male}
          renderLabelContent={(): JSX.Element => (
            <VisittkortLabels personopplysninger={personopplysninger} harTilbakekrevingVerge={harTilbakekrevingVerge} />
          )}
        />
      </div>
    );
  }

  const soker = personopplysninger;
  const annenPart = personopplysninger.annenPart ? personopplysninger : personopplysninger.annenPart;
  const barnSoktFor = personopplysninger.barnSoktFor?.length > 0 ? personopplysninger.barnSoktFor : null;

  return (
    <div className={styles.container}>
      <FlexContainer>
        <FlexRow>
          <FlexColumn>
            <PersonCard
              name={soker.navn}
              fodselsnummer={soker.fnr}
              gender={utledKjonn(soker.navBrukerKjonn)}
              renderMenuContent={(): JSX.Element => (
                <VisittkortDetaljerPopup personopplysninger={soker} alleKodeverk={alleKodeverk} sprakkode={sprakkode} />
              )}
              renderLabelContent={(): JSX.Element => <VisittkortLabels personopplysninger={soker} />}
            />
          </FlexColumn>
          {annenPart && annenPart.aktoerId && (
            <FlexColumn>
              <PersonCard
                name={annenPart.navn}
                fodselsnummer={annenPart.fnr}
                gender={utledKjonn(annenPart.navBrukerKjonn)}
                renderMenuContent={(): JSX.Element => (
                  <VisittkortDetaljerPopup
                    personopplysninger={annenPart}
                    alleKodeverk={alleKodeverk}
                    sprakkode={sprakkode}
                  />
                )}
                isActive={false}
              />
            </FlexColumn>
          )}
          {relaterteFagsaker?.relaterteSøkere?.length > 0 &&
            relaterteFagsaker.relaterteSøkere.map(relatertFagsak => (
              <FlexColumn key={relatertFagsak.søkerIdent}>
                <OtherPartCard
                  fodselsnummer={relatertFagsak.søkerIdent}
                  name={relatertFagsak.søkerNavn}
                  url={`/k9/web${pathToFagsak(relatertFagsak.saksnummer)}`}
                />
              </FlexColumn>
            ))}
          {barnSoktFor && (
            <div className={styles.pushRight}>
              {barnSoktFor.map(barn => (
                <FlexColumn key={barn.aktoerId}>
                  <PersonCard
                    name={barn.navn}
                    fodselsnummer={barn.fnr}
                    gender={utledKjonn(barn.navBrukerKjonn)}
                    isChild
                    childAge={
                      <FormattedMessage
                        id="VisittkortBarnInfoFodselPanel.Fodt"
                        values={{ dato: moment(barn.fodselsdato).format(DDMMYYYY_DATE_FORMAT) }}
                      />
                    }
                  />
                </FlexColumn>
              ))}
            </div>
          )}
        </FlexRow>
      </FlexContainer>
    </div>
  );
};

export default VisittkortPanel;
