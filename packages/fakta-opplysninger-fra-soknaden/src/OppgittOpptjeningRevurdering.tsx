import { Aksjonspunkt, Behandling, SubmitCallback } from '@k9-sak-web/types';
import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import OpplysningerFraSøknaden from '@k9-sak-web/types/src/opplysningerFraSoknaden';
import messages from '../i18n/nb_NO.json';
import OppgittOpptjeningRevurderingForm from './OppgittOpptjeningRevurderingForm';

const cache = createIntlCache();

const intlConfig = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface Props {
  readOnly: boolean;
  behandling: Behandling;
  aksjonspunkter: Aksjonspunkt[];
  submitCallback: (props: SubmitCallback[]) => void;
  submittable: boolean;
  harApneAksjonspunkter: boolean;
  kanEndrePåSøknadsopplysninger: boolean;
  oppgittOpptjening: OpplysningerFraSøknaden;
}

const OppgittOpptjeningRevurdering = (props: Props) => {
  const {
    behandling: { id, versjon },
    kanEndrePåSøknadsopplysninger,
    aksjonspunkter,
  } = props;
  return (
    <RawIntlProvider value={intlConfig}>
      <OppgittOpptjeningRevurderingForm
        behandlingId={id}
        behandlingVersjon={versjon}
        {...props}
        kanEndrePåSøknadsopplysninger={kanEndrePåSøknadsopplysninger}
        aksjonspunkter={aksjonspunkter}
      />
    </RawIntlProvider>
  );
};

export default OppgittOpptjeningRevurdering;
