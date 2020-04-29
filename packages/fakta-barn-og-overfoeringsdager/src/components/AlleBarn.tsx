import React, { FunctionComponent } from 'react';
import { WrappedFieldArrayProps } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import Hovedknapp from 'nav-frontend-knapper/lib/hovedknapp';
import { guid } from 'nav-frontend-js-utils';
import { VerticalSpacer } from '@fpsak-frontend/shared-components/index';
import { Undertittel } from 'nav-frontend-typografi';
import BarnInput from './BarnInput';
import { BarnHentetAutomatisk, BarnLagtTilAvSakbehandler } from '../types/Barn';

interface AlleBarnProps {
  barn: BarnHentetAutomatisk[];
  readOnly?: boolean;
}

export const AlleBarn: FunctionComponent<WrappedFieldArrayProps & AlleBarnProps> = ({ fields, barn, readOnly }) => {
  return (
    <>
      {fields.length > 0 && (
        <Undertittel>
          <FormattedMessage id="FaktaRammevedtak.BarnAutomatisk" />
        </Undertittel>
      )}
      {fields.map((field, index) => (
        <BarnInput
          namePrefix={field}
          key={field}
          visning={
            <FormattedMessage
              id="FaktaRammevedtak.BarnVisningFnr"
              values={{ nummer: index + 1, fnr: barn[index].fødselsnummer }}
            />
          }
          readOnly={readOnly}
        />
      ))}
    </>
  );
};

interface BarnLagtTilAvSaksbehandlerProps {
  barn: BarnLagtTilAvSakbehandler[];
  readOnly?: boolean;
}

export const BarnLagtTilAvSaksbehandler: FunctionComponent<
  WrappedFieldArrayProps & BarnLagtTilAvSaksbehandlerProps
> = ({ fields, readOnly }) => {
  return (
    <>
      {fields.length > 0 && (
        <Undertittel>
          <FormattedMessage id="FaktaRammevedtak.BarnManuelt" />
        </Undertittel>
      )}
      {fields.map((field, index) => (
        <BarnInput
          namePrefix={field}
          key={field}
          fjernBarn={() => fields.remove(index)}
          visFødselsdato
          visning={<FormattedMessage id="FaktaRammevedtak.BarnVisningNummer" values={{ nummer: index + 1 }} />}
          readOnly={readOnly}
        />
      ))}
      <VerticalSpacer sixteenPx />
      <Hovedknapp
        mini
        htmlType="button"
        onClick={() =>
          fields.push({
            id: guid(),
            fødselsdato: '',
          })
        }
        disabled={readOnly}
      >
        <FormattedMessage id="FaktaRammevedtak.Barn.LeggTil" />
      </Hovedknapp>
    </>
  );
};
