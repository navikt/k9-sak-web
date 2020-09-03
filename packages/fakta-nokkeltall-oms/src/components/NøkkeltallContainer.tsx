import * as React from 'react';
import { periodeErIKoronaperioden } from '@k9-sak-web/prosess-aarskvantum-oms/src/components/utils';
import Uttaksperiode from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/Uttaksperiode';
import { FormattedMessage } from 'react-intl';
import { Image } from '@fpsak-frontend/shared-components';
import nøkkelhull from '@fpsak-frontend/assets/images/nøkkelhull.svg';
import show from '@fpsak-frontend/assets/images/show.svg';
import hide from '@fpsak-frontend/assets/images/hide.svg';
import Hr from '@fpsak-frontend/shared-components/src/Hr';
import ÅrskvantumForbrukteDager from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/ÅrskvantumForbrukteDager';
import { Overskrift, OverskriftContainer, ToggleDetaljerKnapp } from './NøkkeltallContainerStyles';
import { beregnDagerTimer, DagerTimer, konverterDesimalTilDagerOgTimer, sumTid } from './durationUtils';
import DagerSøkerHarRettPå from './DagerSøkerHarRettPå';
import DagerNavKanUtbetale from './DagerNavKanUtbetale';
import ForbrukteDager from './ForbrukteDager';
import Restdager from './Restdager';

export type NøkkeltallContainerProps = Pick<
  ÅrskvantumForbrukteDager,
  | 'totaltAntallDager'
  | 'antallKoronadager'
  | 'antallDagerArbeidsgiverDekker'
  | 'forbrukteDager'
  | 'forbruktTid'
  | 'restdager'
  | 'restTid'
  | 'antallDagerInfotrygd'
  | 'smitteverndager'
> & {
  uttaksperioder: Uttaksperiode[];
  benyttetRammemelding: boolean;
};

const absoluttverdiDagerTimer = ({ dager, timer }: DagerTimer): DagerTimer => ({
  dager: Math.abs(dager),
  timer: Math.abs(timer),
});

const NøkkeltallContainer: React.FunctionComponent<NøkkeltallContainerProps> = ({
  uttaksperioder,
  restTid,
  restdager,
  forbrukteDager,
  forbruktTid,
  antallDagerArbeidsgiverDekker,
  antallDagerInfotrygd,
  antallKoronadager,
  smitteverndager,
  benyttetRammemelding,
  totaltAntallDager: grunnrettsdager,
}) => {
  const erIKoronaPerioden = React.useMemo(
    () => uttaksperioder.some(({ periode }) => periodeErIKoronaperioden(periode)),
    [uttaksperioder],
  );

  const smittevernDagerTimer = smitteverndager ? beregnDagerTimer(smitteverndager) : null;
  const harSmitteverndager = smittevernDagerTimer?.timer > 0 || smittevernDagerTimer?.dager > 0;
  const rest = restTid ? beregnDagerTimer(restTid) : konverterDesimalTilDagerOgTimer(restdager);
  const restTidErNegativt = rest.dager < 0 || rest.timer < 0;
  const utbetaltFlereDagerEnnRett = !harSmitteverndager && restTidErNegativt;

  const totaltForbruktDagerTimer = forbruktTid
    ? beregnDagerTimer(forbruktTid)
    : konverterDesimalTilDagerOgTimer(forbrukteDager);
  const tidFraInfotrygd = konverterDesimalTilDagerOgTimer(antallDagerInfotrygd);
  const navHarUtbetaltDagerTimer = sumTid(totaltForbruktDagerTimer, tidFraInfotrygd);
  const dagerRettPå = grunnrettsdager + antallKoronadager;
  const dagerNavKanUtbetale = dagerRettPå - antallDagerArbeidsgiverDekker;
  const alleDagerErForbrukt = !!harSmitteverndager || utbetaltFlereDagerEnnRett;
  const forbruktDagerTimer = restTidErNegativt ? { dager: dagerNavKanUtbetale } : totaltForbruktDagerTimer;

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
      <DagerSøkerHarRettPå
        dagerRettPå={dagerRettPå}
        antallOmsorgsdager={grunnrettsdager}
        antallKoronadager={antallKoronadager}
        erIKoronaperioden={erIKoronaPerioden}
        benyttetRammemelding={benyttetRammemelding}
        viserDetaljer={viserDetaljerDagerRettPå}
        visDetaljer={() => visDetaljerDagerRettPå(current => !current)}
      />
      <DagerNavKanUtbetale
        dagerNavKanUtbetale={dagerNavKanUtbetale}
        dagerRettPå={dagerRettPå}
        antallDagerArbeidsgiverDekker={antallDagerArbeidsgiverDekker}
        visDetaljer={() => visDetaljerDagerKanUtbetale(current => !current)}
        viserDetaljer={viserDetaljerDagerKanUtbetale}
      />
      <Hr marginTopPx={14} marginBottomPx={12} />
      <ForbrukteDager
        navHarUtbetaltDagerTimer={navHarUtbetaltDagerTimer}
        infotrygdDagerTimer={tidFraInfotrygd}
        forbrukteDagerTimer={forbruktDagerTimer}
        smittevernDagerTimer={smittevernDagerTimer}
        utbetaltForMangeDagerTimer={utbetaltFlereDagerEnnRett ? absoluttverdiDagerTimer(rest) : null}
        viserDetaljer={viserDetaljerForbrukteDager}
        visDetaljer={() => visDetaljerForbrukteDager(current => !current)}
      />
      <Restdager
        tilgodeDagertimer={{
          dager: alleDagerErForbrukt ? 0 : rest.dager,
          timer: alleDagerErForbrukt ? null : rest.timer,
        }}
        dagerNavKanUtbetale={dagerNavKanUtbetale}
        navHarUtbetaltDagerTimer={navHarUtbetaltDagerTimer}
        viserDetaljer={viserDetaljerRestdager}
        visDetaljer={() => visDetaljerRestdager(current => !current)}
      />
    </section>
  );
};

export default NøkkeltallContainer;
