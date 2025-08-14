import type {
  sif_abac_kontrakt_abac_InnloggetAnsattDto as InnloggetAnsattDto,
  k9_sak_kontrakt_notat_NotatDto as NotatDto,
} from '@k9-sak-web/backend/k9sak/generated';
import { Alert, Button, Heading, Loader, Switch } from '@navikt/ds-react';
import { RhfCheckbox, RhfForm, RhfTextarea } from '@navikt/ft-form-hooks';
import React, { useMemo, useState } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import ChatComponent, { type EndreNotatPayload, type SkjulNotatPayload } from './components/ChatComponent';
import styles from './notater.module.css';
import type { FormState } from './types/FormState';

export interface skjulNotatMutationVariables {
  skjul: boolean;
  id: string;
  saksnummer: string;
  versjon: number;
}

interface NotaterProps {
  fagsakId: string;
  navAnsatt: Pick<InnloggetAnsattDto, 'brukernavn'>;
  opprettNotat: (formState: FormState) => void;
  endreNotat: (formState: FormState, id: string, fagsakIdFraRedigertNotat: string, versjon: number) => void;
  skjulNotat: ({ skjul, id, saksnummer, versjon }: SkjulNotatPayload) => void;
  isLoading: boolean;
  hasGetNotaterError: boolean;
  notater: NotatDto[];
  hasLagreNotatError: boolean;
  formMethods: UseFormReturn<FormState>;
  fagsakHarPleietrengende: boolean;
}

const Notater: React.FunctionComponent<NotaterProps> = ({
  fagsakId,
  navAnsatt,
  opprettNotat,
  isLoading,
  hasGetNotaterError,
  notater,
  hasLagreNotatError,
  skjulNotat,
  formMethods,
  fagsakHarPleietrengende,
  endreNotat,
}) => {
  const [visSkjulteNotater, setVisSkjulteNotater] = useState(false);

  const toggleVisSkjulteNotater = () => {
    setVisSkjulteNotater(current => !current);
  };

  const submitNyttNotat = (data: FormState) => opprettNotat(data);

  const alleNotaterErSkjulte = useMemo(() => notater?.every(notat => notat.skjult), [notater]);

  const handleEndreNotat = (data: EndreNotatPayload) =>
    endreNotat(data.formState, data.id, data.saksnummer, data.versjon);

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
            <Switch checked={visSkjulteNotater} size="small" onChange={toggleVisSkjulteNotater}>
              Vis skjulte notater
            </Switch>
          </div>
          <RhfForm<FormState> formMethods={formMethods} onSubmit={submitNyttNotat}>
            <div className={styles.nyttNotat}>
              <RhfTextarea control={formMethods.control} name="notatTekst" size="small" label="Skriv et nytt notat" />
            </div>
            {fagsakHarPleietrengende && (
              <RhfCheckbox
                control={formMethods.control}
                className={styles.visAlleNotater}
                name="visNotatIAlleSaker"
                label="Vis notat i alle saker tilknyttet pleietrengende"
              />
            )}
            <Button type="submit" className={styles.leggTilNotatKnapp} size="small" variant="primary">
              Legg til notat
            </Button>
          </RhfForm>
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
          {hasLagreNotatError && (
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
                    endreNotat={handleEndreNotat}
                    navAnsatt={navAnsatt}
                    skjulNotat={skjulNotat}
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
