import React, { useState } from 'react';

import { RelasjonsRolleType } from '@navikt/ft-kodeverk';
import { ForeldelseProsessIndex, ForeldelsesresultatActivity } from '@navikt/ft-prosess-tilbakekreving-foreldelse';
import relasjonsRolleTypeKodeverk from '../kodeverk/relasjonsRolleTypeKodeverk';

const ForeldelseProsessIndexWrapper: React.FC = (props: any) => {
  const [formData, setFormData] = useState<ForeldelsesresultatActivity[] | undefined>(undefined);
  const {
    behandling,
    perioderForeldelse,
    submitCallback,
    isReadOnly,
    aksjonspunkter,
    beregnBelop,
    alleMerknaderFraBeslutter,
    fagsakPerson,
    kodeverkSamling,
  } = props;

  const relasjonsRolleType = fagsakPerson.erKvinne ? RelasjonsRolleType.MOR : RelasjonsRolleType.FAR;

  const submitForeldelse = (values: any) => submitCallback([values]);

  return (
    <ForeldelseProsessIndex
      behandling={behandling}
      perioderForeldelse={perioderForeldelse}
      submitCallback={submitForeldelse}
      isReadOnly={isReadOnly}
      aksjonspunkter={aksjonspunkter}
      beregnBelop={beregnBelop}
      alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
      kodeverkSamlingFpTilbake={kodeverkSamling}
      relasjonsRolleType={relasjonsRolleType}
      relasjonsRolleTypeKodeverk={relasjonsRolleTypeKodeverk}
      setFormData={setFormData}
      formData={formData}
    />
  );
};

export default ForeldelseProsessIndexWrapper;
