import { Aksjonspunkt, FastsattOpptjening, SubmitCallback, Vilkaarresultat } from '@k9-sak-web/types';
import React from 'react';
import OpptjeningVilkarAksjonspunktPanel from './OpptjeningVilkarAksjonspunktPanel';
import OpptjeningVilkarView from './OpptjeningVilkarView';

/**
 * OpptjeningVilkarForm
 *
 * Presentasjonskomponent. Viser resultatet av opptjeningsvilkåret.
 */

interface OpptjeningVilkarFormProps {
  behandlingId: number;
  behandlingVersjon: number;
  vilkarsresultat: Vilkaarresultat;
  fastsattOpptjening: FastsattOpptjening;
  isAksjonspunktOpen: boolean;
  aksjonspunkter: Aksjonspunkt[];
  status: string;
  lovReferanse?: string;
  readOnlySubmitButton: boolean;
  readOnly: boolean;
  submitCallback: (props: SubmitCallback[]) => void;
  tabIndex: number;
}

const OpptjeningVilkarForm = ({
  behandlingId,
  behandlingVersjon,
  vilkarsresultat,
  fastsattOpptjening,
  isAksjonspunktOpen,
  aksjonspunkter,
  status,
  lovReferanse,
  readOnlySubmitButton,
  readOnly,
  submitCallback,
  tabIndex,
}: OpptjeningVilkarFormProps) => {
  if (aksjonspunkter.length > 0) {
    return (
      <OpptjeningVilkarAksjonspunktPanel
        // key={fastsattOpptjening.opptjeningTom}
        submitCallback={submitCallback}
        isApOpen={isAksjonspunktOpen}
        readOnly={readOnly}
        readOnlySubmitButton={readOnlySubmitButton}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        vilkarsresultat={vilkarsresultat}
        aksjonspunkter={aksjonspunkter}
        status={status}
        lovReferanse={lovReferanse}
        fastsattOpptjening={fastsattOpptjening}
        tabIndex={tabIndex}
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
