import { Alert, Button, Heading, Switch, Textarea } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage, RawIntlProvider, createIntl, createIntlCache } from 'react-intl';
import messages from '../i18n/nb_NO.json';
import ChatComponent, { ChatPosition } from './components/ChatComponent';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const NotatISakIndex = () => (
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
    <div className="grid mt-5 gap-10">
      <ChatComponent
        text="Saken er tidligere rettet opp i punsj på grunn av manglende funksjonalitet."
        name="Saksbehandler Huldra"
        timestamp="01.01.22 14:00"
        subject="Denne saken"
      />
      <ChatComponent
        // eslint-disable-next-line max-len
        text="Bruker venter på legeerklæring fra sykehus, men har fått beskjed om at sykehuslege er på ferie og det kan derfor ta litt tid før den kommer inn. Setter derfor fristen lenger frem i tid enn normalt."
        name="Deg"
        timestamp="01.01.22 14:00"
        subject="Pleietrengende"
        position={ChatPosition.Right}
      />
    </div>

    <div className="mt-9">
      <Textarea size="small" label={<FormattedMessage id="NotatISakIndex.SkrivNyttNotat" />} />
    </div>
    <div className="mt-5">
      <Switch size="small">
        <FormattedMessage id="NotatISakIndex.VisNotatTilknyttetPleietrengende" />
      </Switch>
    </div>
    <Button className="mt-4" size="small" variant="primary">
      <FormattedMessage id="NotatISakIndex.LeggTilNotatButton" />
    </Button>
  </RawIntlProvider>
);

export default NotatISakIndex;
