import React, { FunctionComponent, ReactNode } from 'react';
import { VerticalSpacer } from '@fpsak-frontend/shared-components/index';
import { CheckboxField, InputField } from '@fpsak-frontend/form/index';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import Panel from 'nav-frontend-paneler';
import styles from './barnInput.less';
import FastBreddeAligner from './FastBreddeAligner';

interface BarnInputProps {
  namePrefix: string;
  readOnly?: boolean;
  visning: ReactNode;
}

const BarnInput: FunctionComponent<BarnInputProps> = ({ namePrefix, readOnly, visning }) => {
  return (
    <Panel border className={styles.barnInput}>
      <Element tag="h3">{visning}</Element>
      <VerticalSpacer eightPx />
      <FastBreddeAligner
        kolonner={[
          {
            width: '200px',
            id: 'fnrFdato',
            content: (
              <InputField
                name={`${namePrefix}.fødselsnummer`}
                readOnly
                label={
                  <Element>
                    <FormattedMessage id="FaktaRammevedtak.Barn.Fnr" />
                  </Element>
                }
              />
            ),
          },
          {
            width: '200px',
            padding: '1.5em 0 0 0',
            id: 'kroniskSyk',
            content: (
              <CheckboxField
                name={`${namePrefix}.erKroniskSykt`}
                label={<FormattedMessage id="FaktaRammevedtak.Barn.KroniskSykt" />}
                readOnly={readOnly}
              />
            ),
          },
          {
            width: '200px',
            padding: '1.5em 0 0 0',
            id: 'aleneomsorg',
            content: (
              <CheckboxField
                name={`${namePrefix}.aleneomsorg`}
                label={<FormattedMessage id="FaktaRammevedtak.Barn.Aleneomsorg" />}
                readOnly={readOnly}
              />
            ),
          },
        ]}
      />
    </Panel>
  );
};

export default BarnInput;
