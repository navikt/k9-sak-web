import React, { FunctionComponent, ReactNode, useMemo } from 'react';
import classnames from 'classnames/bind';
import { VerticalSpacer } from '@fpsak-frontend/shared-components/index';
import { required, hasValidDate } from '@fpsak-frontend/utils';
import { CheckboxField, DatepickerField, InputField } from '@fpsak-frontend/form/index';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import Panel from 'nav-frontend-paneler';
import styles from './barnInput.less';
import FastBreddeAligner from './FastBreddeAligner';
import { BarnEnum, Barntype } from '../types/Barn';

const classNames = classnames.bind(styles);

interface BarnInputProps {
  namePrefix: string;
  barntype: Barntype;
  readOnly?: boolean;
  visning: ReactNode;
}

const checkboxPadding = (barntype: Barntype, readOnly: boolean): string => {
  if (barntype === BarnEnum.HENTET_AUTOMATISK) {
    return '1.5em 0 0 0';
  }
  return readOnly ? '1em 0 0 0' : '2.5em 0 0 0';
};

const BarnInput: FunctionComponent<BarnInputProps> = ({ namePrefix, readOnly, barntype, visning }) => {
  const padding = useMemo<string>(() => checkboxPadding(barntype, readOnly), [barntype, readOnly]);

  return (
    <div className={classNames({ overrideBorder: barntype === BarnEnum.MANUELT_LAGT_TIL })}>
      <Panel border className={styles.barnInput}>
        <Element tag="h3">{visning}</Element>
        <VerticalSpacer eightPx />
        <FastBreddeAligner
          kolonner={[
            {
              width: '200px',
              id: 'fnrFdato',
              content:
                barntype === BarnEnum.HENTET_AUTOMATISK ? (
                  <InputField
                    name={`${namePrefix}.fødselsnummer`}
                    readOnly
                    label={
                      <Element>
                        <FormattedMessage id="FaktaRammevedtak.Barn.Fnr" />
                      </Element>
                    }
                  />
                ) : (
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
                ),
            },
            {
              width: '200px',
              padding,
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
              padding,
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
    </div>
  );
};

export default BarnInput;
