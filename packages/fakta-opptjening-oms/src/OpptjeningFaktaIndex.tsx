import {
  Aksjonspunkt,
  ArbeidsgiverOpplysningerPerId,
  Opptjening,
  OpptjeningBehandling,
  SubmitCallback,
  UtlandDokStatus,
} from '@k9-sak-web/types';
import AlleKodeverk from '@k9-sak-web/types/src/kodeverk';
import React from 'react';
import messages from '../i18n/nb_NO.json';
import OpptjeningInfoPanel from './components/OpptjeningInfoPanel';

interface OpptjeningFaktaIndexProps {
  behandling: OpptjeningBehandling;
  opptjening?: { opptjeninger: Opptjening[] };
  aksjonspunkter: Aksjonspunkt[];
  alleMerknaderFraBeslutter: any;
  utlandDokStatus?: UtlandDokStatus;
  alleKodeverk: AlleKodeverk;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
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
  arbeidsgiverOpplysningerPerId,
  harApneAksjonspunkter,
  submittable,
  submitCallback,
  readOnly,
}: OpptjeningFaktaIndexProps) => (
      <OpptjeningInfoPanel
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      opptjeningList={opptjening?.opptjeninger}
      dokStatus={utlandDokStatus ? utlandDokStatus.dokStatus : undefined}
      aksjonspunkter={aksjonspunkter}
      submitCallback={submitCallback}
      readOnly={readOnly}
      alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      harApneAksjonspunkter={harApneAksjonspunkter}
      submittable={submittable}
    />);

export default OpptjeningFaktaIndex;
