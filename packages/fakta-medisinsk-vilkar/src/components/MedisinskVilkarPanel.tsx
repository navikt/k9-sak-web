import { FaktaEkspandertpanel, faktaPanelCodes, withDefaultToggling } from '@fpsak-frontend/fp-felles';
import * as React from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import { connect } from 'react-redux';
import { SubmitCallbackProps } from '../MedisinskVilkarIndex';
import MedisinskVilkarForm from './MedisinskVilkarForm';

interface Soknad {
  soknadType: Status;
}

interface Status {
  kode: string;
  navn: string;
}

interface Vilkar {
  vilkarType: Status;
  avslagKode: string;
  lovReferanse: string;
}

interface Behandling {
  id: number;
  versjon: number;
  aksjonspunkter: any[]; // TODO: Foreløpig ikke i bruk her, men må få riktig type
  type: Status;
  status: Status;
  fagsakId: number;
  opprettet: string;
  soknad: Soknad;
  vilkar: Vilkar[];
  behandlingPaaVent: boolean;
}

interface MedisinskVilkarPanelProps {
  readOnly: boolean;
  toggleInfoPanelCallback: () => void;
  behandling: Behandling;
  submitCallback: (props: SubmitCallbackProps[]) => void;
  intl: IntlShape;
  hasOpenAksjonspunkter: boolean;
  openInfoPanels: string[];
}

const MedisinskVilkarPanel: React.FunctionComponent<MedisinskVilkarPanelProps> = ({
  readOnly,
  toggleInfoPanelCallback,
  behandling,
  submitCallback,
  intl,
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
      <MedisinskVilkarForm {...props} />
    </FaktaEkspandertpanel>
  );
};

const mapStateToProps = () => ({});

const ConnectedComponent = connect(mapStateToProps)(injectIntl(MedisinskVilkarPanel));

export default withDefaultToggling(faktaPanelCodes.MEDLEMSKAPSVILKARET, [])(ConnectedComponent);
