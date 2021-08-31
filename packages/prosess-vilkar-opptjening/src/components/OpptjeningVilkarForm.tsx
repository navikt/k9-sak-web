import React from 'react';

import { Aksjonspunkt, Behandling, FastsattOpptjening } from '@k9-sak-web/types';

import OpptjeningVilkarView from './OpptjeningVilkarView';
import OpptjeningVilkarAksjonspunktPanel from './OpptjeningVilkarAksjonspunktPanel';

interface OwnProps {
  behandlingId: number;
  behandlingVersjon: number;
  behandlingsresultat?: Behandling['behandlingsresultat'];
  fastsattOpptjening?: FastsattOpptjening;
  aksjonspunkter: Aksjonspunkt[];
  status: string;
  lovReferanse?: string;
  isAksjonspunktOpen: boolean;
  readOnly: boolean;
  readOnlySubmitButton: boolean;
  submitCallback: (aksjonspunktData: { kode: string }[]) => Promise<any>;
}

/**
 * OpptjeningVilkarForm
 *
 * Presentasjonskomponent. Viser resultatet av opptjeningsvilkåret.
 */
const OpptjeningVilkarForm = ({
  behandlingId,
  behandlingVersjon,
  behandlingsresultat,
  fastsattOpptjening,
  isAksjonspunktOpen,
  aksjonspunkter,
  status,
  lovReferanse,
  readOnlySubmitButton,
  readOnly,
  submitCallback,
}: OwnProps) => {
  if (aksjonspunkter.length > 0) {
    return (
      <OpptjeningVilkarAksjonspunktPanel
        submitCallback={submitCallback}
        isApOpen={isAksjonspunktOpen}
        readOnly={readOnly}
        readOnlySubmitButton={readOnlySubmitButton}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        behandlingsresultat={behandlingsresultat}
        aksjonspunkter={aksjonspunkter}
        status={status}
        lovReferanse={lovReferanse}
        fastsattOpptjening={fastsattOpptjening}
      />
    );
  }
  return (
    <OpptjeningVilkarView
      months={fastsattOpptjening.opptjeningperiode.måneder}
      days={fastsattOpptjening.opptjeningperiode.dager}
      fastsattOpptjeningActivities={fastsattOpptjening.fastsattOpptjeningAktivitetList}
      opptjeningFomDate={fastsattOpptjening.opptjeningFom}
      opptjeningTomDate={fastsattOpptjening.opptjeningTom}
    />
  );
};

export default OpptjeningVilkarForm;
