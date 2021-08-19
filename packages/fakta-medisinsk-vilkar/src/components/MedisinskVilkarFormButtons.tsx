import React, { FunctionComponent } from 'react';
import { Knapp } from 'nav-frontend-knapper';
import { injectIntl, WrappedComponentProps } from 'react-intl';

import { FaktaSubmitButton } from '@k9-sak-web/fakta-felles';
import { FlexColumn, FlexContainer, FlexRow } from '@fpsak-frontend/shared-components';

interface MedisinskVilkarFormButtonsProps {
  behandlingId: number;
  behandlingVersjon: number;
  form: string;
  harApneAksjonspunkter: boolean;
  readOnly: boolean;
  submittable: boolean;
}

const MedisinskVilkarFormButtons: FunctionComponent<MedisinskVilkarFormButtonsProps & WrappedComponentProps> = ({
  intl,
  behandlingId,
  behandlingVersjon,
  form,
  harApneAksjonspunkter,
  readOnly,
  submittable,
}) => (
  <FlexContainer>
    <FlexRow>
      <FlexColumn>
        <FaktaSubmitButton
          buttonText={intl.formatMessage({ id: 'SubmitButton.ConfirmInformation' })}
          formName={form}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          isSubmittable={submittable}
          isReadOnly={readOnly} // TODO: Mangler && overstyringDisabled
          hasOpenAksjonspunkter={harApneAksjonspunkter}
        />
      </FlexColumn>
      <FlexColumn>
        {!readOnly && (
          <Knapp mini htmlType="button" onClick={() => false} disabled={false}>
            Avbryt
          </Knapp>
        )}
      </FlexColumn>
    </FlexRow>
  </FlexContainer>
);

export default injectIntl(MedisinskVilkarFormButtons);
