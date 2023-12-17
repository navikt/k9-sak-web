import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import { FlexColumn, FlexContainer, FlexRow } from '@fpsak-frontend/shared-components';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils/src/formats';
import {
  FagsakPerson,
  Kodeverk,
  KodeverkMedNavn,
  Personopplysninger,
  RelatertFagsak as RelatertFagsakType,
} from '@k9-sak-web/types';
import OvergangFraInfotrygd from '@k9-sak-web/types/src/overgangFraInfotrygd';
import { Gender, PersonCard } from '@navikt/ft-plattform-komponenter';
import moment from 'moment';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import RelatertFagsak from './RelatertFagsak';
import TagContainer from './TagContainer';
import VisittkortDetaljerPopup from './VisittkortDetaljerPopup';
import VisittkortLabels from './VisittkortLabels';
import styles from './visittkortPanel.module.css';

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
  direkteOvergangFraInfotrygd?: OvergangFraInfotrygd;
  erPbSak?: boolean;
  erHastesak?: boolean;
}

const VisittkortPanel = ({
  fagsakPerson,
  personopplysninger,
  alleKodeverk,
  sprakkode,
  harTilbakekrevingVerge,
  relaterteFagsaker,
  direkteOvergangFraInfotrygd,
  erPbSak,
  erHastesak,
}: OwnProps) => {
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
  const erDirekteOvergangFraInfotrygd = direkteOvergangFraInfotrygd?.skjæringstidspunkter?.length > 0;
  const erUtenlandssak = personopplysninger?.pleietrengendePart?.personstatus?.kode === personstatusType.AKTIVT;

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
            <RelatertFagsak relaterteFagsakerResponse={relaterteFagsaker} />
          </FlexColumn>
          <div className={styles.pushRight}>
            {barnSoktFor &&
              barnSoktFor.map(barn => (
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
            {erDirekteOvergangFraInfotrygd && (
              <TagContainer tagVariant="info">
                <FormattedMessage id="VisittkortPanel.FraInfotrygd" />
              </TagContainer>
            )}
            {erPbSak && (
              <TagContainer tagVariant="warning">
                <FormattedMessage id="VisittkortPanel.PB" />
              </TagContainer>
            )}
            {erUtenlandssak && (
              <TagContainer tagVariant="success">
                <FormattedMessage id="VisittkortPanel.Utenlandssak" />
              </TagContainer>
            )}
            {erHastesak && (
              <TagContainer tagVariant="error">
                <FormattedMessage id="VisittkortPanel.Hastesak" />
              </TagContainer>
            )}
          </div>
        </FlexRow>
      </FlexContainer>
    </div>
  );
};

export default VisittkortPanel;
