import { BorderBox, VerticalSpacer } from '@fpsak-frontend/shared-components';
import Tidslinje from '@fpsak-frontend/tidslinje/src/components/pleiepenger/Tidslinje';
import Periode from '@fpsak-frontend/tidslinje/src/components/pleiepenger/types/Periode';
import TidslinjeRad from '@fpsak-frontend/tidslinje/src/components/pleiepenger/types/TidslinjeRad';
import { KodeverkMedNavn, OverlappendePeriode } from '@k9-sak-web/types';
import { Accordion, Alert, BodyLong, Checkbox, CheckboxGroup, Heading, Tag } from '@navikt/ds-react';
import { useFormikContext } from 'formik';
import React from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl';
import { sorterOverlappendeRader } from '../utils/periodeUtils';
import styles from './VedtakOverlappendeYtelsePanel.module.css';

interface Props {
  overlappendeYtelser: any;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  harVurdertOverlappendeYtelse: boolean;
  setHarVurdertOverlappendeYtelse: (harVurdertOverlappendeYtelse: boolean) => void;
}

const VedtakOverlappendeYtelsePanel: React.FC<Props & WrappedComponentProps> = ({
  overlappendeYtelser,
  alleKodeverk,
  intl,
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
    if (raden) {
      setValgtPeriode(raden.perioder.find(periode => periode.id === eventProps.items[0]));
    }
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

  return (
    <>
      <Alert className={styles.aksjonspunktAlert} variant="warning" size="medium">
        <Heading spacing size="small" level="3">
          Søker har overlappende ytelser
        </Heading>
        <BodyLong>Vurder om overlappende ytelser gir konsekvens for vedtak</BodyLong>
        <VerticalSpacer twentyPx />
        {getTidslinje()}
        <VerticalSpacer twentyPx />
        {valgtPeriode && (
          <>
            <BorderBox>
              <header>Detaljer om periode</header>
              <div className={styles.periodeDetaljer}>
                <Tag variant="warning" className={styles.periodeDetalj}>
                  <strong>{intl.formatMessage({ id: 'VedtakForm.OverlappendeYtelserKilde' })}</strong>
                  {utledFagSystem(valgtPeriode.periodeinfo.kilde.kode)}
                </Tag>
                <Tag variant="info" className={styles.periodeDetalj}>
                  <strong>{intl.formatMessage({ id: 'VedtakForm.OverlappendeYtelserYtelse' })}</strong>
                  {utledYtelseType(valgtPeriode.periodeinfo.ytelseType.kode)}
                </Tag>
                <Tag variant="info" className={styles.periodeDetalj}>
                  <strong>{intl.formatMessage({ id: 'VedtakForm.OverlappendeYtelserPeriode' })}</strong>
                  {valgtPeriode.fom} - {valgtPeriode.tom}
                </Tag>
              </div>
            </BorderBox>
            <VerticalSpacer sixteenPx />
          </>
        )}
        <CheckboxGroup
          legend="Bekreft at overlappende ytelser er sjekket og fulgt opp"
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
            <Accordion.Header type="button">
              <Heading size="xsmall" level="3">
                Hvilke ytelser går det automatisk melding?
              </Heading>
            </Accordion.Header>
            <Accordion.Content>
              <Heading spacing size="xsmall" level="4">
                Sykepenger
              </Heading>
              <BodyLong spacing>
                Det opprettes automatisk VKY-oppgave på sykepenger i Gosys hvis det er overlapp med sykepenger i
                Infotrygd eller Speil.
              </BodyLong>
              <Heading spacing size="xsmall" level="4">
                Foreldrepenger
              </Heading>
              <BodyLong spacing>
                Det opprettes automatisk revurdering ved overlapp mellom pleiepenger og foreldrepenger. Ved overlapp med
                omsorgspenger eller pleiepenger i livets sluttfase må saksbehandler vurdere om overlappet er riktig,
                f.eks. ved gradert ytelse, og eventuelt sende VKY-oppgave til riktig avdeling hvis FP skal stanses eller
                endres.
              </BodyLong>
              <Heading spacing size="xsmall" level="4">
                Dagpenger
              </Heading>
              <BodyLong spacing>
                Ved overlapp med dagpenger i Arena opprettes det automatisk oppgave hos NØS om å sette utbetalingen på
                vent.
              </BodyLong>
              <Heading spacing size="xsmall" level="4">
                Andre ytelser i kapittel 9
              </Heading>
              <BodyLong>
                Det opprettes ingen oppgave i Gosys ved overlapp mot annen ytelse i kapittel 9, verken om utbetalingen
                er gjort i Infotrygd eller K9. Saksbehandler må vurdere hvilken ytelse som er riktig, og eventuelt endre
                utbetalingen på overlappende ytelse.
              </BodyLong>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </Alert>
    </>
  );
};

export default injectIntl(VedtakOverlappendeYtelsePanel);
