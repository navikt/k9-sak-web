import { BehandlingspunktBegrunnelseTextField, VilkarResultPicker } from '@fpsak-frontend/fp-felles';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import * as React from 'react';

interface VilkarFieldsProps {
  fieldPrefix: string;
  erVilkarOk: boolean;
  readOnly: boolean;
}

const VilkarFields = React.memo(({ fieldPrefix, erVilkarOk, readOnly }: VilkarFieldsProps) => {
  return (
    <>
      <VilkarResultPicker
        erVilkarOk={erVilkarOk}
        readOnly={readOnly}
        customVilkarOppfyltText={{ id: 'OpptjeningVilkarAksjonspunktPanel.ErOppfylt' }}
        customVilkarIkkeOppfyltText={{ id: 'OpptjeningVilkarAksjonspunktPanel.ErIkkeOppfylt' }}
        fieldNamePrefix={fieldPrefix}
      />
      <VerticalSpacer sixteenPx />
      <BehandlingspunktBegrunnelseTextField readOnly={readOnly} fieldNamePrefix={fieldPrefix} />
    </>
  );
});
export default VilkarFields;
