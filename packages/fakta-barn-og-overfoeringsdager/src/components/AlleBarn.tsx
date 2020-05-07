import React, { FunctionComponent } from 'react';
import { WrappedFieldArrayProps } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { guid } from 'nav-frontend-js-utils';
import { LeggTilKnapp, VerticalSpacer, FlexRow, Image } from '@fpsak-frontend/shared-components/index';
import { Flatknapp } from 'nav-frontend-knapper';
import søppelkasse from '@fpsak-frontend/assets/images/søppelkasse.svg';
import BarnInput from './BarnInput';
import { BarnEnum, BarnHentetAutomatisk } from '../types/Barn';
import styles from './alleBarn.less';

interface AlleBarnProps {
  readOnly?: boolean;
}

export const AlleBarn: FunctionComponent<WrappedFieldArrayProps & AlleBarnProps> = ({ fields, readOnly }) => {
  return (
    <>
      {fields.map((field, index) => (
        <BarnInput
          namePrefix={field}
          key={field}
          barntype={BarnEnum.HENTET_AUTOMATISK}
          visning={
            <FlexRow childrenMargin>
              <span>
                <FormattedMessage id="FaktaRammevedtak.BarnVisningNummer" values={{ nummer: index + 1 }} />
              </span>
              <span className={styles.italic}>
                <FormattedMessage id="FaktaRammevedtak.BarnAutomatisk" />
              </span>
            </FlexRow>
          }
          readOnly={readOnly}
        />
      ))}
    </>
  );
};

interface BarnLagtTilAvSaksbehandlerProps {
  barnAutomatisk: BarnHentetAutomatisk[];
  readOnly?: boolean;
}

export const BarnLagtTilAvSaksbehandler: FunctionComponent<
  WrappedFieldArrayProps & BarnLagtTilAvSaksbehandlerProps
> = ({ fields, readOnly, barnAutomatisk }) => {
  return (
    <>
      {fields.map((field, index) => (
        <BarnInput
          namePrefix={field}
          key={field}
          barntype={BarnEnum.MANUELT_LAGT_TIL}
          visning={
            <FlexRow spaceBetween>
              <FlexRow childrenMargin autoFlex>
                <span>
                  <FormattedMessage
                    id="FaktaRammevedtak.BarnVisningNummer"
                    values={{ nummer: barnAutomatisk.length + index + 1 }}
                  />
                </span>
                <span className={styles.italic}>
                  <FormattedMessage id="FaktaRammevedtak.BarnManuelt" />
                </span>
              </FlexRow>
              {!readOnly && (
                <Flatknapp mini kompakt onClick={() => fields.remove(index)} htmlType="button">
                  <FormattedMessage id="FaktaRammevedtak.Barn.Fjern" />
                  <Image src={søppelkasse} className={styles.fjernknapp} />
                </Flatknapp>
              )}
            </FlexRow>
          }
          readOnly={readOnly}
        />
      ))}
      <VerticalSpacer sixteenPx />
      {!readOnly && (
        <LeggTilKnapp
          tekstId="FaktaRammevedtak.Barn.LeggTil"
          onClick={() =>
            fields.push({
              id: guid(),
              fødselsdato: '',
            })
          }
        />
      )}
    </>
  );
};
