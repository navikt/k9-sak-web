import { useLocalStorage } from '@fpsak-frontend/utils';
import { NavAnsatt } from '@k9-sak-web/types';
import { Alert, Button, Heading, Loader, Switch } from '@navikt/ds-react';
import { CheckboxField, Form, TextAreaField } from '@navikt/ft-form-hooks';
import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, RawIntlProvider, createIntl, createIntlCache } from 'react-intl';
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

interface NotatIndexProps {
  fagsakId: string;
  navAnsatt: NavAnsatt;
}

const Notater: React.FunctionComponent<NotatIndexProps> = ({ fagsakId, navAnsatt }) => {
  const [notater, setNotater] = useState<NotatResponse[]>([]);
  const [hasGetNotaterError, setHasGetNotaterError] = useState(false);
  const [hasPostNotatError, setHasPostNotatError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const httpCanceler = useMemo(() => axios.CancelToken.source(), []);
  const [, setLesteNotater] = useLocalStorage<number[]>('lesteNotater', []);
  const getNotater = () => {
    setIsLoading(true);
    return axios.get<NotatResponse[]>(`/notat?fagsakId=${fagsakId}`, { cancelToken: httpCanceler.token });
  };

  const handleGetNotaterResponse = (response: AxiosResponse<NotatResponse[], any>) => {
    setNotater(response.data);
    setIsLoading(false);
    setLesteNotater(response.data.filter(notat => !notat.skjult).map(notat => notat.id));
  };

  const handleGetNotaterError = () => {
    setHasGetNotaterError(true);
    setIsLoading(false);
  };

  useEffect(() => {
    let isMounted = true;
    getNotater()
      .then(response => {
        if (isMounted) {
          handleGetNotaterResponse(response);
        }
      })
      .catch(() => {
        if (isMounted) {
          handleGetNotaterError();
        }
      });

    return () => {
      isMounted = false;
      httpCanceler.cancel();
    };
  }, []);

  const formMethods = useForm<Inputs>({
    defaultValues: {
      notatTekst: '',
      visNotatIAlleSaker: false,
    },
  });

  const postNotat = (data: Inputs, id?: number, fagsakIdFraRedigertNotat?: string) => {
    axios
      .post('/notat', {
        notatTekst: data.notatTekst,
        id,
        fagsakId: fagsakIdFraRedigertNotat || fagsakId,
        notatGjelderType: data.visNotatIAlleSaker ? NotatGjelderType.pleietrengende : NotatGjelderType.fagsak,
        opprettetAv: id ? undefined : navAnsatt.brukernavn,
        endretAv: id ? navAnsatt.brukernavn : undefined,
      })
      .then(() => {
        formMethods.reset();
        getNotater()
          .then(response => {
            handleGetNotaterResponse(response);
          })
          .catch(() => {
            handleGetNotaterError();
          });
      })
      .catch(() => setHasPostNotatError(true));
  };

  const submit = (data: Inputs) => postNotat(data);

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
            <Switch size="small">
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
          {hasPostNotatError && (
            <Alert className="mt-7" size="small" variant="error">
              <FormattedMessage id="NotatISakIndex.NoeGikkGaltLagringNotater" />
            </Alert>
          )}
          {notater.length > 0 && (
            <div className="grid mt-5 gap-10">
              {notater.map(notat => (
                <ChatComponent key={notat.id} notat={notat} postNotat={postNotat} navAnsatt={navAnsatt} />
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
