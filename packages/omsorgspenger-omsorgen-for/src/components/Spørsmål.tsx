import { FunctionComponent, useEffect } from 'react';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form/index';
import { FormattedMessage } from 'react-intl';
import * as React from 'react';
import { usePrevious } from '@fpsak-frontend/fp-felles/index';
import { VerticalSpacer } from '@fpsak-frontend/shared-components/index';

interface SpørsmålProps {
  vis: boolean;
  feltnavn: string;
  labeldId: string;
  nullstillFelt: (feltnavn: string) => void;
  readOnly?: boolean;
}

const Spørsmål: FunctionComponent<SpørsmålProps> = ({ vis, feltnavn, labeldId, nullstillFelt, readOnly }) => {
  const prevVis = usePrevious(vis);
  useEffect(() => {
    if (prevVis && !vis) {
      nullstillFelt(feltnavn);
    }
  }, [vis, prevVis]);

  return vis ? (
    <>
      <VerticalSpacer eightPx />
      <RadioGroupField name={feltnavn} label={<FormattedMessage id={labeldId} />} readOnly={readOnly}>
        <RadioOption label={<FormattedMessage id="OmsorgenFor.Ja" />} value />
        <RadioOption label={<FormattedMessage id="OmsorgenFor.Nei" />} value={false} />
      </RadioGroupField>
    </>
  ) : null;
};

export default Spørsmål;
