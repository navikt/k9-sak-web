import React, { FunctionComponent, ReactNode } from 'react';
import { FlexRow, VerticalSpacer } from '@fpsak-frontend/shared-components/index';
import { required, hasValidDate } from '@fpsak-frontend/utils';
import { CheckboxField, DatepickerField, InputField } from '@fpsak-frontend/form/index';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import Panel from 'nav-frontend-paneler';
import styles from './barnInput.less';

interface BarnInputProps {
  namePrefix: string;
  visFødselsdato?: boolean;
  visFødselsnummer?: boolean;
  readOnly?: boolean;
  visning: ReactNode;
}

const BarnInput: FunctionComponent<BarnInputProps> = ({
  namePrefix,
  readOnly,
  visFødselsdato,
  visFødselsnummer,
  visning,
}) => {
  return (
    <Panel border className={styles.barnInput}>
      <Element tag="h3">{visning}</Element>
      <VerticalSpacer eightPx />
      <FlexRow wrap={false} spaceBetween alignItemsToBaseline>
        {visFødselsdato && (
          <DatepickerField
            name={`${namePrefix}.fødselsdato`}
            readOnly={readOnly}
            label={
              <Element>
                <FormattedMessage id="FaktaRammevedtak.Barn.Fødselsdato" />
              </Element>
            }
            validate={[required, hasValidDate]}
          />
        )}
        {visFødselsnummer && (
          <InputField
            name={`${namePrefix}.fødselsnummer`}
            readOnly
            label={
              <Element>
                <FormattedMessage id="FaktaRammevedtak.Barn.Fnr" />
              </Element>
            }
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
    </Panel>
  );
};

export default BarnInput;
