import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import OpptjeningInfoPanel from './components/OpptjeningInfoPanel';
import opptjeningAksjonspunkterPropType from './propTypes/opptjeningAksjonspunkterPropType';
import opptjeningPropType from './propTypes/opptjeningPropType';
import opptjeningBehandlingPropType from './propTypes/opptjeningBehandlingPropType';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

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
}) => {
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

  const opptjeningsperioder = [
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

OpptjeningFaktaIndex.propTypes = {
  behandling: opptjeningBehandlingPropType.isRequired,
  opptjening: opptjeningPropType,
  aksjonspunkter: PropTypes.arrayOf(opptjeningAksjonspunkterPropType).isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape().isRequired,
  utlandDokStatus: PropTypes.shape({
    dokStatus: PropTypes.string.isRequired,
  }),
  alleKodeverk: PropTypes.shape().isRequired,
  submitCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  harApneAksjonspunkter: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
};

OpptjeningFaktaIndex.defaultProps = {
  opptjening: undefined,
  utlandDokStatus: undefined,
};

export default OpptjeningFaktaIndex;
