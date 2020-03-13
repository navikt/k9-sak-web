import React, { FunctionComponent, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Flatknapp } from 'nav-frontend-knapper';
import endreSvg from '@fpsak-frontend/assets/images/endre.svg';
import { Image } from '@fpsak-frontend/shared-components';
import { Normaltekst } from 'nav-frontend-typografi';
import VerticalSpacer from '@fpsak-frontend/shared-components/src/VerticalSpacer';
import styles from './uttakFaktaForm.less';
import NyArbeidsperiode from './NyArbeidsperiode';
import { arbeidsprosentNormal, arbeidsprosent, useUttakContext, visningsdato } from './uttakUtils';
import ArbeidsforholdPeriode from './types/ArbeidsforholdPeriode';
import { nyArbeidsperiodeFormName } from './constants';
import Arbeid from './types/Arbeid';
import Jobbinfo from './types/Jobbinfo';

interface ValgtPeriodeProps {
  endreValgtPeriodeCallback: () => void;
  redigererPeriode: boolean;
  oppdaterPerioder: (nyPeriode: ArbeidsforholdPeriode) => void;
  behandlingVersjon: number;
  behandlingId: number;
  avbryt: () => void;
  arbeid: Arbeid[];
}

const formaterTimer = (timer, timerNormal?: number) =>
  ` ${timer}t (${timerNormal ? arbeidsprosent(timer, timerNormal) : arbeidsprosentNormal(timer)}%)`;

const ValgtPeriode: FunctionComponent<ValgtPeriodeProps> = ({
  endreValgtPeriodeCallback,
  redigererPeriode,
  oppdaterPerioder,
  behandlingVersjon,
  behandlingId,
  avbryt,
  arbeid,
}) => {
  const { valgtArbeidsforholdId, valgtFomTom } = useUttakContext();

  const valgtPeriode = useMemo<Jobbinfo>(
    () => arbeid.find(arb => arb.arbeidsforhold.arbeidsforholdId === valgtArbeidsforholdId)?.perioder[valgtFomTom],
    [valgtArbeidsforholdId, valgtFomTom, arbeid],
  );

  const intl = useIntl();

  if (!valgtPeriode && !redigererPeriode) {
    return (
      <Normaltekst className={styles.kursiv}>
        <FormattedMessage id="FaktaOmUttakForm.IngenPeriodeValgt" />
      </Normaltekst>
    );
  }

  const valgtPeriodeIndex = 0; // TODO: Det er ingen garanti for at perioder kommer i sortert rekkefølge?

  const [fom, tom] = valgtFomTom?.split('/');
  const { periodeLabelText, visningsdatoer, timerFårJobbet, timerIJobbTilVanlig } = valgtPeriode
    ? {
        periodeLabelText: `${intl.formatMessage({ id: 'FaktaOmUttakForm.Periode' })} ${`${valgtPeriodeIndex +
          1}`.padStart(2, '0')}:`,
        visningsdatoer: ` ${visningsdato(fom)} - ${visningsdato(tom)}`,
        timerFårJobbet: formaterTimer(valgtPeriode.timerFårJobbet, valgtPeriode.timerIJobbTilVanlig),
        timerIJobbTilVanlig: formaterTimer(valgtPeriode.timerIJobbTilVanlig),
      }
    : {
        periodeLabelText: `${intl.formatMessage({ id: 'FaktaOmUttakForm.Periode' })}:`,
        visningsdatoer: ' -',
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
        <span id={periodeId}>{visningsdatoer}</span>
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
