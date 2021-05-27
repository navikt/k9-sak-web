import React from 'react';
import { FormattedMessage } from 'react-intl';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { VilkarResultPicker, ProsessStegBegrunnelseTextField } from '@k9-sak-web/prosess-felles';

interface VilkarFieldsProps {
  fieldPrefix: string;
  erVilkarOk: boolean;
  erOmsorgspenger?: boolean;
  readOnly: boolean;
}

const VilkarFields = React.memo(({ erOmsorgspenger, fieldPrefix, erVilkarOk, readOnly }: VilkarFieldsProps) => (
  <>
    <ProsessStegBegrunnelseTextField
      text={
        erOmsorgspenger ? (
          <FormattedMessage
            id="OpptjeningVilkarAksjonspunktPanel.ErIkkeOppfylt"
            values={{ b: chunks => <b>{chunks}</b> }}
          />
        ) : null
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
));
export default VilkarFields;
