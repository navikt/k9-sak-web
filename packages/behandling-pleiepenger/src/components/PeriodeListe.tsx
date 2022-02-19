import React from 'react';

import { CalendarIcon } from '@navikt/k9-react-components';
import { Period } from '@navikt/k9-period-utils';
import { Heading, Label, BodyShort } from '@navikt/ds-react';
import styles from './periodeListe.less';

type Item = {
  label: string;
  value: string;
};
type Periode = {
  fom: string;
  tom: string;
  items: Item[];
};

type OwnProps = {
  perioder: Periode[];
  tittel: string;
  customRenderFunc?: (items: { label: string; value: string }[]) => JSX.Element | null;
};
const PeriodeListe = ({ perioder, tittel, customRenderFunc }: OwnProps) => {
  if (!perioder || !Array.isArray(perioder)) {
    return null;
  }

  return (
    <>
      {tittel && (
        <Heading spacing size="xsmall" level="4">
          {tittel}
        </Heading>
      )}
      <ul className={styles.periodList}>
        {perioder.map(periode => {
          const { fom, tom, items = [] } = periode;
          const period = new Period(fom, tom);
          return (
            <li className={styles.periodList__element} key={fom}>
              <div className={styles.periodList__element__title}>
                <CalendarIcon />
                <span className={styles.periodList__element__title__period}>{period.prettifyPeriod()}</span>
              </div>
              {!customRenderFunc ? (
                <div className={styles.periodList__element__content}>
                  {items.map(item => (
                    <div className={styles.periodList__element__content__item}>
                      <Label size="small">{item.label}</Label>
                      <BodyShort size="small">{item.value}</BodyShort>
                    </div>
                  ))}
                </div>
              ) : (
                customRenderFunc(items)
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default PeriodeListe;
