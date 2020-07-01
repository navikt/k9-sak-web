import { Aksjonspunkt, Behandling, SubmitCallback, Sykdom } from '@k9-sak-web/types';
import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messages from '../i18n/nb_NO.json';
import MedisinskVilkarForm from './components/MedisinskVilkarForm';

const cache = createIntlCache();

const intlConfig = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface MedisinskVilkarIndexProps {
  readOnly: boolean;
  behandling: Behandling;
  submitCallback: (props: SubmitCallback[]) => void;
  harApneAksjonspunkter: boolean;
  submittable: boolean;
  sykdom: Sykdom;
  aksjonspunkter: Aksjonspunkt[];
}

const MedisinskVilkarIndex = (props: MedisinskVilkarIndexProps) => {
  const {
    readOnly,
    behandling: { id: behandlingId, versjon: behandlingVersjon },
    submitCallback,
    harApneAksjonspunkter,
    submittable,
    sykdom,
    aksjonspunkter,
  } = props;
  return (
    <RawIntlProvider value={intlConfig}>
      <MedisinskVilkarForm
        readOnly={readOnly}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        submitCallback={submitCallback}
        harApneAksjonspunkter={harApneAksjonspunkter}
        submittable={submittable}
        sykdom={sykdom}
        aksjonspunkter={aksjonspunkter}
      />
    </RawIntlProvider>
  );
};
export default MedisinskVilkarIndex;
