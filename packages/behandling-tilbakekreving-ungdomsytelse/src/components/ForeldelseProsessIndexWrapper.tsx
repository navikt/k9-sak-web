import { Aksjonspunkt, Behandling, FagsakPerson, FeilutbetalingPerioderWrapper } from '@k9-sak-web/types';
import { RelasjonsRolleType } from '@navikt/ft-kodeverk';
import {
  ForeldelseProsessIndex,
  ForeldelsesresultatActivity,
  VurderForeldelseAp,
} from '@navikt/ft-prosess-tilbakekreving-foreldelse';
import React, { useState } from 'react';
import relasjonsRolleTypeKodeverk from '../kodeverk/relasjonsRolleTypeKodeverk';

interface ForeldelseProsessIndexWrapperProps {
  behandling: Behandling;
  perioderForeldelse: FeilutbetalingPerioderWrapper;
  kodeverkSamling: unknown;
  beregnBelop: (params: unknown) => Promise<unknown>;
  alleMerknaderFraBeslutter: {
    [key: string]: {
      notAccepted?: boolean;
    };
  };
  aksjonspunkter: Aksjonspunkt[];
  submitCallback: (aksjonspunktData: VurderForeldelseAp[]) => Promise<void>;
  isReadOnly: boolean;
  fagsakPerson: FagsakPerson;
}

const ForeldelseProsessIndexWrapper: React.FC = (props: ForeldelseProsessIndexWrapperProps) => {
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

  const submitForeldelse = (values: VurderForeldelseAp) => submitCallback([values]);

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
