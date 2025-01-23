import type { InnloggetAnsattDto } from '@k9-sak-web/backend/k9sak/generated';
import { Alert, Button, Heading, Loader, Switch } from '@navikt/ds-react';
import { CheckboxField, Form, TextAreaField } from '@navikt/ft-form-hooks';
import React, { useState } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import ChatComponent from './components/ChatComponent';
import styles from './notater.module.css';
import type { NotatResponse } from './types/NotatResponse';

export type Inputs = {
  notatTekst: string;
  visNotatIAlleSaker: boolean;
};

export interface skjulNotatMutationVariables {
  skjul: boolean;
  id: number;
  saksnummer: string;
  versjon: number;
}

interface NotaterProps {
  fagsakId: string;
  navAnsatt: Pick<InnloggetAnsattDto, 'brukernavn'>;
  submitNotat: (data: Inputs, id?: number, fagsakIdFraRedigertNotat?: string, versjon?: number) => void;
  submitSkjulNotat: ({ skjul, id, saksnummer, versjon }: skjulNotatMutationVariables) => void;
  isLoading: boolean;
  hasGetNotaterError: boolean;
  notater: NotatResponse[];
  postNotatMutationError: boolean;
  formMethods: UseFormReturn<Inputs>;
  fagsakHarPleietrengende: boolean;
}

const Notater: React.FunctionComponent<NotaterProps> = ({
  fagsakId,
  navAnsatt,
  submitNotat,
  isLoading,
  hasGetNotaterError,
  notater,
  postNotatMutationError,
  submitSkjulNotat,
  formMethods,
  fagsakHarPleietrengende,
}) => {
  const [visSkjulteNotater, setVisSkjulteNotater] = useState(false);

  const toggleVisSkjulteNotater = () => {
    setVisSkjulteNotater(current => !current);
  };

  const submit = (data: Inputs) => submitNotat(data);

  const alleNotaterErSkjulte = notater?.every(notat => notat.skjult);

  return (
    <>
      {isLoading ? (
        <Loader className={styles.loader} variant="neutral" size="xlarge" title="venter..." />
      ) : (
        <>
          <div className={styles.heading}>
            <Heading level="3" size="xsmall">
              Notater i sak
            </Heading>
            <Switch checked={visSkjulteNotater} size="small" onClick={toggleVisSkjulteNotater}>
              Vis skjulte notater
            </Switch>
          </div>
          <Form<Inputs> formMethods={formMethods} onSubmit={submit}>
            <div className={styles.nyttNotat}>
              <TextAreaField name="notatTekst" size="small" label="Skriv et nytt notat" />
            </div>
            {fagsakHarPleietrengende && (
              <CheckboxField
                className={styles.visAlleNotater}
                name="visNotatIAlleSaker"
                label="Vis notat i alle saker tilknyttet pleietrengende"
              />
            )}
            <Button type="submit" className={styles.leggTilNotatKnapp} size="small" variant="primary">
              Legg til notat
            </Button>
          </Form>
          {!hasGetNotaterError && notater?.length === 0 && (
            <Alert className={styles.alert} size="small" variant="info">
              Ingen notater er publisert i saken
            </Alert>
          )}
          {alleNotaterErSkjulte && !visSkjulteNotater && notater?.length > 0 && (
            <Alert className={styles.alert} size="small" variant="info">
              Ingen aktive notater i saken
            </Alert>
          )}
          {hasGetNotaterError && (
            <Alert className={styles.alert} size="small" variant="error">
              Noe gikk galt ved henting av notater, vennligst prøv igjen senere
            </Alert>
          )}
          {postNotatMutationError && (
            <Alert className={styles.alert} size="small" variant="error">
              Noe gikk galt ved lagring av notater, vennligst prøv igjen senere
            </Alert>
          )}
          {notater?.length > 0 && (
            <div className={styles.notater}>
              {notater
                .filter(notat => visSkjulteNotater || !notat.skjult)
                .map(notat => (
                  <ChatComponent
                    key={notat.notatId}
                    notat={notat}
                    postNotat={data => submitNotat(data.data, data.id, data.saksnummer, data.versjon)}
                    navAnsatt={navAnsatt}
                    skjulNotat={data => submitSkjulNotat(data)}
                    fagsakId={fagsakId}
                  />
                ))}
            </div>
          )}
        </>
      )}
    </>
  );
};
export default Notater;
