import * as React from 'react';
import { periodeErISmittevernsperioden } from '@k9-sak-web/prosess-aarskvantum-oms/src/components/utils';
import Uttaksperiode from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/Uttaksperiode';
import { FormattedMessage } from 'react-intl';
import { Image } from '@fpsak-frontend/shared-components';
import nøkkelhull from '@fpsak-frontend/assets/images/nøkkelhull.svg';
import show from '@fpsak-frontend/assets/images/show.svg';
import hide from '@fpsak-frontend/assets/images/hide.svg';
import Hr from '@fpsak-frontend/shared-components/src/Hr';
import Nøkkeltall, { Nøkkeltalldetalj } from './Nøkkeltall';
import { Overskrift, OverskriftContainer, ToggleDetaljerKnapp } from './NøkkeltallContainerStyles';
import { beregnDagerTimer, DagerTimer, konverterDesimalTilDagerOgTimer, sumTid } from './durationUtils';

interface NøkkeltallContainerProps {
  totaltAntallDager: number;
  antallKoronadager?: number;
  antallDagerArbeidsgiverDekker: number;
  forbrukteDager?: number;
  forbruktTid?: string;
  restdager?: number;
  restTid?: string;
  antallDagerInfotrygd: number;
  benyttetRammemelding: boolean;
  uttaksperioder: Uttaksperiode[];
}

const formaterTimer = (timer: number | undefined) =>
  timer ? <FormattedMessage id="Nøkkeltall.Timer" values={{ timer }} /> : null;

const forbrukteDagerDetaljer = (
  tidFraInfotrygd: DagerTimer,
  forbruktDagerTimer: DagerTimer,
  restdagerErSmittevernsdager: boolean,
  rest: DagerTimer,
): Nøkkeltalldetalj[] => {
  const detaljer: Nøkkeltalldetalj[] = [
    {
      antallDager: tidFraInfotrygd.dager,
      antallTimer: formaterTimer(tidFraInfotrygd.timer),
      overskrifttekstId: 'Nøkkeltall.DagerFraInfotrygd',
      infotekstContent: tidFraInfotrygd.timer ? (
        <FormattedMessage id="Nøkkeltall.DagerFraInfotrygd.DagerOgTimer.InfoText" values={{ ...tidFraInfotrygd }} />
      ) : (
        <FormattedMessage id="Nøkkeltall.DagerFraInfotrygd.Dager.InfoText" values={{ dager: tidFraInfotrygd.dager }} />
      ),
    },
    {
      antallDager: forbruktDagerTimer.dager,
      antallTimer: formaterTimer(forbruktDagerTimer.timer),
      overskrifttekstId: 'Nøkkeltall.ForbrukteDager',
      infotekstContent: forbruktDagerTimer.timer ? (
        <FormattedMessage id="Nøkkeltall.ForbrukteDager.DagerOgTimer.InfoText" values={{ ...forbruktDagerTimer }} />
      ) : (
        <FormattedMessage id="Nøkkeltall.ForbrukteDager.Dager.InfoText" values={{ dager: forbruktDagerTimer.dager }} />
      ),
    },
  ];

  if (restdagerErSmittevernsdager) {
    detaljer.push({
      antallDager: Math.abs(rest.dager),
      antallTimer: rest.timer ? (
        <FormattedMessage id="Nøkkeltall.Timer" values={{ timer: Math.abs(rest.timer) }} />
      ) : null,
      overskrifttekstId: 'Nøkkeltall.Smittevern',
      infotekstContent: <FormattedMessage id="Nøkkeltall.Smittevern.InfoText" />,
    });
  }

  return detaljer;
};

const NøkkeltallContainer: React.FunctionComponent<NøkkeltallContainerProps> = ({
  uttaksperioder,
  restTid,
  restdager,
  forbrukteDager,
  forbruktTid,
  antallDagerArbeidsgiverDekker,
  antallDagerInfotrygd,
  antallKoronadager,
  benyttetRammemelding,
  totaltAntallDager: grunnrettsdager,
}) => {
  const erInnenSmittevernsperioden = React.useMemo(
    () => uttaksperioder.some(({ periode }) => periodeErISmittevernsperioden(periode)),
    [uttaksperioder],
  );

  const rest = restTid ? beregnDagerTimer(restTid) : konverterDesimalTilDagerOgTimer(restdager);
  const restTidErNegativt = rest.dager < 0 || rest.timer < 0;
  const restdagerErSmittevernsdager = erInnenSmittevernsperioden && restTidErNegativt;
  const utbetaltFlereDagerEnnRett = !erInnenSmittevernsperioden && restTidErNegativt;

  const forbruktDagerTimer = forbruktTid
    ? beregnDagerTimer(forbruktTid)
    : konverterDesimalTilDagerOgTimer(forbrukteDager);
  const tidFraInfotrygd = konverterDesimalTilDagerOgTimer(antallDagerInfotrygd);
  const forbrukt = sumTid(forbruktDagerTimer, tidFraInfotrygd);
  const dagerRettPå = grunnrettsdager + antallKoronadager;
  const dagerNavKanUtbetale = dagerRettPå - antallDagerArbeidsgiverDekker;

  const [viserDetaljerDagerRettPå, visDetaljerDagerRettPå] = React.useState<boolean>(false);
  const [viserDetaljerDagerKanUtbetale, visDetaljerDagerKanUtbetale] = React.useState<boolean>(false);
  const [viserDetaljerForbrukteDager, visDetaljerForbrukteDager] = React.useState<boolean>(false);
  const [viserDetaljerRestdager, visDetaljerRestdager] = React.useState<boolean>(false);

  const viserAlleDetaljer = React.useMemo<boolean>(
    () =>
      viserDetaljerDagerRettPå &&
      viserDetaljerDagerKanUtbetale &&
      viserDetaljerForbrukteDager &&
      viserDetaljerRestdager,
    [viserDetaljerDagerRettPå, viserDetaljerDagerKanUtbetale, viserDetaljerForbrukteDager, viserDetaljerRestdager],
  );

  const toggleDetaljer = () => {
    if (viserAlleDetaljer) {
      visDetaljerDagerRettPå(false);
      visDetaljerDagerKanUtbetale(false);
      visDetaljerForbrukteDager(false);
      visDetaljerRestdager(false);
    } else {
      visDetaljerDagerRettPå(true);
      visDetaljerDagerKanUtbetale(true);
      visDetaljerForbrukteDager(true);
      visDetaljerRestdager(true);
    }
  };

  return (
    <section>
      <OverskriftContainer>
        <Overskrift>
          <Image src={nøkkelhull} />
          <FormattedMessage id="Nøkkeltall.Heading" />
        </Overskrift>
        <ToggleDetaljerKnapp onClick={toggleDetaljer}>
          <FormattedMessage id={viserAlleDetaljer ? 'Nøkkeltall.SkjulUtregninger' : 'Nøkkeltall.VisUtregninger'} />
          <Image src={viserAlleDetaljer ? hide : show} />
        </ToggleDetaljerKnapp>
      </OverskriftContainer>
      <Hr marginTopPx={12} marginBottomPx={16} />
      <Nøkkeltall
        overskrift={{ antallDager: dagerRettPå, overskrifttekstId: 'Nøkkeltall.DagerSøkerHarRettPå' }}
        detaljer={[
          {
            antallDager: grunnrettsdager,
            overskrifttekstId: 'Nøkkeltall.DagerGrunnrett',
            infotekstContent: (
              <>
                <FormattedMessage id="Nøkkeltall.DagerGrunnrett.InfoText" />
                {benyttetRammemelding && <FormattedMessage id="Nøkkeltall.Rammemelding" />}
              </>
            ),
          },
          {
            antallDager: antallKoronadager,
            overskrifttekstId: 'Nøkkeltall.Koronadager',
            infotekstContent: <FormattedMessage id="Nøkkeltall.Koronadager.InfoText" />,
          },
        ]}
        farge="#66cbec"
        viserDetaljer={viserDetaljerDagerRettPå}
        visDetaljer={() => visDetaljerDagerRettPå(current => !current)}
      />
      <Nøkkeltall
        overskrift={{ antallDager: dagerNavKanUtbetale, overskrifttekstId: 'Nøkkeltall.DagerNavKanUtbetale' }}
        detaljer={[
          {
            antallDager: dagerRettPå,
            overskrifttekstId: 'Nøkkeltall.TotaltAntallDager',
            infotekstContent: <FormattedMessage id="Nøkkeltall.TotaltAntallDager.InfoText" />,
          },
          {
            antallDager: -antallDagerArbeidsgiverDekker,
            overskrifttekstId: 'Nøkkeltall.DagerDekketAvArbeidsgiver',
            infotekstContent: (
              <FormattedMessage
                id="Nøkkeltall.DagerDekketAvArbeidsgiver.InfoText"
                values={{ dager: antallDagerArbeidsgiverDekker }}
              />
            ),
          },
        ]}
        farge="#634689"
        viserDetaljer={viserDetaljerDagerKanUtbetale}
        visDetaljer={() => visDetaljerDagerKanUtbetale(current => !current)}
      />
      <Hr marginTopPx={14} marginBottomPx={12} />
      <Nøkkeltall
        overskrift={{
          antallDager: forbrukt.dager,
          antallTimer: formaterTimer(forbrukt.timer),
          overskrifttekstId: 'Nøkkeltall.ForbrukteDager',
        }}
        detaljer={forbrukteDagerDetaljer(tidFraInfotrygd, forbruktDagerTimer, restdagerErSmittevernsdager, rest)}
        farge="#ba3a26"
        viserDetaljer={viserDetaljerForbrukteDager}
        visDetaljer={() => visDetaljerForbrukteDager(current => !current)}
      />
      <Nøkkeltall
        overskrift={{
          antallDager: restdagerErSmittevernsdager ? 0 : rest.dager,
          antallTimer: restdagerErSmittevernsdager ? null : formaterTimer(rest.timer),
          overskrifttekstId: 'Nøkkeltall.Restdager.InfoText',
        }}
        detaljer={[
          {
            antallDager: dagerNavKanUtbetale,
            overskrifttekstId: 'Nøkkeltall.KanUtbetales',
            infotekstContent: (
              <>
                <FormattedMessage id="Nøkkeltall.KanUtbetales.InfoText" values={{ dager: dagerNavKanUtbetale }} />
                {utbetaltFlereDagerEnnRett ? (
                  <strong>
                    <FormattedMessage id="Nøkkeltall.KanUtbetales.InfoText_negativt" />
                  </strong>
                ) : null}
              </>
            ),
          },
          {
            antallDager: forbrukt.dager,
            antallTimer: formaterTimer(forbrukt.timer),
            overskrifttekstId: 'Nøkkeltall.TotaltForbrukte',
            infotekstContent: forbrukt.timer ? (
              <FormattedMessage id="Nøkkeltall.TotaltForbrukte.DagerOgTimer.InfoText" values={{ ...forbrukt }} />
            ) : (
              <FormattedMessage id="Nøkkeltall.TotaltForbrukte.Dager.InfoText" values={{ dager: forbrukt.dager }} />
            ),
          },
        ]}
        farge="#06893a"
        viserDetaljer={viserDetaljerRestdager}
        visDetaljer={() => visDetaljerRestdager(current => !current)}
      />
    </section>
  );
};

export default NøkkeltallContainer;
