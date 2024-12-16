import { useFeatureToggles } from '@k9-sak-web/gui/utils/hooks/useFeatureToggles.js';
import { Aksjonspunkt, Opptjening, SubmitCallback, Vilkarperiode } from '@k9-sak-web/types';
import OpptjeningVilkarAksjonspunktPanel from './OpptjeningVilkarAksjonspunktPanel';

/**
 * OpptjeningVilkarForm
 *
 * Presentasjonskomponent. Viser resultatet av opptjeningsvilkåret.
 */

interface OpptjeningVilkarFormProps {
  behandlingId: number;
  behandlingVersjon: number;
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
}: OpptjeningVilkarFormProps) => {
  const [featureToggles] = useFeatureToggles();

  return (
    <OpptjeningVilkarAksjonspunktPanel
      submitCallback={submitCallback}
      isApOpen={isAksjonspunktOpen}
      readOnly={readOnly}
      readOnlySubmitButton={readOnlySubmitButton}
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
      aksjonspunkter={aksjonspunkter}
      status={status}
      lovReferanse={lovReferanse}
      fagsakType={fagsakType}
      vilkårPerioder={vilkårPerioder}
      periodeIndex={periodeIndex}
      opptjeninger={opptjeninger}
      featureToggles={featureToggles}
    />
  );
};

export default OpptjeningVilkarForm;
