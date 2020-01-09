import { FaktaEkspandertpanel, faktaPanelCodes, withDefaultToggling } from '@fpsak-frontend/fp-felles';
import React from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import { connect } from 'react-redux';
import { SubmitCallbackProps, Behandling } from '../MedisinskVilkarIndex';
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
  readOnly,
  toggleInfoPanelCallback,
  behandling,
  submitCallback,
  intl,
  submittable,
}: // hasOpenAksjonspunkter,
// openInfoPanels,
MedisinskVilkarPanelProps) => {
  const props = { readOnly: false, submitCallback, behandlingId: behandling.id, behandlingVersjon: behandling.versjon }; // TODO readOnly skal sendes videre
  return (
    <FaktaEkspandertpanel
      title={intl.formatMessage({ id: 'MedisinskVilkarPanel.MedisinskVilkar' })}
      hasOpenAksjonspunkter // TODO ={hasOpenAksjonspunkter}
      isInfoPanelOpen // TODO ={openInfoPanels.includes(faktaPanelCodes.MEDLEMSKAPSVILKARET)} sett riktig faktaPanelCode
      toggleInfoPanelCallback={toggleInfoPanelCallback}
      faktaId="123" // TODO sett riktig faktaPanelCode
      readOnly={readOnly}
    >
      <MedisinskVilkarForm
        hasOpenAksjonspunkter // TODO ={hasOpenAksjonspunkter}
        submittable={submittable}
        {...props}
      />
    </FaktaEkspandertpanel>
  );
};

const mapStateToProps = () => ({});

const ConnectedComponent = connect(mapStateToProps)(injectIntl(MedisinskVilkarPanel));

export default withDefaultToggling(faktaPanelCodes.MEDLEMSKAPSVILKARET, [])(ConnectedComponent);
