import { FaktaSubmitButton } from '@fpsak-frontend/fp-felles';
import { FlexColumn, FlexContainer, FlexRow } from '@fpsak-frontend/shared-components';
import { Knapp } from 'nav-frontend-knapper';
import React from 'react';

interface MedisinskVilkarFormButtonsProps {
  behandlingId: number;
  behandlingVersjon: number;
  form: string;
  harApneAksjonspunkter: boolean;
  readOnly: boolean;
  submittable: boolean;
}

const MedisinskVilkarFormButtons = ({
  behandlingId,
  behandlingVersjon,
  form,
  harApneAksjonspunkter,
  readOnly,
  submittable,
}: MedisinskVilkarFormButtonsProps) => (
  <FlexContainer fluid>
    <FlexRow>
      <FlexColumn>
        <FaktaSubmitButton
          buttonTextId="SubmitButton.ConfirmInformation"
          formName={form}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          isSubmittable={submittable}
          isReadOnly={readOnly} // TODO: Mangler && overstyringDisabled
          harApneAksjonspunkter={harApneAksjonspunkter}
        />
      </FlexColumn>
      <FlexColumn>
        <Knapp
          mini
          htmlType="button"
          onClick={() => {
            return false;
          }}
          disabled={false}
        >
          Avbryt
        </Knapp>
      </FlexColumn>
    </FlexRow>
  </FlexContainer>
);

export default MedisinskVilkarFormButtons;
