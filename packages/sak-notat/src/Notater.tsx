import { useLocalStorage } from '@fpsak-frontend/utils';
import { NavAnsatt } from '@k9-sak-web/types';
import { Alert, Button, Heading, Loader, Switch } from '@navikt/ds-react';
import { CheckboxField, Form, TextAreaField } from '@navikt/ft-form-hooks';
import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, RawIntlProvider, createIntl, createIntlCache } from 'react-intl';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import messages from '../i18n/nb_NO.json';
import ChatComponent from './components/ChatComponent';
import { NotatGjelderType } from './types/NotatGjelderType';
import { NotatResponse } from './types/NotatResponse';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

type Inputs = {
  notatTekst: string;
  visNotatIAlleSaker: boolean;
};

interface NotaterProps {
  fagsakId: string;
  navAnsatt: NavAnsatt;
}

const Notater: React.FunctionComponent<NotaterProps> = ({ fagsakId, navAnsatt }) => {
  const [visSkjulteNotater, setVisSkjulteNotater] = useState(false);
  const [, setLesteNotater] = useLocalStorage<number[]>('lesteNotater', []);
  const queryClient = useQueryClient();

  const notaterQueryKey = 'notater';

  const getNotater = (signal: AbortSignal) =>
    axios
      .get<NotatResponse[]>(`/k9/sak/api/notat`, {
        signal,
        params: {
          saksnummer: fagsakId,
        },
      })
      .then(({ data }) => {
        const sorterteNotater = [...data].sort(
          (notatA, notatB) => +new Date(notatA.opprettetTidspunkt) - +new Date(notatB.opprettetTidspunkt),
        );
        setLesteNotater(data.map(notat => notat.notatId));
        return sorterteNotater;
      });

  const {
    isLoading: getNotaterLoading,
    isError: hasGetNotaterError,
    refetch,
    data: notater,
  } = useQuery(notaterQueryKey, ({ signal }) => getNotater(signal));

  const toggleVisSkjulteNotater = () => {
    setVisSkjulteNotater(current => !current);
  };

  const formMethods = useForm<Inputs>({
    defaultValues: {
      notatTekst: '',
      visNotatIAlleSaker: false,
    },
  });

  const postNotat = (data: Inputs, id?: number, fagsakIdFraRedigertNotat?: string, versjon?: number) => {
    let notatGjelderType;
    if (!id) {
      notatGjelderType = data.visNotatIAlleSaker ? NotatGjelderType.pleietrengende : NotatGjelderType.fagsak;
    }
    const postUrl = id ? '/k9/sak/api/notat/endre' : '/k9/sak/api/notat';
    return axios.post(postUrl, {
      notatTekst: data.notatTekst,
      saksnummer: fagsakIdFraRedigertNotat || fagsakId,
      notatGjelderType,
      versjon: versjon || 0,
      notatId: id,
    });
  };

  interface postNotatMutationVariables {
    data: Inputs;
    id?: number;
    fagsakIdFraRedigertNotat?: string;
    versjon?: number;
  }

  const postNotatMutation = useMutation(
    ({ data, id, fagsakIdFraRedigertNotat, versjon }: postNotatMutationVariables) =>
      postNotat(data, id, fagsakIdFraRedigertNotat, versjon),
    {
      onSuccess: () => {
        formMethods.reset();
        queryClient.invalidateQueries(notaterQueryKey);
      },
    },
  );

  const skjulNotat = (skjul: boolean, id: number, saksnummer: string, versjon: number) =>
    axios.post('/k9/sak/api/notat/skjul', {
      notatId: id,
      skjul,
      saksnummer,
      versjon,
    });

  interface skjulNotatMutationVariables {
    skjul: boolean;
    id: number;
    saksnummer: string;
    versjon: number;
  }

  const skjulNotatMutation = useMutation(
    ({ skjul, id, saksnummer, versjon }: skjulNotatMutationVariables) => skjulNotat(skjul, id, saksnummer, versjon),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(notaterQueryKey);
      },
    },
  );

  const submit = (data: Inputs) => postNotatMutation.mutate({ data });

  const isLoading = getNotaterLoading || postNotatMutation.isLoading;

  return (
    <RawIntlProvider value={intl}>
      {isLoading ? (
        <Loader className="flex mx-auto" variant="neutral" size="xlarge" title="venter..." />
      ) : (
        <>
          <div className="flex justify-between items-baseline">
            <Heading level="3" size="xsmall">
              <FormattedMessage id="NotatISakIndex.NotaterISak" />
            </Heading>
            <Switch checked={visSkjulteNotater} size="small" onClick={toggleVisSkjulteNotater}>
              <FormattedMessage id="NotatISakIndex.VisSkjulteNotater" />
            </Switch>
          </div>
          {!hasGetNotaterError && notater.length === 0 && (
            <Alert className="mt-7" size="small" variant="info">
              <FormattedMessage id="NotatISakIndex.IngenNotaterAlert" />
            </Alert>
          )}
          {hasGetNotaterError && (
            <Alert className="mt-7" size="small" variant="error">
              <FormattedMessage id="NotatISakIndex.NoeGikkGaltHentingNotater" />
            </Alert>
          )}
          {postNotatMutation.isError && (
            <Alert className="mt-7" size="small" variant="error">
              <FormattedMessage id="NotatISakIndex.NoeGikkGaltLagringNotater" />
            </Alert>
          )}
          {notater.length > 0 && (
            <div className="grid mt-5 gap-10">
              {notater
                .filter(notat => visSkjulteNotater || !notat.skjult)
                .map(notat => (
                  <ChatComponent
                    key={notat.notatId}
                    notat={notat}
                    postNotat={data => postNotatMutation.mutate(data)}
                    navAnsatt={navAnsatt}
                    skjulNotat={data => skjulNotatMutation.mutate(data)}
                    fagsakId={fagsakId}
                  />
                ))}
            </div>
          )}
          <Form<Inputs> formMethods={formMethods} onSubmit={submit}>
            <div className="mt-9">
              <TextAreaField
                name="notatTekst"
                size="small"
                label={<FormattedMessage id="NotatISakIndex.SkrivNyttNotat" />}
              />
            </div>
            <CheckboxField
              className="mt-3"
              name="visNotatIAlleSaker"
              label={<FormattedMessage id="NotatISakIndex.VisNotatTilknyttetPleietrengende" />}
            />
            <Button type="submit" className="mt-4" size="small" variant="primary">
              <FormattedMessage id="NotatISakIndex.LeggTilNotatButton" />
            </Button>
          </Form>
        </>
      )}
    </RawIntlProvider>
  );
};
export default Notater;
