import React, { FunctionComponent, useEffect } from 'react';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form/index';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames/bind';
import { VerticalSpacer, usePrevious } from '@fpsak-frontend/shared-components/index';
import { Element } from 'nav-frontend-typografi';
import styles from './spørsmål.less';

interface SpørsmålProps {
  vis: boolean;
  feltnavn: string;
  labeldId: string;
  nullstillFelt: (feltnavn: string) => void;
  readOnly?: boolean;
  value?: boolean;
}
const classNames = classnames.bind(styles);
const valueExists = value => value !== null && value !== undefined;

const Spørsmål: FunctionComponent<SpørsmålProps> = ({ vis, feltnavn, labeldId, nullstillFelt, readOnly, value }) => {
  const prevVis = usePrevious(vis);
  useEffect(() => {
    if (prevVis && !vis) {
      nullstillFelt(feltnavn);
    }
  }, [vis, prevVis]);

  const harValgt = valueExists(value);

  return vis ? (
    <>
      <VerticalSpacer eightPx />
      <RadioGroupField
        name={feltnavn}
        label={
          <Element>
            <FormattedMessage id={labeldId} />
          </Element>
        }
        readOnly={readOnly}
      >
        <RadioOption
          label={<FormattedMessage id="OmsorgenFor.Ja" />}
          value
          wrapperClassName={classNames('padding', { valgtIndikatorExtendBorder: harValgt, erValgt: value === true })}
        />
        <RadioOption
          label={<FormattedMessage id="OmsorgenFor.Nei" />}
          value={false}
          wrapperClassName={classNames('padding', { valgtIndikator: harValgt, erValgt: value === false })}
        />
      </RadioGroupField>
    </>
  ) : null;
};

export default Spørsmål;
