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
  opptjening: Opptjening;
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
  const aktiviteter1 = [
    {
      ...opptjening.opptjeningAktivitetList[0],
      opptjeningFom: '2016-02-14',
      opptjeningTom: '2019-10-19',
      aktivitetType: { kode: 'NÆRING' },
    },
  ];
  const aktiviteter2 = [
    {
      ...opptjening.opptjeningAktivitetList[0],
      opptjeningFom: '2015-05-02',
      opptjeningTom: '2018-12-31',
      aktivitetType: { kode: 'ARBEID' },
    },
  ];
  const aktiviteter3 = [
    {
      ...opptjening.opptjeningAktivitetList[0],
      opptjeningFom: '2016-05-05',
      opptjeningTom: '2020-01-01',
      aktivitetType: { kode: 'ARBEID' },
    },
  ];

  const opptjeningsperioder: Opptjening[] = [
    { ...opptjening, opptjeningAktivitetList: aktiviteter1 },
    { ...opptjening, opptjeningAktivitetList: aktiviteter2 },
    { ...opptjening, opptjeningAktivitetList: aktiviteter3 },
  ];

  return (
    <RawIntlProvider value={intl}>
      <OpptjeningInfoPanel
        behandlingId={behandling.id}
        behandlingVersjon={behandling.versjon}
        opptjeningList={opptjeningsperioder}
        dokStatus={utlandDokStatus ? utlandDokStatus.dokStatus : undefined}
        aksjonspunkter={aksjonspunkter}
        submitCallback={submitCallback}
        readOnly={readOnly}
        alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
        alleKodeverk={alleKodeverk}
        hasOpenAksjonspunkter={harApneAksjonspunkter}
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
