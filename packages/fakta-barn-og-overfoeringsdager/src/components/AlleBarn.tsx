import React, { FunctionComponent } from 'react';
import { WrappedFieldArrayProps } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import Hovedknapp from 'nav-frontend-knapper/lib/hovedknapp';
import { VerticalSpacer } from '@fpsak-frontend/shared-components/index';
import BarnInput from './BarnInput';
import { BarnLagtTilAvSakbehandler } from '../types/Barn';

export const AlleBarn: FunctionComponent<WrappedFieldArrayProps> = ({ fields }) => {
  return (
    <>
      {fields.map(field => (
        <BarnInput namePrefix={field} key={field} />
      ))}
    </>
  );
};

export const BarnLagtTilAvSaksbehandler: FunctionComponent<WrappedFieldArrayProps<BarnLagtTilAvSakbehandler>> = ({
  fields,
}) => {
  return (
    <>
      {fields.map((field, index) => (
        <BarnInput namePrefix={field} key={field} fjernBarn={() => fields.remove(index)} />
      ))}
      <VerticalSpacer sixteenPx />
      <Hovedknapp
        mini
        htmlType="button"
        onClick={() =>
          fields.push({
            id: 'randomid',
            fødselsdato: '',
          })
        }
      >
        <FormattedMessage id="FaktaRammevedtak.Barn.LeggTil" />
      </Hovedknapp>
    </>
  );
};
