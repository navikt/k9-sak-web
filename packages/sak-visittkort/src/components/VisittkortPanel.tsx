import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { PersonCard, Gender } from '@navikt/k9-react-components';

import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils/src/formats';
import { FlexColumn, FlexContainer, FlexRow } from '@fpsak-frontend/shared-components';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import {
  Kodeverk,
  KodeverkMedNavn,
  Personopplysninger,
  FagsakPerson,
  RelatertFagsak as RelatertFagsakType,
} from '@k9-sak-web/types';

import VisittkortDetaljerPopup from './VisittkortDetaljerPopup';
import VisittkortLabels from './VisittkortLabels';

import styles from './visittkortPanel.less';
import RelatertFagsak from './RelatertFagsak';

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
  relaterteFagsaker: RelatertFagsakType;
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
  const annenPart = typeof personopplysninger.annenPart !== 'undefined' ? personopplysninger.annenPart : null;
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
          <FlexColumn>
            <RelatertFagsak relaterteFagsaker={relaterteFagsaker} />
          </FlexColumn>
          {barnSoktFor && (
            <div className={styles.pushRight}>
              {barnSoktFor.map(barn => (
                <FlexColumn key={barn.aktoerId}>
                  <div className={styles.flexContainer}>
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
                    {barn.dodsdato && (
                      <p className={styles.dødsdatoLabel}>
                        {`Død ${moment(barn.dodsdato).format(DDMMYYYY_DATE_FORMAT)}`}
                      </p>
                    )}
                  </div>
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
