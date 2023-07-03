import React, { useState } from 'react';

import { ForeldelseProsessIndex } from '@navikt/ft-prosess-tilbakekreving-foreldelse';
// eslint-disable-next-line max-len, import/no-unresolved
import ForeldelsesresultatActivity from '@navikt/ft-prosess-tilbakekreving-foreldelse/dist/packages/prosess-tilbakekreving-foreldelse/src/types/foreldelsesresultatActivitytsType';
import { RelasjonsRolleType } from '@navikt/ft-kodeverk';
import relasjonsRolleTypeKodeverk from '../kodeverk/relasjonsRolleTypeKodeverk';

const ForeldelseProsessIndexWrapper: React.FC = (props: any) => {
  const [formData, setFormData] = useState<ForeldelsesresultatActivity[]>([]);
  const {
    behandling,
    perioderForeldelse,
    submitCallback,
    isReadOnly,
    aksjonspunkter,
    beregnBelop,
    alleMerknaderFraBeslutter,
    fagsakPerson,
  } = props;

  const kodeverkSamlingFpTilbake = { ForeldelseVurderingType: [] };
  const relasjonsRolleType = fagsakPerson.erKvinne ? RelasjonsRolleType.MOR : RelasjonsRolleType.FAR;

  return (
    <ForeldelseProsessIndex
      behandling={behandling}
      perioderForeldelse={perioderForeldelse}
      submitCallback={submitCallback}
      isReadOnly={isReadOnly}
      aksjonspunkter={aksjonspunkter}
      beregnBelop={beregnBelop}
      alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
      kodeverkSamlingFpTilbake={kodeverkSamlingFpTilbake}
      relasjonsRolleType={relasjonsRolleType}
      relasjonsRolleTypeKodeverk={relasjonsRolleTypeKodeverk}
      setFormData={setFormData}
      formData={formData}
    />
  );
};

export default ForeldelseProsessIndexWrapper;
