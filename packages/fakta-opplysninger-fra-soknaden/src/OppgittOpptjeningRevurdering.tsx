import { Behandling, SubmitCallback } from '@k9-sak-web/types';
import * as React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import OpplysningerFraSøknaden from '@k9-sak-web/types/src/opplysningerFraSoknaden';
import { InjectedFormProps } from 'redux-form';
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
  submitCallback: (props: SubmitCallback[]) => void;
  submittable: boolean;
  harApneAksjonspunkter: boolean;
  kanEndrePåSøknadsopplysninger: boolean;
  oppgittOpptjening: OpplysningerFraSøknaden;
}

const OppgittOpptjeningRevurdering = (props: Props & InjectedFormProps) => {
  const {
    behandling: { id, versjon },
  } = props;
  return (
    <RawIntlProvider value={intlConfig}>
      <OppgittOpptjeningRevurderingForm behandlingId={id} behandlingVersjon={versjon} {...props} />
    </RawIntlProvider>
  );
};

export default OppgittOpptjeningRevurdering;
