import { FaktaSubmitButton } from '@fpsak-frontend/fp-felles';
import { FlexColumn, FlexContainer, FlexRow } from '@fpsak-frontend/shared-components';
import { Knapp } from 'nav-frontend-knapper';
import * as React from 'react';

interface MedisinskVilkarFormButtonsProps {
  behandlingId: number;
  behandlingVersjon: number;
  form: string;
}

const MedisinskVilkarFormButtons = ({ behandlingId, behandlingVersjon, form }: MedisinskVilkarFormButtonsProps) => (
  <FlexContainer fluid>
    <FlexRow>
      <FlexColumn>
        <FaktaSubmitButton
          buttonTextId="SubmitButton.ConfirmInformation"
          formName={form}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          isSubmittable
          isReadOnly={false} // TODO: Mangler && overstyringDisabled
          hasOpenAksjonspunkter={false}
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
