import React, { FunctionComponent } from 'react';
import { WrappedFieldArrayProps } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { guid } from 'nav-frontend-js-utils';
import { LeggTilKnapp, VerticalSpacer, FlexRow, Image } from '@fpsak-frontend/shared-components/index';
import { Flatknapp } from 'nav-frontend-knapper';
import søppelkasse from '@fpsak-frontend/assets/images/søppelkasse.svg';
import BarnInput from './BarnInput';
import { BarnLagtTilAvSakbehandler } from '../types/Barn';
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
          visFødselsnummer
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
  barn: BarnLagtTilAvSakbehandler[];
  readOnly?: boolean;
}

export const BarnLagtTilAvSaksbehandler: FunctionComponent<
  WrappedFieldArrayProps & BarnLagtTilAvSaksbehandlerProps
> = ({ fields, readOnly }) => {
  return (
    <>
      {fields.map((field, index) => (
        <BarnInput
          namePrefix={field}
          key={field}
          visFødselsdato
          visning={
            <FlexRow spaceBetween>
              <FlexRow childrenMargin autoFlex>
                <span>
                  <FormattedMessage id="FaktaRammevedtak.BarnVisningNummer" values={{ nummer: index + 1 }} />
                </span>
                <span className={styles.italic}>
                  <FormattedMessage id="FaktaRammevedtak.BarnManuelt" />
                </span>
              </FlexRow>
              <Flatknapp mini kompakt onClick={() => fields.remove(index)} htmlType="button" disabled={readOnly}>
                <FormattedMessage id="FaktaRammevedtak.Barn.Fjern" />
                <Image src={søppelkasse} className={styles.fjernknapp} />
              </Flatknapp>
            </FlexRow>
          }
          readOnly={readOnly}
        />
      ))}
      <VerticalSpacer sixteenPx />
      <LeggTilKnapp
        tekstId="FaktaRammevedtak.Barn.LeggTil"
        onClick={() =>
          fields.push({
            id: guid(),
            fødselsdato: '',
          })
        }
        disabled={readOnly}
      />
    </>
  );
};
