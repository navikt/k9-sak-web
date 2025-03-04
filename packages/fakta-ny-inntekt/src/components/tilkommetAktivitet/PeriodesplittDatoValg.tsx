import { useCallback, useState } from 'react';

import { DatePicker, Label, useDatepicker } from '@navikt/ds-react';
import dayjs from 'dayjs';

import { FlexColumn, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT, TIDENES_ENDE } from '@navikt/ft-utils';

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

const formaterTomForVisning = (tom: string): string => {
  if (tom === TIDENES_ENDE) {
    return '';
  }
  return dayjs(tom).format(DDMMYYYY_DATE_FORMAT);
};

export const PeriodesplittDatoValg = ({ periode, forhåndsvisPeriodesplitt, setValgtDato }: Props) => {
  const [nyePerioder, setNyePerioder] = useState<Periode[]>();

  const oppdaterSplittDatoValg = useCallback(
    (dato: Date | undefined) => {
      const splitt = dayjs(dato).format(ISO_DATE_FORMAT);
      setValgtDato(splitt);
      if (splitt) {
        const splittedePerioder = forhåndsvisPeriodesplitt(splitt);
        splittedePerioder.sort((a, b) => dayjs(a.fom).diff(dayjs(b.fom)));
        setNyePerioder(splittedePerioder);
      }
    },
    [forhåndsvisPeriodesplitt],
  );

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
    <>
      <FlexColumn className={styles.datoVelger}>
        <DatePicker {...datepickerProps}>
          <DatePicker.Input {...inputProps} label="Opprett ny vurdering fra" size="small" />
        </DatePicker>
      </FlexColumn>
      {nyePerioder && (
        <FlexColumn>
          <Label size="small" className={styles.periodeHeader}>
            Nye perioder til vurdering:
          </Label>
          <ul>
            {nyePerioder[0] && (
              <li>
                {`${dayjs(nyePerioder[0].fom).format(DDMMYYYY_DATE_FORMAT)} - ${formaterTomForVisning(nyePerioder[0].tom)}`}
              </li>
            )}
            {nyePerioder[1] && (
              <li>
                {`${dayjs(nyePerioder[1].fom).format(DDMMYYYY_DATE_FORMAT)} - ${formaterTomForVisning(nyePerioder[1].tom)}`}
              </li>
            )}
          </ul>
        </FlexColumn>
      )}
      <VerticalSpacer sixteenPx />
    </>
  );
};
