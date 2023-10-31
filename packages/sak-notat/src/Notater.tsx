import { NavAnsatt, NotatResponse } from '@k9-sak-web/types';
import { Alert, Button, Heading, Loader, Switch } from '@navikt/ds-react';
import { CheckboxField, Form, TextAreaField } from '@navikt/ft-form-hooks';
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormattedMessage, RawIntlProvider, createIntl, createIntlCache } from 'react-intl';
import messages from '../i18n/nb_NO.json';
import ChatComponent from './components/ChatComponent';
import styles from './notater.module.css';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

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
  navAnsatt: NavAnsatt;
  submitNotat: (data: Inputs, id?: number, fagsakIdFraRedigertNotat?: string, versjon?: number) => void;
  submitSkjulNotat: ({ skjul, id, saksnummer, versjon }: skjulNotatMutationVariables) => void;
  isLoading: boolean;
  hasGetNotaterError: boolean;
  notater: NotatResponse[];
  postNotatMutationError: boolean;
  formMethods: UseFormReturn<Inputs, any, undefined>;
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
    <RawIntlProvider value={intl}>
      {isLoading ? (
        <Loader className={styles.loader} variant="neutral" size="xlarge" title="venter..." />
      ) : (
        <>
          <div className={styles.heading}>
            <Heading level="3" size="xsmall">
              <FormattedMessage id="NotatISakIndex.NotaterISak" />
            </Heading>
            <Switch checked={visSkjulteNotater} size="small" onClick={toggleVisSkjulteNotater}>
              <FormattedMessage id="NotatISakIndex.VisSkjulteNotater" />
            </Switch>
          </div>
          <Form<Inputs> formMethods={formMethods} onSubmit={submit}>
            <div className={styles.nyttNotat}>
              <TextAreaField
                name="notatTekst"
                size="small"
                label={<FormattedMessage id="NotatISakIndex.SkrivNyttNotat" />}
              />
            </div>
            {fagsakHarPleietrengende && (
              <CheckboxField
                className={styles.visAlleNotater}
                name="visNotatIAlleSaker"
                label={<FormattedMessage id="NotatISakIndex.VisNotatTilknyttetPleietrengende" />}
              />
            )}
            <Button type="submit" className={styles.leggTilNotatKnapp} size="small" variant="primary">
              <FormattedMessage id="NotatISakIndex.LeggTilNotatButton" />
            </Button>
          </Form>
          {!hasGetNotaterError && notater?.length === 0 && (
            <Alert className={styles.alert} size="small" variant="info">
              <FormattedMessage id="NotatISakIndex.IngenNotaterAlert" />
            </Alert>
          )}
          {alleNotaterErSkjulte && !visSkjulteNotater && (
            <Alert className={styles.alert} size="small" variant="info">
              <FormattedMessage id="NotatISakIndex.IngenAktiveNotaterAlert" />
            </Alert>
          )}
          {hasGetNotaterError && (
            <Alert className={styles.alert} size="small" variant="error">
              <FormattedMessage id="NotatISakIndex.NoeGikkGaltHentingNotater" />
            </Alert>
          )}
          {postNotatMutationError && (
            <Alert className={styles.alert} size="small" variant="error">
              <FormattedMessage id="NotatISakIndex.NoeGikkGaltLagringNotater" />
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
    </RawIntlProvider>
  );
};
export default Notater;
