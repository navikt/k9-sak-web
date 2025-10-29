import { InputField, PeriodpickerField } from '@fpsak-frontend/form/index';
import { FlexRow } from '@fpsak-frontend/shared-components/index';
import { Label } from '@navikt/ds-react';
import classnames from 'classnames/bind';
import React, { ReactNode } from 'react';
import { WrappedFieldArrayProps } from 'redux-form';
import Overføring, {
  Overføringsretning,
  OverføringsretningEnum,
  Overføringstype,
  OverføringstypeEnum,
} from '../types/Overføring';
import FastBreddeAligner from './FastBreddeAligner';
import Pil from './Pil';
import styles from './overføringsrader.module.css';

const classNames = classnames.bind(styles);

interface OverføringsraderProps {
  type: Overføringstype;
  retning: Overføringsretning;
}

const retningTilTekstIdMap = {
  [OverføringsretningEnum.INN]: 'Fra',
  [OverføringsretningEnum.UT]: 'Til',
};

const typeTilTekstIdMap = {
  [OverføringstypeEnum.OVERFØRING]: 'Overføring',
  [OverføringstypeEnum.FORDELING]: 'Fordeling',
  [OverføringstypeEnum.KORONAOVERFØRING]: 'Koronaoverføring',
};

const renderHeaders = (antallRader: number, type: Overføringstype, retning: Overføringsretning): ReactNode => {
  if (antallRader === 0) {
    return (
      <Label size="small" as="p">
        Ingen registrerte overføringer
      </Label>
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
              <Label size="small" as="p">
                {typeTilTekstIdMap[type]}
              </Label>
            ),
          },
          {
            width: '150px',
            id: 'fra/til',
            content: (
              <Label size="small" as="p">
                {retningTilTekstIdMap[retning]}
              </Label>
            ),
          },
          {
            width: 'inherit',
            id: 'gyldighetsperiode',
            content: (
              <Label size="small" as="p">
                Gyldighetsperiode
              </Label>
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
        <Label size="small" as="p">
          Ingen registrerte overføringer
        </Label>
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
                      {retning === OverføringsretningEnum.INN ? 'Inn' : 'Ut'}
                    </span>
                    <InputField name={`${field}.antallDager`} readOnly type="number" />
                    <span>
                       dager 
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
