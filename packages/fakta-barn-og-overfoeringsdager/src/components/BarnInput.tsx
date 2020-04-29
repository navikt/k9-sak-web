import React, { FunctionComponent, ReactNode } from 'react';
import { FlexRow, VerticalSpacer } from '@fpsak-frontend/shared-components/index';
import { required, hasValidDate } from '@fpsak-frontend/utils';
import { CheckboxField, DatepickerField } from '@fpsak-frontend/form/index';
import { FormattedMessage } from 'react-intl';
import Undertittel from 'nav-frontend-typografi/lib/undertittel';
import { Flatknapp } from 'nav-frontend-knapper';
import Panel from 'nav-frontend-paneler';
import styles from './barnInput.less';

interface BarnInputProps {
  namePrefix: string;
  fjernBarn?: VoidFunction;
  visFødselsdato?: boolean;
  readOnly?: boolean;
  visning: ReactNode;
}

const BarnInput: FunctionComponent<BarnInputProps> = ({ namePrefix, fjernBarn, readOnly, visFødselsdato, visning }) => {
  return (
    <Panel border className={styles.barnInput}>
      <Undertittel tag="h3">{visning}</Undertittel>
      <VerticalSpacer eightPx />
      <FlexRow wrap={false} spaceBetween alignItemsToBaseline>
        <FlexRow autoFlex childrenMargin alignItemsToBaseline>
          {visFødselsdato && (
            <DatepickerField
              name={`${namePrefix}.fødselsdato`}
              readOnly={readOnly}
              label={<FormattedMessage id="FaktaRammevedtak.Barn.Fødselsdato" />}
              validate={[required, hasValidDate]}
            />
          )}
          <CheckboxField
            name={`${namePrefix}.erKroniskSykt`}
            label={<FormattedMessage id="FaktaRammevedtak.Barn.KroniskSykt" />}
            readOnly={readOnly}
          />
          <CheckboxField
            name={`${namePrefix}.aleneomsorg`}
            label={<FormattedMessage id="FaktaRammevedtak.Barn.Aleneomsorg" />}
            readOnly={readOnly}
          />
        </FlexRow>
        {fjernBarn && (
          <Flatknapp mini kompakt onClick={fjernBarn} htmlType="button" disabled={readOnly}>
            <FormattedMessage id="FaktaRammevedtak.Barn.Fjern" />
          </Flatknapp>
        )}
      </FlexRow>
    </Panel>
  );
};

export default BarnInput;
