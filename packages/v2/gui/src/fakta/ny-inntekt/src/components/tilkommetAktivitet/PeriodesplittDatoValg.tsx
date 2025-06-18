import { useState } from 'react';

import { Box, DatePicker, Label, useDatepicker } from '@navikt/ds-react';
import dayjs from 'dayjs';

import { FlexColumn } from '@fpsak-frontend/shared-components';
import { ISO_DATE_FORMAT, sortPeriodsByFom } from '@navikt/ft-utils';

import { PeriodLabel } from '@navikt/ft-ui-komponenter';
import styles from './periodesplittModal.module.css';

export type Periode = {
  fom: string;
  tom: string;
};

type Props = {
  periode: Periode;
  forhåndsvisPeriodesplitt: (nyFom: string) => Periode[];
  setValgtDato: (dato: string) => void;
};

export const PeriodesplittDatoValg = ({ periode, forhåndsvisPeriodesplitt, setValgtDato }: Props) => {
  const [nyePerioder, setNyePerioder] = useState<Periode[]>([]);

  const oppdaterSplittDatoValg = (dato: Date | undefined) => {
    const splitt = dayjs(dato).format(ISO_DATE_FORMAT);
    setValgtDato(splitt);
    if (splitt) {
      const splittedePerioder = forhåndsvisPeriodesplitt(splitt);
      splittedePerioder.sort(sortPeriodsByFom);
      setNyePerioder(splittedePerioder);
    }
  };

  const disabledDays = [
    (date: Date) => !periode || !dayjs(date).isAfter(dayjs(periode.fom)) || dayjs(date).isAfter(dayjs(periode.tom)),
  ];
  const { datepickerProps, inputProps } = useDatepicker({
    today: new Date(periode.fom),
    disableWeekends: true,
    disabled: disabledDays,
    onDateChange: oppdaterSplittDatoValg,
  });

  return (
    <Box marginBlock="0 4">
      <FlexColumn className={styles.datoVelger}>
        <DatePicker {...datepickerProps}>
          <DatePicker.Input {...inputProps} label="Opprett ny vurdering fra" size="small" />
        </DatePicker>
      </FlexColumn>
      {nyePerioder.length > 0 ? (
        <FlexColumn>
          <Label size="small" className={styles.periodeHeader}>
            Nye perioder til vurdering:
          </Label>
          <ul>
            {nyePerioder[0] && (
              <li>
                <PeriodLabel dateStringFom={nyePerioder[0].fom} dateStringTom={nyePerioder[0].tom} />
              </li>
            )}
            {nyePerioder[1] && (
              <li>
                <PeriodLabel dateStringFom={nyePerioder[1].fom} dateStringTom={nyePerioder[1].tom} />
              </li>
            )}
          </ul>
        </FlexColumn>
      ) : null}
    </Box>
  );
};
