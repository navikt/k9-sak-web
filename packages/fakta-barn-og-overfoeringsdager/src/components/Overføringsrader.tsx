import React, { ReactNode } from 'react';
import { InputField, PeriodpickerField } from '@fpsak-frontend/form/index';
import { WrappedFieldArrayProps } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import classnames from 'classnames/bind';
import { FlexRow } from '@fpsak-frontend/shared-components/index';
import Overføring, {
  Overføringsretning,
  OverføringsretningEnum,
  Overføringstype,
  OverføringstypeEnum,
} from '../types/Overføring';
import styles from './overføringsrader.less';
import Pil from './Pil';
import FastBreddeAligner from './FastBreddeAligner';

const classNames = classnames.bind(styles);

interface OverføringsraderProps {
  type: Overføringstype;
  retning: Overføringsretning;
}

const retningTilTekstIdMap = {
  [OverføringsretningEnum.INN]: 'FaktaRammevedtak.Overføring.Fra',
  [OverføringsretningEnum.UT]: 'FaktaRammevedtak.Overføring.Til',
};

const typeTilTekstIdMap = {
  [OverføringstypeEnum.OVERFØRING]: 'FaktaRammevedtak.Overføringsdager.Rad.Overføring',
  [OverføringstypeEnum.FORDELING]: 'FaktaRammevedtak.Overføringsdager.Rad.Fordeling',
  [OverføringstypeEnum.KORONAOVERFØRING]: 'FaktaRammevedtak.Overføringsdager.Rad.Koronaoverføring',
};

const renderHeaders = (antallRader: number, type: Overføringstype, retning: Overføringsretning): ReactNode => {
  if (antallRader === 0) {
    return (
      <Element>
        <FormattedMessage id="FaktaRammevedtak.IngenOverføringer" />
      </Element>
    );
  }

  return (
    <div className={styles.headers}>
      <FastBreddeAligner
        kolonner={[
          {
            width: '225px',
            id: 'overføring',
            content: (
              <Element>
                <FormattedMessage id={typeTilTekstIdMap[type]} />
              </Element>
            ),
          },
          {
            width: '150px',
            id: 'fra/til',
            content: (
              <Element>
                <FormattedMessage id={retningTilTekstIdMap[retning]} />
              </Element>
            ),
          },
          {
            width: 'inherit',
            id: 'gyldighetsperiode',
            content: (
              <Element>
                <FormattedMessage id="Gyldighetsperiode" />
              </Element>
            ),
          },
        ]}
      />
    </div>
  );
};

const Overføringsrader = ({ fields, type, retning }: WrappedFieldArrayProps<Overføring> & OverføringsraderProps) => {
  if (fields.length === 0) {
    return (
      <FlexRow spaceBetween alignItemsToBaseline>
        <Element>
          <FormattedMessage id="FaktaRammevedtak.IngenOverføringer" />
        </Element>
      </FlexRow>
    );
  }

  return (
    <div>
      {renderHeaders(fields.length, type, retning)}
      <div className={classNames({ relativePosition: fields.length > 0 })}>
        {fields.map(field => (
          <FastBreddeAligner
            kolonner={[
              {
                width: '150px',
                id: `${field}.dager`,
                content: (
                  <span className={styles.dagerInputContainer}>
                    <span>
                      <FormattedMessage
                        id={
                          retning === OverføringsretningEnum.INN
                            ? 'FaktaRammevedtak.Overføringsdager.Inn'
                            : 'FaktaRammevedtak.Overføringsdager.Ut'
                        }
                      />
                    </span>
                    <InputField name={`${field}.antallDager`} readOnly type="number" />
                    <span>
                      <FormattedMessage id="FaktaRammevedtak.Overføringsdager.Dager" />
                    </span>
                  </span>
                ),
              },
              {
                width: '75px',
                id: `${field}.pil`,
                content: <Pil retning={retning} />,
              },
              {
                width: '150px',
                id: `${field}.fnr`,
                padding: '0 20px 0 0',
                content: <InputField name={`${field}.mottakerAvsenderFnr`} readOnly />,
              },
              {
                width: 'inherit',
                id: `${field}.gyldighetsperiode`,
                content: (
                  <PeriodpickerField names={[`${field}.fom`, `${field}.tom`]} readOnly renderIfMissingDateOnReadOnly />
                ),
              },
            ]}
            key={field}
          />
        ))}
      </div>
    </div>
  );
};

export default Overføringsrader;
