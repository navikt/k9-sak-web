import React from 'react';
import {injectIntl, IntlShape, useIntl} from 'react-intl';
import { Behandling, SubmitCallbackProps } from '../MedisinskVilkarIndex';
import MedisinskVilkarForm from './MedisinskVilkarForm';

interface MedisinskVilkarPanelProps {
  readOnly: boolean;
  toggleInfoPanelCallback: () => void;
  behandling: Behandling;
  submitCallback: (props: SubmitCallbackProps[]) => void;
  intl: IntlShape;
  hasOpenAksjonspunkter: boolean;
  openInfoPanels: string[];
  submittable: boolean;
}

const MedisinskVilkarPanel: React.FunctionComponent<MedisinskVilkarPanelProps> = ({
  behandling,
  submitCallback,
  submittable,
}:
MedisinskVilkarPanelProps) => {
  const intl = useIntl();
  const props = {
    readOnly: false,
    submitCallback,
    behandlingId: behandling.id,
    behandlingVersjon: behandling.versjon,
    intl,
  }; // TODO readOnly skal sendes videre
  return (
      <MedisinskVilkarForm
        hasOpenAksjonspunkter // TODO ={hasOpenAksjonspunkter}
        submittable={submittable}
        {...props}
      />
  );
};

export default injectIntl(MedisinskVilkarPanel);
