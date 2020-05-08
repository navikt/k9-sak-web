import { Behandling, SubmitCallback } from '@k9-sak-web/types';
import * as React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messages from '../i18n/nb_NO.json';
import OpplysningerFraSoknadenForm from './OpplysningerFraSoknadenForm';

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
}

const OpplysningerFraSoknadenIndex = (props: Props) => {
  const {
    readOnly,
    behandling: { id: behandlingId, versjon: behandlingVersjon },
    submitCallback,
    submittable,
  } = props;

  return (
    <RawIntlProvider value={intlConfig}>
      <OpplysningerFraSoknadenForm
        readOnly={readOnly}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        submitCallback={submitCallback}
        submittable={submittable}
      />
    </RawIntlProvider>
  );
};
export default OpplysningerFraSoknadenIndex;
