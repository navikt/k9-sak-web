import React, { useState } from 'react';

import {
  ForeldelseProsessIndex,
  ForeldelsesresultatActivity,
  RelasjonsRolleType,
} from '@navikt/ft-prosess-tilbakekreving-foreldelse';
import relasjonsRolleTypeKodeverk from '../kodeverk/relasjonsRolleTypeKodeverk';

type ForeldelseFormData = {
  perioder: ForeldelsesresultatActivity[];
  erEndret: boolean;
};

const ForeldelseProsessIndexWrapper: React.FC = (props: any) => {
  const [formData, setFormData] = useState<ForeldelseFormData | undefined>(undefined);
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
      behandlingUuid={behandling.uuid}
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
