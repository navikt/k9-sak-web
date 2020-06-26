import React, { FunctionComponent } from 'react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import styled from 'styled-components';
import moment from 'moment';
import Undertittel from 'nav-frontend-typografi/lib/undertittel';
import { FlexRow, Image } from '@fpsak-frontend/shared-components/index';
import pieChart from '@fpsak-frontend/assets/images/pie_chart.svg';
import info from '@fpsak-frontend/assets/images/information-circle.svg';
import CounterBox from './CounterBox';
import BorderedContainer from './BorderedContainer';
import ComboCounterBox from './ComboCounterBox';
import Uttaksperiode from '../dto/Uttaksperiode';
import { periodeErISmittevernsperioden } from './utils';

interface ÅrskvantumProps {
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

const CounterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  & > * {
    margin: 0.25em 0.5em;
  }
`;

const InfoRammemelding = styled.span`
  font-size: 17px;
  font-weight: 400;
  display: flex;
  align-items: center;
  padding-right: 1em;

  & img {
    width: 20px;
    height: 20px;
  }
`;

interface DagerTimer {
  dager: number;
  timer?: number;
}

const formaterTimerDesimal = timerDesimal => Number.parseFloat(timerDesimal.toFixed(2).replace('.0', ''));

export const konverterDesimalTilDagerOgTimer = (desimal: number): DagerTimer => {
  const dager = Math.floor(desimal);
  const timerDesimal = desimal % 1;

  return {
    dager,
    timer: timerDesimal !== 0 ? formaterTimerDesimal(timerDesimal * 7.5) : null,
  };
};

export const beregnDagerTimer = (dagerTimer: string): DagerTimer => {
  const duration = moment.duration(dagerTimer);
  const totaltAntallTimer = duration.asHours();

  return {
    dager: Math.floor(totaltAntallTimer / 7.5),
    timer: totaltAntallTimer % 7.5,
  };
};

const sumTid = (dagerTimer_1: DagerTimer, dagerTimer_2: DagerTimer): DagerTimer => {
  const sumTimer = (dagerTimer_2.timer || 0) + (dagerTimer_1.timer || 0);

  return {
    dager: dagerTimer_2.dager + dagerTimer_1.dager + Math.floor(sumTimer / 7.5),
    timer: formaterTimerDesimal(sumTimer % 7.5),
  };
};

const Årskvantum: FunctionComponent<ÅrskvantumProps> = ({
  totaltAntallDager,
  antallKoronadager = 0,
  restdager,
  restTid,
  forbrukteDager,
  forbruktTid,
  antallDagerArbeidsgiverDekker,
  antallDagerInfotrygd = 0,
  benyttetRammemelding,
  uttaksperioder,
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
  const opprinneligeDager = totaltAntallDager - antallDagerArbeidsgiverDekker;

  return (
    <BorderedContainer
      heading={
        <Undertittel tag="h3">
          <FlexRow spaceBetween>
            <span>
              <Image src={pieChart} />
              <FormattedMessage id="Årskvantum.Heading" />
            </span>
            {benyttetRammemelding && (
              <InfoRammemelding>
                <Image src={info} />
                <FormattedMessage id="Årskvantum.Rammemelding" />
              </InfoRammemelding>
            )}
          </FlexRow>
        </Undertittel>
      }
    >
      <CounterContainer>
        {restdagerErSmittevernsdager && (
          <CounterBox
            count={{
              bigCount: Math.abs(rest.dager),
              smallCount: rest.timer ? (
                <FormattedMessage id="Årskvantum.Timer" values={{ timer: Math.abs(rest.timer) }} />
              ) : null,
            }}
            label={{ textId: 'Årskvantum.Smittevernsdager' }}
            theme="lyseblå"
            infoText={{ content: <FormattedMessage id="Årskvantum.Smittevernsdager.InfoText" /> }}
          />
        )}
        <ComboCounterBox
          counterBoxes={[
            {
              count: { bigCount: opprinneligeDager },
              label: { textId: 'Årskvantum.OpprinneligeDager' },
              theme: 'grå',
              infoText: {
                content: (
                  <FormattedMessage
                    id="Årskvantum.OpprinneligeDager.InfoText"
                    values={{ totaltAntallDager, antallDagerArbeidsgiverDekker }}
                  />
                ),
              },
              border: false,
              key: 'opprinneligeDager',
            },
            {
              count: { bigCount: antallKoronadager, borderBottom: true },
              label: { textId: 'Årskvantum.Koronadager', borderTop: true, borderBottom: true },
              theme: 'oransje',
              border: false,
              infoText: {
                content: <FormattedMessage id="Årskvantum.Koronadager.InfoText" />,
                borderTop: true,
                borderBottom: true,
              },
              key: 'koronadager',
            },
            {
              count: { bigCount: opprinneligeDager + antallKoronadager },
              label: { textId: 'Årskvantum.TotaleDager', bold: true, borderRight: true, borderLeft: true },
              theme: 'hvit',
              border: false,
              infoText: {
                content: <FormattedMessage id="Årskvantum.TotaleDager.InfoText" />,
              },
              key: 'totaleDager',
            },
          ]}
        />
        <CounterBox
          count={{
            bigCount: forbrukt.dager,
            smallCount: forbrukt.timer ? (
              <FormattedMessage id="Årskvantum.Timer" values={{ timer: forbrukt.timer }} />
            ) : null,
          }}
          label={{ textId: 'Årskvantum.ForbrukteDager' }}
          theme="rød"
          infoText={{
            content: tidFraInfotrygd.timer ? (
              <FormattedHTMLMessage id="Årskvantum.DagerOgTimerFraInfotrygd" values={{ ...tidFraInfotrygd }} />
            ) : (
              <FormattedHTMLMessage id="Årskvantum.DagerFraInfotrygd" values={{ dager: tidFraInfotrygd.dager }} />
            ),
          }}
        />
        <CounterBox
          count={{
            bigCount: restdagerErSmittevernsdager ? 0 : rest.dager,
            smallCount:
              rest.timer && rest.timer > 0 ? (
                <FormattedMessage id="Årskvantum.Timer" values={{ timer: rest.timer }} />
              ) : null,
          }}
          label={{ textId: 'Årskvantum.Restdager' }}
          theme="grønn"
          infoText={{
            content: (
              <FormattedMessage
                id={
                  utbetaltFlereDagerEnnRett ? 'Årskvantum.Restdager.InfoText_negativt' : 'Årskvantum.Restdager.InfoText'
                }
              />
            ),
          }}
        />
      </CounterContainer>
    </BorderedContainer>
  );
};

export default Årskvantum;
