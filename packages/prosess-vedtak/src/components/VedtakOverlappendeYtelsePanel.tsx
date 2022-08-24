import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { BorderBox, VerticalSpacer } from '@fpsak-frontend/shared-components';
import Tidslinje from '@fpsak-frontend/tidslinje/src/components/pleiepenger/Tidslinje';
import Periode from '@fpsak-frontend/tidslinje/src/components/pleiepenger/types/Periode';
import TidslinjeRad from '@fpsak-frontend/tidslinje/src/components/pleiepenger/types/TidslinjeRad';
import { AlleKodeverk, OverlappendePeriode } from '@k9-sak-web/types';
import { Accordion, Alert, BodyLong, Checkbox, CheckboxGroup, Heading } from '@navikt/ds-react';
import { useFormikContext } from 'formik';
import { EtikettFokus, EtikettInfo } from 'nav-frontend-etiketter';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { sorterOverlappendeRader } from '../utils/periodeUtils';
import styles from './VedtakOverlappendeYtelsePanel.less';

interface Props {
  overlappendeYtelser: any;
  alleKodeverk: AlleKodeverk;
  aksjonspunktKoder: string[];
  harVurdertOverlappendeYtelse: boolean;
  setHarVurdertOverlappendeYtelse: (harVurdertOverlappendeYtelse: boolean) => void;
}

const VedtakOverlappendeYtelsePanel: React.FC<Props & WrappedComponentProps> = ({
  overlappendeYtelser,
  alleKodeverk,
  intl,
  aksjonspunktKoder,
  harVurdertOverlappendeYtelse,
  setHarVurdertOverlappendeYtelse,
}) => {
  const [valgtPeriode, setValgtPeriode] = React.useState<Periode<OverlappendePeriode> | null>(null);
  const { submitCount } = useFormikContext();

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

  const getTidslinje = () =>
    overlappendeYtelser &&
    overlappendeYtelser.length > 0 && (
      <Tidslinje
        rader={rader}
        velgPeriode={velgPeriodeHandler}
        valgtPeriode={valgtPeriode}
        sideContentRader={sideKolonneRader}
        withBorder
      />
    );

  const harAksjonspunkt =
    aksjonspunktKoder && aksjonspunktKoder.includes(aksjonspunktCodes.VURDERE_OVERLAPPENDE_YTELSER_FØR_VEDTAK);

  return (
    <>
      {harAksjonspunkt && (
        <>
          <Alert className={styles.aksjonspunktAlert} variant="warning" size="medium">
            <Heading spacing size="small" level="3">
              Søker har overlappende ytelser
            </Heading>
            <BodyLong>Vurder om overlappende ytelser gir konsekvens for vedtak</BodyLong>
            <VerticalSpacer twentyPx />
            {getTidslinje()}
            <VerticalSpacer twentyPx />
            <CheckboxGroup
              legend="Hei"
              hideLegend
              error={submitCount > 0 && !harVurdertOverlappendeYtelse ? 'Du må bekrefte for å gå videre' : ''}
            >
              <Checkbox
                checked={harVurdertOverlappendeYtelse}
                onChange={() => setHarVurdertOverlappendeYtelse(!harVurdertOverlappendeYtelse)}
                size="small"
                error={submitCount > 0 && !harVurdertOverlappendeYtelse}
                value="harVurdertOverlappendeYtelse"
              >
                Jeg bekrefter å ha sjekket og fulgt opp overlappende ytelser
              </Checkbox>
            </CheckboxGroup>
          </Alert>
          <Alert variant="info" size="medium">
            <Accordion className={styles.accordion}>
              <Accordion.Item>
                <Accordion.Header>
                  <Heading spacing size="small" level="3">
                    Hvilke ytelser går det automatisk melding?
                  </Heading>
                </Accordion.Header>
                <Accordion.Content>
                  <BodyLong>Nå kan du sende inn søknaden.</BodyLong>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          </Alert>
        </>
      )}

      {!harAksjonspunkt && getTidslinje()}

      {valgtPeriode && (
        <BorderBox>
          <header>Detaljer om periode</header>
          <div className={styles.periodeDetaljer}>
            <EtikettFokus className={styles.periodeDetalj}>
              <strong>{intl.formatMessage({ id: 'VedtakForm.OverlappendeYtelserKilde' })}</strong>
              {utledFagSystem(valgtPeriode.periodeinfo.kilde.kode)}
            </EtikettFokus>
            <EtikettInfo className={styles.periodeDetalj}>
              <strong>{intl.formatMessage({ id: 'VedtakForm.OverlappendeYtelserYtelse' })}</strong>
              {utledYtelseType(valgtPeriode.periodeinfo.ytelseType.kode)}
            </EtikettInfo>
            <EtikettInfo className={styles.periodeDetalj}>
              <strong>{intl.formatMessage({ id: 'VedtakForm.OverlappendeYtelserPeriode' })}</strong>
              {valgtPeriode.fom} - {valgtPeriode.tom}
            </EtikettInfo>
          </div>
        </BorderBox>
      )}
    </>
  );
};

export default injectIntl(VedtakOverlappendeYtelsePanel);
