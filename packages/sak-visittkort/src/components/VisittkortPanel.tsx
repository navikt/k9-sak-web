import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import { FlexColumn, FlexContainer, FlexRow } from '@fpsak-frontend/shared-components';
import { Fagsak, Kodeverk, Personopplysninger, KodeverkMedNavn } from '@k9-sak-web/types';
import { Gender, PersonCard } from '@navikt/nap-person-card';
import React, { FunctionComponent } from 'react';
import { injectIntl, WrappedComponentProps, FormattedMessage } from 'react-intl';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils/src/formats';
import moment from 'moment';
import VisittkortDetaljerPopup from './VisittkortDetaljerPopup';
import VisittkortLabels from './VisittkortLabels';
import styles from './visittkortPanel.less';

const utledKjonn = kjonn => {
  if (kjonn.kode === navBrukerKjonn.KVINNE) {
    return Gender.female;
  }
  return kjonn.kode === navBrukerKjonn.MANN ? Gender.male : Gender.unknown;
};

interface OwnProps {
  fagsak: Fagsak;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  sprakkode?: Kodeverk;
  personopplysninger?: Personopplysninger;
  harTilbakekrevingVerge: boolean;
}

const VisittkortPanel: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  // intl,
  fagsak,
  personopplysninger,
  // lenkeTilAnnenPart,
  alleKodeverk,
  sprakkode,
  harTilbakekrevingVerge,
}) => {
  if (!personopplysninger && !harTilbakekrevingVerge) {
    const { person } = fagsak;
    return (
      <div className={styles.container}>
        <PersonCard
          name={person.navn}
          fodselsnummer={person.personnummer}
          gender={person.erKvinne ? Gender.female : Gender.male}
        />
      </div>
    );
  }
  if (harTilbakekrevingVerge) {
    const { person } = fagsak;
    return (
      <div className={styles.container}>
        <PersonCard
          name={person.navn}
          fodselsnummer={person.personnummer}
          gender={person.erKvinne ? Gender.female : Gender.male}
          renderLabelContent={(): JSX.Element => (
            <VisittkortLabels personopplysninger={personopplysninger} harTilbakekrevingVerge={harTilbakekrevingVerge} />
          )}
        />
      </div>
    );
  }
  // const erMor = fagsak.relasjonsRolleType.kode === relasjonsRolleType.MOR;

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
              // url={lenkeTilAnnenPart}
              renderMenuContent={(): JSX.Element => (
                <VisittkortDetaljerPopup personopplysninger={soker} alleKodeverk={alleKodeverk} sprakkode={sprakkode} />
              )}
              renderLabelContent={(): JSX.Element => <VisittkortLabels personopplysninger={soker} />}
              // isActive={erMor}
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
          {/* {annenPart && !annenPart.aktoerId && (
            <FlexColumn>
              <EmptyPersonCard namePlaceholder={intl.formatMessage({ id: 'VisittkortPanel.Ukjent' })} />
            </FlexColumn>
          )} */}
        </FlexRow>
      </FlexContainer>
    </div>
  );
};

export default injectIntl(VisittkortPanel);
