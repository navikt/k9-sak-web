import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import Tidslinje from '@fpsak-frontend/tidslinje/src/components/pleiepenger/Tidslinje';
import TidslinjeRad from '@fpsak-frontend/tidslinje/src/components/pleiepenger/types/TidslinjeRad';
import Periode from '@fpsak-frontend/tidslinje/src/components/pleiepenger/types/Periode';
import { AlleKodeverk, OverlappendePeriode } from '@k9-sak-web/types';
import { BorderBox } from '@fpsak-frontend/shared-components';
import { EtikettInfo, EtikettFokus } from 'nav-frontend-etiketter';
import styles from './VedtakOverlappendeYtelsePanel.less';
import { sorterOverlappendeRader } from '../../utils/periodeUtils';

interface Props {
  overlappendeYtelser: any;
  alleKodeverk: AlleKodeverk;
}

const VedtakOverlappendeYtelsePanel: React.FC<Props & WrappedComponentProps> = ({
  overlappendeYtelser,
  alleKodeverk,
  intl,
}) => {
  const [valgtPeriode, setValgtPeriode] = React.useState<Periode<OverlappendePeriode> | null>(null);

  const utledYtelseType = (ytelseTypeKode: string) => {
    if (alleKodeverk.FagsakYtelseType && alleKodeverk.FagsakYtelseType.length > 0) {
      return alleKodeverk.FagsakYtelseType.find(ytelseType => ytelseType.kode === ytelseTypeKode).navn;
    }
    return ytelseTypeKode;
  };

  const utledFagSystem = (fagSystemKode: string) => {
    if (alleKodeverk.Fagsystem && alleKodeverk.Fagsystem.length > 0) {
      return alleKodeverk.Fagsystem.find(system => system.kode === fagSystemKode).navn;
    }
    return fagSystemKode;
  };

  /**
   * Set opp radene som brukes i Tidslinjen
   */
  const usorterteRader = overlappendeYtelser.map(
    (rad, radIndex): TidslinjeRad<OverlappendePeriode> => ({
      id: `rad-${radIndex}`,
      perioder: rad.overlappendePerioder.map((periode, periodeIndex) => ({
        fom: periode.fom,
        tom: periode.tom,
        id: `rad-${radIndex}-periode-${periodeIndex}`,
        hoverText: `${intl.formatMessage({ id: 'VedtakForm.OverlappendeYtelserKilde' })} ${utledFagSystem(
          rad.kilde.kode,
        )}`,
        periodeinfo: {
          kilde: rad.kilde,
          ytelseType: rad.ytelseType,
        },
      })),
    }),
  );

  /**
   * Sorter radene slik at raden som har en periode med den tidligeste datoen sorteres øverst
   * for å unngå "rotete" pølsefest
   */
  const rader = sorterOverlappendeRader(usorterteRader);

  /**
   * Sett opp korresponderende rader til sidekolonnen
   */
  const sideKolonneRader = overlappendeYtelser.map(rad => (
    <span className={styles.sideKolonne}>{`${utledYtelseType(rad.ytelseType.kode)}`}</span>
  ));

  const velgPeriodeHandler = (eventProps: any) => {
    const raden: TidslinjeRad<OverlappendePeriode> = rader.find(rad =>
      rad.perioder.find(periode => periode.id === eventProps.items[0]),
    );
    setValgtPeriode(raden.perioder.find(periode => periode.id === eventProps.items[0]));
  };

  return (
    <BorderBox>
      {overlappendeYtelser && overlappendeYtelser.length > 0 && (
        <Tidslinje
          rader={rader}
          velgPeriode={velgPeriodeHandler}
          valgtPeriode={valgtPeriode}
          sideContentRader={sideKolonneRader}
        />
      )}

      {valgtPeriode && (
        <BorderBox>
          <header>Detaljer om periode</header>
          <div className={styles.periodeDetaljer}>
            <EtikettFokus className={styles.periodeDetalj}>
              <strong>{intl.formatMessage({ id: 'VedtakForm.OverlappendeYtelserKilde' })}</strong>
              {utledFagSystem(valgtPeriode.periodeinfo.kilde)}
            </EtikettFokus>
            <EtikettInfo className={styles.periodeDetalj}>
              <strong>{intl.formatMessage({ id: 'VedtakForm.OverlappendeYtelserYtelse' })}</strong>
              {utledYtelseType(valgtPeriode.periodeinfo.ytelseType)}
            </EtikettInfo>
            <EtikettInfo className={styles.periodeDetalj}>
              <strong>{intl.formatMessage({ id: 'VedtakForm.OverlappendeYtelserPeriode' })}</strong>
              {valgtPeriode.fom} - {valgtPeriode.tom}
            </EtikettInfo>
          </div>
        </BorderBox>
      )}
    </BorderBox>
  );
};

export default injectIntl(VedtakOverlappendeYtelsePanel);
