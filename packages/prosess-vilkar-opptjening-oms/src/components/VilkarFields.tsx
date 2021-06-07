import React, { FunctionComponent } from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { VilkarResultPicker, ProsessStegBegrunnelseTextField } from '@k9-sak-web/prosess-felles';

interface VilkarFieldsProps {
  erOmsorgspenger: boolean;
  fieldPrefix: string;
  erVilkarOk: boolean;
  readOnly: boolean;
}

const VilkarFields: FunctionComponent<VilkarFieldsProps & WrappedComponentProps> = React.memo(
  ({ intl, erOmsorgspenger, fieldPrefix, erVilkarOk, readOnly }) => (
    <>
      <ProsessStegBegrunnelseTextField
        text={
          erOmsorgspenger
            ? intl.formatMessage({ id: 'OpptjeningVilkarAksjonspunktPanel.OmsorgspengerVurderLabel' })
            : undefined
        }
        readOnly={readOnly}
        fieldNamePrefix={fieldPrefix}
      />
      <VerticalSpacer sixteenPx />
      <VilkarResultPicker
        erVilkarOk={erVilkarOk}
        readOnly={readOnly}
        customVilkarOppfyltText={<FormattedMessage id="OpptjeningVilkarAksjonspunktPanel.ErOppfylt" />}
        customVilkarIkkeOppfyltText={
          <FormattedMessage
            id="OpptjeningVilkarAksjonspunktPanel.ErIkkeOppfylt"
            values={{ b: chunks => <b>{chunks}</b> }}
          />
        }
        fieldNamePrefix={fieldPrefix}
      />
    </>
  ),
);
export default injectIntl(VilkarFields);
