import { Aksjonspunkt, Opptjening, OpptjeningBehandling, SubmitCallback, UtlandDokStatus } from '@k9-sak-web/types';
import AlleKodeverk from '@k9-sak-web/types/src/kodeverk';
import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messages from '../i18n/nb_NO.json';
import OpptjeningInfoPanel from './components/OpptjeningInfoPanel';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface OpptjeningFaktaIndexProps {
  behandling: OpptjeningBehandling;
  opptjening: { opptjeninger: Opptjening[] };
  aksjonspunkter: Aksjonspunkt[];
  alleMerknaderFraBeslutter: any;
  utlandDokStatus: UtlandDokStatus;
  alleKodeverk: AlleKodeverk;
  submitCallback: (props: SubmitCallback[]) => void;
  readOnly: boolean;
  harApneAksjonspunkter: boolean;
  submittable: boolean;
}

const OpptjeningFaktaIndex = ({
  behandling,
  opptjening,
  aksjonspunkter,
  utlandDokStatus,
  alleMerknaderFraBeslutter,
  alleKodeverk,
  harApneAksjonspunkter,
  submittable,
  submitCallback,
  readOnly,
}: OpptjeningFaktaIndexProps) => {
  return (
    <RawIntlProvider value={intl}>
      <OpptjeningInfoPanel
        behandlingId={behandling.id}
        behandlingVersjon={behandling.versjon}
        opptjeningList={opptjening.opptjeninger}
        dokStatus={utlandDokStatus ? utlandDokStatus.dokStatus : undefined}
        aksjonspunkter={aksjonspunkter}
        submitCallback={submitCallback}
        readOnly={readOnly}
        alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
        alleKodeverk={alleKodeverk}
        harApneAksjonspunkter={harApneAksjonspunkter}
        submittable={submittable}
      />
    </RawIntlProvider>
  );
};

OpptjeningFaktaIndex.defaultProps = {
  opptjening: undefined,
  utlandDokStatus: undefined,
};

export default OpptjeningFaktaIndex;
