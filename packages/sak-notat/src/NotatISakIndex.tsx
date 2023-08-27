import { Alert, Button, Heading, Switch } from '@navikt/ds-react';
import { CheckboxField, Form, TextAreaField } from '@navikt/ft-form-hooks';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
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

const NotatISakIndex = () => {
  const [notater, setNotater] = useState<NotatResponse[]>([]);
  const getNotater = () =>
    axios
      .get<NotatResponse[]>('/notat?fagsakId=X')
      .then(response => setNotater(response.data))
      .catch(error => console.log(error));

  useEffect(() => {
    getNotater();
  }, []);

  const formMethods = useForm<Inputs>({
    defaultValues: {
      notatTekst: '',
      visNotatIAlleSaker: false,
    },
  });

  const postNotat = (data: Inputs, fagsakId?: string, notatGjelderType?: NotatGjelderType) => {
    axios.post('/notat', { ...data, fagsakId, notatGjelderType });
  };

  const submit = (data: Inputs) => postNotat(data);

  return (
    <RawIntlProvider value={intl}>
      <div className="flex justify-between items-baseline">
        <Heading level="3" size="xsmall">
          <FormattedMessage id="NotatISakIndex.NotaterISak" />
        </Heading>
        <Switch size="small">
          <FormattedMessage id="NotatISakIndex.VisSkjulteNotater" />
        </Switch>
      </div>
      <Alert className="mt-7" size="small" variant="info">
        <FormattedMessage id="NotatISakIndex.IngenNotaterAlert" />
      </Alert>
      {notater.length > 0 && (
        <div className="grid mt-5 gap-10">
          {notater.map(notat => (
            <ChatComponent key={notat.id} notat={notat} postNotat={postNotat} />
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
    </RawIntlProvider>
  );
};
export default NotatISakIndex;
