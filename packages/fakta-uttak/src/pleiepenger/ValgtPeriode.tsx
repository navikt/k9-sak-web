import React, { FunctionComponent, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Flatknapp } from 'nav-frontend-knapper';
import endreSvg from '@fpsak-frontend/assets/images/endre.svg';
import { Image } from '@fpsak-frontend/shared-components';
import { Normaltekst } from 'nav-frontend-typografi';
import VerticalSpacer from '@fpsak-frontend/shared-components/src/VerticalSpacer';
import styles from './uttakFaktaForm.less';
import NyArbeidsperiode, { nyArbeidsperiodeFormName } from './NyArbeidsperiode';
import { useUttakContext } from './UttakFaktaForm2';
import { ArbeidsforholdPeriode, Arbeidsgiver } from './UttakFaktaIndex2';
import { visningsdato } from './uttakUtils';

interface ValgtPeriodeProps {
  endreValgtPeriodeCallback: () => void;
  redigererPeriode: boolean;
  oppdaterPerioder: (nyPeriode: ArbeidsforholdPeriode) => void;
  behandlingVersjon: number;
  behandlingId: number;
  avbryt: () => void;
  arbeidsgivere: Arbeidsgiver[];
}

const arbeidsprosent = timer => ((timer / 37.5) * 100).toFixed(1).replace(/\.0+$/, '');

const formaterTimer = timer => ` ${timer}t (${arbeidsprosent(timer)}%)`;

const ValgtPeriode: FunctionComponent<ValgtPeriodeProps> = ({
  endreValgtPeriodeCallback,
  redigererPeriode,
  oppdaterPerioder,
  behandlingVersjon,
  behandlingId,
  avbryt,
  arbeidsgivere,
}) => {
  const { valgtPeriodeIndex, valgtArbeidsforholdId, valgtArbeidsgiversOrgNr } = useUttakContext();

  const valgtPeriode = useMemo<ArbeidsforholdPeriode>(
    () =>
      arbeidsgivere
        ?.find(arbeidsgiver => arbeidsgiver.organisasjonsnummer === valgtArbeidsgiversOrgNr)
        ?.arbeidsforhold.find(arbeidsforhold => arbeidsforhold.arbeidsgiversArbeidsforholdId === valgtArbeidsforholdId)
        ?.perioder.find((periode, index) => index === valgtPeriodeIndex),
    [arbeidsgivere, valgtArbeidsgiversOrgNr, valgtArbeidsforholdId, valgtPeriodeIndex],
  );
  const intl = useIntl();

  if (!valgtPeriode && !redigererPeriode) {
    return (
      <Normaltekst className={styles.kursiv}>
        <FormattedMessage id="FaktaOmUttakForm.IngenPeriodeValgt" />
      </Normaltekst>
    );
  }

  const { periodeLabelText, fomTom, timerFårJobbet, timerIJobbTilVanlig } = valgtPeriode
    ? {
        periodeLabelText: `${intl.formatMessage({ id: 'FaktaOmUttakForm.Periode' })} ${`${valgtPeriodeIndex +
          1}`.padStart(2, '0')}:`,
        fomTom: ` ${visningsdato(valgtPeriode.fom)} - ${visningsdato(valgtPeriode.tom)}`,
        timerFårJobbet: formaterTimer(valgtPeriode.timerFårJobbet),
        timerIJobbTilVanlig: formaterTimer(valgtPeriode.timerIJobbTilVanlig),
      }
    : {
        periodeLabelText: `${intl.formatMessage({ id: 'FaktaOmUttakForm.Periode' })}:`,
        fomTom: ' -',
        timerFårJobbet: ' -',
        timerIJobbTilVanlig: ' -',
      };

  const periodeId = `${nyArbeidsperiodeFormName}-periode.visning`;
  const timerIJobbTilVanligId = `${nyArbeidsperiodeFormName}-timerIJobbTilVanlig.visning`;
  const timerFårJobbetId = `${nyArbeidsperiodeFormName}-timerFårJobbet.visning`;

  return (
    <>
      <Normaltekst>
        <label htmlFor={periodeId} className={styles.periodeLabel}>
          {periodeLabelText}
        </label>
        <span id={periodeId}>{fomTom}</span>
      </Normaltekst>
      <Normaltekst>
        <label htmlFor={timerIJobbTilVanligId} className={styles.timerLabel}>
          {`${intl.formatMessage({ id: 'FaktaOmUttakForm.timerIJobbTilVanlig' })}:`}
        </label>
        <span id={timerIJobbTilVanligId}>{timerIJobbTilVanlig}</span>
      </Normaltekst>
      <Normaltekst>
        <label htmlFor={timerFårJobbetId} className={styles.timerLabel}>
          {`${intl.formatMessage({ id: 'FaktaOmUttakForm.timerFårJobbet' })}:`}
        </label>
        <span id={timerFårJobbetId}>{timerFårJobbet}</span>
      </Normaltekst>
      <VerticalSpacer sixteenPx />
      {redigererPeriode && (
        <NyArbeidsperiode
          initialPeriodeValues={valgtPeriode}
          avbryt={avbryt}
          oppdaterPerioder={oppdaterPerioder}
          behandlingVersjon={behandlingVersjon}
          behandlingId={behandlingId}
        />
      )}
      {!redigererPeriode && (
        <Flatknapp htmlType="button" onClick={endreValgtPeriodeCallback} mini form="kompakt">
          <Image src={endreSvg} className={styles.image} />
          <span>{intl.formatMessage({ id: 'FaktaOmUttakForm.EndrePeriode' })}</span>
        </Flatknapp>
      )}
    </>
  );
};

export default ValgtPeriode;
