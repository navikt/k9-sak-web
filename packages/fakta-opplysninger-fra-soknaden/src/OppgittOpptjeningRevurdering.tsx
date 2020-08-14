import { Aksjonspunkt, Behandling, SubmitCallback } from '@k9-sak-web/types';
import * as React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import OpplysningerFraSøknaden from '@k9-sak-web/types/src/opplysningerFraSoknaden';
import { InjectedFormProps } from 'redux-form';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
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

function harRelevantAksjonspunktSomKanLøses(aksjonspunkter) {
  const aksjonspunkt = (aksjonspunkter || []).find(
    ap => ap.definisjon.kode === aksjonspunktCodes.OVERSTYRING_FRISINN_OPPGITT_OPPTJENING,
  );
  if (!aksjonspunkt) {
    return false;
  }
  return aksjonspunkt.kanLoses === true;
}

const OppgittOpptjeningRevurdering = (props: Props & InjectedFormProps) => {
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
        kanEndrePåSøknadsopplysninger={
          kanEndrePåSøknadsopplysninger && harRelevantAksjonspunktSomKanLøses(aksjonspunkter)
        }
      />
    </RawIntlProvider>
  );
};

export default OppgittOpptjeningRevurdering;
