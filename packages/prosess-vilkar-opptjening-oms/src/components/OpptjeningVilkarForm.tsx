import { Aksjonspunkt, SubmitCallback, Vilkårresultat, Vilkarperiode, Opptjening } from '@k9-sak-web/types';
import React from 'react';
import OpptjeningVilkarAksjonspunktPanel from './OpptjeningVilkarAksjonspunktPanel';

/**
 * OpptjeningVilkarForm
 *
 * Presentasjonskomponent. Viser resultatet av opptjeningsvilkåret.
 */

interface OpptjeningVilkarFormProps {
  behandlingId: number;
  behandlingVersjon: number;
  vilkårsresultat: Vilkårresultat;
  isAksjonspunktOpen: boolean;
  aksjonspunkter: Aksjonspunkt[];
  status: string;
  lovReferanse?: string;
  fagsakType?: string;
  readOnlySubmitButton: boolean;
  readOnly: boolean;
  submitCallback: (props: SubmitCallback[]) => void;
  vilkårPerioder: Vilkarperiode[];
  periodeIndex: number;
  opptjeninger: Opptjening[];
}

const OpptjeningVilkarForm = ({
  behandlingId,
  behandlingVersjon,
  vilkårsresultat,
  isAksjonspunktOpen,
  aksjonspunkter,
  status,
  lovReferanse,
  fagsakType,
  readOnlySubmitButton,
  readOnly,
  submitCallback,
  vilkårPerioder,
  periodeIndex,
  opptjeninger,
}: OpptjeningVilkarFormProps) => (
  <OpptjeningVilkarAksjonspunktPanel
    submitCallback={submitCallback}
    isApOpen={isAksjonspunktOpen}
    readOnly={readOnly}
    readOnlySubmitButton={readOnlySubmitButton}
    behandlingId={behandlingId}
    behandlingVersjon={behandlingVersjon}
    vilkårsresultat={vilkårsresultat}
    aksjonspunkter={aksjonspunkter}
    status={status}
    lovReferanse={lovReferanse}
    fagsakType={fagsakType}
    vilkårPerioder={vilkårPerioder}
    periodeIndex={periodeIndex}
    opptjeninger={opptjeninger}
  />
);

export default OpptjeningVilkarForm;
